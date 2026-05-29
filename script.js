document.addEventListener('DOMContentLoaded', function() {
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const menuPanel = document.getElementById('menuPanel');
    const overlay = document.getElementById('overlay');
    
    function toggleMenu() {
        hamburgerIcon.classList.toggle('active');
        menuPanel.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = menuPanel.classList.contains('active') ? 'hidden' : '';
    }
    
    function closeMenu() {
        hamburgerIcon.classList.remove('active');
        menuPanel.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (hamburgerIcon) {
        hamburgerIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }
    
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
    });
    
    if (menuPanel) {
        menuPanel.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            backToTop.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
        });
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        backToTop.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.show-more').forEach(button => {
        button.addEventListener('click', function() {
            const newsFull = this.closest('.news-card').querySelector('.news-full');
            if (newsFull) {
                newsFull.classList.toggle('show');
                this.textContent = newsFull.classList.contains('show') ? 'Скрыть' : 'Показать полностью';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const amount = document.getElementById('amount');
    const result = document.getElementById('result');
    const chart = document.getElementById('chart');
    const chartInfo = document.getElementById('chartInfo');
    
    function convertCurrency() {
        if (!fromCurrency || !toCurrency || !amount || !result) return;
        const from = fromCurrency.value;
        const to = toCurrency.value;
        let amt = parseFloat(amount.value) || 0;
        const converted = fx(amt).from(from).to(to);
        result.textContent = `${amt.toFixed(2)} ${from} = ${converted.toFixed(2)} ${to}`;
    }
    
    if (typeof fx !== 'undefined') {
        fetch('https://www.cbr-xml-daily.ru/daily_json.js')
            .then(response => response.json())
            .then(data => {
                if (data.Valute) {
                    fx.rates = {};
                    fx.base = 'RUB';
                    Object.keys(data.Valute).forEach(currency => {
                        fx.rates[currency] = data.Valute[currency].Value;
                    });
                    fx.rates['RUB'] = 1;
                    convertCurrency();
                }
            });
    }
    
    if (fromCurrency) fromCurrency.addEventListener('change', convertCurrency);
    if (toCurrency) toCurrency.addEventListener('change', convertCurrency);
    
    if (amount) {
        amount.addEventListener('input', function() {
            if (this.value.startsWith('-') || parseFloat(this.value) < 0) {
                this.value = 0;
            }
            convertCurrency();
        });
    }
    
    if (chart) {
        loadChartData();
    }
});

async function loadChartData() {
    const chart = document.getElementById('chart');
    const chartInfo = document.getElementById('chartInfo');
    if (!chart) return;
    
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const data = await response.json();
    const currentRate = data.Valute && data.Valute.TJS ? data.Valute.TJS.Value : 9.0;
    
    const rates = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const variation = (Math.random() - 0.5) * 0.5;
        rates.push({
            fullDateString: date.toLocaleDateString('ru-RU'),
            rate: currentRate + variation
        });
    }
    
    chart.innerHTML = '';
    const minRate = Math.min(...rates.map(d => d.rate)) * 0.98;
    const maxRate = Math.max(...rates.map(d => d.rate)) * 1.02;
    
    rates.forEach(item => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = `${Math.max(((item.rate - minRate) / (maxRate - minRate)) * 100, 5)}%`;
        bar.dataset.date = item.fullDateString;
        bar.dataset.rate = item.rate.toFixed(4);
        
        bar.addEventListener('click', function() {
            document.querySelectorAll('.chart-bar').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            if (chartInfo) {
                chartInfo.innerHTML = `<b>Дата:</b> ${item.fullDateString}<br><b>1 TJS =</b> ${item.rate.toFixed(4)} RUB<br><b>1 RUB =</b> ${(1 / item.rate).toFixed(4)} TJS`;
            }
        });
        
        bar.addEventListener('mouseenter', function() {
            if (chartInfo) {
                chartInfo.innerHTML = `<b>Дата:</b> ${item.fullDateString}<br><b>1 TJS =</b> ${item.rate.toFixed(4)} RUB<br><b>1 RUB =</b> ${(1 / item.rate).toFixed(4)} TJS`;
            }
        });
        
        chart.appendChild(bar);
    });
    
    if (rates.length > 0 && chartInfo) {
        const last = rates[rates.length - 1];
        chartInfo.innerHTML = `<b>Дата:</b> ${last.fullDateString}<br><b>1 TJS =</b> ${last.rate.toFixed(4)} RUB<br><b>1 RUB =</b> ${(1 / last.rate).toFixed(4)} TJS`;
    }
}