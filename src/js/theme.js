// ===================================
// ORDEM PRO SYSTEM - THEME MANAGER
// ===================================

const ThemeManager = {
    /**
     * Initialize theme on page load
     */
    init() {
        const savedTheme = StorageManager.getTheme();
        this.setTheme(savedTheme);
        this.setupToggleButton();
    },

    /**
     * Set theme
     * @param {string} theme - 'light' or 'dark'
     */
    setTheme(theme) {
        const html = document.documentElement;
        
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        
        StorageManager.saveTheme(theme);
        this.updateToggleButton(theme);
    },

    /**
     * Toggle theme
     */
    toggle() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },

    /**
     * Get current theme
     * @returns {string} Current theme
     */
    getCurrentTheme() {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    },

    /**
     * Setup theme toggle button
     */
    setupToggleButton() {
        const button = document.getElementById('theme-toggle');
        if (button) {
            button.addEventListener('click', () => this.toggle());
        }
    },

    /**
     * Update toggle button icon
     * @param {string} theme - Current theme
     */
    updateToggleButton(theme) {
        const button = document.getElementById('theme-toggle');
        if (!button) return;
        
        const icon = button.querySelector('.material-symbols-rounded');
        if (!icon) return;
        
        icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    },

    /**
     * Get system theme preference
     * @returns {string} System theme preference
     */
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    /**
     * Watch for system theme changes
     */
    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }
};

// Initialize theme when DOM is ready
function initTheme() {
    ThemeManager.init();
}

// Export to global scope
window.ThemeManager = ThemeManager;
window.initTheme = initTheme;

console.log('✅ Theme Manager loaded');
