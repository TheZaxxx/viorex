// Markets page functionality
class MarketsManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadMarketData();
    }
    
    setupEventListeners() {
        // Search functionality
        const searchBar = document.querySelector('.search-bar');
        if (searchBar) {
            searchBar.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        // Trade buttons
        document.querySelectorAll('.trade-btn-small').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const row = e.target.closest('.table-row');
                const symbol = row.getAttribute('data-symbol');
                this.handleTradeClick(symbol);
            });
        });
        
        // Row clicks
        document.querySelectorAll('.table-row').forEach(row => {
            row.addEventListener('click', () => {
                const symbol = row.getAttribute('data-symbol');
                this.selectPair(symbol);
            });
        });
    }
    
    loadMarketData() {
        // Simulate market data loading
        this.marketData = [
            {
                symbol: 'VRT/USDT',
                name: 'Viorex Token',
                fullName: 'Viorex Token',
                price: '0.8500',
                change: '+5.20%',
                changeType: 'positive',
                volume: '$2.5M'
            },
            {
                symbol: 'VRDT/USDT', 
                name: 'VRDT',
                fullName: 'Viorex Dollar',
                price: '1.0000',
                change: '0.00%',
                changeType: 'neutral', 
                volume: '$1.8M'
            },
            {
                symbol: 'VRT/VRDT',
                name: 'VRT/VRDT',
                fullName: 'Viorex Pair',
                price: '0.8500',
                change: '+5.20%',
                changeType: 'positive',
                volume: '$1.2M'
            }
        ];
        
        this.updateMarketsDisplay();
    }
    
    handleSearch(query) {
        if (query.length > 0) {
            const filtered = this.marketData.filter(coin =>
                coin.symbol.toLowerCase().includes(query.toLowerCase()) ||
                coin.name.toLowerCase().includes(query.toLowerCase())
            );
            this.updateMarketsDisplay(filtered);
        } else {
            this.updateMarketsDisplay(this.marketData);
        }
    }
    
    updateMarketsDisplay(data = null) {
        const displayData = data || this.marketData;
        const tableBody = document.querySelector('.table-body');
        
        if (!tableBody) return;
        
        tableBody.innerHTML = displayData.map(coin => `
            <div class="table-row" data-symbol="${coin.symbol}">
                <div class="table-col asset">
                    <div class="asset-cell">
                        <div class="coin-icon ${coin.symbol.split('/')[0].toLowerCase()}-icon">
                            ${coin.symbol.split('/')[0].charAt(0)}
                        </div>
                        <div class="coin-details">
                            <div class="coin-name">${coin.name}</div>
                            <div class="coin-full">${coin.fullName}</div>
                        </div>
                    </div>
                </div>
                <div class="table-col price">
                    <div class="price-value">${coin.price}</div>
                </div>
                <div class="table-col change">
                    <div class="change-value ${coin.changeType}">${coin.change}</div>
                </div>
                <div class="table-col volume">
                    <div class="volume-value">${coin.volume}</div>
                </div>
                <div class="table-col action">
                    <button class="trade-btn-small">TRADE</button>
                </div>
            </div>
        `).join('');
        
        // Re-attach event listeners
        this.setupEventListeners();
    }
    
    handleTradeClick(symbol) {
        // Redirect to trade page with selected pair
        window.location.href = `trade.html?pair=${symbol}`;
    }
    
    selectPair(symbol) {
        // Highlight selected pair
        document.querySelectorAll('.table-row').forEach(row => {
            row.classList.remove('selected');
        });
        
        const selectedRow = document.querySelector(`[data-symbol="${symbol}"]`);
        if (selectedRow) {
            selectedRow.classList.add('selected');
        }
        
        // Show pair details (bisa dikembangkan)
        console.log('Selected pair:', symbol);
    }
}

// Initialize markets manager
document.addEventListener('DOMContentLoaded', () => {
    new MarketsManager();
});
