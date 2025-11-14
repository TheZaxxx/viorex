// Pixel Art Charts for VIOREX
class PixelCharts {
    constructor() {
        this.charts = {};
        this.init();
    }
    
    init() {
        this.setupCharts();
        this.startChartAnimations();
    }
    
    setupCharts() {
        // Setup home balance chart
        const homeChart = document.getElementById('home-chart');
        if (homeChart) {
            this.createChart(homeChart, 'up');
            this.charts.home = homeChart;
        }
        
        // Setup wallet chart
        const walletChart = document.getElementById('wallet-chart');
        if (walletChart) {
            this.createChart(walletChart, 'up');
            this.charts.wallet = walletChart;
        }
    }
    
    createChart(container, trend = 'up') {
        // Clear existing chart
        container.innerHTML = '<div class="pixel-chart-line"></div>';
        
        // Generate random data points based on trend
        const pointCount = 8;
        const points = this.generateChartData(pointCount, trend);
        
        // Create pixel data points
        points.forEach((point, index) => {
            const pointElement = document.createElement('div');
            pointElement.className = `chart-point ${point.trend}`;
            pointElement.style.left = `${(index / (pointCount - 1)) * 100}%`;
            pointElement.style.bottom = `${point.value}%`;
            container.appendChild(pointElement);
        });
        
        // Update container class based on trend
        container.className = `pixel-chart pixel-chart-${trend}`;
        container.innerHTML += '<div class="pixel-chart-line"></div>';
    }
    
    generateChartData(count, trend) {
        const points = [];
        let currentHeight = 30 + Math.random() * 40; // Start between 30-70%
        
        for (let i = 0; i < count; i++) {
            // Determine movement based on trend
            let movement;
            if (trend === 'up') {
                movement = (Math.random() * 15) + 5; // Mostly upward
            } else {
                movement = -(Math.random() * 15) - 5; // Mostly downward
            }
            
            // Add some randomness
            movement += (Math.random() - 0.5) * 10;
            
            currentHeight += movement;
            
            // Keep within bounds
            currentHeight = Math.max(10, Math.min(90, currentHeight));
            
            points.push({
                value: currentHeight,
                trend: movement >= 0 ? 'up' : 'down'
            });
        }
        
        return points;
    }
    
    startChartAnimations() {
        // Update charts periodically to simulate live data
        setInterval(() => {
            this.updateAllCharts();
        }, 5000); // Update every 5 seconds
    }
    
    updateAllCharts() {
        Object.keys(this.charts).forEach(chartId => {
            const chart = this.charts[chartId];
            const currentTrend = chart.classList.contains('pixel-chart-up') ? 'up' : 'down';
            
            // Occasionally flip trend for demo
            const newTrend = Math.random() > 0.8 ? 
                (currentTrend === 'up' ? 'down' : 'up') : 
                currentTrend;
            
            this.createChart(chart, newTrend);
            
            // Update P&L value based on trend
            this.updatePLValue(chartId, newTrend);
        });
    }
    
    updatePLValue(chartId, trend) {
        if (chartId === 'home') {
            const plValue = document.querySelector('.today-pl-value');
            if (plValue) {
                const currentValue = parseFloat(plValue.textContent.replace('$', '')) || 0;
                const change = trend === 'up' ? 
                    (Math.random() * 10) + 5 : 
                    -(Math.random() * 10) - 5;
                
                const newValue = (currentValue + change).toFixed(2);
                plValue.textContent = `$${Math.abs(newValue)}`;
                plValue.className = `today-pl-value ${trend}`;
            }
        }
    }
    
    // Method to manually set chart trend
    setChartTrend(chartId, trend) {
        const chart = this.charts[chartId];
        if (chart) {
            this.createChart(chart, trend);
        }
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pixelCharts = new PixelCharts();
});
