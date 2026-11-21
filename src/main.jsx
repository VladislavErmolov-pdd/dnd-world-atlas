import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { MapContainer, ImageOverlay, Polygon, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.css";

const W = 1448, H = 1086;
const bounds = [[0, 0], [H, W]];

// Контур оцифрован приблизительно по красной обводке на присланной карте.
// При необходимости его можно будет уточнить, не меняя исходное изображение.
const theocracy = [
  [286, 647], [302, 619], [322, 607], [346, 576], [373, 560],
  [397, 527], [418, 515], [435, 482], [431, 448], [415, 421],
  [403, 382], [391, 352], [379, 321], [353, 302], [319, 289],
  [285, 270], [283, 246], [301, 220], [329, 204], [354, 183],
  [378, 151], [405, 126], [421, 101], [447, 91], [466, 97],
  [488, 93], [510, 117], [537, 132], [558, 160], [585, 178],
  [607, 199], [633, 217], [654, 246], [679, 260], [700, 284],
  [722, 310], [741, 338], [752, 367], [739, 392], [716, 412],
  [690, 424], [662, 433], [635, 425], [610, 425], [585, 437],
  [559, 431], [534, 442], [510, 463], [486, 482], [462, 499],
  [439, 516], [413, 536], [390, 558], [365, 573], [339, 568],
  [319, 560], [299, 559], [286, 576], [278, 603], [286, 647]
];

function ZoomToRegion({ active }) {
  const map = useMap();
  React.useEffect(() => {
    if (active) map.flyToBounds([[280, 280], [760, 760]], { duration: 1.3, padding: [35, 35] });
    else map.flyToBounds(bounds, { duration: 1.1, padding: [10, 10] });
  }, [active, map]);
  return null;
}

function App() {
  const [selected, setSelected] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const cityIcon = L.divIcon({ className: "city-marker-wrap", html: '<span class="city-marker">✦</span>', iconSize: [30,30], iconAnchor: [15,15] });

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-mark">✧</div>
      <div><div className="eyebrow">ИНТЕРАКТИВНЫЙ АТЛАС</div><h1>Хроники известного мира</h1></div>
      <div className="top-actions"><span className="status-dot"></span> Атлас игроков</div>
    </header>

    <main className="layout">
      <section className="map-section">
        <div className="map-heading">
          <div><div className="eyebrow">МИРОВАЯ КАРТА</div><h2>{selected ? "Теократия Красной Розы" : "Известные земли"}</h2></div>
          {selected && <button className="back-button" onClick={() => setSelected(false)}>← Ко всему миру</button>}
        </div>
        <div className="map-frame">
          <MapContainer crs={L.CRS.Simple} bounds={bounds} minZoom={-1.5} maxZoom={2.5} zoomSnap={0.25} scrollWheelZoom={true} zoomControl={true} maxBounds={[[-100,-100],[H+100,W+100]]}>
            <ImageOverlay url="/maps/world-map.png" bounds={bounds} />
            <Polygon positions={theocracy} pathOptions={{ color: "#f1c36a", weight: 3, opacity: 0.95, fillColor: "#e4b65b", fillOpacity: selected ? 0.19 : 0.04 }}
              eventHandlers={{ mouseover: e => e.target.setStyle({ fillOpacity: 0.22, weight: 5 }), mouseout: e => e.target.setStyle({ fillOpacity: selected ? 0.19 : 0.04, weight: 3 }), click: () => setSelected(true) }}>
              <Tooltip sticky>Теократия Красной Розы · Нажмите, чтобы приблизить</Tooltip>
            </Polygon>
            {selected && <Marker position={[420, 700]} icon={cityIcon} eventHandlers={{ click: () => setShowInfo(true) }}>
              <Tooltip permanent direction="top" offset={[0,-12]}>Ауренхельм · столица</Tooltip>
            </Marker>}
            <ZoomToRegion active={selected} />
          </MapContainer>
          <div className="map-hint">{selected ? "Колёсико мыши — масштаб · Перетаскивание — перемещение" : "Наведите на красную область и нажмите, чтобы открыть государство"}</div>
        </div>
      </section>

      <aside className="side-panel">
        {selected ? <>
          <div className="crest">☼</div>
          <div className="eyebrow">ГОСУДАРСТВО</div>
          <h2>Теократия Красной Розы</h2>
          <p className="official">Официальное название: Теократия Святого Восхода</p>
          <blockquote>«Через веру — к очищению. Через жертву — к спасению».</blockquote>
          <div className="facts">
            <div><small>Столица</small><strong>Ауренхельм</strong></div>
            <div><small>Форма правления</small><strong>Верховный Иерарх и Священный Синод</strong></div>
            <div><small>Государственная вера</small><strong>Единый Свет</strong></div>
            <div><small>Символ</small><strong>Солнце, выступающее из-за гор</strong></div>
            <div><small>Основные цвета</small><strong>Белый · золотой · алый · серебряный</strong></div>
          </div>
          <button className="city-card" onClick={() => setShowInfo(!showInfo)}>
            <span className="city-symbol">✦</span><span><small>СТОЛИЦА</small><strong>Ауренхельм</strong><em>Открыть сведения о городе</em></span><b>→</b>
          </button>
          {showInfo && <div className="city-note">Карточку Ауренхельма наполним отдельно, когда утвердим сведения о городе.</div>}
          <details open><summary>Вера и религия</summary><p>Жители Теократии поклоняются Единому Свету, который, согласно священным преданиям, создал мир и установил естественный порядок вещей. Его присутствие символизирует восходящее солнце.</p></details>
          <details><summary>Отношение к магии</summary><p>Теократия крайне отрицательно относится к магии, колдовству и магическим артефактам. За соблюдением запретов следит Инквизиция Красной Розы.</p></details>
          <details><summary>Общество и повседневная жизнь</summary><p>Страна сравнительно благополучна. В городах действуют храмы, больницы, приюты и школы. Общество строго иерархично.</p></details>
          <details><summary>Земли, города и климат</summary><p>Многие населённые земли находятся у подножья высоких гор, в холодных долинах и хвойных лесах. В южных низинах климат мягче.</p></details>
          <details><summary>Экономика</summary><p>Основу экономики составляют земледелие, животноводство, горное дело, ремёсла и торговля.</p></details>
        </> : <>
          <div className="eyebrow">ПУТЕВОДИТЕЛЬ</div>
          <h2>Изучайте известный мир</h2>
          <p>Выберите государство на карте, чтобы открыть его территорию и общедоступные сведения.</p>
          <div className="country-list">
            {["Медный Конклав","Империя Аквилон","Теократия Красной Розы","Вольные города","Архипелаг Серебряного Тумана","Легион Железного Порога","Орда Свободных Земель","Королевство Морт-Виль","Объединение Скьот"].map((name,i)=><button className={i===2?"country active":"country"} key={name} onClick={() => i===2 && setSelected(true)}><span className="country-dot"></span>{name}<span className="country-arrow">›</span></button>)}
          </div>
          <div className="notice">Пока интерактивно подключена Теократия Красной Розы. Остальные государства будут добавляться по мере подготовки их карт и описаний.</div>
        </>}
      </aside>
    </main>
    <footer>АТЛАС ИЗВЕСТНОГО МИРА <span>·</span> Путеводитель для путешественников</footer>
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);
