// Initialize Map
// Centered on Mauritius
const map = L.map('map').setView([-20.2, 57.5], 10);

// Add Dark Mode Base Layer (CartoDB Dark Matter)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// --- CSR Data Layers (Quantitative) ---

// --- CSR Data Layers (Quantitative) ---

// Poches de Pauvreté (Poverty Pockets)
const povertyZones = [
    {
        name: "Résidence La Cure",
        desc: "Zone urbaine vulnérable",
        stats: "1,250 foyers précaires",
        coords: [[-20.142, 57.520], [-20.142, 57.530], [-20.150, 57.530], [-20.150, 57.520]]
    },
    {
        name: "Roche Bois",
        desc: "Forte densité, précarité",
        stats: "Rev. moyen < 15k MUR",
        coords: [[-20.135, 57.490], [-20.135, 57.505], [-20.145, 57.505], [-20.145, 57.490]]
    },
    {
        name: "Poste de Flacq",
        desc: "Communauté côtière vulnérable",
        stats: "Tx chômage: 12%",
        coords: [[-20.160, 57.725], [-20.160, 57.735], [-20.170, 57.735], [-20.170, 57.725]]
    },
    {
        name: "Le Morne Village",
        desc: "Isolement géographique",
        stats: "Accès services: Faible",
        coords: [[-20.440, 57.330], [-20.440, 57.340], [-20.450, 57.340], [-20.450, 57.330]]
    },
    {
        name: "Cité Tole (Mahebourg)",
        desc: "Habitat précaire",
        stats: "Logements tôle: 85%",
        coords: [[-20.410, 57.690], [-20.410, 57.700], [-20.420, 57.700], [-20.420, 57.690]]
    },
    {
        name: "Bambous",
        desc: "Poches de pauvreté identifiées",
        stats: "Densité: 2500 hab/km²",
        coords: [[-20.240, 57.395], [-20.240, 57.415], [-20.255, 57.415], [-20.255, 57.395]]
    },
    {
        name: "Chemin Grenier",
        desc: "Vulnérabilité sociale Sud",
        stats: "Foyers aidés: 450+",
        coords: [[-20.485, 57.455], [-20.485, 57.470], [-20.495, 57.470], [-20.495, 57.455]]
    }
];

// Flood Prone Areas (Zones Inondables)
const floodZones = [
    {
        name: "Port Louis (Canal Dayot)",
        risk: "Risque Crues Éclair",
        stats: "Débit max: 120 m³/s",
        coords: [[-20.160, 57.480], [-20.160, 57.510], [-20.180, 57.510], [-20.180, 57.480]]
    },
    {
        name: "Fond du Sac / Cottage",
        risk: "Accumulation d'eau",
        stats: "Inondations > 0.5m",
        coords: [[-20.040, 57.580], [-20.040, 57.610], [-20.070, 57.610], [-20.070, 57.580]]
    },
    {
        name: "Souillac",
        risk: "Débordement Rivière",
        stats: "Fréquence: 1x/2 ans",
        coords: [[-20.510, 57.510], [-20.510, 57.530], [-20.530, 57.530], [-20.530, 57.510]]
    }
];

// Coastal Risks (Erosion & Submersion)
const coastalRisks = [
    {
        name: "Trou aux Biches",
        risk: "Érosion Côtière",
        stats: "Recul: 0.4m/an",
        coords: [[-20.030, 57.545], [-20.030, 57.560], [-20.050, 57.560], [-20.050, 57.545]]
    },
    {
        name: "Flic en Flac",
        risk: "Pression Anthropique",
        stats: "Perte plage: 12%",
        coords: [[-20.270, 57.360], [-20.270, 57.375], [-20.300, 57.375], [-20.300, 57.360]]
    },
    {
        name: "Anse La Raie",
        risk: "Submersion Marine",
        stats: "Cote: +1.5m IGN",
        coords: [[-19.990, 57.620], [-19.990, 57.640], [-20.005, 57.640], [-20.005, 57.620]]
    }
];

// Renewable Energy (Solar Farms)
const greenEnergy = [
    { name: "Ferme Solaire SARAKO", loc: "Bambous", stats: "15 MW", coords: [-20.262, 57.432] },
    { name: "Ferme Solaire Henrietta", loc: "Vacoas", stats: "2 MW", coords: [-20.354, 57.579] },
    { name: "Projet Qair", loc: "Trou d'Eau Douce", stats: "En développement", coords: [-20.242, 57.786] },
    { name: "Projet Qair", loc: "Balaclava", stats: "Solaire PV", coords: [-20.083, 57.516] },
    { name: "Ferme Rivière des Anguilles", loc: "Sud", stats: "Projet Pilote", coords: [-20.485, 57.551] }
];

// Historical Floods (Events)
const historicalFloods = [
    { name: "Inondations Meurtrières 2013", loc: "Port Louis", date: "30 Mars 2013", stats: "11 Victimes, 152mm pluie", coords: [-20.162, 57.499] },
    { name: "Flash Flood 2021", loc: "Bambous Virieux", date: "Avril 2021", stats: "Dégâts matériels majeurs", coords: [-20.345, 57.755] },
    { name: "Inondations Plaine Magnien", loc: "Sud-Est", date: "2022", stats: "Perturbation aéroport", coords: [-20.433, 57.633] }
];

// --- Layer Groups ---

const povertyLayer = L.layerGroup();
const floodLayer = L.layerGroup();
const coastalLayer = L.layerGroup();
const greenLayer = L.layerGroup();
const historyLayer = L.layerGroup();

// Populate Poverty Layer
povertyZones.forEach(zone => {
    const polygon = L.polygon(zone.coords, {
        color: '#f97316',
        fillColor: '#f97316',
        fillOpacity: 0.6,
        weight: 2
    });
    polygon.bindPopup(`<b>${zone.name}</b><br>${zone.desc}<br><em>${zone.stats}</em>`);
    povertyLayer.addLayer(polygon);
});

// Populate Flood Layer
floodZones.forEach(zone => {
    const polygon = L.polygon(zone.coords, {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.4,
        weight: 0
    });
    polygon.bindPopup(`<b>${zone.name}</b><br>${zone.risk}<br><em>${zone.stats}</em>`);
    floodLayer.addLayer(polygon);
});

// Populate Coastal Layer
coastalRisks.forEach(zone => {
    const polygon = L.polygon(zone.coords, {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.4,
        weight: 0
    });
    polygon.bindPopup(`<b>${zone.name}</b><br>${zone.risk}<br><em>${zone.stats}</em>`);
    coastalLayer.addLayer(polygon);
});

// Populate Green Energy Layer (Green Markers)
greenEnergy.forEach(site => {
    const marker = L.circleMarker(site.coords, {
        radius: 6,
        fillColor: '#10b981', // Emerald-500
        color: '#fff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    });
    marker.bindPopup(`<b>${site.name}</b><br>${site.loc}<br><em>${site.stats}</em>`);
    greenLayer.addLayer(marker);
});

// Populate Historical Floods Layer (Purple Markers)
historicalFloods.forEach(event => {
    const marker = L.circleMarker(event.coords, {
        radius: 6,
        fillColor: '#8b5cf6', // Violet-500
        color: '#fff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    });
    marker.bindPopup(`<b>${event.name}</b><br>${event.date}<br><em>${event.stats}</em>`);
    historyLayer.addLayer(marker);
});

// Add layers to map by default
povertyLayer.addTo(map);
floodLayer.addTo(map);
coastalLayer.addTo(map);
greenLayer.addTo(map);
historyLayer.addTo(map);

// --- Event Listeners for Toggles ---

document.getElementById('layer-poverty').addEventListener('change', function (e) {
    if (e.target.checked) {
        map.addLayer(povertyLayer);
    } else {
        map.removeLayer(povertyLayer);
    }
});

document.getElementById('layer-flood').addEventListener('change', function (e) {
    if (e.target.checked) {
        map.addLayer(floodLayer);
    } else {
        map.removeLayer(floodLayer);
    }
});

document.getElementById('layer-coastal').addEventListener('change', function (e) {
    if (e.target.checked) {
        map.addLayer(coastalLayer);
    } else {
        map.removeLayer(coastalLayer);
    }
});

document.getElementById('layer-green').addEventListener('change', function (e) {
    if (e.target.checked) {
        map.addLayer(greenLayer);
    } else {
        map.removeLayer(greenLayer);
    }
});

document.getElementById('layer-history').addEventListener('change', function (e) {
    if (e.target.checked) {
        map.addLayer(historyLayer);
    } else {
        map.removeLayer(historyLayer);
    }
});

// --- Charts (Chart.js) & Analysis ---

Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

// Analysis Panel Logic
const analysisPanel = document.getElementById('analysis-panel');
const analysisTitle = document.getElementById('analysis-title');
const analysisText = document.getElementById('analysis-text');
const closeAnalysis = document.getElementById('close-analysis');

closeAnalysis.addEventListener('click', () => {
    analysisPanel.classList.add('hidden');
});

function showAnalysis(title, text) {
    analysisTitle.innerText = title;
    analysisText.innerHTML = text;
    analysisPanel.classList.remove('hidden');
}

// Poverty Chart
const ctxPoverty = document.getElementById('povertyChart').getContext('2d');
const povertyChart = new Chart(ctxPoverty, {
    type: 'doughnut',
    data: {
        labels: ['Rodrigues', 'Port Louis', 'Plaines Wilhems', 'Rural Nord/Est', 'Rural Sud'],
        datasets: [{
            label: 'Distribution Pauvreté Relative',
            data: [40, 25, 10, 15, 10],
            backgroundColor: ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 } } },
            title: { display: true, text: 'Vulnérabilité par Région (%)' }
        }
    }
});

// Flood Chart
const ctxFlood = document.getElementById('floodChart').getContext('2d');
const floodChart = new Chart(ctxFlood, {
    type: 'bar',
    data: {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [{
            label: 'Événements Inondation Majeurs',
            data: [2, 3, 1, 4, 3, 5],
            backgroundColor: '#3b82f6',
            borderRadius: 4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Fréquence Inondations (Tendance)' }
        },
        scales: { y: { beginAtZero: true } }
    }
});

// --- Unified Click Listeners for All Dashboard Elements ---

// 1. Poverty Chart Click
document.getElementById('povertyChart').parentElement.addEventListener('click', () => {
    showAnalysis(
        "Disparités Régionales",
        "Une forte concentration de la pauvreté relative est observée à Rodrigues (40%) et dans les faubourgs de Port-Louis (25%).<br><br>Cette distribution reflète une <i>ségrégation spatiale</i> marquée. L'indice de Gini à Maurice (0.40) masque des inégalités territoriales profondes. La vulnérabilité à Rodrigues est structurelle (isolement, économie de subsistance), tandis qu'à Port-Louis, elle est liée à l'urbanisation rapide et à la précarité de l'emploi informel."
    );
});

// 2. Flood Chart Click
document.getElementById('floodChart').parentElement.addEventListener('click', () => {
    showAnalysis(
        "Intensification Hydrologique",
        "On note une tendance haussière des événements d'inondation majeurs (passant de 2 à 5 par an en 5 ans).<br><br>Cette augmentation est corrélée à deux facteurs : l'imperméabilisation des sols due à l'artificialisation (<i>Urban Sprawl</i>) et l'intensification des précipitations extrêmes liée au changement climatique. Le système de drainage actuel, conçu pour des périodes de retour décennales, est désormais obsolète face à des épisodes de pluies torrentielles (>100mm/24h) de plus en plus fréquents."
    );
});

// 3. Poverty Stat Card Click
document.getElementById('stat-poverty').addEventListener('click', () => {
    showAnalysis(
        "Poches de Pauvreté",
        "229 Poches de Pauvreté identifiées.<br><br>Ce chiffre provient du registre social de Maurice (SRM). Il désigne les zones où la concentration de ménages éligibles aux aides sociales est la plus forte. Ces zones cumulent souvent des risques sociaux (chômage) et environnementaux (inondations, insalubrité)."
    );
});

// 4. Flood Stat Card Click
document.getElementById('stat-flood').addEventListener('click', () => {
    showAnalysis(
        "Statistique : Zones Inondables",
        "<b>Chiffre Clé :</b> 306 Zones à Risque (LDA).<br><br><b>Contexte :</b> La <i>Land Drainage Authority</i> a cartographié ces zones prioritaires. Elles incluent les zones de débordement de rivières, les zones d'accumulation d'eau (cuvettes) et les zones sujettes aux crues éclairs (Flash Floods). 25% de ces zones sont situées en milieu urbain dense."
    );
});

// 5. Green Energy Stat Card Click
document.getElementById('stat-green').addEventListener('click', () => {
    showAnalysis(
        "Statistique : Énergie Verte",
        "<b>Chiffre Clé :</b> 8+ Projets Solaires Majeurs.<br><br><b>Contexte :</b> Maurice vise 60% d'énergie renouvelable d'ici 2030. Les fermes solaires (comme SARAKO à Bambous) et les projets distribués (Qair) sont essentiels pour réduire la dépendance aux énergies fossiles importées et atténuer l'empreinte carbone nationale."
    );
});

// 6. History Stat Card Click
document.getElementById('stat-history').addEventListener('click', () => {
    showAnalysis(
        "Statistique : Historique Crues",
        "<b>Événement Marquant :</b> 30 Mars 2013.<br><br><b>Contexte :</b> Les inondations meurtrières de Port-Louis (11 victimes) ont marqué un tournant dans la conscience du risque climatique à Maurice. Elles ont révélé la vulnérabilité des infrastructures urbaines face aux pluies torrentielles (>150mm en 2h), un phénomène qui s'intensifie avec le changement climatique."
    );
});
