class RoadmapManager {
    constructor() {
        this.roadmapData = null;
        this.progressManager = new ProgressManager();
        this.languageManager = new LanguageManager();
        this.currentLanguage = this.getLanguageFromURL() || 'python';
        this.init();
    }

    getLanguageFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('lang');
    }

    async init() {
        await this.loadRoadmap();
        this.updatePageTitle();
        this.renderRoadmap();
        this.updateOverallProgress();
        this.setupEventListeners();
    }

    async loadRoadmap() {
        try {
            const language = this.languageManager.getLanguageById(this.currentLanguage);
            if (!language || !language.available) {
                throw new Error('Language not available');
            }

            const response = await fetch(`./data/${language.dataFile}`);
            if (!response.ok) {
                throw new Error('Failed to load roadmap data');
            }
            
            this.roadmapData = await response.json();
        } catch (error) {
            console.error('Failed to load roadmap data:', error);
            this.showError('Failed to load roadmap. Please try a different language or refresh the page.');
        }
    }

    updatePageTitle() {
        const language = this.languageManager.getLanguageById(this.currentLanguage);
        if (language) {
            document.title = `${language.name} Roadmap - PathShine`;
            
            // Update breadcrumb
            const breadcrumb = document.querySelector('nav .text-gray-600');
            if (breadcrumb) {
                breadcrumb.textContent = `/ ${language.name} Roadmap`;
            }

            // Update header
            const header = document.querySelector('main h1');
            if (header) {
                header.innerHTML = `${language.icon} ${language.name} Learning Roadmap`;
            }
        }
    }

    renderRoadmap() {
        const container = document.getElementById('roadmap-container');
        if (!container || !this.roadmapData) return;

        container.innerHTML = this.roadmapData.steps.map(step => this.renderStep(step)).join('');
    }
    renderStep(step) {
        const status = this.progressManager.getStepStatus(step.id);
        const statusIcon = this.getStatusIcon(status);
        const statusText = this.getStatusText(status);

        return `
            <div class="roadmap-step" data-step-id="${step.id}">
                <div class="step-marker status-${status}">
                    ${statusIcon}
                </div>
                
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">${step.title}</h3>
                        <p class="text-gray-600 mb-3">${step.description}</p>
                        <div class="flex flex-wrap gap-2 mb-3">
                            <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                ${step.estimatedTime}
                            </span>
                            <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                ${step.difficulty}
                            </span>
                        </div>
                    </div>
                    <button class="status-toggle ${status}" onclick="roadmapManager.toggleStepStatus(${step.id})">
                        ${statusIcon} ${statusText}
                    </button>
                </div>

                <div class="mb-4">
                    <h4 class="font-semibold text-gray-700 mb-2">Topics Covered:</h4>
                    <div class="flex flex-wrap gap-2">
                        ${step.topics.map(topic => `
                            <span class="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">${topic}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="resources-section">
                    <h4 class="font-semibold text-gray-700 mb-3">Learning Resources:</h4>
                    <div class="grid gap-3">
                        ${step.resources.map(resource => this.renderResource(resource)).join('')}
                    </div>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-200">
                    <div class="feedback-section">
                        <p class="text-sm text-gray-600 mb-2">Was this step helpful?</p>
                        <div class="flex gap-2">
                            <button class="feedback-btn text-sm px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200">
                                👍 Yes
                            </button>
                            <button class="feedback-btn text-sm px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">
                                👎 No
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderResource(resource) {
        return `
            <div class="resource-item p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div class="flex items-start gap-3">
                    <span class="resource-type-badge ${resource.type}">
                        ${resource.type}
                    </span>
                    <div class="flex-1">
                        <a href="${resource.url}" target="_blank" rel="noopener noreferrer" 
                           class="text-blue-600 hover:text-blue-800 font-medium text-lg block mb-1">
                            ${resource.title} ↗
                        </a>
                        ${resource.description ? `<p class="text-gray-600 text-sm mb-2">${resource.description}</p>` : ''}
                        ${resource.duration ? `<p class="text-gray-500 text-sm">Duration: ${resource.duration}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    getStatusIcon(status) {
        const icons = {
            'not-started': '○',
            'in-progress': '◐',
            'completed': '●'
        };
        return icons[status] || '○';
    }

    getStatusText(status) {
        const texts = {
            'not-started': 'Not Started',
            'in-progress': 'In Progress',
            'completed': 'Completed'
        };
        return texts[status] || 'Not Started';
    }

    toggleStepStatus(stepId) {
        const newStatus = this.progressManager.toggleStepStatus(stepId);
        this.updateStepUI(stepId, newStatus);
        this.updateOverallProgress();
    }

    updateStepUI(stepId, status) {
        const stepElement = document.querySelector(`[data-step-id="${stepId}"]`);
        if (!stepElement) return;

        const marker = stepElement.querySelector('.step-marker');
        const toggle = stepElement.querySelector('.status-toggle');

        // Update marker
        marker.className = `step-marker status-${status}`;
        marker.textContent = this.getStatusIcon(status);

        // Update toggle button
        toggle.className = `status-toggle ${status}`;
        toggle.innerHTML = `${this.getStatusIcon(status)} ${this.getStatusText(status)}`;
    }

    updateOverallProgress() {
        if (!this.roadmapData) return;

        const progress = this.progressManager.calculateOverallProgress(this.roadmapData.totalSteps);
        const progressBar = document.getElementById('overall-progress');
        const progressText = document.getElementById('progress-text');

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (progressText) {
            progressText.textContent = `${progress}% Complete`;
        }
    }

    setupEventListeners() {
        const resetButton = document.getElementById('reset-progress');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.progressManager.resetProgress();
            });
        }

        // Add feedback listeners
        document.addEventListener('click', (e) => {
            if (e.target.matches('.feedback-btn')) {
                const isPositive = e.target.textContent.includes('👍');
                this.handleFeedback(isPositive);
                e.target.style.opacity = '0.5';
                e.target.disabled = true;
            }
        });
    }

    handleFeedback(isPositive) {
        // Store feedback (could be enhanced to send to analytics)
        console.log('Feedback received:', isPositive ? 'positive' : 'negative');
        
        // Show thank you message
        const message = document.createElement('div');
        message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        message.textContent = 'Thank you for your feedback!';
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    showError(message) {
        const container = document.getElementById('roadmap-container');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-red-600 text-xl mb-4">⚠️ Error</div>
                    <p class="text-gray-600">${message}</p>
                </div>
            `;
        }
    }
}

// Initialize roadmap manager when DOM is loaded
let roadmapManager;
document.addEventListener('DOMContentLoaded', () => {
    roadmapManager = new RoadmapManager();
});
