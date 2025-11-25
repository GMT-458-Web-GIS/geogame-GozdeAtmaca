let map, markerLayer;
let score = 0;
let timeLeft = 60;
let timerInterval;
let currentCountry = null;
let gameStarted = false; 

const countries = [
    
    { name: "France", coords: [2.3522, 48.8566], flag: "https://flagcdn.com/fr.svg", region: "europe" }, 
    { name: "Germany", coords: [13.4050, 52.5200], flag: "https://flagcdn.com/de.svg", region: "europe" }, 
    { name: "Italy", coords: [12.4964, 41.9028], flag: "https://flagcdn.com/it.svg", region: "europe" },
    { name: "Russia", coords: [37.6173, 55.7558], flag: "https://flagcdn.com/ru.svg", region: "europe" }, 
    { name: "Spain", coords: [-3.7038, 40.4168], flag: "https://flagcdn.com/es.svg", region: "europe" }, 
    { name: "Greece", coords: [23.7275, 37.9838], flag: "https://flagcdn.com/gr.svg", region: "europe" }, 
    { name: "Portugal", coords: [-9.1393, 38.7223], flag: "https://flagcdn.com/pt.svg", region: "europe" },
    { name: "United Kingdom", coords: [-0.1278, 51.5074], flag: "https://flagcdn.com/gb.svg", region: "europe" }, 
    { name: "Sweden", coords: [18.0686, 59.3293], flag: "https://flagcdn.com/se.svg", region: "europe" }, 
    { name: "Netherlands", coords: [4.8952, 52.3702], flag: "https://flagcdn.com/nl.svg", region: "europe" }, 
    { name: "Turkey", coords: [32.8597, 39.9334], flag: "https://flagcdn.com/tr.svg", region: "asia" },
    { name: "Japan", coords: [139.6917, 35.6895], flag: "https://flagcdn.com/jp.svg", region: "asia" },
    { name: "India", coords: [77.2090, 28.6139], flag: "https://flagcdn.com/in.svg", region: "asia" }, 
    { name: "China", coords: [116.3975, 39.9042], flag: "https://flagcdn.com/cn.svg", region: "asia" },
    { name: "South Korea", coords: [126.9780, 37.5665], flag: "https://flagcdn.com/kr.svg", region: "asia" }, 
    { name: "Indonesia", coords: [106.8456, -6.2088], flag: "https://flagcdn.com/id.svg", region: "asia" }, 
    { name: "Thailand", coords: [100.5018, 13.7563], flag: "https://flagcdn.com/th.svg", region: "asia" }, 
    { name: "Saudi Arabia", coords: [46.7219, 24.7136], flag: "https://flagcdn.com/sa.svg", region: "asia" },
    { name: "Vietnam", coords: [105.8342, 21.0278], flag: "https://flagcdn.com/vn.svg", region: "asia" }, 
    { name: "Kazakhstan", coords: [71.4704, 51.1694], flag: "https://flagcdn.com/kz.svg", region: "asia" },
    { name: "Brazil", coords: [-47.8825, -15.7942], flag: "https://flagcdn.com/br.svg", region: "america" }, 
    { name: "Canada", coords: [-75.6972, 45.4215], flag: "https://flagcdn.com/ca.svg", region: "america" }, 
    { name: "Mexico", coords: [-99.1332, 19.4326], flag: "https://flagcdn.com/mx.svg", region: "america" },
    { name: "United States", coords: [-77.0369, 38.9072], flag: "https://flagcdn.com/us.svg", region: "america" }, 
    { name: "Argentina", coords: [-58.3816, -34.6037], flag: "https://flagcdn.com/ar.svg", region: "america" }, 
    { name: "Peru", coords: [-77.0428, -12.0464], flag: "https://flagcdn.com/pe.svg", region: "america" }, 
    { name: "Chile", coords: [-70.6693, -33.4489], flag: "https://flagcdn.com/cl.svg", region: "america" },
    { name: "Cuba", coords: [-82.3590, 23.1136], flag: "https://flagcdn.com/cu.svg", region: "america" }, 
    { name: "Venezuela", coords: [-66.9036, 10.4806], flag: "https://flagcdn.com/ve.svg", region: "america" }, 
    { name: "Egypt", coords: [31.2357, 30.0444], flag: "https://flagcdn.com/eg.svg", region: "africa" }, 
    { name: "South Africa", coords: [28.0473, -26.2041], flag: "https://flagcdn.com/za.svg", region: "africa" },
    { name: "Nigeria", coords: [7.4913, 9.0579], flag: "https://flagcdn.com/ng.svg", region: "africa" },
    { name: "Kenya", coords: [36.8219, -1.2921], flag: "https://flagcdn.com/ke.svg", region: "africa" }, 
    { name: "Morocco", coords: [-6.8437, 34.0150], flag: "https://flagcdn.com/ma.svg", region: "africa" }, 
    { name: "Madagascar", coords: [47.50, -18.91], flag: "https://flagcdn.com/mg.svg", region: "africa" }, 
    { name: "Australia", coords: [149.1300, -35.2809], flag: "https://flagcdn.com/au.svg", region: "oceania" }, 
    { name: "New Zealand", coords: [174.7633, -41.2865], flag: "https://flagcdn.com/nz.svg", region: "oceania" },
];


const regionViews = {
    europe: [[15, 50], 4],
    asia: [[100, 40], 3],
    africa: [[20, 0], 3],
    america: [[-100, 30], 3],
    oceania: [[150, -20], 3],
    all: [[0, 20], 2]
};


function initMap() {
    markerLayer = new ol.layer.Vector({ source: new ol.source.Vector() });

    map = new ol.Map({
        target: "map",
        layers: [
            
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
                }),
            }),
            markerLayer,
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 20]),
            zoom: 2,
        }),
    });

    map.on("click", handleClick);
}


function focusOnRegion(regionKey) {
    const viewData = regionViews[regionKey];
    if (!viewData) return;
    
    const [lonLat, zoom] = viewData;
    const center = ol.proj.fromLonLat(lonLat);
    
    map.getView().animate({
        center: center,
        zoom: zoom,
        duration: 800
    });
}

function startGame() {
    if (gameStarted) { 
        clearInterval(timerInterval);
        gameStarted = false;
    }
    
    gameStarted = true;
    score = 0;
    timeLeft = 90;
    document.getElementById("startBtn").textContent = "Restart Game"; 

    markerLayer.getSource().clear();

   
    focusOnRegion(document.getElementById("regionSelect").value);

    updateUI();
    nextFlag();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateUI();
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function updateUI() {
    document.getElementById("score").textContent = score;
    document.getElementById("timerText").textContent = timeLeft;
    
    const percentage = (timeLeft / 90) * 100;
    const timerBar = document.getElementById("timerBar");

    timerBar.style.width = percentage + "%";
    
    if (percentage > 40) {
        timerBar.style.backgroundColor = "#4caf50"; 
    } else if (percentage > 15) {
        timerBar.style.backgroundColor = "#ffc107"; 
    } else {
        timerBar.style.backgroundColor = "#dc3545"; 
    }
}

function nextFlag() {
    markerLayer.getSource().clear(); 

    const selectedRegion = document.getElementById("regionSelect").value;
    
    let filtered = selectedRegion === "all"
        ? countries
        : countries.filter(c => c.region === selectedRegion);

    if (filtered.length === 0) {
          currentCountry = null;
          document.getElementById("flag").src = "";
          return; 
    }

    currentCountry = filtered[Math.floor(Math.random() * filtered.length)];
    document.getElementById("flag").src = currentCountry.flag;

    // Flag Box
    const flagBox = document.getElementById("flag-box");
    flagBox.classList.remove("animate");
    void flagBox.offsetWidth; 
    flagBox.classList.add("animate");
}

function handleClick(event) {
    if (!currentCountry || timeLeft <= 0 || !gameStarted) return;

    const clickedCoord = ol.proj.toLonLat(event.coordinate);
    
    const distance = ol.sphere.getDistance(clickedCoord, currentCountry.coords);

   
    addMarker(clickedCoord, "red");  
    addMarker(currentCountry.coords, "blue"); 

    if (distance < 500000) { 
        score += 10;
        alert(`Correct! That was ${currentCountry.name}. You earned 10 points.`);
    } else {
        timeLeft = Math.max(0, timeLeft - 5);
        alert(`Wrong! The correct answer was ${currentCountry.name}. You lost 5 seconds.`);
    }

    updateUI();
    setTimeout(nextFlag, 2000);
}

function addMarker(lonLat, color) {
    const point = new ol.geom.Point(ol.proj.fromLonLat(lonLat));
    const feature = new ol.Feature(point);

    feature.setStyle(
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({ color: color }),
                stroke: new ol.style.Stroke({ color: 'white', width: 2 })
            })
        })
    );
    markerLayer.getSource().addFeature(feature);
}

function endGame() {
    clearInterval(timerInterval);
    gameStarted = false;
    document.getElementById("startBtn").textContent = "Play Again";
    alert(`Time's up! Final Score: ${score}`);
}


document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("regionSelect").addEventListener("change", (e) => {
    focusOnRegion(e.target.value);
});

initMap();