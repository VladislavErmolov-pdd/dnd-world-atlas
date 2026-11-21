import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { MapContainer, ImageOverlay, Polygon, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.css";

const W = 1448, H = 1086;
const imageBounds = [[0, 0], [H, W]];

// Точки ниже заданы в пикселях исходной картинки: [x, y] от верхнего левого угла.
// Leaflet CRS.Simple считает вертикальную координату снизу вверх,
// поэтому переводим y в H - y. Это устраняет прежнее вертикальное смещение.
const borderPixels = [
  [547, 530],
  [563, 535],
  [633, 548],
  [662, 558],
  [672, 556],
  [701, 540],
  [762, 518],
  [782, 501],
  [793, 502],
  [802, 511],
  [855, 500],
  [907, 507],
  [961, 480],
  [963, 460],
  [984, 444],
  [987, 426],
  [982, 416],
  [956, 405],
  [929, 378],
  [873, 358],
  [851, 335],
  [828, 342],
  [809, 321],
  [776, 310],
  [760, 289],
  [726, 296],
  [681, 286],
  [669, 307],
  [640, 324],
  [621, 355],
  [580, 369],
  [567, 391],
  [543, 408],
  [547, 429],
  [579, 457],
  [621, 469],
  [620, 483],
  [609, 500],
  [556, 512]
];
const borderPositions = borderPixels.map(([x,y]) => [H-y, x]);

// Примерная точка столицы по согласованному месту на мировой карте.
// При необходимости можно будет сдвинуть её на несколько пикселей после проверки.
const capitalPosition = [H-415, 696];

function ZoomToRegion({ active }) {
  const map = useMap();
  React.useEffect(() => {
    if (active) {
      const regionBounds = [[H-625, 500], [H-280, 970]];
      map.flyToBounds(regionBounds, { duration: 1.25, padding: [28, 28] });
    } else {
      map.flyToBounds(imageBounds, { duration: 1.1, padding: [8, 8] });
    }
  }, [active, map]);
  return null;
}

function App() {
  const [selected, setSelected] = useState(false);
  const [showCity, setShowCity] = useState(false);

  const cityIcon = L.divIcon({
    className: "city-marker-wrap",
    html: '<span class="city-marker">✦</span>',
    iconSize: [30,30],
    iconAnchor: [15,15]
  });

  const normalStyle = {
    color: "#d9b36d",
    weight: 1.1,
    opacity: 0.28,
    fillColor: "#e4b65b",
    fillOpacity: 0
  };

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-mark">✧</div>
      <div><div className="eyebrow">ИНТЕРАКТИВНЫЙ АТЛАС</div><h1>Хроники известного мира</h1></div>
      <div className="top-actions"><span className="status-dot"></span> Атлас игроков</div>
    </header>

    <main className="layout">
      <section className="map-section">
        <div className="map-heading">
          <div><div className="eyebrow">{selected ? "ТЕРРИТОРИЯ ГОСУДАРСТВА" : "МИРОВАЯ КАРТА"}</div><h2>{selected ? "Теократия Красной Розы" : "Известные земли"}</h2></div>
          {selected && <button className="back-button" onClick={() => {setSelected(false); setShowCity(false);}}>← Ко всему миру</button>}
        </div>
        <div className="map-frame">
          <MapContainer crs={L.CRS.Simple} bounds={imageBounds} minZoom={-1.5} maxZoom={2.5} zoomSnap={0.25} scrollWheelZoom={true} zoomControl={true} maxBounds={[[-100,-100],[H+100,W+100]]}>
            <ImageOverlay url="/maps/world-map.png" bounds={imageBounds} />
            <Polygon
              positions={borderPositions}
              pathOptions={normalStyle}
              eventHandlers={{
                mouseover: e => e.target.setStyle({color:"#ffe09a",weight:3.5,opacity:1,fillColor:"#f0c46d",fillOpacity:0.13}),
                mouseout: e => e.target.setStyle(normalStyle),
                click: () => setSelected(true)
              }}
            >
              <Tooltip sticky direction="top" opacity={1}>Теократия Красной Розы · Нажмите, чтобы открыть</Tooltip>
            </Polygon>
            {selected && <Marker position={capitalPosition} icon={cityIcon} eventHandlers={{click:()=>setShowCity(v=>!v)}}>
              <Tooltip permanent direction="top" offset={[0,-13]}>Ауренхельм · столица</Tooltip>
            </Marker>}
            <ZoomToRegion active={selected} />
          </MapContainer>
          <div className="map-hint">{selected ? "Колёсико мыши — масштаб · Перетаскивание — перемещение" : "Наведите на Теократию и нажмите, чтобы открыть государство"}</div>
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
          <button className="city-card" onClick={()=>setShowCity(v=>!v)}>
            <span className="city-symbol">✦</span><span><small>СТОЛИЦА</small><strong>Ауренхельм</strong><em>Открыть сведения о городе</em></span><b>→</b>
          </button>
          {showCity && <div className="city-note">Ауренхельм — столица Теократии Красной Розы. Подробное описание города добавим отдельно.</div>}
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
            {["Медный Конклав","Империя Аквилон","Теократия Красной Розы","Вольные города","Архипелаг Серебряного Тумана","Легион Железного Порога","Орда Свободных Земель","Королевство Морт-Виль","Объединение Скьот"].map((name,i)=><button className={i===2?"country active":"country"} key={name} onClick={()=>i===2&&setSelected(true)}><span className="country-dot"></span>{name}<span className="country-arrow">›</span></button>)}
          </div>
          <div className="notice">Пока интерактивно подключена Теократия Красной Розы. Остальные государства будут добавляться по мере подготовки их карт и описаний.</div>
        </>}
      </aside>
    </main>
    <footer>АТЛАС ИЗВЕСТНОГО МИРА <span>·</span> Путеводитель для путешественников</footer>
  </div>;
}
createRoot(document.getElementById("root")).render(<App />);
