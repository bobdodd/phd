import { BaseAnalyzer, Issue, AnalyzerContext } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';

/**
 * TableAccessibilityAnalyzer - Detects accessibility issues with data tables
 *
 * Implements WCAG 1.3.1 (Info and Relationships) Level A
 *
 * Detects:
 * - Data tables without <th> headers
 * - Tables without proper scope attributes
 * - Tables missing caption or aria-label
 * - Complex tables without proper header associations
 * - Layout tables with inappropriate ARIA roles
 * - Missing table structure (thead, tbody)
 *
 * Priority: MEDIUM IMPACT
 * Target: Ensures data tables are properly structured for screen readers
 */
export class TableAccessibilityAnalyzer extends BaseAnalyzer {
  readonly name = 'TableAccessibilityAnalyzer';
  readonly description = 'Detects accessibility issues with data tables and table structure';

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.documentModel || !context.documentModel.dom) {
      return issues;
    }

    const allElements = context.documentModel.getAllElements();
    const tableElements = this.findTableElements(allElements);

    for (const table of tableElements) {
      // Determine if this is a data table or layout table
      const isDataTable = this.isDataTable(table, allElements);

      if (isDataTable) {
        this.checkDataTableAccessibility(table, allElements, context, issues);
      } else {
        this.checkLayoutTable(table, context, issues);
      }
    }

    return issues;
  }

  /**
   * Find all <table> elements
   */
  private findTableElements(elements: DOMElement[]): DOMElement[] {
    return elements.filter(el => el.tagName === 'table');
  }

  /**
   * Determine if table is a data table or layout table
   * Heuristics:
   * - Has role="presentation" or role="none" → layout table
   * - Has <th> elements → data table
   * - Has caption → data table
   * - Has headers/scope attributes → data table
   * - Otherwise → assume data table (safer for accessibility)
   */
  private isDataTable(table: DOMElement, allElements: DOMElement[]): boolean {
    // Explicit layout table
    const role = table.attributes.role;
    if (role === 'presentation' || role === 'none') {
      return false;
    }

    // Check for data table indicators
    const children = this.getDescendants(table, allElements);

    // Has <th> elements?
    if (children.some(el => el.tagName === 'th')) {
      return true;
    }

    // Has caption?
    if (children.some(el => el.tagName === 'caption')) {
      return true;
    }

    // Has headers or scope attributes?
    if (children.some(el => el.attributes.headers || el.attributes.scope)) {
      return true;
    }

    // Has aria-label or aria-labelledby?
    if (table.attributes['aria-label'] || table.attributes['aria-labelledby']) {
      return true;
    }

    // Default to data table (safer)
    return true;
  }

  /**
   * Check data table for accessibility issues
   */
  private checkDataTableAccessibility(
    table: DOMElement,
    allElements: DOMElement[],
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const descendants = this.getDescendants(table, allElements);

    // Check for table headers
    this.checkTableHeaders(table, descendants, context, issues);

    // Check for table caption or label
    this.checkTableLabel(table, descendants, context, issues);

    // Check for proper scope attributes
    this.checkScopeAttributes(table, descendants, context, issues);

    // Check for proper table structure (thead, tbody)
    this.checkTableStructure(table, descendants, context, issues);

    // Check for complex table header associations
    this.checkComplexTableHeaders(table, descendants, context, issues);
  }

  /**
   * Check if data table has proper headers
   */
  private checkTableHeaders(
    table: DOMElement,
    descendants: DOMElement[],
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const thElements = descendants.filter(el => el.tagName === 'th');

    if (thElements.length === 0) {
      // Data table has no <th> elements
      issues.push(
        this.createIssue(
          'table-no-headers',
          'error',
          `Data table has no <th> header elements. Screen readers need headers to associate data cells with their labels. Use <th> for column/row headers.`,
          table.location,
          ['1.3.1'],
          context,
          {
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
          }
        )
      );
    }
  }

  /**
   * Check if data table has a caption or label
   */
  private checkTableLabel(
    table: DOMElement,
    descendants: DOMElement[],
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const hasCaption = descendants.some(el => el.tagName === 'caption');
    const hasAriaLabel = table.attributes['aria-label'];
    const hasAriaLabelledby = table.attributes['aria-labelledby'];

    if (!hasCaption && !hasAriaLabel && !hasAriaLabelledby) {
      issues.push(
        this.createIssue(
          'table-no-caption',
          'warning',
          `Data table has no caption, aria-label, or aria-labelledby. A descriptive label helps users understand the table's purpose. Add a <caption> element or aria-label.`,
          table.location,
          ['1.3.1'],
          context,
          {
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
          }
        )
      );
    }
  }

  /**
   * Check for proper scope attributes on headers
   */
  private checkScopeAttributes(
    _table: DOMElement,
    descendants: DOMElement[],
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const thElements = descendants.filter(el => el.tagName === 'th');

    for (const th of thElements) {
      const hasScope = th.attributes.scope;
      const hasHeaders = th.attributes.headers;
      const hasId = th.attributes.id;

      // Simple table: <th> should have scope="col" or scope="row"
      // Complex table: <th> should have id and cells should reference with headers
      if (!hasScope && !hasId && !hasHeaders) {
        issues.push(
          this.createIssue(
            'table-header-no-scope',
            'warning',
            `Table header <th> lacks scope attribute. Add scope="col" for column headers or scope="row" for row headers to help screen readers associate data with headers.`,
            th.location,
            ['1.3.1'],
            context,
            {
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
            }
          )
        );
      }
    }
  }

  /**
   * Check for proper table structure (thead, tbody, tfoot)
   */
  private checkTableStructure(
    table: DOMElement,
    descendants: DOMElement[],
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const hasThead = descendants.some(el => el.tagName === 'thead');
    const hasTbody = descendants.some(el => el.tagName === 'tbody');
    const trElements = descendants.filter(el => el.tagName === 'tr');

    // If table has multiple rows, recommend using thead/tbody
    if (trElements.length > 1 && !hasThead && !hasTbody) {
      issues.push(
        this.createIssue(
          'table-no-structure',
          'info',
          `Table lacks <thead> and <tbody> structure. While not required, these elements help organize complex tables and improve screen reader navigation.`,
          table.location,
          ['1.3.1'],
          context,
          {
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
          }
        )
      );
    }
  }

  /**
   * Check for complex table header associations
   */
  private checkComplexTableHeaders(
    table: DOMElement,
    descendants: DOMElement[],
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    // Detect complex tables (multiple header rows/columns)
    const thElements = descendants.filter(el => el.tagName === 'th');
    const tdElements = descendants.filter(el => el.tagName === 'td');

    // Simple heuristic: if table has headers attribute on cells, check associations
    const cellsWithHeaders = tdElements.filter(td => td.attributes.headers);

    if (cellsWithHeaders.length > 0) {
      // This is a complex table using headers/id associations
      for (const cell of cellsWithHeaders) {
        const headersAttr = cell.attributes.headers;
        const headerIds = headersAttr.split(/\s+/);

        // Check if all referenced IDs exist
        for (const headerId of headerIds) {
          const headerExists = thElements.some(th => th.attributes.id === headerId);

          if (!headerExists) {
            issues.push(
              this.createIssue(
                'table-invalid-headers',
                'error',
                `Table cell references header ID "${headerId}" in headers attribute, but no <th> with this ID exists. Screen readers cannot associate this cell with its headers.`,
                cell.location,
                ['1.3.1'],
                context,
                {
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
                }
              )
            );
          }
        }
      }
    }

    // Check if complex table (multiple header levels) is using proper technique
    const firstRowCells = this.getFirstRowCells(table, descendants);
    const hasMultipleHeaderLevels = firstRowCells.filter(c => c.tagName === 'th').length > 1 &&
                                    thElements.length > firstRowCells.length;

    if (hasMultipleHeaderLevels) {
      // Complex table detected - check if using headers/id or colspan/rowspan properly
      const thWithId = thElements.filter(th => th.attributes.id);
      const tdWithHeaders = tdElements.filter(td => td.attributes.headers);

      if (thWithId.length === 0 && tdWithHeaders.length === 0) {
        issues.push(
          this.createIssue(
            'table-complex-no-headers',
            'warning',
            `Complex table detected (multiple header levels) but not using headers/id associations. For multi-level headers, use id on <th> and headers on <td> to create proper associations.`,
            table.location,
            ['1.3.1'],
            context,
            {
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
            }
          )
        );
      }
    }
  }

  /**
   * Check layout table (should not have table semantics)
   */
  private checkLayoutTable(
    table: DOMElement,
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    // Layout table with role="presentation" or role="none" is correct
    // But warn if it has data table elements
    const role = table.attributes.role;

    if (role !== 'presentation' && role !== 'none') {
      // Table without data indicators might be layout table
      issues.push(
        this.createIssue(
          'table-layout-missing-role',
          'info',
          `Table appears to be used for layout (no headers, caption, or semantic structure). If this is not a data table, add role="presentation" to remove table semantics for screen readers.`,
          table.location,
          ['1.3.1'],
          context,
          {
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
          }
        )
      );
    }
  }

  /**
   * Get all descendant elements of a given element
   */
  private getDescendants(parent: DOMElement, allElements: DOMElement[]): DOMElement[] {
    const descendants: DOMElement[] = [];

    const collectDescendants = (el: DOMElement) => {
      const children = allElements.filter(child => child.parent === el);
      for (const child of children) {
        descendants.push(child);
        collectDescendants(child);
      }
    };

    collectDescendants(parent);
    return descendants;
  }

  /**
   * Get first row cells of table
   */
  private getFirstRowCells(_table: DOMElement, descendants: DOMElement[]): DOMElement[] {
    // Find first <tr>
    const trElements = descendants.filter(el => el.tagName === 'tr');
    if (trElements.length === 0) return [];

    const firstTr = trElements[0];
    return descendants.filter(el =>
      el.parent === firstTr && (el.tagName === 'th' || el.tagName === 'td')
    );
  }
}
