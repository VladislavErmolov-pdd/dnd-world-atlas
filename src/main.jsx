import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { MapContainer, ImageOverlay, Polygon, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.css";

const WORLD_W = 1448, WORLD_H = 1086;
const REGION_W = 1671, REGION_H = 941;
const worldBounds = [[0, 0], [WORLD_H, WORLD_W]];
const regionBounds = [[0, 0], [REGION_H, REGION_W]];
// Координаты поселений хранятся в исходной сетке 1536×1024.
// Преобразуем их к размеру обновлённого изображения региональной карты.
const regionPosition = (x, y) => [
  REGION_H - y * (REGION_H / 1024),
  x * (REGION_W / 1536)
];

// Граница Теократии на мировой карте. Координаты привязаны к исходному изображению.
const borderPixels = [
  [526,420],[529,429],[535,434],[542,447],[548,451],[557,455],[570,458],[577,465],
  [590,468],[602,470],[620,476],[638.9,471.9],[647.7,475.5],[666.7,477.8],
  [691.5,486.8],[720,488],[735.2,490.5],[761.6,500.7],[780.7,505.9],
  [812.7,520.9],[829.9,525],[847.6,516],[859.9,519.1],[879.3,523],
  [892.6,518.7],[905,512.6],[915,504.8],[922.2,498.3],[929.6,495.9],
  [936.1,487.5],[938.6,481.5],[942.6,478.5],[947.3,468.1],[951.5,467.1],
  [959.2,464.2],[956.4,456.7],[958.5,449.8],[967.5,445.1],[975.4,437.8],
  [980.6,430.5],[971.4,429.7],[960.4,430.3],[940.3,423.2],[935.6,409.1],
  [921.5,399.3],[910.1,390.7],[902.4,384.1],[892.5,375.1],[878.9,372.9],
  [859,373],[844,356],[835,348],[822,350],[814,349],[805,343],[798,332],
  [789,329],[786,329],[777,325],[772,324],[767,322],[762,320],[758,319],
  [755,317],[749,313],[748,307],[744,304],[735,300],[728,304],[716,305],
  [704,306],[692,302],[682,299],[671,298],[664,302],[653,316],[627,325],
  [622,345],[608,355],[590,366],[571,381],[553,393],[533,405]
];
const borderPositions = borderPixels.map(([x,y]) => [WORLD_H-y, x]);
const capitalPosition = [WORLD_H-415, 696];

function ZoomToCountry({ selected }) {
  const map = useMap();
  React.useEffect(() => {
    const bounds = selected ? [[WORLD_H-625,500],[WORLD_H-280,970]] : worldBounds;
    map.flyToBounds(bounds, { duration: 1.1, padding: selected ? [28,28] : [8,8] });
  }, [selected, map]);
  return null;
}

const cities = [
  {name:"Ауренхельм", type:"Столица", x:700, y:235, size:"Крупнейший город", days:"—", desc:"Столица Теократии Святого Восхода. Расположена у подножья северных гор, среди снежных долин. Здесь находятся резиденция Верховного Иерарха, Священный Синод, главный кафедральный храм и центральное управление Инквизиции."},
  {name:"Гранитный Венец", type:"Крупный город", x:420, y:290, days:"4 дня от Ауренхельма", desc:"Горнодобывающий и металлургический центр северо-запада. Здесь работают каменоломни, рудники и кузницы, производящие инструменты, оружие и доспехи."},
  {name:"Светозар", type:"Крупный город", x:1080, y:280, days:"5 дней от Ауренхельма", desc:"Центр религиозного образования. В городе находятся храмовые школы, библиотеки, лечебницы и монастырские комплексы, где готовят жрецов и служителей Единого Света."},
  {name:"Каменный Брод", type:"Средний город", x:215, y:425, days:"4 дня от Ауренхельма", desc:"Западный торговый узел у крупной реки и каменного моста. Контролирует переправы и движение караванов между западными землями и столицей."},
  {name:"Златодол", type:"Средний город", x:892, y:795, days:"6 дней от Ауренхельма", desc:"Главный сельскохозяйственный центр южных долин. Вокруг города расположены поля, пастбища, мельницы, сады и монастырские хозяйства."},
  {name:"Розенвальд", type:"Небольшой город", x:420, y:640, days:"6 дней от Ауренхельма", desc:"Юго-западный центр скотоводства, кожевенного ремесла и лесозаготовки. Через город проходят тракты к западным соседям."},
  {name:"Тихоречье", type:"Небольшой город", x:1110, y:670, days:"6 дней от Ауренхельма", desc:"Город речных переправ, рыбной торговли, мельниц и ремесленных мастерских. Здесь сходятся дороги, ведущие к южным землям."}
];

const villages = [
  ["Эльмхольд",760,175],
  ["Белые Ключи",595,225],
  ["Солнечный Склон",980,225],
  ["Морозный Лог",1145,350],
  ["Рудный Яр",125,310],
  ["Каменный Ручей",305,332],
  ["Серебряная Сопка",382,360],
  ["Сосновый Дол",498,347],
  ["Три Мельницы",530,446],
  ["Звонкие Колокола",975,370],
  ["Святой Исток",1142,350],
  ["Лесная Обитель",1245,554],
  ["Тихая Падь",1153,652],
  ["Зимняя Падь",960,555],
  ["Мельничный Брод",175,580],
  ["Старый Перевоз",240,550],
  ["Липовая Пойма",343,548],
  ["Крутой Берег",402,590],
  ["Дубовый Клин",1048,575],
  ["Медвежья Заводь",1245,554],
  ["Три Ели",885,597],
  ["Сухой Ручей",1016,652],
  ["Пшеничный Край",647,705],
  ["Медовая Нива",760,780],
  ["Красный Колос",875,795],
  ["Тёплый Ручей",950,745],
  ["Волчий Лог",332,710],
  ["Красная Роща",435,750],
  ["Олений Пруд",550,775],
  ["Рыбачий Мыс",1060,735],
  ["Три Переправы",1167,750],
  ["Ивовый Берег",700,870]
];

const forts = [
  {name:"Белый Дозор",x:810,y:75,desc:"Северная крепость, контролирующая высокогорные перевалы и дороги к Медному Конклаву."},
  {name:"Клык Горы",x:300,y:205,desc:"Северо-западное укрепление, охраняющее узкие горные проходы."},
  {name:"Железные Врата",x:115,y:440,desc:"Западная пограничная крепость у важного торгового тракта в сторону Империи Аквилон."},
  {name:"Солнечный Щит",x:1435,y:475,desc:"Восточная застава, наблюдающая за дорогами к Вольным городам."},
  {name:"Последний Свет",x:650,y:820,desc:"Южная крепость на пути к землям Орды Свободных Земель."}
];

function makeHotspot(kind) {
  const size = kind === "city" ? [150,110] : kind === "fort" ? [110,78] : [34,34];
  return L.divIcon({className:"atlas-hotspot-wrap", html:'<span class="atlas-hotspot"></span>', iconSize:size, iconAnchor:[size[0]/2,size[1]/2]});
}
const cityIcon = makeHotspot("city"), fortIcon = makeHotspot("fort"), villageIcon = makeHotspot("village");

function App() {
  const [selected, setSelected] = useState(false);
  const [regionView, setRegionView] = useState(false);
  const [detailView, setDetailView] = useState(false);
  const [activePlace, setActivePlace] = useState(null);

  const normalStyle = {stroke:false, fill:true, fillColor:"#e9bd69", fillOpacity:0.001, className:"territory-hit-area"};

  const showCountry = () => {
    setSelected(true);
    setRegionView(false);
    setDetailView(false);
    setActivePlace(null);
  };
  const openRegion = () => {
    setSelected(true);
    setRegionView(true);
    setDetailView(false);
    setActivePlace(null);
  };
  // Двойное нажатие на страну сразу открывает подробную территориальную карту,
  // минуя промежуточную карточку второго уровня.
  const openDetailedRegion = () => {
    setSelected(true);
    setRegionView(true);
    setDetailView(true);
    setActivePlace(null);
  };
  const backToWorld = () => {
    setSelected(false);
    setRegionView(false);
    setDetailView(false);
    setActivePlace(null);
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
          <div>
            <div className="eyebrow">{detailView ? "ПОДРОБНАЯ КАРТА МЕСТНОСТИ" : regionView ? "РЕГИОНАЛЬНАЯ КАРТА" : selected ? "ТЕРРИТОРИЯ ГОСУДАРСТВА" : "МИРОВАЯ КАРТА"}</div>
            <h2>{detailView ? "Земли Теократии Святого Восхода" : regionView ? "Теократия Красной Розы · обзор региона" : selected ? "Теократия Красной Розы" : "Известные земли"}</h2>
          </div>
          {(selected || regionView || detailView) && <button className="back-button" onClick={backToWorld}>← Ко всему миру</button>}
        </div>

        <div className="map-frame">
          {!detailView ? <MapContainer key={regionView ? "region" : selected ? "country" : "world"} crs={L.CRS.Simple} bounds={worldBounds} minZoom={-1.5} maxZoom={2.5} zoomSnap={0.25} scrollWheelZoom={true} zoomControl={true} maxBounds={[[-100,-100],[WORLD_H+100,WORLD_W+100]]}>
            <ImageOverlay url="/maps/world-map.png" bounds={worldBounds} />
            <Polygon positions={borderPositions} pathOptions={normalStyle} eventHandlers={{
              mouseover:e=>e.target.setStyle({fillOpacity:0.30}),
              mouseout:e=>e.target.setStyle(normalStyle),
              click:showCountry,
              dblclick:e=>{L.DomEvent.stopPropagation(e);openDetailedRegion();}
            }}>
              <Tooltip sticky direction="top" opacity={1}>Теократия Красной Розы · Нажмите, чтобы открыть</Tooltip>
            </Polygon>
            {selected && <Marker position={capitalPosition} icon={cityIcon}><Tooltip permanent direction="top" offset={[0,-13]}>Ауренхельм · столица</Tooltip></Marker>}
            <ZoomToCountry selected={selected} />
          </MapContainer> : <MapContainer key="detailed-region" crs={L.CRS.Simple} bounds={regionBounds} minZoom={-1} maxZoom={2.5} zoomSnap={0.25} scrollWheelZoom={true} zoomControl={true} maxBounds={[[-60,-60],[REGION_H+60,REGION_W+60]]}>
            <ImageOverlay url="/maps/theocracy-region.png" bounds={regionBounds} />
            {cities.map(city=><Marker key={city.name} position={regionPosition(city.x,city.y)} icon={cityIcon} eventHandlers={{mouseover:()=>setActivePlace({ ...city, kind:"city" })}} />)}
            {villages.map(([name,x,y])=><Marker key={name} position={regionPosition(x,y)} icon={villageIcon} eventHandlers={{mouseover:()=>setActivePlace({name,type:"Деревня",kind:"village",desc:`Небольшое сельское поселение Теократии. Жители занимаются хозяйством, ремеслом и снабжают ближайший город.`})}} />)}
            {forts.map(f=><Marker key={f.name} position={regionPosition(f.x,f.y)} icon={fortIcon} eventHandlers={{mouseover:()=>setActivePlace({...f,type:"Пограничная крепость",kind:"fort"})}} />)}
          </MapContainer>}
          <div className="map-hint">{detailView ? "Подробная карта · Наведите курсор на город, деревню или крепость, чтобы увидеть сведения" : regionView ? "Обзор региона · Здесь сохранён исходный рельеф мировой карты" : selected ? "Двойное нажатие открывает региональный уровень" : "Наведите на Теократию и нажмите, чтобы открыть государство · Двойное нажатие — карта региона"}</div>
        </div>
      </section>

      <aside className="side-panel">
        {detailView ? <>
          {activePlace ? <>
            <div className="eyebrow">{activePlace.type || "ПОСЕЛЕНИЕ"}</div>
            {activePlace.name === "Каменный Брод" && activePlace.kind === "city" && (
              <img
                src="/maps/stone-bridge-town.png"
                alt="Панорама города Каменный Брод"
                className="place-illustration"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  borderRadius: "12px",
                  margin: "14px 0",
                  border: "1px solid rgba(180, 145, 86, 0.45)"
                }}
              />
            )}
            {activePlace.days && <p className="official">Путь от столицы: {activePlace.days}</p>}
            <p><strong>{activePlace.name}</strong> — {activePlace.desc}</p>
            <button className="back-button" onClick={()=>setActivePlace(null)}>← К обзору местности</button>
          </> : <>
            <div className="region-banner"><span className="eyebrow">ПОДРОБНЫЙ АТЛАС</span><strong>Теократия Красной Розы</strong><p>Карта местности с городами, деревнями, пограничными крепостями и дорогами. Главный тракт вымощен серым камнем; региональные дороги и местные пути показаны более тёплыми земляными оттенками.</p></div>
            <div className="crest">☼</div>
            <div className="eyebrow">РЕГИОНАЛЬНЫЙ АТЛАС</div>
            <h2>Теократия Святого Восхода</h2>
            <p>Семь городов, тридцать две деревни и пять пограничных крепостей. Названия объектов постоянно видны на карте. Нажмите на любой знак, чтобы прочитать описание.</p>
            <div className="facts">
              <div><small>Столица</small><strong>Ауренхельм</strong></div>
              <div><small>Городов</small><strong>7</strong></div>
              <div><small>Деревень</small><strong>32</strong></div>
              <div><small>Крепостей</small><strong>6</strong></div>
            </div>
            <div className="notice">Главный Солнечный тракт — мощёная каменная дорога. Остальные региональные тракты и местные пути проходят через леса, долины и перевалы.</div>
            <div className="place-list">{cities.map(c=><button className="place-row" key={c.name} onClick={()=>setActivePlace({...c,kind:"city"})}><span className="place-symbol">✦</span>{c.name}<span>›</span></button>)}</div>
            <button className="back-button wide" onClick={()=>setDetailView(false)}>← К увеличенному фрагменту мировой карты</button>
          </>}
        </> : regionView ? <>
          <div className="region-banner"><span className="eyebrow">ВТОРОЙ УРОВЕНЬ АТЛАСА</span><strong>Обзор территории Теократии</strong><p>Это увеличенный фрагмент исходной мировой карты: расположение гор, лесов, рек и долин не меняется.</p></div>
          <div className="crest">☼</div><div className="eyebrow">ГОСУДАРСТВО</div><h2>Теократия Красной Розы</h2>
          <p>Откройте подробную карту, чтобы увидеть города, деревни, крепости и дороги.</p>
          <button className="city-card" onClick={()=>setDetailView(true)}><span className="city-symbol">⌖</span><span><small>СЛЕДУЮЩИЙ УРОВЕНЬ</small><strong>Подробная карта местности</strong><em>Города, деревни и крепости</em></span><b>→</b></button>
          <button className="back-button wide" onClick={backToWorld}>← Ко всему миру</button>
        </> : selected ? <>
          <div className="crest">☼</div><div className="eyebrow">ГОСУДАРСТВО</div><h2>Теократия Красной Розы</h2>
          <p className="official">Официальное название: Теократия Святого Восхода</p>
          <blockquote>«Через веру — к очищению. Через жертву — к спасению».</blockquote>
          <div className="facts">
            <div><small>Столица</small><strong>Ауренхельм</strong></div>
            <div><small>Форма правления</small><strong>Верховный Иерарх и Священный Синод</strong></div>
            <div><small>Государственная вера</small><strong>Единый Свет</strong></div>
            <div><small>Символ</small><strong>Солнце, выступающее из-за гор</strong></div>
            <div><small>Основные цвета</small><strong>Белый · золотой · алый · серебряный</strong></div>
          </div>
          <button className="city-card" onClick={openRegion}><span className="city-symbol">✦</span><span><small>ВТОРОЙ УРОВЕНЬ</small><strong>Открыть регион</strong><em>Увеличенный фрагмент карты</em></span><b>→</b></button>
          <details open><summary>Вера и религия</summary><p>Жители Теократии поклоняются Единому Свету, который, согласно священным преданиям, создал мир и установил естественный порядок вещей. Его присутствие символизирует восходящее солнце.</p></details>
          <details><summary>Отношение к магии</summary><p>Теократия крайне отрицательно относится к магии, колдовству и магическим артефактам. За соблюдением запретов следит Инквизиция Красной Розы.</p></details>
          <details><summary>Общество и повседневная жизнь</summary><p>Страна сравнительно благополучна. В городах действуют храмы, больницы, приюты и школы. Общество строго иерархично.</p></details>
          <details><summary>Земли, города и климат</summary><p>Многие населённые земли находятся у подножья высоких гор, в холодных долинах и хвойных лесах. В южных низинах климат мягче.</p></details>
          <details><summary>Экономика</summary><p>Основу экономики составляют земледелие, животноводство, горное дело, ремёсла и торговля.</p></details>
        </> : <>
          <div className="eyebrow">ПУТЕВОДИТЕЛЬ</div><h2>Изучайте известный мир</h2>
          <p>Выберите государство на карте, чтобы открыть его территорию и общедоступные сведения.</p>
          <div className="country-list">
            {["Медный Конклав","Империя Аквилон","Теократия Красной Розы","Вольные города","Архипелаг Серебряного Тумана","Легион Железного Порога","Орда Свободных Земель","Королевство Морт-Виль","Объединение Скьот"].map((name,i)=><button className={i===2?"country active":"country"} key={name} onClick={()=>i===2&&showCountry()}><span className="country-dot"></span>{name}<span className="country-arrow">›</span></button>)}
          </div>
          <div className="notice">Пока интерактивно подключена Теократия Красной Розы. Одинарное нажатие открывает карточку страны, двойное — увеличенный фрагмент региона.</div>
        </>}
      </aside>
    </main>
    <footer>АТЛАС ИЗВЕСТНОГО МИРА <span>·</span> Путеводитель для путешественников</footer>
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);
