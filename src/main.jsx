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
  [526, 420],
  [529, 429],
  [535, 434],
  [542, 447],
  [548, 451],
  [557, 455],
  [570, 458],
  [577, 465],
  [590, 468],
  [602, 470],
  [620, 476],
  [638.9, 471.9],
  [647.7, 475.5],
  [666.7, 477.8],
  [691.5, 486.8],
  [720.0, 488.0],
  [735.2, 490.5],
  [761.6, 500.7],
  [780.7, 505.9],
  [812.7, 520.9],
  [829.9, 525.0],
  [847.6, 516.0],
  [859.9, 519.1],
  [879.3, 523.0],
  [892.6, 518.7],
  [905.0, 512.6],
  [915.0, 504.8],
  [922.2, 498.3],
  [929.6, 495.9],
  [936.1, 487.5],
  [938.6, 481.5],
  [942.6, 478.5],
  [947.3, 468.1],
  [951.5, 467.1],
  [959.2, 464.2],
  [956.4, 456.7],
  [958.5, 449.8],
  [967.5, 445.1],
  [975.4, 437.8],
  [980.6, 430.5],
  [971.4, 429.7],
  [960.4, 430.3],
  [940.3, 423.2],
  [935.6, 409.1],
  [921.5, 399.3],
  [910.1, 390.7],
  [902.4, 384.1],
  [892.5, 375.1],
  [878.9, 372.9],
  [859, 373],
  [844, 356],
  [835, 348],
  [822, 350],
  [814, 349],
  [805, 343],
  [798, 332],
  [789, 329],
  [786, 329],
  [777, 325],
  [772, 324],
  [767, 322],
  [762, 320],
  [758, 319],
  [755, 317],
  [749, 313],
  [748, 307],
  [744, 304],
  [735, 300],
  [728, 304],
  [716, 305],
  [704, 306],
  [692, 302],
  [682, 299],
  [671, 298],
  [664, 302],
  [653, 316],
  [627, 325],
  [622, 345],
  [608, 355],
  [590, 366],
  [571, 381],
  [553, 393],
  [533, 405]
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
