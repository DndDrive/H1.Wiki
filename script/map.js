//!<(---- CANVAS SETTINGS ----)>
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//!<(---- MOUSE ----)>
let currentMousePos = { x: 0, y: 0 };

canvas.addEventListener("mousemove", (e) => {
        // Get mouse position relative to canvas
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Convert to map coordinates
        const mapX = ((mouseX - offsetX) / scale).toFixed(2);
        const mapY = ((mouseY - offsetY) / scale).toFixed(2);

        // If in distance mode and one point is selected, update current mouse position
        if (distanceMode && selectedLocations.length === 1) {
            currentMousePos.x = mapX;
            currentMousePos.y = mapY;
        }

        drawMap(); // Redraw the map to clear previous coordinates

        // Display mouse coordinates
        ctx.font = "16px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(`Cursor: (${mapX}, ${mapY})`, 230, canvas.height - 10);

    if (drag) {
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        drawMap();
    }
});

//!<(---- MAP ----)>
// Load the map image
const mapImage = new Image();
let MapNM = 1;
let selectedPointName = "";

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
    { name: "Le donjon de l'ordre des pierres du temps", x: 2802, y: 1216, radius: 10 }
   // { name: "Le Passage", x: 407, y: 2181, radius: 10 }
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

//Change the map based on the seleccted point
function updateMap() {
    if (selectedPointName === "Grandarbre") {
        MapNM = 2;
    } else if (selectedPointName === "Grosgras") {
        MapNM = 3;
    } else if (selectedPointName === "Le Passage") {
        if (MapNM == "1") {
        MapNM = 4;
        } else {
        MapNM = 1;
        }
    } else if (selectedPointName === "Les plaines de la joi" || selectedPointName === "La contrée désolée du nord") {
        MapNM = 1;
    }

    // Update map image and locations based on MapNM
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

// Initial map load
updateMap();

// Initial map position and scale
let scale = 0.3;
let offsetX = 100, offsetY = -300;
let drag = false, startX, startY;

let selectedLocations = []; // Store clicked locations for distance
let distanceMode = false;   // Toggle mode

// Function to draw the map and locations
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, offsetX, offsetY, mapImage.width * scale, mapImage.height * scale);

    // Draw interactive locations
    locations.forEach(loc => {
        const screenX = offsetX + loc.x * scale;
        const screenY = offsetY + loc.y * scale;

        // Draw location marker
        ctx.beginPath();
        ctx.arc(screenX, screenY, loc.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Draw text label
        ctx.font = `${30 * scale}px Arial`;
        ctx.fillStyle = "white";
        ctx.fillText(loc.name, screenX + 15, screenY);
    });

    if (distanceMode) {
        if (selectedLocations.length === 1) {
            // Draw dynamic line from the first selected point to the current mouse position
            drawDistanceLine(selectedLocations[0], currentMousePos);
        } else if (selectedLocations.length === 2) {
            // Draw fixed line between the two selected points
            drawDistanceLine(selectedLocations[0], selectedLocations[1]);
        }
    }

    // Show distance mode text
    if (distanceMode) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText("DISTANCE MODE (Press SPACE to exit)", 230, 90);
    }
}

//!<(---- DISTANCE MODE ----)>
// Calculate Euclidean distance
function calculateDistance(loc1, loc2) {
    const dx = loc2.x - loc1.x;
    const dy = loc2.y - loc1.y;
    const distancePixels = Math.sqrt(dx * dx + dy * dy);

    // Convert to world units (adjust conversionFactor if needed)
    const conversionFactor = 1;
    let mapMathRule;

    //* The math rule is the maths that will convert the units to miles.
    //*if not set right, the Island will not have the right size.
    // Switch mapMathRule based on the current map (MapNM)
    if (MapNM === 1) {
        mapMathRule = 21;
    } else if (MapNM === 2) {
        mapMathRule = 5.956;
    } else {
        mapMathRule = 5.956;
    }

    // Return distance adjusted by the mapMathRule
    return (distancePixels * conversionFactor / mapMathRule).toFixed(2);
}

// Draw line between two selected locations
function drawDistanceLine(loc1, loc2) {
    const screenX1 = offsetX + loc1.x * scale;
    const screenY1 = offsetY + loc1.y * scale;
    const screenX2 = offsetX + loc2.x * scale;
    const screenY2 = offsetY + loc2.y * scale;

    // Draw line
    ctx.beginPath();
    ctx.moveTo(screenX1, screenY1);
    ctx.lineTo(screenX2, screenY2);
    ctx.strokeStyle = "#a39c11";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    // Show distance text
    const midX = (screenX1 + screenX2) / 2;
    const midY = (screenY1 + screenY2) / 2;
    const distance = calculateDistance(loc1, loc2);

    // Define the units based on MapNM value
    let mapUnits;

    if (MapNM === 1) {
        mapUnits = "Milles";
    } else if (MapNM === 2) {
        mapUnits = "Pieds";
    } else {
        mapUnits = "Pieds";
    }

    // Combine the distance and mapUnits into the 'measurement' variable
    const measurement = `${distance} ${mapUnits}`;

    ctx.font = "18px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText(measurement, midX, midY);
}

let xKeyPressed = false; // To track whether the X key is currently pressed

// Detect when the X key is pressed
document.addEventListener("keydown", (e) => {
    if (e.key === "x") {
        xKeyPressed = true;
    }
});

// Detect when the X key is released
document.addEventListener("keyup", (e) => {
    if (e.key === "x") {
        xKeyPressed = false;
    }
});

//!<(---- KEYBINDS ----)>
// Handle clicking on locations
canvas.addEventListener("click", (e) => {
    if (!distanceMode || !xKeyPressed) return; // Ignore click if not in distance mode or X key is not pressed

    const clickX = (e.clientX - offsetX) / scale;
    const clickY = (e.clientY - offsetY) / scale;

    // Store the clicked position
    selectedLocations.push({ x: clickX, y: clickY });

    drawMap();
});

// Handle panning
canvas.addEventListener("mousedown", (e) => {
    drag = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
});

canvas.addEventListener("mousemove", (e) => {
    if (!drag) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    drawMap();
});
canvas.addEventListener("mouseup", () => { drag = false; });

// Handle zooming
canvas.addEventListener("wheel", (e) => {
    let zoomFactor = 1.1;
    let scaleAmount = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
    // Get mouse position relative to canvas
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    // Convert mouse position to map coordinates before zoom
    const mapX = (mouseX - offsetX) / scale;
    const mapY = (mouseY - offsetY) / scale;
    // Apply new scale
    scale *= scaleAmount;
    scale = Math.max(0.1, Math.min(scale, 3)); // Limit zoom levels
    // Adjust offsetX and offsetY to keep mouse centered
    offsetX = mouseX - mapX * scale;
    offsetY = mouseY - mapY * scale;
    drawMap();
});

// Handle spacebar toggle for distance mode
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        distanceMode = !distanceMode;
        selectedLocations = [];
        drawMap();
    }
});

// Click event to update selected point name
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    locations1.forEach(loc => {
        const dx = mouseX - loc.x;
        const dy = mouseY - loc.y;
        if (Math.sqrt(dx * dx + dy * dy) <= loc.radius) {
            selectedPointName = loc.name;
            console.log("Selected Point:", selectedPointName);
        }
    });
});

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    // Mouse position on canvas
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Convert to map coordinates (using your scale and offset)
    const mapX = (mouseX - offsetX) / scale;
    const mapY = (mouseY - offsetY) / scale;

    // Combine locations1, locations2, and locations3 into one array
    const allLocations = locations1.concat(locations2, locations3);

    allLocations.forEach(loc => {
        const dx = mapX - loc.x;
        const dy = mapY - loc.y;
        if (Math.sqrt(dx * dx + dy * dy) <= loc.radius && !distanceMode) {
            selectedPointName = loc.name;
            console.log("Selected Point:", selectedPointName);
            updateMap();
        }
    });
});

// Load the map and draw everything
mapImage.onload = drawMap;
