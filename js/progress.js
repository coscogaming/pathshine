class ProgressManager {
    constructor(language = 'python') {
        this.language = language;
        this.storageKey = `pathshine-${language}-progress`;
        this.progress = this.loadProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {};
    }

    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }

    getStepStatus(stepId) {
        return this.progress[stepId] || 'not-started';
    }

    setStepStatus(stepId, status) {
        this.progress[stepId] = status;
        this.saveProgress();
    }

    toggleStepStatus(stepId) {
        const statuses = ['not-started', 'in-progress', 'completed'];
        const currentStatus = this.getStepStatus(stepId);
        const currentIndex = statuses.indexOf(currentStatus);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        
        this.setStepStatus(stepId, nextStatus);
        return nextStatus;
    }

    calculateOverallProgress(totalSteps) {
        const completedSteps = Object.values(this.progress)
            .filter(status => status === 'completed').length;
        return Math.round((completedSteps / totalSteps) * 100);
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            this.progress = {};
            this.saveProgress();
            location.reload();
        }
    }

    getProgressStats() {
        const total = Object.keys(this.progress).length;
        const completed = Object.values(this.progress).filter(s => s === 'completed').length;
        const inProgress = Object.values(this.progress).filter(s => s === 'in-progress').length;
        
        return { total, completed, inProgress };
    }
}
