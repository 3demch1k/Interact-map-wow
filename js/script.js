// Данные о битвах
const battles = [
    {
        name: "Битва за Москву",
        coords: [55.7558, 37.6173],
        period: "Сентябрь 1941 – Апрель 1942",
        stage: "defensive",
        color: "#ff4444",
        description: "Первое крупное поражение вермахта во Второй мировой войне.",
        significance: "Срыв плана «Барбаросса», разрушение мифа о непобедимости германской армии.",
        casualties: "Потери СССР: около 1 млн человек. Потери Германии: около 500 тыс. человек.",
        outcome: "Стратегическая победа СССР. Немецкие войска отброшены от Москвы на 100-250 км."
    },
    {
        name: "Сталинградская битва",
        coords: [48.7080, 44.5133],
        period: "Июль 1942 – Февраль 1943",
        stage: "turning",
        color: "#ffa500",
        description: "Одно из крупнейших сражений в истории человечества.",
        significance: "Начало коренного перелома в войне. Окружение и разгром 6-й армии вермахта.",
        casualties: "Общие потери обеих сторон: около 2 млн человек.",
        outcome: "Решающая победа СССР. Стратегическая инициатива перешла к Красной Армии."
    },
    {
        name: "Курская битва",
        coords: [51.7373, 36.1873],
        period: "Июль – Август 1943",
        stage: "turning",
        color: "#ffa500",
        description: "Крупнейшее танковое сражение в истории.",
        significance: "Завершение коренного перелома. Последнее крупное наступление вермахта на Восточном фронте.",
        casualties: "Потери СССР: около 860 тыс. человек. Потери Германии: около 500 тыс. человек.",
        outcome: "Окончательный переход стратегической инициативы к СССР."
    },
    {
        name: "Блокада Ленинграда",
        coords: [59.9343, 30.3351],
        period: "Сентябрь 1941 – Январь 1944",
        stage: "defensive",
        color: "#ff4444",
        description: "872 дня блокады города немецкими и финскими войсками.",
        significance: "Символ стойкости советского народа. Сковывание значительных сил противника.",
        casualties: "Погибло около 1,5 млн человек, большинство от голода.",
        outcome: "Город выстоял. Полное снятие блокады 27 января 1944 года."
    },
    {
        name: "Битва за Берлин",
        coords: [52.5200, 13.4050],
        period: "Апрель – Май 1945",
        stage: "offensive",
        color: "#44ff44",
        description: "Финальное сражение Великой Отечественной войны в Европе.",
        significance: "Взятие столицы Третьего рейха. Капитуляция Германии.",
        casualties: "Потери СССР: около 350 тыс. человек. Потери Германии: около 500 тыс. человек.",
        outcome: "Безоговорочная капитуляция Германии 8 мая 1945 года."
    }
];

// Инициализация карты
const map = L.map('map').setView([55.0, 37.0], 4);

// Добавление базового слоя OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
}).addTo(map);

// Элементы панели информации
const infoPanel = document.getElementById('infoPanel');
const closeBtn = document.getElementById('closeBtn');
const battleTitle = document.getElementById('battleTitle');
const battleInfo = document.getElementById('battleInfo');

// Добавление маркеров на карту
battles.forEach(battle => {
    const marker = L.circleMarker(battle.coords, {
        radius: 12,
        fillColor: battle.color,
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);

    // Всплывающая подсказка
    marker.bindTooltip(battle.name, {
        permanent: false,
        direction: 'top'
    });

    // Обработчик клика по маркеру
    marker.on('click', () => {
        showBattleInfo(battle);
    });
});

// Функция отображения информации о битве
function showBattleInfo(battle) {
    battleTitle.textContent = battle.name;
    battleInfo.innerHTML = `
        <h3>⏰ Период</h3>
        <p>${battle.period}</p>
        
        <h3>📋 Описание</h3>
        <p>${battle.description}</p>
        
        <h3>⚡ Значение</h3>
        <p>${battle.significance}</p>
        
        <h3>📊 Потери</h3>
        <p>${battle.casualties}</p>
        
        <h3>🏆 Итог</h3>
        <p>${battle.outcome}</p>
    `;
    
    infoPanel.classList.add('active');
    map.setView(battle.coords, 6);
}

// Закрытие панели информации
closeBtn.addEventListener('click', () => {
    infoPanel.classList.remove('active');
});

// Закрытие при клике вне панели
document.addEventListener('click', (e) => {
    if (!infoPanel.contains(e.target) && !e.target.closest('.leaflet-marker-icon') && 
        !e.target.closest('.leaflet-marker-pane')) {
        infoPanel.classList.remove('active');
    }
});
