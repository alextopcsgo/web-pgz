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
    
    const chartCanvas = document.getElementById('rateChart');  
    const clickInfo = document.getElementById('clickInfo');    
    
    const historyData = [
        { date: "29.04", price: 7.90 }, { date: "30.04", price: 7.87 },
        { date: "01.05", price: 7.85 }, { date: "02.05", price: 7.87 },
        { date: "03.05", price: 7.91 }, { date: "04.05", price: 7.90 },
        { date: "05.05", price: 7.94 }, { date: "06.05", price: 7.93 },
        { date: "07.05", price: 7.95 }, { date: "08.05", price: 7.96 },
        { date: "09.05", price: 8.03 }, { date: "10.05", price: 8.03 },
        { date: "11.05", price: 8.02 }, { date: "12.05", price: 7.96 },
        { date: "13.05", price: 8.03 }, { date: "14.05", price: 8.02 },
        { date: "15.05", price: 7.96 }, { date: "16.05", price: 7.93 },
        { date: "17.05", price: 7.89 }, { date: "18.05", price: 7.84 },
        { date: "19.05", price: 7.82 }, { date: "20.05", price: 7.83 },
        { date: "21.05", price: 7.74 }, { date: "22.05", price: 7.64 },
        { date: "23.05", price: 7.61 }, { date: "24.05", price: 7.62 },
        { date: "25.05", price: 7.67 }, { date: "26.05", price: 7.71 },
        { date: "27.05", price: 7.75 }, { date: "28.05", price: 7.67 },
        { date: "29.05", price: 7.71 }
    ];
    
    function buildChart() {
        if (!chartCanvas) return;
        
        const labels = historyData.map(item => item.date);
        const prices = historyData.map(item => item.price);
        
        if (window.rateChartInstance) {
            window.rateChartInstance.destroy();
        }
        
        window.rateChartInstance = new Chart(chartCanvas.getContext('2d'), {
            type: 'line', 
            data: {
                labels: labels,
                datasets: [{
                    label: 'Курс TJS/RUB',
                    data: prices,
                    borderColor: 'rgba(0, 77, 128, 1)', 
                    backgroundColor: 'rgba(0, 77, 128, 0.1)', 
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3, 
                    pointRadius: 4, 
                    pointHoverRadius: 6,
                    pointBackgroundColor: 'rgba(0, 77, 128, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                return 'Курс: ' + context.parsed.y.toFixed(4) + ' RUB';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        display: true,
                        beginAtZero: false,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        title: { display: true, text: 'RUB' }
                    },
                    x: {
                        display: true,
                        grid: { display: false },
                        ticks: {
                            autoSkip: true,
                            maxRotation: 45,
                            minRotation: 45,
                            maxTicksLimit: 10
                        },
                        title: { display: true, text: 'Дата' }
                    }
                },
                onClick: (event, activeElements) => {
                    if (activeElements.length === 0) return;
                    const index = activeElements[0].index;
                    const item = historyData[index];
                    const inverse = (1 / item.price).toFixed(4);
                    
                    if (clickInfo) {
                        clickInfo.innerHTML = 
                            `<strong>Дата:</strong> ${item.date}.2026<br>` +
                            `<strong>1 TJS =</strong> ${item.price.toFixed(4)} RUB<br>` +
                            `<strong>1 RUB =</strong> ${inverse} TJS`;
                    }
                }
            }
        });
        
        if (clickInfo && historyData.length > 0) {
            const last = historyData[historyData.length - 1];
            const inverse = (1 / last.price).toFixed(4);
            clickInfo.innerHTML = 
                `<strong>Дата:</strong> ${last.date}.2026<br>` +
                `<strong>1 TJS =</strong> ${last.price.toFixed(4)} RUB<br>` +
                `<strong>1 RUB =</strong> ${inverse} TJS`;
        }
    }
    
    buildChart();
    
    function convertCurrency() {
        if (!fromCurrency || !toCurrency || !amount || !result) return;
        const from = fromCurrency.value;
        const to = toCurrency.value;
        let amt = parseFloat(amount.value) || 0;
        
        let converted;
        if (typeof fx !== 'undefined' && fx.rates) {
            converted = fx(amt).from(from).to(to);
        } else {
            const rate = 7.71;
            converted = (from === 'TJS' && to === 'RUB') ? amt * rate : 
                       (from === 'RUB' && to === 'TJS') ? amt / rate : amt;
        }
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
            if (this.value.startsWith('-') || parseFloat(this.value) < 0) this.value = 0;
            convertCurrency();
        });
    }
});