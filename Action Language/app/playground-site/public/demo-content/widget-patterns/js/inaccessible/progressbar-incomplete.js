/**
 * Inaccessible Progressbar Implementation
 * Demonstrates common accessibility mistakes with progressbars
 *
 * ISSUES THAT PARADISE WILL DETECT:
 * 1. Missing role="progressbar" on progress elements
 * 2. Missing aria-valuemin and aria-valuemax attributes
 * 3. Missing aria-valuenow for current progress value
 * 4. No aria-label or aria-labelledby for accessible names
 *
 * These issues make the progress indicators completely invisible to screen readers
 */

class InaccessibleProgressbar {
    constructor() {
        this.basicInterval = null;
        this.basicValue = 0;
        this.basicPaused = false;

        this.fileUploadInterval = null;
        this.fileUploadValue = 0;
        this.fileUploadActive = false;

        this.installationInterval = null;
        this.installationValue = 0;
        this.installationActive = false;
        this.installationSteps = [
            { name: 'Downloading files', duration: 3000 },
            { name: 'Extracting archive', duration: 2000 },
            { name: 'Installing components', duration: 4000 },
            { name: 'Configuring settings', duration: 2000 },
            { name: 'Finalizing installation', duration: 1500 }
        ];
        this.currentStep = 0;

        this.circularInterval = null;
        this.circularValue = 0;
        this.circularActive = false;

        this.indeterminateActive = false;
    }

    // ==================== BASIC PROGRESSBAR ====================
    // ISSUE: No ARIA attributes updated, only visual changes

    startBasic() {
        if (this.basicInterval) {
            this.basicPaused = false;
            return;
        }

        this.basicValue = 0;
        this.basicPaused = false;

        const fill = document.getElementById('inaccessible-basic-fill');
        const percentage = document.getElementById('inaccessible-basic-percentage');

        this.basicInterval = setInterval(() => {
            if (!this.basicPaused) {
                this.basicValue += 2;

                if (this.basicValue >= 100) {
                    this.basicValue = 100;
                    this.resetBasic();
                    fill.style.width = '100%';
                    fill.textContent = '100%';
                    percentage.textContent = '100%';
                    return;
                }

                // Only visual updates, no ARIA updates
                fill.style.width = this.basicValue + '%';
                fill.textContent = Math.round(this.basicValue) + '%';
                percentage.textContent = Math.round(this.basicValue) + '%';
            }
        }, 100);
    }

    pauseBasic() {
        this.basicPaused = !this.basicPaused;
    }

    resetBasic() {
        if (this.basicInterval) {
            clearInterval(this.basicInterval);
            this.basicInterval = null;
        }

        this.basicValue = 0;
        this.basicPaused = false;

        const fill = document.getElementById('inaccessible-basic-fill');
        const percentage = document.getElementById('inaccessible-basic-percentage');

        fill.style.width = '0%';
        fill.textContent = '0%';
        percentage.textContent = '0%';
    }

    // ==================== FILE UPLOAD PROGRESSBAR ====================
    // ISSUE: No aria-valuetext, no live region announcements

    startFileUpload() {
        if (this.fileUploadActive) return;

        this.fileUploadValue = 0;
        this.fileUploadActive = true;

        const fill = document.getElementById('inaccessible-file-fill');
        const percentage = document.getElementById('inaccessible-file-percentage');
        const statusBadge = document.getElementById('inaccessible-file-status');
        const textLabel = document.getElementById('inaccessible-file-text');

        statusBadge.textContent = 'Uploading';
        statusBadge.className = 'status-badge processing';
        textLabel.textContent = 'Uploading file...';

        this.fileUploadInterval = setInterval(() => {
            this.fileUploadValue += Math.random() * 5 + 2;

            if (this.fileUploadValue >= 100) {
                this.fileUploadValue = 100;
                this.completeFileUpload();
                return;
            }

            const uploadedMB = ((this.fileUploadValue / 100) * 15.7).toFixed(1);
            fill.style.width = this.fileUploadValue + '%';
            percentage.textContent = Math.round(this.fileUploadValue) + '%';
            textLabel.textContent = `Uploading... ${uploadedMB} MB of 15.7 MB`;
        }, 200);
    }

    completeFileUpload() {
        if (this.fileUploadInterval) {
            clearInterval(this.fileUploadInterval);
            this.fileUploadInterval = null;
        }

        this.fileUploadActive = false;

        const fill = document.getElementById('inaccessible-file-fill');
        const percentage = document.getElementById('inaccessible-file-percentage');
        const statusBadge = document.getElementById('inaccessible-file-status');
        const textLabel = document.getElementById('inaccessible-file-text');

        fill.style.width = '100%';
        percentage.textContent = '100%';
        statusBadge.textContent = 'Complete';
        statusBadge.className = 'status-badge complete';
        textLabel.textContent = 'Upload completed successfully';
    }

    cancelFileUpload() {
        if (this.fileUploadInterval) {
            clearInterval(this.fileUploadInterval);
            this.fileUploadInterval = null;
        }

        this.fileUploadActive = false;
        this.fileUploadValue = 0;

        const fill = document.getElementById('inaccessible-file-fill');
        const percentage = document.getElementById('inaccessible-file-percentage');
        const statusBadge = document.getElementById('inaccessible-file-status');
        const textLabel = document.getElementById('inaccessible-file-text');

        fill.style.width = '0%';
        percentage.textContent = '0%';
        statusBadge.textContent = 'Cancelled';
        statusBadge.className = 'status-badge error';
        textLabel.textContent = 'Upload cancelled';

        setTimeout(() => {
            statusBadge.textContent = 'Pending';
            statusBadge.className = 'status-badge pending';
            textLabel.textContent = 'Ready to upload';
        }, 2000);
    }

    // ==================== INSTALLATION PROGRESSBAR ====================

    startInstallation() {
        if (this.installationActive) return;

        this.installationValue = 0;
        this.installationActive = true;
        this.currentStep = 0;

        const stepsContainer = document.getElementById('inaccessible-install-steps');
        this.renderInstallationSteps(stepsContainer);

        const textLabel = document.getElementById('inaccessible-install-text');
        textLabel.textContent = 'Installing...';

        this.processInstallationStep();
    }

    processInstallationStep() {
        if (this.currentStep >= this.installationSteps.length) {
            this.completeInstallation();
            return;
        }

        const step = this.installationSteps[this.currentStep];
        const stepProgress = (this.currentStep / this.installationSteps.length) * 100;

        const fill = document.getElementById('inaccessible-install-fill');
        const percentage = document.getElementById('inaccessible-install-percentage');
        const textLabel = document.getElementById('inaccessible-install-text');

        textLabel.textContent = step.name;

        const stepElements = document.querySelectorAll('#inaccessible-install-steps .installation-step');
        if (stepElements[this.currentStep]) {
            const stepStatus = stepElements[this.currentStep].querySelector('.step-status');
            stepStatus.textContent = 'In progress...';
        }

        const increment = 100 / this.installationSteps.length / (step.duration / 50);
        let localProgress = stepProgress;

        this.installationInterval = setInterval(() => {
            localProgress += increment;
            const nextStepProgress = ((this.currentStep + 1) / this.installationSteps.length) * 100;

            if (localProgress >= nextStepProgress) {
                clearInterval(this.installationInterval);

                if (stepElements[this.currentStep]) {
                    const stepStatus = stepElements[this.currentStep].querySelector('.step-status');
                    stepStatus.textContent = 'Complete';
                }

                this.currentStep++;
                this.processInstallationStep();
                return;
            }

            fill.style.width = localProgress + '%';
            fill.textContent = Math.round(localProgress) + '%';
            percentage.textContent = Math.round(localProgress) + '%';
        }, 50);
    }

    renderInstallationSteps(container) {
        container.innerHTML = '';
        this.installationSteps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'installation-step';
            stepDiv.innerHTML = `
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                    <div class="step-title">${step.name}</div>
                    <div class="step-status">Pending</div>
                </div>
            `;
            container.appendChild(stepDiv);
        });
    }

    completeInstallation() {
        const fill = document.getElementById('inaccessible-install-fill');
        const percentage = document.getElementById('inaccessible-install-percentage');
        const textLabel = document.getElementById('inaccessible-install-text');

        fill.style.width = '100%';
        fill.textContent = '100%';
        percentage.textContent = '100%';
        textLabel.textContent = 'Installation complete!';

        this.installationActive = false;
    }

    cancelInstallation() {
        if (this.installationInterval) {
            clearInterval(this.installationInterval);
            this.installationInterval = null;
        }

        this.installationActive = false;
        this.installationValue = 0;
        this.currentStep = 0;

        const fill = document.getElementById('inaccessible-install-fill');
        const percentage = document.getElementById('inaccessible-install-percentage');
        const textLabel = document.getElementById('inaccessible-install-text');
        const stepsContainer = document.getElementById('inaccessible-install-steps');

        fill.style.width = '0%';
        fill.textContent = '0%';
        percentage.textContent = '0%';
        textLabel.textContent = 'Installation cancelled';
        stepsContainer.innerHTML = '';

        setTimeout(() => {
            textLabel.textContent = 'Ready to install';
        }, 2000);
    }

    // ==================== CIRCULAR PROGRESSBAR ====================

    startCircular() {
        if (this.circularActive) return;

        this.circularValue = 0;
        this.circularActive = true;

        const text = document.getElementById('inaccessible-circular-text');
        const status = document.getElementById('inaccessible-circular-status');
        const bar = document.getElementById('inaccessible-circular-bar');
        const radius = 50;
        const circumference = 2 * Math.PI * radius;

        status.textContent = 'Processing data...';

        this.circularInterval = setInterval(() => {
            this.circularValue += 1.5;

            if (this.circularValue >= 100) {
                this.circularValue = 100;
                this.stopCircular();
                text.textContent = '100%';
                status.textContent = 'Processing complete!';
                bar.style.strokeDashoffset = 0;
                return;
            }

            const offset = circumference - (this.circularValue / 100) * circumference;
            bar.style.strokeDashoffset = offset;
            text.textContent = Math.round(this.circularValue) + '%';
        }, 50);
    }

    stopCircular() {
        if (this.circularInterval) {
            clearInterval(this.circularInterval);
            this.circularInterval = null;
        }

        this.circularActive = false;

        if (this.circularValue < 100) {
            const status = document.getElementById('inaccessible-circular-status');
            status.textContent = 'Processing stopped';
        }
    }

    // ==================== INDETERMINATE PROGRESSBAR ====================

    startIndeterminate() {
        if (this.indeterminateActive) return;

        this.indeterminateActive = true;

        const progressBar = document.getElementById('inaccessible-indeterminate');
        const textLabel = document.getElementById('inaccessible-indeterminate-text');

        progressBar.style.display = 'block';
        textLabel.textContent = 'Loading content...';
    }

    stopIndeterminate() {
        if (!this.indeterminateActive) return;

        this.indeterminateActive = false;

        const progressBar = document.getElementById('inaccessible-indeterminate');
        const textLabel = document.getElementById('inaccessible-indeterminate-text');

        progressBar.style.display = 'none';
        textLabel.textContent = 'Content loaded successfully';

        setTimeout(() => {
            textLabel.textContent = 'Ready to load';
        }, 2000);
    }
}

// Initialize the inaccessible progressbar manager
const inaccessibleProgress = new InaccessibleProgressbar();
