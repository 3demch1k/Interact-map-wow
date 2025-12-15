// Leaflet API: bindPopup/openPopup, flyTo, события moveend — базовые механики экскурсии [web:50][web:54]

const STAGES = {
  def: { label: "Оборонительный этап", badgeClass: "badge--def", color: "#ff4444" },
  turn: { label: "Коренной перелом", badgeClass: "badge--turn", color: "#ffa500" },
  off: { label: "Наступательный этап", badgeClass: "badge--off", color: "#44ff44" }
};

// События (можно расширять: добавляйте новые объекты по этому шаблону)
const EVENTS = [
  {
    id: "moscow",
    title: "Битва за Москву",
    stage: "def",
    coords: [55.7558, 37.6173],
    start: "1941-09-30",
    end: "1942-04-20",
    summary:
      "Сражение, сорвавшее план молниеносной войны и ставшее первым крупным стратегическим поражением вермахта на Восточном фронте.",
    narrative:
      "Осенью 1941 года немецкое командование предприняло попытку захватить столицу СССР. Оборона строилась на системе рубежей, манёвре резервами и упорных боях на подступах. 5 декабря 1941 года началось советское контрнаступление, отбросившее противника от Москвы на значительное расстояние.",
    commanders: {
      ussr: ["Г.К. Жуков", "К.К. Рокоссовский", "И.С. Конев"],
      germany: ["Ф. фон Бок", "Г. Гудериан", "Г. Гот"]
    },
    scale: [
      "Фронт: тысячи км, десятки армий",
      "Значение: срыв стратегического плана 1941 года"
    ],
    facts: [
      "Контрнаступление началось 5 декабря 1941 года.",
      "Поражение у Москвы разрушило представление о «непобедимости» вермахта.",
      "Итогом стало общее отступление немецких войск на ряде направлений."
    ],
    outcome:
      "Победа Красной Армии под Москвой укрепила моральный дух страны и сорвала ключевой замысел германского командования на кампанию 1941 года."
  },
  {
    id: "leningrad",
    title: "Блокада Ленинграда",
    stage: "def",
    coords: [59.9343, 30.3351],
    start: "1941-09-08",
    end: "1944-01-27",
    summary:
      "872 дня осады, ставшие символом трагедии и стойкости, а также фактором, сковавшим значительные силы противника.",
    narrative:
      "Блокада началась после перерезания сухопутных коммуникаций города. Самым тяжёлым стал период зимы 1941–1942 годов. В январе 1943 года блокаду частично прорвали, а 27 января 1944 года — полностью сняли.",
    commanders: {
      ussr: ["Л.А. Говоров", "К.А. Мерецков", "Г.К. Жуков (в разные периоды)"],
      germany: ["В. фон Лееб", "Г. фон Кюхлер"]
    },
    scale: [
      "Длительность: 872 дня",
      "Стратегический эффект: «связанные» силы группы армий «Север»"
    ],
    facts: [
      "«Дорога жизни» по Ладоге стала ключевым маршрутом снабжения и эвакуации.",
      "В январе 1943 года проведена операция по прорыву блокады.",
      "Полное снятие блокады — 27 января 1944 года."
    ],
    outcome:
      "Ленинград не был взят, что стало важнейшим моральным и стратегическим результатом. Город выдержал осаду ценой огромных потерь."
  },
  {
    id: "stalingrad",
    title: "Сталинградская битва",
    stage: "turn",
    coords: [48.7080, 44.5133],
    start: "1942-07-17",
    end: "1943-02-02",
    summary:
      "Кульминация борьбы на южном направлении: окружение и разгром крупной группировки противника и переход стратегической инициативы к СССР.",
    narrative:
      "Летом 1942 года бои развернулись на подступах к Волге и в городе. В ноябре 1942 года Красная Армия перешла в контрнаступление (операция по окружению), замкнув кольцо вокруг 6-й армии. К началу февраля 1943 года окружённая группировка капитулировала.",
    commanders: {
      ussr: ["Г.К. Жуков", "А.М. Василевский", "К.К. Рокоссовский", "А.И. Ерёменко"],
      germany: ["Ф. Паулюс", "Э. фон Манштейн"]
    },
    scale: [
      "Одна из крупнейших битв войны по размаху и потерям",
      "Городские бои: борьба за кварталы, высоты, переправы"
    ],
    facts: [
      "Окружение 6-й армии стало крупнейшим оперативным успехом Красной Армии.",
      "Победа вызвала сильный международный резонанс и изменила оценки хода войны.",
      "Сталинград часто называют началом коренного перелома."
    ],
    outcome:
      "Разгром под Сталинградом резко ослабил ударные возможности вермахта и стал стратегическим рубежом, после которого инициатива всё чаще переходила к СССР."
  },
  {
    id: "kursk",
    title: "Курская битва",
    stage: "turn",
    coords: [51.7373, 36.1873],
    start: "1943-07-05",
    end: "1943-08-23",
    summary:
      "Последнее крупное наступление вермахта на Восточном фронте завершилось неудачей, после чего Красная Армия закрепила инициативу и начала масштабное освобождение территорий.",
    narrative:
      "Немецкое командование пыталось ликвидировать Курский выступ. Советская сторона подготовила глубоко эшелонированную оборону. После отражения ударов начались советские наступательные операции на орловском и белгородско-харьковском направлениях.",
    commanders: {
      ussr: ["Г.К. Жуков", "А.М. Василевский", "К.К. Рокоссовский", "И.С. Конев", "Н.Ф. Ватутин"],
      germany: ["Э. фон Манштейн", "В. Модель", "Г. фон Клюге"]
    },
    scale: [
      "Крупнейшее танковое противостояние войны",
      "Сочетание обороны и последующих наступательных операций"
    ],
    facts: [
      "Сражение под Прохоровкой стало одним из самых известных эпизодов битвы.",
      "Поражение под Курском лишило Германию возможности стратегического наступления на Востоке.",
      "После завершения битвы началась серия операций по освобождению Украины."
    ],
    outcome:
      "Курская победа закрепила коренной перелом: СССР перешёл к устойчивому стратегическому наступлению."
  },
  {
    id: "berlin",
    title: "Берлинская операция",
    stage: "off",
    coords: [52.5200, 13.4050],
    start: "1945-04-16",
    end: "1945-05-08",
    summary:
      "Финальная операция в Европе: штурм столицы Третьего рейха и завершение войны капитуляцией Германии.",
    narrative:
      "В апреле 1945 года советские фронты прорвали оборону противника на подступах к Берлину, окружили город и начали уличные бои. Вскоре после падения ключевых узлов обороны гарнизон капитулировал, а 8 мая был подписан акт о безоговорочной капитуляции Германии.",
    commanders: {
      ussr: ["Г.К. Жуков", "И.С. Конев", "К.К. Рокоссовский"],
      germany: ["Г. Вейдлинг (оборона Берлина)"]
    },
    scale: [
      "Одна из крупнейших наступательных операций финального периода войны",
      "Интенсивные уличные бои и штурм укреплённых районов"
    ],
    facts: [
      "Операция включала прорыв обороны на подступах к Берлину и последующий штурм.",
      "Капитуляция Германии подписана 8 мая 1945 года.",
      "Падение Берлина стало символическим завершением войны в Европе."
    ],
    outcome:
      "Берлинская операция завершила разгром нацистской Германии и стала итоговой точкой боевых действий в Европе."
  }
];

// ---------- UI refs ----------
const el = {
  map: document.getElementById("map"),
  panel: document.getElementById("panel"),
  panelEmpty: document.getElementById("panelEmpty"),
  panelContent: document.getElementById("panelContent"),
  btnClosePanel: document.getElementById("btnClosePanel"),

  title: document.getElementById("eventTitle"),
  stage: document.getElementById("eventStage"),
  dates: document.getElementById("eventDates"),
  summary: document.getElementById("eventSummary"),
  narrative: document.getElementById("eventNarrative"),
  commanders: document.getElementById("eventCommanders"),
  scale: document.getElementById("eventScale"),
  facts: document.getElementById("eventFacts"),
  outcome: document.getElementById("eventOutcome"),

  btnPrev: document.getElementById("btnPrev"),
  btnNext: document.getElementById("btnNext"),

  btnStartTour: document.getElementById("btnStartTour"),
  btnStopTour: document.getElementById("btnStopTour"),

  timeline: document.getElementById("timeline"),
  hudYear: document.getElementById("hudYear"),
  btnPlay: document.getElementById("btnPlay"),
  btnPause: document.getElementById("btnPause"),
  btnReset: document.getElementById("btnReset"),

  tourProgress: document.getElementById("tourProgress"),
  tourProgressFill: document.getElementById("tourProgressFill"),

  filterDef: document.getElementById("filterDef"),
  filterTurn: document.getElementById("filterTurn"),
  filterOff: document.getElementById("filterOff")
};

// ---------- Map init ----------
const map = L.map("map", { zoomControl: true }).setView([55.0, 37.0], 4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap'
}).addTo(map);

// После мобильного ресайза карта иногда «пустая» — принудительная перерисовка.
setTimeout(() => map.invalidateSize(), 300);
window.addEventListener("resize", () => map.invalidateSize());

// ---------- Markers ----------
const markerById = new Map();
const layerGroup = L.layerGroup().addTo(map);

function stageEnabled(stage) {
  if (stage === "def") return el.filterDef.checked;
  if (stage === "turn") return el.filterTurn.checked;
  if (stage === "off") return el.filterOff.checked;
  return true;
}

function buildMarkers() {
  layerGroup.clearLayers();
  markerById.clear();

  EVENTS.forEach((ev) => {
    if (!stageEnabled(ev.stage)) return;

    const circle = L.circleMarker(ev.coords, {
      radius: 12,
      weight: 3,
      color: "#fff",
      fillColor: STAGES[ev.stage].color,
      fillOpacity: 0.85
    });

    circle.bindTooltip(`🏷️ ${ev.title}`, { direction: "top" });
    circle.on("click", () => openEvent(ev.id, { fromClick: true }));

    circle.addTo(layerGroup);
    markerById.set(ev.id, circle);
  });
}

buildMarkers();
[el.filterDef, el.filterTurn, el.filterOff].forEach(cb => cb.addEventListener("change", () => {
  buildMarkers();
  // Если текущая точка «отфильтровалась» — закрыть панель
  if (state.currentId && !markerById.has(state.currentId)) closePanel();
}));

// ---------- Panel ----------
function openPanel() {
  el.panel.classList.add("open");
}
function closePanel() {
  el.panel.classList.remove("open");
  el.panelEmpty.hidden = false;
  el.panelContent.hidden = true;
  state.currentId = null;
  updateNavButtons();
}

el.btnClosePanel.addEventListener("click", closePanel);

// ---------- Time helpers ----------
const START = new Date("1941-09-01");
const END = new Date("1945-05-09");
function dateFromProgress(pct) {
  const t = pct / 100;
  return new Date(START.getTime() + t * (END.getTime() - START.getTime()));
}
function yearFromProgress(pct) {
  return dateFromProgress(pct).getFullYear();
}
function inRange(date, startStr, endStr) {
  const s = new Date(startStr);
  const e = new Date(endStr);
  return date >= s && date <= e;
}

function updateTimelineVisual() {
  const d = dateFromProgress(Number(el.timeline.value));
  el.hudYear.textContent = String(d.getFullYear());

  // Подсветка маркеров по времени
  EVENTS.forEach(ev => {
    const m = markerById.get(ev.id);
    if (!m) return;
    const active = inRange(d, ev.start, ev.end);
    m.setStyle({
      fillOpacity: active ? 0.92 : 0.18,
      opacity: active ? 1 : 0.35
    });
  });
}

el.timeline.addEventListener("input", updateTimelineVisual);
updateTimelineVisual();

// ---------- Tour state ----------
const state = {
  playing: false,
  tourTimer: null,
  tourIndex: 0,
  currentId: null
};

function getTourList() {
  // Экскурсия идёт по отфильтрованным событиям
  return EVENTS.filter(ev => markerById.has(ev.id));
}

function setProgressText() {
  const list = getTourList();
  if (!list.length) {
    el.tourProgress.textContent = "Экскурсия: нет точек (проверьте фильтры)";
    el.tourProgressFill.style.width = "0%";
    return;
  }
  if (!state.currentId) {
    el.tourProgress.textContent = "Экскурсия: не запущена";
    el.tourProgressFill.style.width = "0%";
    return;
  }
  const idx = list.findIndex(x => x.id === state.currentId);
  const pct = Math.max(0, idx) / (list.length - 1 || 1) * 100;
  el.tourProgress.textContent = `Экскурсия: ${idx + 1} / ${list.length}`;
  el.tourProgressFill.style.width = `${pct}%`;
}

function updateNavButtons() {
  const list = getTourList();
  if (!list.length || !state.currentId) {
    el.btnPrev.disabled = true;
    el.btnNext.disabled = true;
    return;
  }
  const i = list.findIndex(x => x.id === state.currentId);
  el.btnPrev.disabled = i <= 0;
  el.btnNext.disabled = i >= list.length - 1;
}

function renderEvent(ev) {
  el.panelEmpty.hidden = true;
  el.panelContent.hidden = false;

  el.title.textContent = ev.title;
  el.dates.textContent = `${ev.start} → ${ev.end}`;

  const st = STAGES[ev.stage];
  el.stage.textContent = st.label;
  el.stage.className = `badge ${st.badgeClass}`;

  el.summary.textContent = ev.summary;
  el.narrative.textContent = ev.narrative;

  el.commanders.innerHTML = `
    <div><strong>СССР:</strong> ${ev.commanders.ussr.join(", ")}</div>
    <div><strong>Германия:</strong> ${ev.commanders.germany.join(", ")}</div>
  `;

  el.scale.innerHTML = `<ul>${ev.scale.map(x => `<li>${x}</li>`).join("")}</ul>`;

  el.facts.innerHTML = ev.facts.map(x => `<li>${x}</li>`).join("");
  el.outcome.textContent = ev.outcome;

  openPanel();
  updateNavButtons();
  setProgressText();
}

function openEvent(id, { fromClick = false } = {}) {
  const ev = EVENTS.find(x => x.id === id);
  if (!ev) return;

  // Если точка отфильтрована — игнор
  if (!markerById.has(id)) return;

  state.currentId = id;

  // Плавный перелёт к точке и открытие tooltip по завершению движения [web:54]
  map.flyTo(ev.coords, 6, { animate: true, duration: 1.6 });
  map.once("moveend", () => {
    const m = markerById.get(id);
    if (m) m.openTooltip();
  });

  renderEvent(ev);

  // Синхронизация timeline: ставим положение по середине интервала события
  if (!fromClick) {
    const mid = (new Date(ev.start).getTime() + new Date(ev.end).getTime()) / 2;
    const pct = ((mid - START.getTime()) / (END.getTime() - START.getTime())) * 100;
    el.timeline.value = String(Math.max(0, Math.min(100, Math.round(pct))));
    updateTimelineVisual();
  }
}

function nextEvent() {
  const list = getTourList();
  if (!list.length) return;
  const i = state.currentId ? list.findIndex(x => x.id === state.currentId) : -1;
  const next = list[Math.min(list.length - 1, i + 1)];
  if (next) openEvent(next.id);
}

function prevEvent() {
  const list = getTourList();
  if (!list.length) return;
  const i = state.currentId ? list.findIndex(x => x.id === state.currentId) : 0;
  const prev = list[Math.max(0, i - 1)];
  if (prev) openEvent(prev.id);
}

el.btnNext.addEventListener("click", nextEvent);
el.btnPrev.addEventListener("click", prevEvent);

// ---------- Autoplay экскурсии ----------
function startTour() {
  const list = getTourList();
  if (!list.length) return;

  state.tourIndex = 0;
  el.btnStartTour.disabled = true;
  el.btnStopTour.disabled = false;

  openEvent(list[0].id);
}

function stopTour() {
  state.playing = false;
  if (state.tourTimer) clearInterval(state.tourTimer);
  state.tourTimer = null;

  el.btnPlay.disabled = false;
  el.btnPause.disabled = true;

  el.btnStartTour.disabled = false;
  el.btnStopTour.disabled = true;

  setProgressText();
}

el.btnStartTour.addEventListener("click", startTour);
el.btnStopTour.addEventListener("click", stopTour);

// ---------- Timeline autoplay (авто-режим) ----------
function playTimeline() {
  if (state.playing) return;
  state.playing = true;

  el.btnPlay.disabled = true;
  el.btnPause.disabled = false;

  state.tourTimer = setInterval(() => {
    const v = Number(el.timeline.value);
    if (v >= 100) {
      pauseTimeline();
      return;
    }
    el.timeline.value = String(v + 1);
    updateTimelineVisual();

    // Автоподсказка: если в текущем году “активна” точка, показать её (но не дёргать слишком часто)
    const now = dateFromProgress(Number(el.timeline.value));
    const list = getTourList();
    const active = list.find(ev => inRange(now, ev.start, ev.end));
    if (active && state.currentId !== active.id) {
      openEvent(active.id);
    }
  }, 220);
}

function pauseTimeline() {
  state.playing = false;
  if (state.tourTimer) clearInterval(state.tourTimer);
  state.tourTimer = null;

  el.btnPlay.disabled = false;
  el.btnPause.disabled = true;
}

function resetTimeline() {
  pauseTimeline();
  el.timeline.value = "0";
  updateTimelineVisual();
  closePanel();
  setProgressText();
}

el.btnPlay.addEventListener("click", playTimeline);
el.btnPause.addEventListener("click", pauseTimeline);
el.btnReset.addEventListener("click", resetTimeline);

// Первичное состояние прогресса
setProgressText();
updateNavButtons();
