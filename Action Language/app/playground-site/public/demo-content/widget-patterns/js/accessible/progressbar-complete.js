/**
 * Accessible Progressbar Implementation
 * Demonstrates proper use of ARIA progressbar pattern with all required attributes
 *
 * Key ARIA Requirements:
 * - role="progressbar" on the progress element
 * - aria-valuemin (typically 0)
 * - aria-valuemax (typically 100)
 * - aria-valuenow (current value)
 * - aria-label or aria-labelledby for accessible name
 * - aria-valuetext (optional, for human-readable description)
 * - aria-live region for announcements (optional but recommended)
 */

class AccessibleProgressbar {
    constructor() {
        // Basic progress
        this.basicInterval = null;
        this.basicValue = 0;
        this.basicPaused = false;

        // File upload progress
        this.fileUploadInterval = null;
        this.fileUploadValue = 0;
        this.fileUploadActive = false;

        // Installation progress
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

        // Circular progress
        this.circularInterval = null;
        this.circularValue = 0;
        this.circularActive = false;

        // Indeterminate progress
        this.indeterminateActive = false;
    }

    // Helper method to update progressbar ARIA attributes
    updateProgressbarAttributes(element, value, valueText = null) {
        if (!element) return;

        element.setAttribute('aria-valuenow', Math.round(value));

        if (valueText) {
            element.setAttribute('aria-valuetext', valueText);
        }
    }

    // Helper method to announce to screen readers
    announceToScreenReader(liveRegionId, message) {
        const liveRegion = document.getElementById(liveRegionId);
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }

    // ==================== BASIC PROGRESSBAR ====================

    startBasic() {
        if (this.basicInterval) {
            this.basicPaused = false;
            return;
        }

        this.basicValue = 0;
        this.basicPaused = false;

        const fill = document.getElementById('accessible-basic-fill');
        const percentage = document.getElementById('accessible-basic-percentage');
        const label = document.getElementById('accessible-basic-label');

        this.announceToScreenReader('accessible-basic-live', 'Progress started');

        this.basicInterval = setInterval(() => {
            if (!this.basicPaused) {
                this.basicValue += 2;

                if (this.basicValue >= 100) {
                    this.basicValue = 100;
                    this.resetBasic();

                    // Update UI
                    fill.style.width = '100%';
                    fill.textContent = '100%';
                    percentage.textContent = '100%';
                    label.textContent = 'Complete!';

                    // Update ARIA attributes
                    this.updateProgressbarAttributes(fill, 100, 'Task completed');

                    // Announce completion
                    this.announceToScreenReader('accessible-basic-live', 'Task completed successfully');
                    return;
                }

                // Update UI
                fill.style.width = this.basicValue + '%';
                fill.textContent = Math.round(this.basicValue) + '%';
                percentage.textContent = Math.round(this.basicValue) + '%';
                label.textContent = 'Loading...';

                // Update ARIA attributes
                this.updateProgressbarAttributes(fill, this.basicValue, `${Math.round(this.basicValue)} percent complete`);

                // Announce progress at milestones
                if (this.basicValue === 25 || this.basicValue === 50 || this.basicValue === 75) {
                    this.announceToScreenReader('accessible-basic-live', `${Math.round(this.basicValue)}% complete`);
                }
            }
        }, 100);
    }

    pauseBasic() {
        this.basicPaused = !this.basicPaused;
        const status = this.basicPaused ? 'paused' : 'resumed';
        this.announceToScreenReader('accessible-basic-live', `Progress ${status} at ${Math.round(this.basicValue)}%`);
    }

    resetBasic() {
        if (this.basicInterval) {
            clearInterval(this.basicInterval);
            this.basicInterval = null;
        }

        this.basicValue = 0;
        this.basicPaused = false;

        const fill = document.getElementById('accessible-basic-fill');
        const percentage = document.getElementById('accessible-basic-percentage');
        const label = document.getElementById('accessible-basic-label');

        if (fill && percentage && label) {
            fill.style.width = '0%';
            fill.textContent = '0%';
            percentage.textContent = '0%';
            label.textContent = 'Loading...';

            // Reset ARIA attributes
            this.updateProgressbarAttributes(fill, 0, 'Not started');
        }

        this.announceToScreenReader('accessible-basic-live', 'Progress reset');
    }

    // ==================== FILE UPLOAD PROGRESSBAR ====================

    startFileUpload() {
        if (this.fileUploadActive) return;

        this.fileUploadValue = 0;
        this.fileUploadActive = true;

        const fill = document.getElementById('accessible-file-fill');
        const percentage = document.getElementById('accessible-file-percentage');
        const statusBadge = document.getElementById('accessible-file-status');
        const textLabel = document.getElementById('accessible-file-text');

        statusBadge.textContent = 'Uploading';
        statusBadge.className = 'status-badge processing';
        textLabel.textContent = 'Uploading file...';

        // Update ARIA attributes
        this.updateProgressbarAttributes(fill, 0, 'Upload started: 0 of 15.7 MB uploaded');
        this.announceToScreenReader('accessible-file-live', 'File upload started');

        this.fileUploadInterval = setInterval(() => {
            this.fileUploadValue += Math.random() * 5 + 2;

            if (this.fileUploadValue >= 100) {
                this.fileUploadValue = 100;
                this.completeFileUpload();
                return;
            }

            const uploadedMB = ((this.fileUploadValue / 100) * 15.7).toFixed(1);

            // Update UI
            fill.style.width = this.fileUploadValue + '%';
            percentage.textContent = Math.round(this.fileUploadValue) + '%';
            textLabel.textContent = `Uploading... ${uploadedMB} MB of 15.7 MB`;

            // Update ARIA attributes with detailed valuetext
            this.updateProgressbarAttributes(
                fill,
                this.fileUploadValue,
                `Upload in progress: ${uploadedMB} of 15.7 MB uploaded`
            );

            // Announce at milestones
            const roundedValue = Math.round(this.fileUploadValue);
            if (roundedValue === 25 || roundedValue === 50 || roundedValue === 75) {
                this.announceToScreenReader('accessible-file-live', `${roundedValue}% uploaded`);
            }
        }, 200);
    }

    completeFileUpload() {
        if (this.fileUploadInterval) {
            clearInterval(this.fileUploadInterval);
            this.fileUploadInterval = null;
        }

        this.fileUploadActive = false;

        const fill = document.getElementById('accessible-file-fill');
        const percentage = document.getElementById('accessible-file-percentage');
        const statusBadge = document.getElementById('accessible-file-status');
        const textLabel = document.getElementById('accessible-file-text');

        fill.style.width = '100%';
        percentage.textContent = '100%';
        statusBadge.textContent = 'Complete';
        statusBadge.className = 'status-badge complete';
        textLabel.textContent = 'Upload completed successfully';

        // Update ARIA attributes
        this.updateProgressbarAttributes(fill, 100, 'Upload complete: 15.7 MB uploaded successfully');
        this.announceToScreenReader('accessible-file-live', 'File upload completed successfully');
    }

    cancelFileUpload() {
        if (this.fileUploadInterval) {
            clearInterval(this.fileUploadInterval);
            this.fileUploadInterval = null;
        }

        this.fileUploadActive = false;
        this.fileUploadValue = 0;

        const fill = document.getElementById('accessible-file-fill');
        const percentage = document.getElementById('accessible-file-percentage');
        const statusBadge = document.getElementById('accessible-file-status');
        const textLabel = document.getElementById('accessible-file-text');

        fill.style.width = '0%';
        percentage.textContent = '0%';
        statusBadge.textContent = 'Cancelled';
        statusBadge.className = 'status-badge error';
        textLabel.textContent = 'Upload cancelled';

        // Update ARIA attributes
        this.updateProgressbarAttributes(fill, 0, 'Upload cancelled by user');
        this.announceToScreenReader('accessible-file-live', 'File upload cancelled');

        setTimeout(() => {
            statusBadge.textContent = 'Pending';
            statusBadge.className = 'status-badge pending';
            textLabel.textContent = 'Ready to upload';
            this.updateProgressbarAttributes(fill, 0, 'Ready to upload');
        }, 2000);
    }

    // ==================== INSTALLATION PROGRESSBAR ====================

    startInstallation() {
        if (this.installationActive) return;

        this.installationValue = 0;
        this.installationActive = true;
        this.currentStep = 0;

        const fill = document.getElementById('accessible-install-fill');
        const percentage = document.getElementById('accessible-install-percentage');
        const textLabel = document.getElementById('accessible-install-text');
        const stepsContainer = document.getElementById('accessible-install-steps');

        // Create step indicators
        this.renderInstallationSteps(stepsContainer);

        textLabel.textContent = 'Installing...';
        this.updateProgressbarAttributes(fill, 0, 'Installation started');
        this.announceToScreenReader('accessible-install-live', 'Installation started');

        this.processInstallationStep();
    }

    processInstallationStep() {
        if (this.currentStep >= this.installationSteps.length) {
            this.completeInstallation();
            return;
        }

        const step = this.installationSteps[this.currentStep];
        const stepProgress = (this.currentStep / this.installationSteps.length) * 100;

        const fill = document.getElementById('accessible-install-fill');
        const percentage = document.getElementById('accessible-install-percentage');
        const textLabel = document.getElementById('accessible-install-text');

        textLabel.textContent = step.name;
        this.updateProgressbarAttributes(
            fill,
            stepProgress,
            `Step ${this.currentStep + 1} of ${this.installationSteps.length}: ${step.name}`
        );
        this.announceToScreenReader('accessible-install-live', `${step.name}`);

        // Update step UI
        const stepElements = document.querySelectorAll('#accessible-install-steps .installation-step');
        if (stepElements[this.currentStep]) {
            const stepStatus = stepElements[this.currentStep].querySelector('.step-status');
            stepStatus.textContent = 'In progress...';
        }

        // Animate progress
        const increment = 100 / this.installationSteps.length / (step.duration / 50);
        let localProgress = stepProgress;

        this.installationInterval = setInterval(() => {
            localProgress += increment;
            const nextStepProgress = ((this.currentStep + 1) / this.installationSteps.length) * 100;

            if (localProgress >= nextStepProgress) {
                clearInterval(this.installationInterval);

                // Mark step as complete
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
            this.updateProgressbarAttributes(fill, localProgress);
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
        const fill = document.getElementById('accessible-install-fill');
        const percentage = document.getElementById('accessible-install-percentage');
        const textLabel = document.getElementById('accessible-install-text');

        fill.style.width = '100%';
        fill.textContent = '100%';
        percentage.textContent = '100%';
        textLabel.textContent = 'Installation complete!';

        this.updateProgressbarAttributes(fill, 100, 'Installation completed successfully');
        this.announceToScreenReader('accessible-install-live', 'Installation completed successfully');

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

        const fill = document.getElementById('accessible-install-fill');
        const percentage = document.getElementById('accessible-install-percentage');
        const textLabel = document.getElementById('accessible-install-text');
        const stepsContainer = document.getElementById('accessible-install-steps');

        fill.style.width = '0%';
        fill.textContent = '0%';
        percentage.textContent = '0%';
        textLabel.textContent = 'Installation cancelled';
        stepsContainer.innerHTML = '';

        this.updateProgressbarAttributes(fill, 0, 'Installation cancelled');
        this.announceToScreenReader('accessible-install-live', 'Installation cancelled');

        setTimeout(() => {
            textLabel.textContent = 'Ready to install';
        }, 2000);
    }

    // ==================== CIRCULAR PROGRESSBAR ====================

    startCircular() {
        if (this.circularActive) return;

        this.circularValue = 0;
        this.circularActive = true;

        const bar = document.getElementById('accessible-circular-bar');
        const text = document.getElementById('accessible-circular-text');
        const status = document.getElementById('accessible-circular-status');
        const radius = 50;
        const circumference = 2 * Math.PI * radius;

        status.textContent = 'Processing data...';
        this.updateProgressbarAttributes(bar, 0, 'Data processing started');
        this.announceToScreenReader('accessible-circular-live', 'Data processing started');

        this.circularInterval = setInterval(() => {
            this.circularValue += 1.5;

            if (this.circularValue >= 100) {
                this.circularValue = 100;
                this.stopCircular();

                text.textContent = '100%';
                status.textContent = 'Processing complete!';
                bar.style.strokeDashoffset = 0;

                this.updateProgressbarAttributes(bar, 100, 'Data processing completed');
                this.announceToScreenReader('accessible-circular-live', 'Data processing completed successfully');
                return;
            }

            const offset = circumference - (this.circularValue / 100) * circumference;
            bar.style.strokeDashoffset = offset;
            text.textContent = Math.round(this.circularValue) + '%';

            this.updateProgressbarAttributes(
                bar,
                this.circularValue,
                `Processing: ${Math.round(this.circularValue)}% complete`
            );

            // Announce at milestones
            if (Math.round(this.circularValue) % 25 === 0) {
                this.announceToScreenReader('accessible-circular-live', `${Math.round(this.circularValue)}% processed`);
            }
        }, 50);
    }

    stopCircular() {
        if (this.circularInterval) {
            clearInterval(this.circularInterval);
            this.circularInterval = null;
        }

        this.circularActive = false;

        if (this.circularValue < 100) {
            const status = document.getElementById('accessible-circular-status');
            status.textContent = 'Processing stopped';

            const bar = document.getElementById('accessible-circular-bar');
            this.announceToScreenReader('accessible-circular-live', 'Data processing stopped');
        }
    }

    // ==================== INDETERMINATE PROGRESSBAR ====================

    startIndeterminate() {
        if (this.indeterminateActive) return;

        this.indeterminateActive = true;

        const progressBar = document.getElementById('accessible-indeterminate');
        const textLabel = document.getElementById('accessible-indeterminate-text');

        progressBar.style.display = 'block';
        textLabel.textContent = 'Loading content...';

        // Set ARIA attributes for indeterminate state
        progressBar.setAttribute('aria-busy', 'true');
        progressBar.setAttribute('aria-valuetext', 'Loading in progress');

        this.announceToScreenReader('accessible-indeterminate-live', 'Loading started');
    }

    stopIndeterminate() {
        if (!this.indeterminateActive) return;

        this.indeterminateActive = false;

        const progressBar = document.getElementById('accessible-indeterminate');
        const textLabel = document.getElementById('accessible-indeterminate-text');

        progressBar.style.display = 'none';
        textLabel.textContent = 'Content loaded successfully';

        // Update ARIA attributes
        progressBar.setAttribute('aria-busy', 'false');
        progressBar.setAttribute('aria-valuetext', 'Loading complete');

        this.announceToScreenReader('accessible-indeterminate-live', 'Content loaded successfully');

        setTimeout(() => {
            textLabel.textContent = 'Ready to load';
        }, 2000);
    }
}

// Initialize the accessible progressbar manager
const accessibleProgress = new AccessibleProgressbar();
