/**
 * Accessible Grid Implementation
 * Demonstrates proper ARIA grid pattern with full keyboard navigation
 */

class AccessibleGrid {
    constructor(gridElement) {
        this.grid = gridElement;
        this.tbody = gridElement.querySelector('tbody');
        this.thead = gridElement.querySelector('thead');
        this.currentFocusCell = null;
        this.sortColumn = null;
        this.sortDirection = 'none';
        this.selectedRows = new Set();
        this.data = [];
        this.filteredData = [];

        this.init();
    }

    init() {
        this.generateEmployeeData();
        this.renderGrid();
        this.setupEventListeners();
        this.updateStatistics();
        this.setInitialFocus();
    }

    generateEmployeeData() {
        const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle', 'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

        const departments = [
            { name: 'Engineering', class: 'engineering', positions: ['Software Engineer', 'Senior Engineer', 'Tech Lead', 'Engineering Manager', 'DevOps Engineer'] },
            { name: 'Sales', class: 'sales', positions: ['Sales Representative', 'Account Executive', 'Sales Manager', 'Business Development'] },
            { name: 'Marketing', class: 'marketing', positions: ['Marketing Specialist', 'Content Writer', 'Marketing Manager', 'Social Media Manager'] },
            { name: 'HR', class: 'hr', positions: ['HR Specialist', 'Recruiter', 'HR Manager', 'HR Director'] },
            { name: 'Finance', class: 'finance', positions: ['Accountant', 'Financial Analyst', 'Finance Manager', 'Controller'] },
            { name: 'Operations', class: 'operations', positions: ['Operations Specialist', 'Operations Manager', 'Project Manager'] }
        ];

        const statuses = [
            { name: 'Active', class: 'active', weight: 70 },
            { name: 'On Leave', class: 'on-leave', weight: 20 },
            { name: 'Inactive', class: 'inactive', weight: 10 }
        ];

        for (let i = 1; i <= 50; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
            const dept = departments[Math.floor(Math.random() * departments.length)];
            const position = dept.positions[Math.floor(Math.random() * dept.positions.length)];
            const salary = Math.floor(Math.random() * 100000) + 50000;
            const hireYear = 2015 + Math.floor(Math.random() * 10);
            const hireMonth = Math.floor(Math.random() * 12);
            const hireDay = Math.floor(Math.random() * 28) + 1;
            const hireDate = new Date(hireYear, hireMonth, hireDay);

            const rand = Math.random() * 100;
            let status;
            if (rand < statuses[0].weight) {
                status = statuses[0];
            } else if (rand < statuses[0].weight + statuses[1].weight) {
                status = statuses[1];
            } else {
                status = statuses[2];
            }

            this.data.push({
                id: i,
                name,
                email,
                department: dept.name,
                departmentClass: dept.class,
                position,
                salary,
                hireDate,
                status: status.name,
                statusClass: status.class
            });
        }

        this.filteredData = [...this.data];
    }

    renderGrid() {
        this.tbody.innerHTML = '';

        this.filteredData.forEach((employee, index) => {
            const row = document.createElement('tr');
            row.setAttribute('role', 'row');
            row.setAttribute('data-employee-id', employee.id);

            const cells = [
                { content: employee.id, label: 'Employee ID' },
                { content: `<span class="employee-name">${employee.name}</span>`, label: 'Name' },
                { content: `<span class="employee-email">${employee.email}</span>`, label: 'Email' },
                { content: `<span class="department-badge ${employee.departmentClass}">${employee.department}</span>`, label: 'Department' },
                { content: employee.position, label: 'Position' },
                { content: `<span class="salary-amount">$${employee.salary.toLocaleString()}</span>`, label: 'Salary' },
                { content: this.formatDate(employee.hireDate), label: 'Hire Date' },
                { content: `<span class="status-indicator ${employee.statusClass}">${employee.status}</span>`, label: 'Status' }
            ];

            cells.forEach(cellData => {
                const cell = document.createElement('td');
                cell.setAttribute('role', 'gridcell');
                cell.setAttribute('tabindex', '-1');
                cell.setAttribute('aria-label', `${cellData.label}: ${this.stripHTML(cellData.content)}`);
                cell.innerHTML = cellData.content;
                row.appendChild(cell);
            });

            // Actions cell
            const actionsCell = document.createElement('td');
            actionsCell.setAttribute('role', 'gridcell');
            actionsCell.setAttribute('tabindex', '-1');
            actionsCell.innerHTML = `
                <div class="action-buttons">
                    <button class="action-btn edit" aria-label="Edit ${employee.name}">Edit</button>
                    <button class="action-btn delete" aria-label="Delete ${employee.name}">Delete</button>
                </div>
            `;
            row.appendChild(actionsCell);

            this.tbody.appendChild(row);
        });

        this.updateGridStatus();
    }

    setupEventListeners() {
        // Keyboard navigation for grid cells
        this.grid.addEventListener('keydown', (e) => this.handleGridKeyDown(e));

        // Click handlers for cells
        this.grid.addEventListener('click', (e) => {
            const cell = e.target.closest('[role="gridcell"], [role="columnheader"]');
            if (cell) {
                this.setFocusCell(cell);
            }
        });

        // Column header sorting
        const headers = this.thead.querySelectorAll('[role="columnheader"].sortable');
        headers.forEach(header => {
            header.addEventListener('click', () => this.handleSort(header));
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleSort(header);
                }
            });
        });

        // Search functionality
        const searchInput = document.getElementById('employee-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Control buttons
        const clearBtn = document.getElementById('clear-selection');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSelection());
        }

        const selectAllBtn = document.getElementById('select-all');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => this.selectAll());
        }

        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
    }

    handleGridKeyDown(e) {
        const cell = e.target.closest('[role="gridcell"], [role="columnheader"]');
        if (!cell) return;

        const isHeader = cell.getAttribute('role') === 'columnheader';

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                this.moveUp(cell);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.moveDown(cell);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.moveLeft(cell);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.moveRight(cell);
                break;
            case 'Home':
                e.preventDefault();
                if (e.ctrlKey) {
                    this.moveToFirstCell();
                } else {
                    this.moveToFirstCellInRow(cell);
                }
                break;
            case 'End':
                e.preventDefault();
                if (e.ctrlKey) {
                    this.moveToLastCell();
                } else {
                    this.moveToLastCellInRow(cell);
                }
                break;
            case ' ':
                if (!isHeader) {
                    e.preventDefault();
                    this.toggleRowSelection(cell);
                }
                break;
            case 'a':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.selectAll();
                }
                break;
        }
    }

    moveUp(cell) {
        const row = cell.closest('tr');
        const cellIndex = Array.from(row.children).indexOf(cell);
        const prevRow = row.previousElementSibling;

        if (prevRow) {
            const targetCell = prevRow.children[cellIndex];
            if (targetCell) {
                this.setFocusCell(targetCell);
            }
        } else {
            // Move to header
            const headerRow = this.thead.querySelector('tr');
            const headerCell = headerRow.children[cellIndex];
            if (headerCell) {
                this.setFocusCell(headerCell);
            }
        }
    }

    moveDown(cell) {
        const isHeader = cell.getAttribute('role') === 'columnheader';

        if (isHeader) {
            // Move to first body row
            const firstBodyRow = this.tbody.querySelector('tr');
            if (firstBodyRow) {
                const cellIndex = Array.from(cell.parentElement.children).indexOf(cell);
                const targetCell = firstBodyRow.children[cellIndex];
                if (targetCell) {
                    this.setFocusCell(targetCell);
                }
            }
        } else {
            const row = cell.closest('tr');
            const cellIndex = Array.from(row.children).indexOf(cell);
            const nextRow = row.nextElementSibling;

            if (nextRow) {
                const targetCell = nextRow.children[cellIndex];
                if (targetCell) {
                    this.setFocusCell(targetCell);
                }
            }
        }
    }

    moveLeft(cell) {
        const prevCell = cell.previousElementSibling;
        if (prevCell) {
            this.setFocusCell(prevCell);
        }
    }

    moveRight(cell) {
        const nextCell = cell.nextElementSibling;
        if (nextCell) {
            this.setFocusCell(nextCell);
        }
    }

    moveToFirstCellInRow(cell) {
        const row = cell.closest('tr');
        const firstCell = row.querySelector('[role="gridcell"], [role="columnheader"]');
        if (firstCell) {
            this.setFocusCell(firstCell);
        }
    }

    moveToLastCellInRow(cell) {
        const row = cell.closest('tr');
        const cells = row.querySelectorAll('[role="gridcell"], [role="columnheader"]');
        const lastCell = cells[cells.length - 1];
        if (lastCell) {
            this.setFocusCell(lastCell);
        }
    }

    moveToFirstCell() {
        const firstHeaderCell = this.thead.querySelector('[role="columnheader"]');
        if (firstHeaderCell) {
            this.setFocusCell(firstHeaderCell);
        }
    }

    moveToLastCell() {
        const lastRow = this.tbody.querySelector('tr:last-child');
        if (lastRow) {
            const cells = lastRow.querySelectorAll('[role="gridcell"]');
            const lastCell = cells[cells.length - 1];
            if (lastCell) {
                this.setFocusCell(lastCell);
            }
        }
    }

    setFocusCell(cell) {
        if (this.currentFocusCell) {
            this.currentFocusCell.setAttribute('tabindex', '-1');
        }

        cell.setAttribute('tabindex', '0');
        cell.focus();
        this.currentFocusCell = cell;
    }

    setInitialFocus() {
        const firstHeader = this.thead.querySelector('[role="columnheader"]');
        if (firstHeader) {
            firstHeader.setAttribute('tabindex', '0');
            this.currentFocusCell = firstHeader;
        }
    }

    toggleRowSelection(cell) {
        const row = cell.closest('tr');
        const employeeId = row.getAttribute('data-employee-id');

        if (this.selectedRows.has(employeeId)) {
            this.selectedRows.delete(employeeId);
            row.classList.remove('row-selected');
        } else {
            this.selectedRows.add(employeeId);
            row.classList.add('row-selected');
        }

        this.updateGridStatus();
    }

    selectAll() {
        this.selectedRows.clear();
        const rows = this.tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const employeeId = row.getAttribute('data-employee-id');
            this.selectedRows.add(employeeId);
            row.classList.add('row-selected');
        });
        this.updateGridStatus();
    }

    clearSelection() {
        this.selectedRows.clear();
        const rows = this.tbody.querySelectorAll('tr');
        rows.forEach(row => row.classList.remove('row-selected'));
        this.updateGridStatus();
    }

    handleSort(header) {
        const column = header.getAttribute('data-column');

        // Update sort direction
        if (this.sortColumn === column) {
            if (this.sortDirection === 'none') {
                this.sortDirection = 'ascending';
            } else if (this.sortDirection === 'ascending') {
                this.sortDirection = 'descending';
            } else {
                this.sortDirection = 'none';
            }
        } else {
            this.sortColumn = column;
            this.sortDirection = 'ascending';
        }

        // Update ARIA attributes
        const headers = this.thead.querySelectorAll('[role="columnheader"]');
        headers.forEach(h => {
            h.classList.remove('sorted-asc', 'sorted-desc');
            h.setAttribute('aria-sort', 'none');
        });

        if (this.sortDirection !== 'none') {
            header.setAttribute('aria-sort', this.sortDirection);
            header.classList.add(this.sortDirection === 'ascending' ? 'sorted-asc' : 'sorted-desc');
            this.sortData(column, this.sortDirection);
        } else {
            this.filteredData = [...this.data];
        }

        this.renderGrid();
        this.setFocusCell(header);
    }

    sortData(column, direction) {
        this.filteredData.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            if (column === 'salary' || column === 'id') {
                aVal = Number(aVal);
                bVal = Number(bVal);
            } else if (column === 'hireDate') {
                aVal = a[column].getTime();
                bVal = b[column].getTime();
            } else {
                aVal = String(aVal).toLowerCase();
                bVal = String(bVal).toLowerCase();
            }

            if (direction === 'ascending') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
        });
    }

    handleSearch(query) {
        query = query.toLowerCase().trim();

        if (query === '') {
            this.filteredData = [...this.data];
        } else {
            this.filteredData = this.data.filter(employee => {
                return employee.name.toLowerCase().includes(query) ||
                       employee.email.toLowerCase().includes(query) ||
                       employee.department.toLowerCase().includes(query) ||
                       employee.position.toLowerCase().includes(query);
            });
        }

        this.renderGrid();
        this.updateStatistics();
    }

    exportData() {
        const csv = this.generateCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employee-data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    generateCSV() {
        const headers = ['ID', 'Name', 'Email', 'Department', 'Position', 'Salary', 'Hire Date', 'Status'];
        const rows = this.filteredData.map(emp => [
            emp.id,
            emp.name,
            emp.email,
            emp.department,
            emp.position,
            emp.salary,
            this.formatDate(emp.hireDate),
            emp.status
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    updateStatistics() {
        const totalElem = document.getElementById('total-employees');
        const activeElem = document.getElementById('active-count');
        const avgSalaryElem = document.getElementById('avg-salary');
        const deptsElem = document.getElementById('departments-count');

        if (totalElem) totalElem.textContent = this.filteredData.length;

        const activeCount = this.filteredData.filter(e => e.status === 'Active').length;
        if (activeElem) activeElem.textContent = activeCount;

        const avgSalary = this.filteredData.reduce((sum, e) => sum + e.salary, 0) / this.filteredData.length;
        if (avgSalaryElem) avgSalaryElem.textContent = '$' + Math.round(avgSalary).toLocaleString();

        const departments = new Set(this.filteredData.map(e => e.department));
        if (deptsElem) deptsElem.textContent = departments.size;
    }

    updateGridStatus() {
        const statusElem = document.getElementById('grid-status');
        if (statusElem) {
            const total = this.filteredData.length;
            const selected = this.selectedRows.size;

            if (selected > 0) {
                statusElem.textContent = `${selected} of ${total} rows selected`;
            } else {
                statusElem.textContent = `Showing ${total} employees`;
            }
        }
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    stripHTML(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }
}

// Initialize accessible grid
document.addEventListener('DOMContentLoaded', () => {
    const accessibleGrid = document.getElementById('accessible-grid');
    if (accessibleGrid) {
        new AccessibleGrid(accessibleGrid);
    }
});
