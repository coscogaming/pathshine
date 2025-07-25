// Theme management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('pathshine-theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupThemeToggle();
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.documentElement.classList.add('dark');
            this.updateThemeToggle('☀️');
        } else {
            document.documentElement.classList.remove('dark');
            this.updateThemeToggle('🌙');
        }
    }

    updateThemeToggle(icon) {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.textContent = icon;
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('pathshine-theme', this.theme);
        this.applyTheme();
    }

    setupThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});
