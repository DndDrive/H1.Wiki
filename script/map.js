//!<(---- CANVAS SETTINGS ----)>
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio || 1;
canvas.style.width  = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;
canvas.width  = window.innerWidth  * dpr;
canvas.height = window.innerHeight * dpr;
ctx.scale(dpr, dpr);

//!<(---- MOUSE ----)>
let currentMousePos = { x: 0, y: 0 };

// Variables globales
let scale = 0.3;
let offsetX = 100, offsetY = -300;
let drag = false, startX, startY;
let selectedLocations = [];
let distanceMode = false;
let xKeyPressed = false;
let locations = [];
let MapNM = 1;
let selectedPointName = "";

//!<(---- LOCATIONS ----)>
const locations1 = [
    { name: "Grandarbre", x: 2071, y: 2600, radius: 10 },
    { name: "Grandarbre, l'arbre des légendes", x: 2192, y: 2565, radius: 10 },
    { name: "Atelier de Gaspard", x: 2169, y: 2670, radius: 10 },
    { name: "La forteresse de Balaboo", x: 2406, y: 1988, radius: 10 },
    { name: "Le temple de l'esprit de nord", x: 2254, y: 1370, radius: 10 },
    { name: "Le palais des anciens", x: 1805, y: 1435, radius: 10 },
    { name: "Grosgras", x: 1790, y: 1510, radius: 10 },
    { name: "Petitîle", x: 1638, y: 1677, radius: 10 },
    { name: "Maisonette de Hilda", x: 1702, y: 1725, radius: 10 },
    { name: "Maison de Julien", x: 1727, y: 1749, radius: 10 },
    { name: "Maison de maitre Richard", x: 625, y: 2398, radius: 10 },
    { name: "Manoir de l'ogre", x: 1185, y: 1877, radius: 10 },
    { name: "Les ruines immegrées", x: 896, y: 1818, radius: 10 },
    { name: "La cabane de la sorcière", x: 767, y: 1617, radius: 10 },
    { name: "Les ruines de l'ancienes cité", x: 1924, y: 806, radius: 10 },
    { name: "La grotte des murmures", x: 2842, y: 690, radius: 10 },
    { name: "La maison sur le lac", x: 2803, y: 1038, radius: 10 },
    { name: "Le donjon de l'ordre des pierres du temps", x: 2802, y: 1216, radius: 10 },
    { name: "Le manoir de Splixcord le pliable", x: 413, y: 2347, radius: 10 },
    { name: "Le camp des inquisiteurs de l'ordre des liches", x: 1682, y: 2222, radius: 10 }
];

const locations2 = [
    { name: "Grandarbre", x: 786, y: 1267, radius: 50 },
    { name: "Forgeron", x: 1282, y: 1065, radius: 50 },
    { name: "Épicerie de Marc", x: 1383, y: 1302, radius: 50 },
    { name: "Le marché", x: 1619, y: 687, radius: 50 },
    { name: "Le temple de Chenillama", x: 1872, y: 808, radius: 50 },
    { name: "La maison du maire", x: 2208, y: 1320, radius: 50 },
    { name: "Les plaines de la joi", x: 380, y: 394, radius: 100 }
];

const locations3 = [
    { name: "La maison du maire", x: 784, y: 2235, radius: 50 },
    { name: "Forgeron", x: 1263, y: 1692, radius: 50 },
    { name: "Maison du sage", x: 1954, y: 1186, radius: 50 },
    { name: "La contrée désolée du nord", x: 428, y: 329, radius: 100 }
];

const locations4 = [
    { name: "Grandarbre", x: 2071, y: 2600, radius: 10 },
    { name: "La Ville des Boiseux", x: 2192, y: 2565, radius: 10 },
    { name: "La chambre de la douleur", x: 2169, y: 2670, radius: 10 },
    { name: "Petitîle", x: 1638, y: 1677, radius: 10 },
    { name: "Le Passage", x: 407, y: 2181, radius: 10 }
];

//!<(---- MAP ----)>
const mapImage = new Image();
mapImage.onload = drawMap; // S’assurer que le dessin ne se fait qu’après le chargement

function updateMap() {
    if (selectedPointName === "Grandarbre" && !distanceMode) {
        MapNM = 2;
    } else if (selectedPointName === "Grosgras" && !distanceMode) {
        MapNM = 3;
    } else if (selectedPointName === "Le Passage" && !distanceMode) {
        MapNM = MapNM === 1 ? 4 : 1;
    } else if (selectedPointName === "Les plaines de la joi" || selectedPointName === "La contrée désolée du nord" && !distanceMode) {
        MapNM = 1;
    }

    switch (MapNM) {
        case 1:
            mapImage.src = "Images/map.png";
            locations = locations1;
            break;
        case 2:
            mapImage.src = "Images/map2.png";
            locations = locations2;
            break;
        case 3:
            mapImage.src = "Images/map3.png";
            locations = locations3;
            break;
        case 4:
            mapImage.src = "Images/map4.png";
            locations = locations4;
            break;
    }
}
updateMap(); // Charger l’image et les points au démarrage

//!<(---- DESSIN ----)>
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, offsetX, offsetY, mapImage.width * scale, mapImage.height * scale);

    locations.forEach(loc => {
        const screenX = offsetX + loc.x * scale;
        const screenY = offsetY + loc.y * scale;

        ctx.beginPath();
        ctx.arc(screenX, screenY, loc.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        ctx.font = `${30 * scale}px Arial`;
        ctx.fillStyle = "white";
        ctx.fillText(loc.name, screenX + 15, screenY);
    });

    if (distanceMode) {
        if (selectedLocations.length === 1) {
            drawDistanceLine(selectedLocations[0], currentMousePos);
        } else if (selectedLocations.length === 2) {
            drawDistanceLine(selectedLocations[0], selectedLocations[1]);
        }

        ctx.font = "20px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText("Calcul de distances", 230, 90);
    }
}

//!<(---- DISTANCE MODE ----)>
function calculateDistance(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const pixels = Math.hypot(dx, dy);
    const rule = (MapNM === 1 ? 21 : 5.956);
    return (pixels / rule).toFixed(2);
}

function drawDistanceLine(loc1, loc2) {
    const screenX1 = offsetX + loc1.x * scale;
    const screenY1 = offsetY + loc1.y * scale;
    const screenX2 = offsetX + loc2.x * scale;
    const screenY2 = offsetY + loc2.y * scale;

    ctx.beginPath();
    ctx.moveTo(screenX1, screenY1);
    ctx.lineTo(screenX2, screenY2);
    ctx.strokeStyle = "#a39c11";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    const midX = (screenX1 + screenX2) / 2;
    const midY = (screenY1 + screenY2) / 2;
    const distance = calculateDistance(loc1, loc2);

    let mapUnits = (MapNM === 1) ? "Milles" : "Pieds";
    const measurement = `${distance} ${mapUnits}`;

    ctx.font = "18px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText(measurement, midX, midY);
}

//!<(---- INTERACTIONS ----)>
canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;

    const mapX = ((cssX - offsetX) / scale).toFixed(2);
    const mapY = ((cssY - offsetY) / scale).toFixed(2);

    if (distanceMode && selectedLocations.length === 1) {
        currentMousePos.x = mapX;
        currentMousePos.y = mapY;
    }

    drawMap();

    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Cursor: (${Math.floor(mapX)}, ${Math.floor(mapY)})`, 230, canvas.height - 10);

    if (drag) {
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        drawMap();
    }
});

canvas.addEventListener("click", event => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const mapX = (mouseX - offsetX) / scale;
    const mapY = (mouseY - offsetY) / scale;

    const allLocations = locations1.concat(locations2, locations3);

    allLocations.forEach(loc => {
        const dx = mapX - loc.x;
        const dy = mapY - loc.y;
        if (Math.sqrt(dx * dx + dy * dy) <= loc.radius) {
            selectedPointName = loc.name;
            console.log("Selected Point:", selectedPointName);
            updateMap();
        }
    });

    if (distanceMode && xKeyPressed) {
        selectedLocations.push({ x: mapX, y: mapY });
        drawMap();
    }
});

canvas.addEventListener("mousedown", e => {
    drag = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
});
canvas.addEventListener("mouseup", () => { drag = false; });

canvas.addEventListener("wheel", e => {
    let zoomFactor = 1.1;
    let scaleAmount = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const mapX = (mouseX - offsetX) / scale;
    const mapY = (mouseY - offsetY) / scale;

    scale *= scaleAmount;
    scale = Math.max(0.1, Math.min(scale, 3));

    offsetX = mouseX - mapX * scale;
    offsetY = mouseY - mapY * scale;

    drawMap();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "x") xKeyPressed = true;
    if (e.code === "Space") {
        distanceMode = !distanceMode;
        selectedLocations = [];
        drawMap();
    }
});
document.addEventListener("keyup", (e) => {
    if (e.key === "x") xKeyPressed = false;
});

