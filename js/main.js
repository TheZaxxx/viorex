// Enhanced main application functionality
class EnhancedViorexApp {
    constructor() {
        this.currentUser = null;
        this.marketData = [];
        this.selectedTradingPair = 'VRT/USDT';
        this.init();
    }
    
    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.loadMarketData();
        this.setupTradingFeatures();
        this.updateUIForLoggedInUser();
    }
    
    checkAuthStatus() {
        const userData = localStorage.getItem('viorex_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        } else {
            // Redirect to login if not authenticated
            if (!window.location.href.includes('index.html')) {
                window.location.href = 'index.html';
            }
        }
    }
    
    // Di bagian setupEventListeners(), update selector untuk feature cards yang baru
setupEventListeners() {
    // Navigation
    this.setupNavigation();
    
    // Search functionality
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
    }
    
    // UPDATE: Feature cards untuk grid horizontal yang baru
    document.querySelectorAll('.feature-card-small').forEach(card => {
        card.addEventListener('click', () => {
            const feature = card.getAttribute('data-feature');
            this.handleFeatureClick(feature);
        });
    });
    
    // Profile icon
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon) {
        profileIcon.addEventListener('click', () => {
            this.handleProfileClick();
        });
    }

    // Wallet actions
    this.setupWalletActions();
}

    setupNavigation() {
        // Update active nav based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'home.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });

        // Add click handlers for navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                    this.showMessage('Feature coming soon!', 'info');
                }
            });
        });
    }

    setupWalletActions() {
        // Wallet buttons
        document.querySelectorAll('.wallet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.textContent;
                this.handleWalletAction(action);
            });
        });

        // Asset items click
        document.querySelectorAll('.asset-item').forEach(item => {
            item.addEventListener('click', () => {
                const assetName = item.querySelector('.asset-name').textContent;
                this.handleAssetClick(assetName);
            });
        });
    }
    
    setupTradingFeatures() {
        // Order type switching
        document.querySelectorAll('.order-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.order-type').querySelectorAll('.order-type-btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });
        
        // Leverage selection
        document.querySelectorAll('.leverage-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.leverage-selector').querySelectorAll('.leverage-btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });
        
        // Trading buttons
        document.querySelectorAll('.trade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleTradeAction(btn);
            });
        });

        // Trade input calculations
        this.setupTradeCalculators();
    }

    setupTradeCalculators() {
        const tradingPanel = document.querySelector('.trading-panel');
        if (!tradingPanel) return;

        // Auto-calculate total based on price and amount
        const inputs = tradingPanel.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.calculateTradeTotal(input);
            });
        });
    }

    calculateTradeTotal(input) {
        const section = input.closest('.panel-section');
        const priceInput = section.querySelector('input[placeholder*="Price"]');
        const amountInput = section.querySelector('input[placeholder*="Amount"]');
        
        if (priceInput && amountInput && priceInput.value && amountInput.value) {
            const price = parseFloat(priceInput.value);
            const amount = parseFloat(amountInput.value);
            const total = price * amount;
            
            // Show total below inputs
            let totalDisplay = section.querySelector('.trade-total');
            if (!totalDisplay) {
                totalDisplay = document.createElement('div');
                totalDisplay.className = 'trade-total';
                section.appendChild(totalDisplay);
            }
            
            totalDisplay.innerHTML = `
                <div style="font-size: 0.9rem; color: var(--secondary); margin-top: 5px;">
                    Total: <strong>$${total.toFixed(2)}</strong>
                </div>
            `;
        }
    }
    
    handleSearch(query) {
        if (query.length > 2) {
            // Filter coins based on search
            const filteredCoins = this.marketData.filter(coin => 
                coin.symbol.toLowerCase().includes(query.toLowerCase())
            );
            this.updateCoinList(filteredCoins);
        } else if (query.length === 0) {
            this.updateCoinList(this.marketData);
        }
    }
    
    handleFeatureClick(feature) {
    const featureActions = {
        'reward': () => this.showMessage('Rewards center - Check your rewards and bonuses!', 'info'),
        'event': () => this.showMessage('Events - Current trading events and promotions!', 'info')
    };
    
    if (featureActions[feature]) {
        featureActions[feature]();
    } else {
        this.showMessage('Feature coming soon!', 'info');
    }
}

    handleWalletAction(action) {
        const actions = {
            'DEPOSIT': () => this.showMessage(`Deposit ${this.getSelectedAsset()} - Feature coming soon!`, 'info'),
            'WITHDRAW': () => this.showMessage(`Withdraw ${this.getSelectedAsset()} - Feature coming soon!`, 'info'),
            'SWAP': () => this.showMessage('Swap assets - Feature coming soon!', 'info')
        };
        
        if (actions[action]) {
            actions[action]();
        }
    }

    handleAssetClick(assetName) {
        this.showMessage(`Selected ${assetName} - View details and transactions`, 'info');
    }

    handleProfileClick() {
        this.showMessage('Profile settings - Feature coming soon!', 'info');
    }
    
    handleTradeAction(button) {
        const action = button.textContent;
        const pair = this.selectedTradingPair;
        
        // Basic validation
        const section = button.closest('.panel-section');
        const priceInput = section.querySelector('input[placeholder*="Price"]');
        const amountInput = section.querySelector('input[placeholder*="Amount"]');
        
        if (!priceInput.value || !amountInput.value) {
            this.showMessage('Please enter price and amount', 'error');
            return;
        }

        const price = parseFloat(priceInput.value);
        const amount = parseFloat(amountInput.value);
        
        if (price <= 0 || amount <= 0) {
            this.showMessage('Price and amount must be greater than 0', 'error');
            return;
        }

        // Simulate trade execution
        this.simulateTrade(action, pair, price, amount);
    }

    simulateTrade(action, pair, price, amount) {
        const total = price * amount;
        
        // Show processing state
        const originalText = event.target.textContent;
        event.target.textContent = 'Processing...';
        event.target.disabled = true;

        setTimeout(() => {
            this.showMessage(
                `${action} ${amount} ${pair.split('/')[0]} at $${price} - Total: $${total.toFixed(2)}`,
                'success'
            );
            
            // Reset button
            event.target.textContent = originalText;
            event.target.disabled = false;

            // Update balance if it's a demo trade
            if (this.currentUser && action.includes('BUY')) {
                this.updateUserBalance(-total);
            } else if (this.currentUser && action.includes('SELL')) {
                this.updateUserBalance(total);
            }
        }, 1000);
    }

    updateUserBalance(change) {
        if (!this.currentUser) return;
        
        const currentBalance = parseFloat(this.currentUser.balance);
        this.currentUser.balance = (currentBalance + change).toFixed(2);
        localStorage.setItem('viorex_user', JSON.stringify(this.currentUser));
        
        // Update UI
        this.updateBalanceDisplay();
    }
    
    async loadMarketData() {
        // Enhanced market data with more details
        this.marketData = [
            { 
                symbol: 'VRT/USDT', 
                price: '0.85', 
                change: '+5.2%', 
                changeType: 'positive',
                volume: '2.5M',
                high: '0.92',
                low: '0.78',
                priceValue: 0.85
            },
            { 
                symbol: 'VRDT/USDT', 
                price: '1.00', 
                change: '0.0%', 
                changeType: 'neutral',
                volume: '1.8M',
                high: '1.00',
                low: '1.00',
                priceValue: 1.00
            },
            { 
                symbol: 'VRT/VRDT', 
                price: '0.85', 
                change: '+5.2%', 
                changeType: 'positive',
                volume: '1.2M',
                high: '0.90',
                low: '0.80',
                priceValue: 0.85
            }
        ];

        this.updateMarketDisplay();
        this.startPriceUpdates();
    }

    startPriceUpdates() {
        // Simulate real-time price updates
        setInterval(() => {
            this.marketData.forEach(coin => {
                if (coin.symbol !== 'VRDT/USDT') {
                    // Random price fluctuation
                    const change = (Math.random() - 0.5) * 4; // -2% to +2%
                    const newPrice = coin.priceValue * (1 + change/100);
                    
                    coin.priceValue = newPrice;
                    coin.price = newPrice.toFixed(4);
                    coin.change = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
                    coin.changeType = change >= 0 ? 'positive' : 'negative';
                }
            });
            this.updateMarketDisplay();
            this.updateTodayPL();
        }, 8000); // Update every 8 seconds
    }

    updateMarketDisplay() {
        this.updateCoinList(this.marketData);
    }
    
    updateCoinList(coins) {
        const coinList = document.querySelector('.coin-list');
        if (!coinList) return;

        coinList.innerHTML = coins.map(coin => `
            <div class="coin-item" data-symbol="${coin.symbol}">
                <div class="coin-icon ${coin.symbol.split('/')[0].toLowerCase()}-icon">
                    ${coin.symbol.split('/')[0].charAt(0)}
                </div>
                <div class="coin-info">
                    <div class="coin-pair">${coin.symbol}</div>
                    <div class="coin-volume">Vol: $${coin.volume}</div>
                </div>
                <div class="coin-price-data">
                    <div class="coin-price ${coin.changeType}">$${coin.price}</div>
                    <div class="coin-change ${coin.changeType}">${coin.change}</div>
                </div>
            </div>
        `).join('');

        // Add click handlers untuk trading
        document.querySelectorAll('.coin-item').forEach(item => {
            item.addEventListener('click', () => {
                const symbol = item.getAttribute('data-symbol');
                this.selectTradingPair(symbol);
            });
        });
    }

    selectTradingPair(symbol) {
        this.selectedTradingPair = symbol;
        
        // Update trading interface dengan pair yang dipilih
        const chartTitle = document.querySelector('#trading-chart div, #futures-chart div');
        if (chartTitle) {
            chartTitle.textContent = `Trading Chart - ${symbol}`;
        }

        // Update panel titles
        document.querySelectorAll('.panel-title').forEach(title => {
            if (title.textContent.includes('VRT')) {
                const baseCurrency = symbol.split('/')[0];
                title.textContent = title.textContent.replace('VRT', baseCurrency);
            }
        });

        this.showMessage(`Selected trading pair: ${symbol}`, 'info');
    }

    getSelectedAsset() {
        return 'VRT';
    }
    
    updateUIForLoggedInUser() {
        if (!this.currentUser) return;

        // Update balance display
        this.updateBalanceDisplay();

        // Update profile icon dengan initial
        const profileIcon = document.querySelector('.profile-icon');
        if (profileIcon) {
            const initial = this.currentUser.email.charAt(0).toUpperCase();
            profileIcon.innerHTML = `<span>${initial}</span>`;
        }

        // Update asset lists in wallet
        this.updateAssetLists();
    }

    updateBalanceDisplay() {
        const balanceElement = document.querySelector('.balance-amount');
        const walletBalance = document.querySelector('.wallet-summary .balance-amount');
        
        if (balanceElement && this.currentUser) {
            balanceElement.textContent = `$${parseFloat(this.currentUser.balance).toLocaleString()}`;
        }
        
        if (walletBalance && this.currentUser) {
            walletBalance.textContent = `$${parseFloat(this.currentUser.balance).toLocaleString()}`;
        }

        // Update balance breakdown
        // Di bagian updateBalanceBreakdown(), update untuk Today P&L saja
updateTodayPL() {
    const todayPLContainer = document.querySelector('.today-pl');
    if (!todayPLContainer || !this.currentUser) return;

    // Simulasikan Today P&L (bisa positive atau negative)
    const todayPLValue = (Math.random() * 50 - 25).toFixed(2); // -25 sampai +25
    const isPositive = parseFloat(todayPLValue) >= 0;
    const sign = isPositive ? '+' : '';
    
    const todayPLValueElement = todayPLContainer.querySelector('.today-pl-value');
    if (todayPLValueElement) {
        todayPLValueElement.textContent = `${sign}$${Math.abs(todayPLValue)}`;
        todayPLValueElement.className = `today-pl-value ${isPositive ? 'positive' : 'negative'}`;
    }
}
2. Update method updateUIForLoggedInUser()
javascript
// CARI method ini:
updateUIForLoggedInUser() {
    if (!this.currentUser) return;

    // Update balance display
    this.updateBalanceDisplay();

    // TAMBAH: Update Today P&L
    this.updateTodayPL();

    // Update profile icon dengan initial
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon) {
        const initial = this.currentUser.email.charAt(0).toUpperCase();
        profileIcon.innerHTML = `<span>${initial}</span>`;
    }

    // Update asset lists in wallet
    this.updateAssetLists();
}

// TAMBAHKIN baris ini di dalam method tersebut (setelah updateBalanceDisplay):
updateUIForLoggedInUser() {
    if (!this.currentUser) return;

    // Update balance display
    this.updateBalanceDisplay();

    // TAMBAH: Update Today P&L
    this.updateTodayPL();

    // Update profile icon dengan initial
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon) {
        const initial = this.currentUser.email.charAt(0).toUpperCase();
        profileIcon.innerHTML = `<span>${initial}</span>`;
    }

    // Update asset lists in wallet
    this.updateAssetLists();
}
3. Update method startPriceUpdates()
javascript
// CARI method ini:
startPriceUpdates() {
    // Simulate real-time price updates
    setInterval(() => {
        this.marketData.forEach(coin => {
            if (coin.symbol !== 'VRDT/USDT') {
                // Random price fluctuation
                const change = (Math.random() - 0.5) * 4; // -2% to +2%
                const newPrice = coin.priceValue * (1 + change/100);
                
                coin.priceValue = newPrice;
                coin.price = newPrice.toFixed(4);
                coin.change = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
                coin.changeType = change >= 0 ? 'positive' : 'negative';
            }
        });
        this.updateMarketDisplay();
    }, 8000); // Update every 8 seconds
}

// TAMBAHKIN baris ini di dalam setTimeout (setelah this.updateMarketDisplay()):
startPriceUpdates() {
    // Simulate real-time price updates
    setInterval(() => {
        this.marketData.forEach(coin => {
            if (coin.symbol !== 'VRDT/USDT') {
                // Random price fluctuation
                const change = (Math.random() - 0.5) * 4; // -2% to +2%
                const newPrice = coin.priceValue * (1 + change/100);
                
                coin.priceValue = newPrice;
                coin.price = newPrice.toFixed(4);
                coin.change = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
                coin.changeType = change >= 0 ? 'positive' : 'negative';
            }
        });
        this.updateMarketDisplay();
        
        // TAMBAH: Update Today P&L juga setiap price update
        this.updateTodayPL();
    }, 8000); // Update every 8 seconds
}
        
    updateAssetLists() {
    if (!this.currentUser || !this.currentUser.assets) return;

    // Update wallet summary
    const estimatedBalance = document.querySelector('.estimated-balance');
    if (estimatedBalance) {
        estimatedBalance.textContent = `≈ ${this.currentUser.balance} VRDT`;
    }

    // Update asset list dengan estimated values
    const assetList = document.getElementById('asset-assets');
    if (assetList) {
        assetList.innerHTML = Object.entries(this.currentUser.assets).map(([symbol, data]) => `
            <div class="asset-item" data-asset="${symbol}">
                <img src="assets/images/${symbol.toLowerCase()}-logo.png" alt="${symbol}" class="asset-icon">
                <div class="asset-info">
                    <div class="asset-name">${symbol}</div>
                    <div class="asset-balance">${data.amount}</div>
                    <div class="asset-estimated">≈ $${data.value}</div>
                </div>
            </div>
        `).join('');
    }
}

    showMessage(message, type) {
        // Remove existing messages
        const existingMsg = document.querySelector('.app-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        // Create new message
        const msgElement = document.createElement('div');
        msgElement.className = `app-message app-message-${type}`;
        msgElement.textContent = message;
        msgElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            font-weight: bold;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            box-shadow: var(--shadow-lg);
        `;
        
        switch (type) {
            case 'error':
                msgElement.style.background = 'var(--danger)';
                msgElement.style.color = 'white';
                break;
            case 'success':
                msgElement.style.background = 'var(--success)';
                msgElement.style.color = 'white';
                break;
            case 'info':
                msgElement.style.background = 'var(--info)';
                msgElement.style.color = 'white';
                break;
        }

        document.body.appendChild(msgElement);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            msgElement.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (msgElement.parentNode) {
                    msgElement.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.viorexApp = new EnhancedViorexApp();
});
