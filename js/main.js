// Enhanced Theme Manager
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
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('pathshine-theme', this.theme);
        this.applyTheme();
        
        // Smooth transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    setupThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Language Manager
class LanguageManager {
    constructor() {
        this.languages = [
            {
                id: 'python',
                name: 'Python',
                icon: '🐍',
                description: 'Complete Python roadmap from basics to advanced projects',
                difficulty: 'Beginner Friendly',
                steps: 8,
                available: true,
                dataFile: 'python-roadmap.json'
            },
            {
                id: 'javascript',
                name: 'JavaScript',
                icon: '⚡',
                description: 'Master modern JavaScript and ES6+ features',
                difficulty: 'Beginner Friendly',
                steps: 10,
                available: true,
                dataFile: 'javascript-roadmap.json'
            },
            {
                id: 'react',
                name: 'React',
                icon: '⚛️',
                description: 'Build modern web applications with React',
                difficulty: 'Intermediate',
                steps: 8,
                available: true,
                dataFile: 'react-roadmap.json'
            },
            {
                id: 'nodejs',
                name: 'Node.js',
                icon: '💚',
                description: 'Server-side JavaScript development',
                difficulty: 'Intermediate',
                steps: 7,
                available: true,
                dataFile: 'nodejs-roadmap.json'
            },
            {
                id: 'data-science',
                name: 'Data Science',
                icon: '📊',
                description: 'Learn data analysis, visualization, and machine learning',
                difficulty: 'Advanced',
                steps: 9,
                available: true,
                dataFile: 'data-science-roadmap.json'
            },
            {
                id: 'web-dev',
                name: 'Web Development',
                icon: '🌐',
                description: 'Full-stack web development fundamentals',
                difficulty: 'Beginner',
                steps: 12,
                available: true,
                dataFile: 'web-dev-roadmap.json'
            },
            {
                id: 'java',
                name: 'Java',
                icon: '☕',
                description: 'Enterprise Java development',
                difficulty: 'Intermediate',
                steps: 8,
                available: false
            },
            {
                id: 'cpp',
                name: 'C++',
                icon: '⚙️',
                description: 'System programming and competitive coding',
                difficulty: 'Advanced',
                steps: 9,
                available: false
            },
            {
                id: 'flutter',
                name: 'Flutter',
                icon: '📱',
                description: 'Cross-platform mobile app development',
                difficulty: 'Intermediate',
                steps: 7,
                available: false
            }
        ];
    }

    getLanguages() {
        return this.languages;
    }

    getAvailableLanguages() {
        return this.languages.filter(lang => lang.available);
    }

    getLanguageById(id) {
        return this.languages.find(lang => lang.id === id);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    
    // Initialize language cards if on homepage
    if (document.getElementById('language-cards')) {
        const languageManager = new LanguageManager();
        renderLanguageCards(languageManager.getLanguages());
    }
});

// Render language cards
function renderLanguageCards(languages) {
    const container = document.getElementById('language-cards');
    if (!container) return;

    container.innerHTML = languages.map(lang => {
        if (lang.available) {
            return `
                <div class="learning-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-2xl">${lang.icon}</span>
                        </div>
                        <h3 class="text-2xl font-semibold text-gray-800 mb-2">${lang.name}</h3>
                        <p class="text-gray-600 mb-4">${lang.description}</p>
                        <div class="mb-4">
                            <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                ${lang.steps} Steps
                            </span>
                            <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
                                ${lang.difficulty}
                            </span>
                        </div>
                        <a href="roadmap.html?lang=${lang.id}" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Start Learning
                        </a>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="learning-card bg-gray-100 rounded-xl shadow-lg p-6 opacity-60">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-2xl">${lang.icon}</span>
                        </div>
                        <h3 class="text-2xl font-semibold text-gray-600 mb-2">${lang.name}</h3>
                        <p class="text-gray-500 mb-4">${lang.description}</p>
                        <div class="mb-4">
                            <span class="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                                ${lang.steps} Steps
                            </span>
                            <span class="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full ml-2">
                                ${lang.difficulty}
                            </span>
                        </div>
                        <span class="inline-block bg-gray-200 text-gray-600 px-6 py-3 rounded-lg font-medium">
                            Coming Soon
                        </span>
                    </div>
                </div>
            `;
        }
    }).join('');
}
