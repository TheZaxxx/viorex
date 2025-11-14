// Trade page functionality
class TradeManager {
    constructor() {
        this.currentPair = 'VRT/USDT';
        this.currentPrice = 0.85;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupOrderCalculations();
        this.updateUI();
    }
    
    setupEventListeners() {
        // Order tabs
        document.querySelectorAll('.order-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchOrderType(e.target.getAttribute('data-type'));
            });
        });
        
        // Trade buttons
        document.querySelectorAll('.trade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.executeTrade(e.target);
            });
        });
        
        // Price/amount inputs
        document.querySelectorAll('.price-input, .amount-input').forEach(input => {
            input.addEventListener('input', () => {
                this.calculateTotal(input);
            });
        });
    }
    
    setupOrderCalculations() {
        // Auto-calculate totals
        const buyPrice = document.querySelector('.buy-panel .price-input');
        const buyAmount = document.querySelector('.buy-panel .amount-input');
        const sellPrice = document.querySelector('.sell-panel .price-input');
        const sellAmount = document.querySelector('.sell-panel .amount-input');
        
        if (buyPrice && buyAmount) {
            buyPrice.addEventListener('input', () => this.calculateBuyTotal());
            buyAmount.addEventListener('input', () => this.calculateBuyTotal());
        }
        
        if (sellPrice && sellAmount) {
            sellPrice.addEventListener('input', () => this.calculateSellTotal());
            sellAmount.addEventListener('input', () => this.calculateSellTotal());
        }
    }
    
    switchOrderType(type) {
        document.querySelectorAll('.order-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
        
        // Update form based on order type
        if (type === 'market') {
            this.enableMarketOrder();
        } else {
            this.enableLimitOrder();
        }
    }
    
    enableMarketOrder() {
        // Disable price inputs for market orders
        document.querySelectorAll('.price-input').forEach(input => {
            input.disabled = true;
            input.placeholder = 'Market Price';
            input.value = '';
        });
    }
    
    enableLimitOrder() {
        // Enable price inputs for limit orders
        document.querySelectorAll('.price-input').forEach(input => {
            input.disabled = false;
            input.placeholder = '0.00';
        });
    }
    
    calculateBuyTotal() {
        const price = parseFloat(document.querySelector('.buy-panel .price-input').value) || 0;
        const amount = parseFloat(document.querySelector('.buy-panel .amount-input').value) || 0;
        const total = price * amount;
        
        document.querySelector('.buy-panel .total-input').value = total.toFixed(2);
    }
    
    calculateSellTotal() {
        const price = parseFloat(document.querySelector('.sell-panel .price-input').value) || 0;
        const amount = parseFloat(document.querySelector('.sell-panel .amount-input').value) || 0;
        const total = price * amount;
        
        document.querySelector('.sell-panel .total-input').value = total.toFixed(2);
    }
    
    calculateTotal(input) {
        const panel = input.closest('.order-form');
        const price = parseFloat(panel.querySelector('.price-input').value) || 0;
        const amount = parseFloat(panel.querySelector('.amount-input').value) || 0;
        const total = price * amount;
        
        panel.querySelector('.total-input').value = total.toFixed(2);
    }
    
    executeTrade(button) {
        const isBuy = button.classList.contains('buy-btn');
        const panel = button.closest('.buy-panel, .sell-panel');
        const price = parseFloat(panel.querySelector('.price-input').value) || 0;
        const amount = parseFloat(panel.querySelector('.amount-input').value) || 0;
        
        if (!amount || amount <= 0) {
            this.showMessage('Please enter a valid amount', 'error');
            return;
        }
        
        if (document.querySelector('.order-tab.active').dataset.type === 'limit' && (!price || price <= 0)) {
            this.showMessage('Please enter a valid price', 'error');
            return;
        }
        
        const action = isBuy ? 'BUY' : 'SELL';
        const total = price * amount;
        const orderType = document.querySelector('.order-tab.active').dataset.type;
        
        // Show processing
        const originalText = button.textContent;
        button.textContent = 'Processing...';
        button.disabled = true;
        
        setTimeout(() => {
            this.showMessage(
                `${orderType.toUpperCase()} ${action} Order: ${amount} ${this.currentPair.split('/')[0]} at ${price} ${this.currentPair.split('/')[1]}`,
                'success'
            );
            
            // Reset form
            button.textContent = originalText;
            button.disabled = false;
            panel.querySelectorAll('input').forEach(input => input.value = '');
            panel.querySelector('.total-input').value = '';
            
        }, 1500);
    }
    
    updateUI() {
        // Update current price display
        const priceElement = document.querySelector('.current-price');
        if (priceElement) {
            priceElement.textContent = `$${this.currentPrice.toFixed(4)}`;
        }
    }
    
    showMessage(message, type) {
        // Use the existing message system from main.js
        if (window.viorexApp && window.viorexApp.showMessage) {
            window.viorexApp.showMessage(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize trade manager
document.addEventListener('DOMContentLoaded', () => {
    window.tradeManager = new TradeManager();
});
