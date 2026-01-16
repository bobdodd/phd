/**
 * Inaccessible Grid Implementation
 * Missing proper ARIA roles and keyboard navigation
 * Paradise will detect 8 accessibility issues
 */

class InaccessibleGrid {
    constructor(tableElement) {
        this.table = tableElement;
        this.tbody = tableElement.querySelector('tbody');
        this.data = [];

        this.init();
    }

    init() {
        this.generateEmployeeData();
        this.renderGrid();
        this.setupEventListeners();
    }

    generateEmployeeData() {
        const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack'];
        const lastNames = ['Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Foster', 'Gray', 'Harris', 'Irving', 'Jones'];

        const departments = [
            { name: 'Engineering', class: 'engineering' },
            { name: 'Sales', class: 'sales' },
            { name: 'Marketing', class: 'marketing' },
            { name: 'HR', class: 'hr' }
        ];

        const positions = ['Manager', 'Senior Specialist', 'Specialist', 'Associate', 'Coordinator'];
        const statuses = [
            { name: 'Active', class: 'active' },
            { name: 'On Leave', class: 'on-leave' },
            { name: 'Inactive', class: 'inactive' }
        ];

        for (let i = 1; i <= 20; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
            const dept = departments[Math.floor(Math.random() * departments.length)];
            const position = positions[Math.floor(Math.random() * positions.length)];
            const salary = Math.floor(Math.random() * 100000) + 50000;
            const hireDate = new Date(2015 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            const status = statuses[Math.floor(Math.random() * statuses.length)];

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
    }

    renderGrid() {
        // ISSUE 1-4: Missing role="row", role="gridcell" attributes
        // Rendering without proper ARIA grid structure
        this.tbody.innerHTML = '';

        this.data.forEach(employee => {
            const row = document.createElement('tr');
            // Missing role="row"

            row.innerHTML = `
                <td>${employee.id}</td>
                <td><span class="employee-name">${employee.name}</span></td>
                <td><span class="employee-email">${employee.email}</span></td>
                <td><span class="department-badge ${employee.departmentClass}">${employee.department}</span></td>
                <td>${employee.position}</td>
                <td><span class="salary-amount">$${employee.salary.toLocaleString()}</span></td>
                <td>${this.formatDate(employee.hireDate)}</td>
                <td><span class="status-indicator ${employee.statusClass}">${employee.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit">Edit</button>
                        <button class="action-btn delete">Delete</button>
                    </div>
                </td>
            `;

            this.tbody.appendChild(row);
        });
    }

    setupEventListeners() {
        // ISSUE 5: No keyboard navigation support
        // Missing arrow key navigation handlers

        // ISSUE 6: Missing aria-sort handling
        // Click sorting without proper ARIA attributes
        const headers = this.table.querySelectorAll('th[data-column]');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-column');
                this.sortByColumn(column);
            });
        });

        // ISSUE 7: No focus management
        // Missing tabindex management for keyboard navigation

        // Basic search without accessibility announcements
        const searchInput = document.getElementById('bad-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        const exportBtn = document.getElementById('bad-export');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
    }

    sortByColumn(column) {
        // ISSUE 6: Sorting without aria-sort updates
        this.data.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            if (column === 'salary' || column === 'id') {
                return Number(aVal) - Number(bVal);
            } else if (column === 'hireDate') {
                return a[column].getTime() - b[column].getTime();
            } else {
                return String(aVal).localeCompare(String(bVal));
            }
        });

        this.renderGrid();
    }

    handleSearch(query) {
        // Search without status announcements
        query = query.toLowerCase().trim();

        const rows = this.tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query) || query === '') {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
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
        const rows = this.data.map(emp => [
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

    formatDate(date) {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
}

// Initialize inaccessible grid
document.addEventListener('DOMContentLoaded', () => {
    const inaccessibleGrid = document.getElementById('inaccessible-grid');
    if (inaccessibleGrid) {
        // ISSUE 8: Missing aria-label on grid
        new InaccessibleGrid(inaccessibleGrid);
    }
});
