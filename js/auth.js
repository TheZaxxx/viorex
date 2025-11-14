// Enhanced Authentication functionality
class EnhancedAuthManager {
    constructor() {
        this.setupAuthTabs();
        this.setupFormHandlers();
        this.checkExistingUser();
    }
    
    setupAuthTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active tab panel
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === targetTab) {
                        panel.classList.add('active');
                    }
                });
            });
        });
    }
    
    setupFormHandlers() {
        const loginForm = document.querySelector('#login .auth-form');
        const registerForm = document.querySelector('#register .auth-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Real-time password validation
        const regPassword = document.getElementById('reg-password');
        const regConfirm = document.getElementById('reg-confirm');
        
        if (regPassword && regConfirm) {
            regPassword.addEventListener('input', () => this.validatePassword());
            regConfirm.addEventListener('input', () => this.validatePasswordMatch());
        }
    }

    validatePassword() {
        const password = document.getElementById('reg-password');
        const hint = password.parentNode.querySelector('.password-hint');
        
        if (password.value.length > 0 && password.value.length < 6) {
            hint.style.color = 'var(--danger)';
            password.style.borderColor = 'var(--danger)';
        } else if (password.value.length >= 6) {
            hint.style.color = 'var(--success)';
            password.style.borderColor = 'var(--success)';
        } else {
            hint.style.color = 'var(--warning)';
            password.style.borderColor = 'var(--primary)';
        }
    }

    validatePasswordMatch() {
        const password = document.getElementById('reg-password');
        const confirm = document.getElementById('reg-confirm');
        
        if (confirm.value.length > 0) {
            if (password.value === confirm.value) {
                confirm.style.borderColor = 'var(--success)';
            } else {
                confirm.style.borderColor = 'var(--danger)';
            }
        }
    }
    
    checkExistingUser() {
        const user = this.getUser();
        if (user) {
            this.showMessage('Welcome back! Redirecting...', 'info');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        }
    }
    
    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Basic validation
        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        if (password.length < 1) {
            this.showMessage('Please enter your password', 'error');
            return;
        }
        
        // Simulate login
        this.simulateLogin(email, password);
    }
    
    handleRegister() {
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        const referralCode = document.getElementById('referral-code').value;
        
        // Enhanced validation
        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return;
        }
        
        if (password !== confirm) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }
        
        // Simulate registration
        this.simulateRegister(email, password, referralCode);
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    simulateLogin(email, password) {
        // Simulate API call delay
        this.showMessage('Logging in...', 'info');
        
        setTimeout(() => {
            // Check if user exists
            const existingUser = this.getUser();
            if (existingUser && existingUser.email === email) {
                // User exists, login successful
                this.showMessage('Login successful! Redirecting...', 'success');
                
                // Update last login
                existingUser.lastLogin = new Date().toISOString();
                this.saveUser(existingUser);
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else {
                // Create new user (demo purpose)
                this.createUser(email, password);
                this.showMessage('New account created! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            }
        }, 1000);
    }
    
    simulateRegister(email, password, referralCode) {
        // Simulate API call delay
        this.showMessage('Creating account...', 'info');
        
        setTimeout(() => {
            // Create new user
            this.createUser(email, password, referralCode);
            
            let message = 'Registration successful!';
            if (referralCode) {
                message += ' Referral code applied.';
            }
            message += ' Redirecting...';
            
            this.showMessage(message, 'success');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
        }, 1000);
    }

    createUser(email, password, referralCode = null) {
        const user = {
            email: email,
            balance: '1250.75', // Demo balance
            joined: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            referralCode: referralCode,
            assets: {
                'VRT': { amount: '1000', value: '850' },
                'VRDT': { amount: '500', value: '500' },
                'USDT': { amount: '0', value: '0' }
            }
        };
        
        this.saveUser(user);
        return user;
    }

    getUser() {
        const userData = localStorage.getItem('viorex_user');
        return userData ? JSON.parse(userData) : null;
    }

    saveUser(user) {
        localStorage.setItem('viorex_user', JSON.stringify(user));
    }
    
    showMessage(message, type) {
        // Remove existing messages
        const existingMsg = document.querySelector('.auth-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        // Create new message
        const msgElement = document.createElement('div');
        msgElement.className = `auth-message auth-message-${type}`;
        msgElement.textContent = message;
        
        // Add styles
        msgElement.style.padding = '12px';
        msgElement.style.marginBottom = '20px';
        msgElement.style.border = '2px solid';
        msgElement.style.borderRadius = '4px';
        msgElement.style.fontSize = '0.9rem';
        msgElement.style.fontWeight = 'bold';
        msgElement.style.textAlign = 'center';
        msgElement.style.animation = 'fadeIn 0.3s ease';
        
        switch (type) {
            case 'error':
                msgElement.style.borderColor = 'var(--danger)';
                msgElement.style.color = 'var(--danger)';
                msgElement.style.background = 'rgba(255, 68, 68, 0.1)';
                break;
            case 'success':
                msgElement.style.borderColor = 'var(--success)';
                msgElement.style.color = 'var(--success)';
                msgElement.style.background = 'rgba(0, 168, 107, 0.1)';
                break;
            case 'info':
                msgElement.style.borderColor = 'var(--info)';
                msgElement.style.color = 'var(--info)';
                msgElement.style.background = 'rgba(0, 153, 204, 0.1)';
                break;
        }
        
        // Insert message after tabs
        const authBox = document.querySelector('.auth-box');
        const tabs = document.querySelector('.auth-tabs');
        authBox.insertBefore(msgElement, tabs.nextSibling);

        // Auto-remove success/info messages after 4 seconds
        if (type !== 'error') {
            setTimeout(() => {
                if (msgElement.parentNode) {
                    msgElement.style.opacity = '0';
                    msgElement.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => msgElement.remove(), 300);
                }
            }, 4000);
        }
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedAuthManager();
});
