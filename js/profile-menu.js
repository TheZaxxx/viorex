// Profile Menu functionality
class ProfileMenu {
    constructor() {
        this.menu = document.getElementById('profileMenu');
        this.overlay = document.getElementById('profileOverlay');
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Profile icon click
        const profileIcon = document.querySelector('.profile-icon');
        if (profileIcon) {
            profileIcon.addEventListener('click', () => {
                this.openMenu();
            });
        }
        
        // Close menu
        const closeBtn = document.getElementById('closeProfileMenu');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        // Logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
        
        // Menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!item.classList.contains('logout-btn')) {
                    e.preventDefault();
                    this.handleMenuItemClick(item.textContent.trim());
                }
            });
        });
    }
    
    openMenu() {
        if (this.menu) this.menu.classList.add('active');
        if (this.overlay) this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        if (this.menu) this.menu.classList.remove('active');
        if (this.overlay) this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    handleMenuItemClick(itemName) {
        this.closeMenu();
        
        // Show message for demo
        if (window.viorexApp && window.viorexApp.showMessage) {
            window.viorexApp.showMessage(`${itemName} - Feature coming soon!`, 'info');
        } else {
            alert(`${itemName} - Feature coming soon!`);
        }
    }
    
    handleLogout() {
        this.closeMenu();
        
        if (window.viorexApp && window.viorexApp.showMessage) {
            window.viorexApp.showMessage('Logging out...', 'info');
        }
        
        // Simulate logout
        setTimeout(() => {
            localStorage.removeItem('viorex_user');
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Initialize profile menu
document.addEventListener('DOMContentLoaded', () => {
    window.profileMenu = new ProfileMenu();
});
