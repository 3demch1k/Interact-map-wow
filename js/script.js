// Данные о битвах (GeoJSON формат для timeline)
const battles = [
    {
        type: "Feature",
        properties: {
            name: "🎖️ Битва за Москву",
            start: "1941-09-30",
            end: "1942-04-20",
            period: "30 сентября 1941 – 20 апреля 1942",
            stage: "defensive",
            color: "#ff4444",
            description: "Первое крупное поражение вермахта во Второй мировой войне.",
            significance: "Срыв плана «Барбаросса». Разрушение мифа о непобедимости Германии.",
            casualties: "🇷🇺 СССР: ~1 млн | 🇩🇪 Германия: ~500 тыс.",
            outcome: "Немцы отброшены на 100-250 км от Москвы."
        },
        geometry: {
            type: "Point",
            coordinates: [37.6173, 55.7558]
        }
    },
    {
        type: "Feature",
        properties: {
            name: "⚔️ Сталинградская битва",
            start: "1942-07-17",
            end: "1943-02-02",
            period: "17 июля 1942 – 2 февраля 1943",
            stage: "turning",
            color: "#ffa500",
            description: "Крупнейшее сражение в истории человечества.",
            significance: "Начало коренного перелома. Окружение 6-й армии Паулюса.",
            casualties: "Общие потери: ~2 млн человек",
            outcome: "Стратегическая инициатива перешла к СССР."
        },
        geometry: {
            type: "Point",
            coordinates: [44.5133, 48.7080]
        }
    },
    {
        type: "Feature",
        properties: {
            name: "🔥 Курская битва",
            start: "1943-07-05",
            end: "1943-08-23",
            period: "5 июля – 23 августа 1943",
            stage: "turning",
            color: "#ffa500",
            description: "Крупнейшее танковое сражение в истории.",
            significance: "Прохоровка – крупнейшее танковое поле боя. Завершение перелома.",
            casualties: "🇷🇺 СССР: ~860 тыс. | 🇩🇪 Германия: ~500 тыс.",
            outcome: "Окончательный переход инициативы к Красной Армии."
        },
        geometry: {
            type: "Point",
            coordinates: [36.1873, 51.7373]
        }
    },
    {
        type: "Feature",
        properties: {
            name: "🛡️ Блокада Ленинграда",
            start: "1941-09-08",
            end: "1944-01-27",
            period: "8 сентября 1941 – 27 января 1944",
            stage: "defensive",
            color: "#ff4444",
            description: "872 дня героической обороны города.",
            significance: "Символ стойкости. Сковано 700 тыс. солдат противника.",
            casualties: "Погибло ~1,5 млн гражданских от голода",
            outcome: "Полное снятие блокады. Ленинград выстоял!"
        },
        geometry: {
            type: "Point",
            coordinates: [30.3351, 59.9343]
        }
    },
    {
        type: "Feature",
        properties: {
            name: "🏆 Битва за Берлин",
            start: "1945-04-16",
            end: "1945-05-08",
            period: "16 апреля – 8 мая 1945",
            stage: "offensive",
            color: "#44ff44",
            description: "Финальное сражение войны в Европе.",
            significance: "Штурм рейхстага. Знамя Победы над Берлином.",
            casualties: "🇷🇺 СССР: ~350 тыс. | 🇩🇪 Германия: ~500 тыс.",
            outcome: "Капитуляция Германии 8 мая 1945."
        },
        geometry: {
            type: "Point",
            coordinates: [13.4050, 52.5200]
        }
    }
];

// Инициализация карты
const map = L.map('map').setView([55.0, 37.0], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Великая Отечественная война',
    maxZoom: 18
}).addTo(map);

// Создание timeline слоя
const timeline = L.timeline(battles, {
    style: function(feature) {
        return {
            radius: 15,
            fillColor: feature.properties.color,
            color: '#fff',
            weight: 4,
            opacity: 1,
            fillOpacity: 0.85
        };
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 15,
            fillColor: feature.properties.color,
            color: '#fff',
            weight: 4,
            opacity: 1,
            fillOpacity: 0.85
        });
    },
    onEachFeature: function(feature, layer) {
        layer.bindTooltip(feature.properties.name, {
            permanent: false,
            direction: 'top',
            className: 'custom-tooltip'
        });
        
        layer.on('click', function() {
            showBattleInfo(feature.properties);
            map.setView(layer.getLatLng(), 7);
        });
    }
}).addTo(map);

// Контроллер timeline
const timelineSlider = L.timelineSliderControl({
    formatOutput: function(date) {
        return date.toLocaleDateString('ru-RU', { year: 'numeric' });
    },
    enablePlayback: true,
    autoPlay: false,
    steps: 100,
    duration: 20000,
    position: 'bottomleft',
    showLabels: true
});

timelineSlider.addTo(map);
map.addControl(timelineSlider);
timelineSlider.addTimelines(timeline);

// Панель информации
const infoPanel = document.getElementById('infoPanel');
const closeBtn = document.getElementById('closeBtn');
const battleTitle = document.getElementById('battleTitle');
const battleInfo = document.getElementById('battleInfo');

function showBattleInfo(battle) {
    battleTitle.textContent = battle.name;
    battleInfo.innerHTML = `
        <h3>⏰ Период</h3>
        <p><strong>${battle.period}</strong></p>
        
        <h3>📝 Описание</h3>
        <p>${battle.description}</p>
        
        <h3>⚡ Стратегическое значение</h3>
        <p>${battle.significance}</p>
        
        <h3>📊 Потери сторон</h3>
        <p>${battle.casualties}</p>
        
        <h3>🏆 Итог сражения</h3>
        <p>${battle.outcome}</p>
    `;
    infoPanel.classList.add('active');
}

closeBtn.addEventListener('click', () => {
    infoPanel.classList.remove('active');
});

document.addEventListener('click', (e) => {
    if (!infoPanel.contains(e.target) && 
        !e.target.closest('.leaflet-marker-icon') && 
        !e.target.closest('.leaflet-marker-pane')) {
        infoPanel.classList.remove('active');
    }
});

// Улучшенный tooltip стиль
L.DivIcon.extend({
    options: {
        className: 'custom-div-icon',
        html: '',
        iconSize: [30, 30]
    }
});
