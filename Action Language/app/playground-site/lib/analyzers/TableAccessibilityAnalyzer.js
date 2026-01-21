"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableAccessibilityAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class TableAccessibilityAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'TableAccessibilityAnalyzer';
        this.description = 'Detects accessibility issues with data tables and table structure';
    }
    analyze(context) {
        const issues = [];
        if (!context.documentModel || !context.documentModel.dom) {
            return issues;
        }
        const allElements = context.documentModel.getAllElements();
        const tableElements = this.findTableElements(allElements);
        for (const table of tableElements) {
            const isDataTable = this.isDataTable(table, allElements);
            if (isDataTable) {
                this.checkDataTableAccessibility(table, allElements, context, issues);
            }
            else {
                this.checkLayoutTable(table, context, issues);
            }
        }
        return issues;
    }
    findTableElements(elements) {
        return elements.filter(el => el.tagName === 'table');
    }
    isDataTable(table, allElements) {
        const role = table.attributes.role;
        if (role === 'presentation' || role === 'none') {
            return false;
        }
        const children = this.getDescendants(table, allElements);
        if (children.some(el => el.tagName === 'th')) {
            return true;
        }
        if (children.some(el => el.tagName === 'caption')) {
            return true;
        }
        if (children.some(el => el.attributes.headers || el.attributes.scope)) {
            return true;
        }
        if (table.attributes['aria-label'] || table.attributes['aria-labelledby']) {
            return true;
        }
        return true;
    }
    checkDataTableAccessibility(table, allElements, context, issues) {
        const descendants = this.getDescendants(table, allElements);
        this.checkTableHeaders(table, descendants, context, issues);
        this.checkTableLabel(table, descendants, context, issues);
        this.checkScopeAttributes(table, descendants, context, issues);
        this.checkTableStructure(table, descendants, context, issues);
        this.checkComplexTableHeaders(table, descendants, context, issues);
    }
    checkTableHeaders(table, descendants, context, issues) {
        const thElements = descendants.filter(el => el.tagName === 'th');
        if (thElements.length === 0) {
            issues.push(this.createIssue('table-no-headers', 'error', `Data table has no <th> header elements. Screen readers need headers to associate data cells with their labels. Use <th> for column/row headers.`, table.location, ['1.3.1'], context, {
                elementContext: context.documentModel?.getElementContext(table),
                fix: {
                    description: `Add <th> elements for table headers:
Example:
<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
    <th>City</th>
  </tr>
  <tr>
    <td>John</td>
    <td>30</td>
    <td>NYC</td>
  </tr>
</table>`,
                    code: `<!-- Add <th> elements for your table headers -->
<table>
  <tr>
    <th>Column 1</th>
    <th>Column 2</th>
  </tr>
  <!-- data rows... -->
</table>`,
                    location: table.location
                }
            }));
        }
    }
    checkTableLabel(table, descendants, context, issues) {
        const hasCaption = descendants.some(el => el.tagName === 'caption');
        const hasAriaLabel = table.attributes['aria-label'];
        const hasAriaLabelledby = table.attributes['aria-labelledby'];
        if (!hasCaption && !hasAriaLabel && !hasAriaLabelledby) {
            issues.push(this.createIssue('table-no-caption', 'warning', `Data table has no caption, aria-label, or aria-labelledby. A descriptive label helps users understand the table's purpose. Add a <caption> element or aria-label.`, table.location, ['1.3.1'], context, {
                elementContext: context.documentModel?.getElementContext(table),
                fix: {
                    description: `Add a caption to describe the table's purpose:
Example:
<table>
  <caption>Employee Directory</caption>
  <!-- table content -->
</table>

Or use aria-label:
<table aria-label="Employee Directory">`,
                    code: `<table>
  <caption>Describe your table's purpose here</caption>
  <!-- table content -->
</table>`,
                    location: table.location
                }
            }));
        }
    }
    checkScopeAttributes(_table, descendants, context, issues) {
        const thElements = descendants.filter(el => el.tagName === 'th');
        for (const th of thElements) {
            const hasScope = th.attributes.scope;
            const hasHeaders = th.attributes.headers;
            const hasId = th.attributes.id;
            if (!hasScope && !hasId && !hasHeaders) {
                issues.push(this.createIssue('table-header-no-scope', 'warning', `Table header <th> lacks scope attribute. Add scope="col" for column headers or scope="row" for row headers to help screen readers associate data with headers.`, th.location, ['1.3.1'], context, {
                    elementContext: context.documentModel?.getElementContext(th),
                    fix: {
                        description: `Add scope attribute to <th> elements:
- scope="col" for column headers (top row)
- scope="row" for row headers (left column)

Example:
<tr>
  <th scope="col">Name</th>
  <th scope="col">Age</th>
</tr>`,
                        code: `<th scope="col">Column Header</th>
<!-- or -->
<th scope="row">Row Header</th>`,
                        location: th.location
                    }
                }));
            }
        }
    }
    checkTableStructure(table, descendants, context, issues) {
        const hasThead = descendants.some(el => el.tagName === 'thead');
        const hasTbody = descendants.some(el => el.tagName === 'tbody');
        const trElements = descendants.filter(el => el.tagName === 'tr');
        if (trElements.length > 1 && !hasThead && !hasTbody) {
            issues.push(this.createIssue('table-no-structure', 'info', `Table lacks <thead> and <tbody> structure. While not required, these elements help organize complex tables and improve screen reader navigation.`, table.location, ['1.3.1'], context, {
                elementContext: context.documentModel?.getElementContext(table),
                fix: {
                    description: `Organize table with <thead> and <tbody>:
Example:
<table>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John</td>
      <td>30</td>
    </tr>
  </tbody>
</table>`,
                    code: `<table>
  <thead>
    <tr>
      <!-- header cells with <th> -->
    </tr>
  </thead>
  <tbody>
    <!-- data rows -->
  </tbody>
</table>`,
                    location: table.location
                }
            }));
        }
    }
    checkComplexTableHeaders(table, descendants, context, issues) {
        const thElements = descendants.filter(el => el.tagName === 'th');
        const tdElements = descendants.filter(el => el.tagName === 'td');
        const cellsWithHeaders = tdElements.filter(td => td.attributes.headers);
        if (cellsWithHeaders.length > 0) {
            for (const cell of cellsWithHeaders) {
                const headersAttr = cell.attributes.headers;
                const headerIds = headersAttr.split(/\s+/);
                for (const headerId of headerIds) {
                    const headerExists = thElements.some(th => th.attributes.id === headerId);
                    if (!headerExists) {
                        issues.push(this.createIssue('table-invalid-headers', 'error', `Table cell references header ID "${headerId}" in headers attribute, but no <th> with this ID exists. Screen readers cannot associate this cell with its headers.`, cell.location, ['1.3.1'], context, {
                            elementContext: context.documentModel?.getElementContext(cell),
                            fix: {
                                description: `Ensure the <th> element with id="${headerId}" exists, or remove this ID from the headers attribute.

Example of correct complex table:
<table>
  <tr>
    <th id="name" scope="col">Name</th>
    <th id="age" scope="col">Age</th>
  </tr>
  <tr>
    <td headers="name">John</td>
    <td headers="age">30</td>
  </tr>
</table>`,
                                code: `<th id="${headerId}" scope="col">Header Text</th>`,
                                location: cell.location
                            }
                        }));
                    }
                }
            }
        }
        const firstRowCells = this.getFirstRowCells(table, descendants);
        const hasMultipleHeaderLevels = firstRowCells.filter(c => c.tagName === 'th').length > 1 &&
            thElements.length > firstRowCells.length;
        if (hasMultipleHeaderLevels) {
            const thWithId = thElements.filter(th => th.attributes.id);
            const tdWithHeaders = tdElements.filter(td => td.attributes.headers);
            if (thWithId.length === 0 && tdWithHeaders.length === 0) {
                issues.push(this.createIssue('table-complex-no-headers', 'warning', `Complex table detected (multiple header levels) but not using headers/id associations. For multi-level headers, use id on <th> and headers on <td> to create proper associations.`, table.location, ['1.3.1'], context, {
                    elementContext: context.documentModel?.getElementContext(table),
                    fix: {
                        description: `For complex tables with multiple header levels, use id and headers attributes:

Example:
<table>
  <tr>
    <th id="name" rowspan="2">Name</th>
    <th id="contact" colspan="2">Contact</th>
  </tr>
  <tr>
    <th id="email">Email</th>
    <th id="phone">Phone</th>
  </tr>
  <tr>
    <td headers="name">John</td>
    <td headers="contact email">john@example.com</td>
    <td headers="contact phone">555-0123</td>
  </tr>
</table>`,
                        code: `<!-- Add id to header cells -->
<th id="header1">Header</th>

<!-- Reference headers in data cells -->
<td headers="header1">Data</td>`,
                        location: table.location
                    }
                }));
            }
        }
    }
    checkLayoutTable(table, context, issues) {
        const role = table.attributes.role;
        if (role !== 'presentation' && role !== 'none') {
            issues.push(this.createIssue('table-layout-missing-role', 'info', `Table appears to be used for layout (no headers, caption, or semantic structure). If this is not a data table, add role="presentation" to remove table semantics for screen readers.`, table.location, ['1.3.1'], context, {
                elementContext: context.documentModel?.getElementContext(table),
                fix: {
                    description: `If this table is used purely for layout (not data), add role="presentation":
<table role="presentation">
  <!-- layout content -->
</table>

Note: Modern CSS (Grid, Flexbox) is preferred over layout tables.`,
                    code: `<table role="presentation">
  <!-- layout content -->
</table>`,
                    location: table.location
                }
            }));
        }
    }
    getDescendants(parent, allElements) {
        const descendants = [];
        const collectDescendants = (el) => {
            const children = allElements.filter(child => child.parent === el);
            for (const child of children) {
                descendants.push(child);
                collectDescendants(child);
            }
        };
        collectDescendants(parent);
        return descendants;
    }
    getFirstRowCells(_table, descendants) {
        const trElements = descendants.filter(el => el.tagName === 'tr');
        if (trElements.length === 0)
            return [];
        const firstTr = trElements[0];
        return descendants.filter(el => el.parent === firstTr && (el.tagName === 'th' || el.tagName === 'td'));
    }
}
exports.TableAccessibilityAnalyzer = TableAccessibilityAnalyzer;
