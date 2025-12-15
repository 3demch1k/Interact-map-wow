// Данные о битвах (GeoJSON формат)
const battlesData = [
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
            significance: "Срыв плана «Барбаросса». Разрушение мифа о непобедимости германской армии.",
            casualties: "Потери СССР: ~1 млн человек<br>Потери Германии: ~500 тыс. человек",
            outcome: "Стратегическая победа СССР. Немецкие войска отброшены от Москвы на 100-250 км."
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
            description: "Одно из крупнейших сражений в истории человечества.",
            significance: "Начало коренного перелома в войне. Окружение и разгром 6-й армии вермахта под командованием Паулюса.",
            casualties: "Общие потери обеих сторон: около 2 млн человек",
            outcome: "Решающая победа СССР. Стратегическая инициатива окончательно перешла к Красной Армии."
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
            significance: "Прохоровское танковое сражение. Завершение коренного перелома. Последнее крупное наступление вермахта на Восточном фронте.",
            casualties: "Потери СССР: ~860 тыс. человек<br>Потери Германии: ~500 тыс. человек",
            outcome: "Окончательный переход стратегической инициативы к СССР. Начало освобождения."
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
            description: "872 дня героической обороны города немецкими и финскими войсками.",
            significance: "Символ стойкости советского народа. Сковывание значительных сил противника (около 700 тыс. солдат).",
            casualties: "Погибло около 1,5 млн человек, большинство от голода",
            outcome: "Город выстоял! Полное снятие блокады 27 января 1944 года."
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
            description: "Финальное сражение Великой Отечественной войны в Европе.",
            significance: "Штурм Рейхстага. Знамя Победы над столицей Третьего рейха.",
            casualties: "Потери СССР: ~350 тыс. человек<br>Потери Германии: ~500 тыс. человек",
            outcome: "Безоговорочная капитуляция Германии 8 мая 1945 года. ПОБЕДА!"
        },
        geometry: {
            type: "Point",
            coordinates: [13.4050, 52.5200]
        }
    }
];

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация карты с настройками для мобильных
    const map = L.map('map', {
        center: [55.0, 37.0],
        zoom: 4,
        zoomControl: true,
        scrollWheelZoom: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        tap: true,
        tapTolerance: 15
    });

    // Добавление OpenStreetMap тайлов
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Великая Отечественная война 1941-1945',
        maxZoom: 18
    }).addTo(map);

    // Создание слоя с маркерами битв
    const battlesLayer = L.geoJSON(battlesData, {
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
            // Добавление всплывающей подсказки
            layer.bindTooltip(feature.properties.name, {
                permanent: false,
                direction: 'top',
                offset: [0, -10]
            });
            
            // Обработчик клика по маркеру
            layer.on('click', function() {
                showBattleInfo(feature.properties);
                map.setView(layer.getLatLng(), 7, {
                    animate: true,
                    duration: 1
                });
            });
        }
    }).addTo(map);

    // Создание контроллера временной шкалы
    const TimelineControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function(map) {
            // Создание контейнера
            const container = L.DomUtil.create('div', 'leaflet-control-timeline');
            
            // Создание элементов управления
            const timelineHTML = `
                <div class="timeline-container">
                    <div class="leaflet-timeline-time" id="timeDisplay">1941</div>
                    <input type="range" class="leaflet-timeline-slider" id="timelineSlider" 
                           min="0" max="100" value="0" step="1">
                    <button class="leaflet-timeline-playback" id="playButton">▶️</button>
                </div>
            `;
            container.innerHTML = timelineHTML;

            // Предотвращение перемещения карты при взаимодействии с контроллером
            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.disableScrollPropagation(container);

            return container;
        }
    });

    // Добавление контроллера на карту
    const timelineControl = new TimelineControl();
    map.addControl(timelineControl);

    // Получение элементов управления
    const slider = document.getElementById('timelineSlider');
    const timeDisplay = document.getElementById('timeDisplay');
    const playButton = document.getElementById('playButton');

    // Параметры временной шкалы
    const startDate = new Date('1941-09-01');
    const endDate = new Date('1945-05-09');
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    
    let isPlaying = false;
    let playInterval = null;

    // Функция обновления видимости маркеров по дате
    function updateMarkersByDate(currentDate) {
        battlesLayer.eachLayer(function(layer) {
            const props = layer.feature.properties;
            const battleStart = new Date(props.start);
            const battleEnd = new Date(props.end);
            
            if (currentDate >= battleStart && currentDate <= battleEnd) {
                layer.setStyle({ fillOpacity: 0.85, opacity: 1 });
            } else {
                layer.setStyle({ fillOpacity: 0.2, opacity: 0.3 });
            }
        });
    }

    // Обработчик изменения слайдера
    slider.addEventListener('input', function() {
        const progress = parseInt(this.value) / 100;
        const currentDate = new Date(startDate.getTime() + (totalDays * progress * 24 * 60 * 60 * 1000));
        
        // Обновление отображения года
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        timeDisplay.textContent = `${year}`;
        
        // Обновление маркеров
        updateMarkersByDate(currentDate);
    });

    // Функция воспроизведения
    function togglePlay() {
        if (!isPlaying) {
            isPlaying = true;
            playButton.textContent = '⏸️';
            
            playInterval = setInterval(function() {
                let currentValue = parseInt(slider.value);
                
                if (currentValue >= 100) {
                    stopPlay();
                    slider.value = 0;
                    slider.dispatchEvent(new Event('input'));
                } else {
                    slider.value = currentValue + 1;
                    slider.dispatchEvent(new Event('input'));
                }
            }, 200);
        } else {
            stopPlay();
        }
    }

    function stopPlay() {
        isPlaying = false;
        playButton.textContent = '▶️';
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    }

    // Обработчик кнопки Play
    playButton.addEventListener('click', togglePlay);

    // Панель информации
    const infoPanel = document.getElementById('infoPanel');
    const closeBtn = document.getElementById('closeBtn');
    const battleTitle = document.getElementById('battleTitle');
    const battleInfo = document.getElementById('battleInfo');

    // Функция отображения информации о битве
    function showBattleInfo(battle) {
        battleTitle.textContent = battle.name;
        battleInfo.innerHTML = `
            <h3>⏰ Период сражения</h3>
            <p><strong>${battle.period}</strong></p>
            
            <h3>📋 Описание</h3>
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

    // Закрытие панели
    closeBtn.addEventListener('click', function() {
        infoPanel.classList.remove('active');
    });

    // Закрытие при клике вне панели
    document.addEventListener('click', function(e) {
        if (!infoPanel.contains(e.target) && 
            !e.target.closest('.leaflet-marker-icon') && 
            !e.target.closest('.leaflet-marker-pane') &&
            !e.target.closest('.leaflet-popup')) {
            infoPanel.classList.remove('active');
        }
    });

    // Инициализация - показываем все битвы
    updateMarkersByDate(startDate);

    // Обработка изменения размера окна
    window.addEventListener('resize', function() {
        map.invalidateSize();
    });
});
