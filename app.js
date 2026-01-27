const map = L.map('map').setView([-20.2, 57.5], 10);
window.map = map; // Debugging
console.log("Map initialized:", map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);





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



const greenEnergy = [
    { name: "Ferme Solaire SARAKO", loc: "Bambous", stats: "15 MW", coords: [-20.262, 57.432] },
    { name: "Ferme Solaire Henrietta", loc: "Henrietta", stats: "2 MW", coords: [-20.354, 57.579] },
    { name: "Projet Qair", loc: "Trou d'Eau Douce", stats: "En développement", coords: [-20.242, 57.786] },
    { name: "Projet Qair", loc: "Balaclava", stats: "Solaire PV", coords: [-20.083, 57.516] },
    { name: "Ferme Rivière des Anguilles", loc: "Sud", stats: "Projet Pilote", coords: [-20.485, 57.551] }
];



const historicalFloods = [
    { name: "Inondations Meurtrières 2013", loc: "Port Louis", date: "30 Mars 2013", stats: "11 Victimes, 150mm/2h", coords: [-20.162, 57.499] },
    { name: "Flash Flood 2021", loc: "Bambous Virieux", date: "Avril 2021", stats: "408mm pluie, 9 évacués", coords: [-20.345, 57.755] },
    { name: "Inondations Plaine Magnien", loc: "Sud-Est", date: "2022", stats: "Perturbation aéroport", coords: [-20.433, 57.633] }
];

// --- DATASETS (Sample Data) ---

// Santé & Social
const healthData = [
    { name: "Hôpital Dr Jeetoo", type: "Hôpital Public", loc: "Port Louis", coords: [-20.163, 57.498] },
    { name: "Victoria Hospital (Candos)", type: "Hôpital Public", loc: "Quatre Bornes", coords: [-20.2783, 57.4765] },
    { name: "SSR National Hospital", type: "Hôpital Public", loc: "Pamplemousses", coords: [-20.1039, 57.5703] },
    { name: "Jawaharlal Nehru Hospital", type: "Hôpital Public", loc: "Rose Belle", coords: [-20.4046, 57.5930] },
    { name: "Flacq Hospital", type: "Hôpital Public", loc: "Centre de Flacq", coords: [-20.1922, 57.7192] },
    { name: "Wellkin Hospital", type: "Clinique Privée", loc: "Moka", coords: [-20.224, 57.514] },
    { name: "Clinique Darné", type: "Clinique Privée", loc: "Floreal", coords: [-20.3112, 57.5072] },
    { name: "Super Pharm", type: "Pharmacie", loc: "Rose Hill", coords: [-20.244, 57.476], cat: "pharmacy" },
    { name: "MedActiv Pharmacy", type: "Pharmacie", loc: "Bagatelle", coords: [-20.225, 57.496], cat: "pharmacy" },
    { name: "Pharmacie St Jean", type: "Pharmacie", loc: "Quatre Bornes", coords: [-20.264, 57.480], cat: "pharmacy" },
    { name: "Centre Social de Bambous", type: "Centre Social", loc: "Bambous", coords: [-20.258, 57.405], cat: "social" },
    { name: "Centre Social de Roche Bois", type: "Centre Social", loc: "Roche Bois", coords: [-20.145, 57.505], cat: "social" },
    { name: "Centre Social de Grand Baie", type: "Centre Social", loc: "Grand Baie", coords: [-20.008, 57.582], cat: "social" }
];

// Sécurité
const securityData = [
    { name: "Caserne Centrale", type: "Police", loc: "Port Louis", coords: [-20.165, 57.503], cat: "emergency" },
    { name: "Poste de Police", type: "Police", loc: "Rose Hill", coords: [-20.242, 57.474], cat: "emergency" },
    { name: "Poste de Police", type: "Police", loc: "Grand Baie", coords: [-20.010, 57.580], cat: "emergency" },
    { name: "Pompiers Coromandel", type: "Pompiers", loc: "Coromandel", coords: [-20.185, 57.470], cat: "emergency" },
    { name: "Pompiers Quatre Bornes", type: "Pompiers", loc: "Quatre Bornes", coords: [-20.265, 57.480], cat: "emergency" },
    { name: "Camera M1", type: "Radar Vitesse", loc: "Pailles", coords: [-20.190, 57.490], cat: "camera" },
    { name: "Camera M2", type: "Radar Vitesse", loc: "Pamplemousses", coords: [-20.100, 57.570], cat: "camera" },
    { name: "Camera Phoenix", type: "Radar Vitesse", loc: "Phoenix", coords: [-20.295, 57.500], cat: "camera" },
    { name: "Plage Flic en Flac", type: "Baignade Dangereuse", loc: "Passe Sud", coords: [-20.290, 57.362], cat: "danger" },
    { name: "Le Morne", type: "Baignade Dangereuse", loc: "Courants forts", coords: [-20.460, 57.310], cat: "danger" },
    { name: "Gris Gris", type: "Baignade Dangereuse", loc: "Falasies", coords: [-20.520, 57.530], cat: "danger" }
];

// Transport (Bus/Metro/Poste/Essence)
const metroStations = [
    { name: "Port Louis Victoria", type: "Metro Station", loc: "Port Louis", coords: [-20.164, 57.500] },
    { name: "Beau Bassin", type: "Metro Station", loc: "Beau Bassin", coords: [-20.226, 57.472] },
    { name: "Rose Hill Central", type: "Metro Station", loc: "Rose Hill", coords: [-20.242, 57.474] },
    { name: "Quatre Bornes Central", type: "Metro Station", loc: "Quatre Bornes", coords: [-20.265, 57.479] },
    { name: "Phoenix Mall Station", type: "Metro Station", loc: "Phoenix", coords: [-20.279, 57.496] },
    { name: "Vacoas Central", type: "Metro Station", loc: "Vacoas", coords: [-20.297, 57.496] },
    { name: "Curepipe Central", type: "Metro Station", loc: "Curepipe", coords: [-20.319, 57.524] },
    { name: "Réduit (Mahatma Gandhi)", type: "Metro Station", loc: "Réduit", coords: [-20.232, 57.497] },
    { name: "Cybercity Ebene", type: "Metro Station", loc: "Ebene", coords: [-20.243, 57.490] }
];
const metroLine = [
    [-20.164, 57.500], [-20.190, 57.480], [-20.226, 57.472], [-20.242, 57.474], [-20.265, 57.479],
    [-20.279, 57.496], [-20.297, 57.496], [-20.319, 57.524]
];

const busData = [
    { name: "Gare du Nord", type: "Gare Routière", loc: "Port Louis", coords: [-20.160, 57.505] },
    { name: "Gare Victoria", type: "Gare Routière", loc: "Port Louis", coords: [-20.164, 57.499] },
    { name: "Gare de Rose Hill", type: "Gare Routière", loc: "Rose Hill", coords: [-20.240, 57.472] },
    { name: "Gare de Quatre Bornes", type: "Gare Routière", loc: "Quatre Bornes", coords: [-20.263, 57.479] },
    { name: "Gare de Vacoas", type: "Gare Routière", loc: "Vacoas", coords: [-20.295, 57.495] },
    { name: "Gare Jan Palach", type: "Gare Routière", loc: "Curepipe", coords: [-20.318, 57.523] },
    { name: "Gare de Flacq", type: "Gare Routière", loc: "Flacq", coords: [-20.190, 57.714] },
    { name: "Gare de Mahébourg", type: "Gare Routière", loc: "Mahébourg", coords: [-20.407, 57.702] }
];

const transportMiscData = [
    { name: "Poste Centrale", type: "Poste", loc: "Port Louis", coords: [-20.162, 57.501], cat: "post" },
    { name: "Poste Rose Hill", type: "Poste", loc: "Rose Hill", coords: [-20.240, 57.475], cat: "post" },
    { name: "Poste Curepipe", type: "Poste", loc: "Curepipe", coords: [-20.320, 57.522], cat: "post" },
    { name: "Poste Flacq", type: "Poste", loc: "Flacq", coords: [-20.192, 57.715], cat: "post" },
    { name: "Poste Grand Baie", type: "Poste", loc: "Grand Baie", coords: [-20.010, 57.585], cat: "post" },
    { name: "Shell Vacoas", type: "Station Service", loc: "Vacoas", coords: [-20.296, 57.492], cat: "transport" },
    { name: "Engen Bagatelle", type: "Station Service", loc: "Bagatelle", coords: [-20.223, 57.495], cat: "transport" },
    { name: "Shell Tamarin", type: "Station Service", loc: "Tamarin", coords: [-20.323, 57.375], cat: "transport" },
    { name: "Total Grand Baie", type: "Station Service", loc: "Grand Baie", coords: [-20.009, 57.581], cat: "transport" },
    { name: "Indian Oil Ebene", type: "Station Service", loc: "Ebene", coords: [-20.235, 57.490], cat: "transport" }
];

// Économie & Tourisme
const ecoData = [
    // Tourisme
    { name: "Le Morne Brabant", type: "Site Touristique", loc: "Le Morne", coords: [-20.456, 57.322], cat: "tourist" },
    { name: "Chamarel 7 Coloured Earth", type: "Site Touristique", loc: "Chamarel", coords: [-20.4402, 57.3733], cat: "tourist" },
    { name: "Pamplemousses Garden", type: "Site Touristique", loc: "Pamplemousses", coords: [-20.1049, 57.5730], cat: "tourist" },
    { name: "Grand Bassin", type: "Site Touristique", loc: "Savanne", coords: [-20.4175, 57.4885], cat: "tourist" },
    { name: "Ile aux Cerfs", type: "Site Touristique", loc: "Est", coords: [-20.2667, 57.8000], cat: "tourist" },
    { name: "Trou aux Cerfs", type: "Site Touristique", loc: "Curepipe", coords: [-20.318, 57.512], cat: "tourist" },

    // Malls
    { name: "Bagatelle Mall", type: "Shopping Mall", loc: "Bagatelle", coords: [-20.2248, 57.4974], cat: "mall" },
    { name: "Phoenix Mall", type: "Shopping Mall", loc: "Phoenix", coords: [-20.2794, 57.4958], cat: "mall" },
    { name: "La Croisette", type: "Shopping Mall", loc: "Grand Baie", coords: [-20.0244, 57.5786], cat: "mall" },
    { name: "Cascavelle Village", type: "Shopping Mall", loc: "Flic en Flac", coords: [-20.2785, 57.4028], cat: "mall" },
    { name: "Tribeca Mall", type: "Shopping Mall", loc: "Trianon", coords: [-20.235, 57.498], cat: "mall" },
    { name: "Bo'Valon Mall", type: "Shopping Mall", loc: "Mahebourg", coords: [-20.415, 57.705], cat: "mall" },

    // ICT
    { name: "Ebene Cyber Tower 1", type: "ICT Hub", loc: "Ebene", coords: [-20.243, 57.489], cat: "ict" },
    { name: "Atelier 17", type: "ICT Company", loc: "Phoenix", coords: [-20.280, 57.490], cat: "ict" },
    { name: "PwC Centre", type: "Finance/ICT", loc: "Telfair", coords: [-20.218, 57.502], cat: "ict" },

    // Finance (Banks/ATM)
    { name: "MCB Head Office", type: "Banque", loc: "Port Louis", coords: [-20.163, 57.497], cat: "finance" },
    { name: "SBM Tower", type: "Banque", loc: "Port Louis", coords: [-20.160, 57.501], cat: "finance" },
    { name: "MCB Grand Baie", type: "Banque", loc: "Grand Baie", coords: [-20.008, 57.582], cat: "finance" },
    { name: "HSBC Ebene", type: "Banque", loc: "Ebene", coords: [-20.241, 57.492], cat: "finance" },
    { name: "ABSA ATM", type: "ATM", loc: "Flic en Flac", coords: [-20.275, 57.365], cat: "finance" }
];

// Env / Édu / Admin
const envEduData = [
    { name: "Île aux Aigrettes", type: "Parc Îlot", loc: "Sud-Est", coords: [-20.420, 57.730], cat: "islets" },
    { name: "Île Plate", type: "Parc Îlot", loc: "Nord", coords: [-19.870, 57.650], cat: "islets" },
    { name: "Île Gabriel", type: "Parc Îlot", loc: "Nord-Est", coords: [-19.880, 57.660], cat: "islets" },
    { name: "Île aux Bénitiers", type: "Parc Îlot", loc: "Ouest", coords: [-20.415, 57.345], cat: "islets" },
    { name: "Mare aux Vacoas", type: "Réservoir", loc: "Centre", coords: [-20.360, 57.500], cat: "utilities" },
    { name: "Midlands Dam", type: "Réservoir", loc: "Midlands", coords: [-20.300, 57.600], cat: "utilities" },
    { name: "La Nicolière", type: "Réservoir", loc: "Nord", coords: [-20.120, 57.600], cat: "utilities" },
    { name: "CEB St Louis", type: "Centrale Électrique", loc: "Port Louis", coords: [-20.170, 57.480], cat: "utilities" },
    { name: "FAD Ouest", type: "Dispositif Pêche (DCP)", loc: "Large Flic en Flac", coords: [-20.250, 57.300], cat: "fishing" },
    { name: "FAD Nord", type: "Dispositif Pêche (DCP)", loc: "Large Grand Baie", coords: [-19.950, 57.550], cat: "fishing" },
    { name: "FAD Sud", type: "Dispositif Pêche (DCP)", loc: "Large Le Morne", coords: [-20.500, 57.320], cat: "fishing" },
    { name: "FAD Est", type: "Dispositif Pêche (DCP)", loc: "Large Trou d'Eau Douce", coords: [-20.250, 57.850], cat: "fishing" },

    // Schools
    { name: "École Raoul Rivet", type: "École Primaire", loc: "Port Louis", coords: [-20.170, 57.510], cat: "education" },
    { name: "Alexandra House School", type: "École Primaire", loc: "Floreal", coords: [-20.3112, 57.5072], cat: "education" },
    { name: "Ecole du Centre", type: "École Primaire", loc: "Saint Pierre", coords: [-20.215, 57.530], cat: "education" },
    { name: "Ecole du Nord", type: "École Primaire", loc: "Mapou", coords: [-20.0722, 57.6130], cat: "education" },
    { name: "Le Nid Primary", type: "École Primaire", loc: "Triolet", coords: [-20.050, 57.550], cat: "education" },
    { name: "Clavis International", type: "École Primaire", loc: "Moka", coords: [-20.220, 57.520], cat: "education" },
    { name: "Lycée La Bourdonnais", type: "École Primaire", loc: "Forest Side", coords: [-20.320, 57.530], cat: "education" },
    { name: "Doha Primary School", type: "École Primaire", loc: "Eau Coulée", coords: [-20.310, 57.515], cat: "education" },
    { name: "St Enfant Jesus RCA", type: "École Primaire", loc: "Rose Hill", coords: [-20.238, 57.476], cat: "education" },
    { name: "Notre Dame de la Confiance", type: "École Primaire", loc: "Curepipe", coords: [-20.315, 57.520], cat: "education" }
];

// Districts (Simplified Polygons)
const districtPolygons = [
    { name: "Port Louis", coords: [[-20.14, 57.48], [-20.14, 57.53], [-20.18, 57.53], [-20.18, 57.48]] },
    { name: "Plaines Wilhems", coords: [[-20.20, 57.45], [-20.20, 57.55], [-20.33, 57.55], [-20.33, 57.45]] },
    { name: "Moka", coords: [[-20.18, 57.53], [-20.20, 57.60], [-20.28, 57.60], [-20.25, 57.50]] },
    { name: "Pamplemousses", coords: [[-20.02, 57.50], [-20.02, 57.62], [-20.14, 57.60], [-20.14, 57.48]] },
    { name: "Rivière du Rempart", coords: [[-19.97, 57.58], [-19.97, 57.70], [-20.12, 57.75], [-20.10, 57.60]] },
    { name: "Flacq", coords: [[-20.12, 57.65], [-20.12, 57.80], [-20.30, 57.80], [-20.30, 57.60]] },
    { name: "Grand Port", coords: [[-20.30, 57.55], [-20.30, 57.75], [-20.50, 57.75], [-20.45, 57.55]] },
    { name: "Savanne", coords: [[-20.40, 57.40], [-20.40, 57.55], [-20.53, 57.55], [-20.50, 57.35]] },
    { name: "Black River", coords: [[-20.20, 57.30], [-20.20, 57.45], [-20.50, 57.35], [-20.50, 57.30]] }
];


// --- LAYER GROUPS ---
// --- LAYER GROUPS ---
const povertyLayer = L.layerGroup();
const floodLayer = L.layerGroup();
const coastalLayer = L.layerGroup();
const greenLayer = L.layerGroup();
const historyLayer = L.layerGroup();


const healthLayer = L.layerGroup();
const pharmacyLayer = L.layerGroup();
const socialLayer = L.layerGroup();

const emergencyLayer = L.layerGroup();
const cameraLayer = L.layerGroup();
const dangerLayer = L.layerGroup();

const metroLayer = L.layerGroup();
const busLayer = L.layerGroup();
const transportLayer = L.layerGroup(); // Essence
const postLayer = L.layerGroup();

const touristLayer = L.layerGroup();
const mallLayer = L.layerGroup();
const ictLayer = L.layerGroup();
const financeLayer = L.layerGroup();

const educationLayer = L.layerGroup();
const isletsLayer = L.layerGroup();
const utilitiesLayer = L.layerGroup();
const fishingLayer = L.layerGroup();
const districtsLayer = L.layerGroup();

// Debugging: Expose layers
window.povertyLayer = povertyLayer;
window.floodLayer = floodLayer;
window.districtsLayer = districtsLayer;




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
console.log("Poverty Layer populated. Count:", povertyLayer.getLayers().length);
console.log("Poverty Zones Data:", povertyZones);


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


greenEnergy.forEach(site => {
    const marker = L.circleMarker(site.coords, {
        radius: 6,
        fillColor: '#10b981',
        color: '#fff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    });
    marker.bindPopup(`<b>${site.name}</b><br>${site.loc}<br><em>${site.stats}</em>`);
    greenLayer.addLayer(marker);
});


historicalFloods.forEach(event => {
    const marker = L.circleMarker(event.coords, {
        radius: 6,
        fillColor: '#8b5cf6',
        color: '#fff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    });
    marker.bindPopup(`<b>${event.name}</b><br>${event.date}<br><em>${event.stats}</em>`);
    historyLayer.addLayer(marker);
});

// Generic Populator
function addMarkers(data, arg2, arg3) {
    let layer, color;
    // Handle argument swap (some calls use color as 2nd arg, others use layer)
    if (typeof arg2 === 'string') {
        color = arg2;
        layer = arg3;
    } else {
        layer = arg2;
        color = arg3;
    }

    if (!data) return;

    try {
        data.forEach(item => {
            if (!item.coords) return;
            const marker = L.circleMarker(item.coords, {
                radius: 5,
                fillColor: color,
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
            marker.bindPopup(`<b>${item.name}</b><br>${item.type}<br><em>${item.loc}</em>`);
            layer.addLayer(marker);
        });
    } catch (e) {
        console.warn("Error in addMarkers:", e);
    }
}

// Populate Layers
addMarkers(healthData.filter(d => !d.cat), '#ec4899', healthLayer); // Pink
addMarkers(healthData.filter(d => d.cat === 'pharmacy'), '#be185d', pharmacyLayer); // Dark Pink
addMarkers(healthData.filter(d => d.cat === 'social'), '#db2777', socialLayer); // Pinkish


addMarkers(securityData.filter(d => d.cat === 'emergency'), '#ef4444', emergencyLayer); // Red
addMarkers(securityData.filter(d => d.cat === 'camera'), '#f87171', cameraLayer); // Light Red
addMarkers(securityData.filter(d => d.cat === 'danger'), '#b91c1c', dangerLayer); // Dark Red (Skull?)

// Metro (Stations + Line)
addMarkers(metroStations, metroLayer, '#6366f1');
const metroPoly = L.polyline(metroLine, { color: '#6366f1', weight: 4 }).bindPopup("Metro Express Line");
metroLayer.addLayer(metroPoly);


addMarkers(busData, busLayer, '#818cf8');
addMarkers(transportMiscData.filter(d => d.cat === 'transport'), '#4f46e5', transportLayer); // Indigo
addMarkers(transportMiscData.filter(d => d.cat === 'post'), '#a5b4fc', postLayer);

addMarkers(ecoData.filter(d => d.cat === 'tourist'), '#facc15', touristLayer); // Yellow
addMarkers(ecoData.filter(d => d.cat === 'mall'), '#eab308', mallLayer);
addMarkers(ecoData.filter(d => d.cat === 'ict'), '#ca8a04', ictLayer);
addMarkers(ecoData.filter(d => d.cat === 'finance'), '#22c55e', financeLayer); // Green

addMarkers(envEduData.filter(d => d.cat === 'education'), '#14b8a6', educationLayer); // Teal
addMarkers(envEduData.filter(d => d.cat === 'islets'), '#0d9488', isletsLayer);
addMarkers(envEduData.filter(d => d.cat === 'utilities'), '#0f766e', utilitiesLayer);
addMarkers(envEduData.filter(d => d.cat === 'fishing'), '#3b82f6', fishingLayer); // Blue

// Districts
districtPolygons.forEach(d => {
    const poly = L.polygon(d.coords, { color: '#94a3b8', weight: 1, fillOpacity: 0.1 });
    poly.bindPopup(`<b>${d.name}</b>`);
    districtsLayer.addLayer(poly);
});


// Initial add to map
povertyLayer.addTo(map);
floodLayer.addTo(map);
coastalLayer.addTo(map);
greenLayer.addTo(map);
historyLayer.addTo(map);

console.log("Layers added to map successfully.");




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

// Setup Listeners
function setupLayerListener(id, layer) {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('change', function (e) {
            if (e.target.checked) {
                map.addLayer(layer);
            } else {
                map.removeLayer(layer);
            }
        });
    }
}

// Map IDs to Layers
const layersMap = {
    'layer-health': healthLayer, 'layer-pharmacy': pharmacyLayer, 'layer-social': socialLayer,
    'layer-emergency': emergencyLayer, 'layer-camera': cameraLayer, 'layer-danger': dangerLayer,
    'layer-metro': metroLayer, 'layer-bus': busLayer, 'layer-transport': transportLayer, 'layer-post': postLayer,
    'layer-tourist': touristLayer, 'layer-mall': mallLayer, 'layer-ict': ictLayer, 'layer-finance': financeLayer,
    'layer-education': educationLayer, 'layer-islets': isletsLayer, 'layer-utilities': utilitiesLayer,
    'layer-fishing': fishingLayer, 'layer-districts': districtsLayer
};

for (const [id, layer] of Object.entries(layersMap)) {
    setupLayerListener(id, layer);
}


Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';


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


document.getElementById('povertyChart').parentElement.addEventListener('click', () => {
    showAnalysis(
        "Disparités Régionales",
        "Une forte concentration de la pauvreté relative est observée à Rodrigues (40%) et dans les faubourgs de Port-Louis (25%).<br><br>Cette distribution reflète une <i>ségrégation spatiale</i> marquée. L'indice de Gini à Maurice (0.40) masque des inégalités territoriales profondes. La vulnérabilité à Rodrigues est structurelle (isolement, économie de subsistance), tandis qu'à Port-Louis, elle est liée à l'urbanisation rapide et à la précarité de l'emploi informel."
    );
});


document.getElementById('floodChart').parentElement.addEventListener('click', () => {
    showAnalysis(
        "Intensification Hydrologique",
        "On note une tendance haussière des événements d'inondation majeurs (passant de 2 à 5 par an en 5 ans).<br><br>Cette augmentation est corrélée à deux facteurs : l'imperméabilisation des sols due à l'artificialisation (<i>Urban Sprawl</i>) et l'intensification des précipitations extrêmes liée au changement climatique. Le système de drainage actuel, conçu pour des périodes de retour décennales, est désormais obsolète face à des épisodes de pluies torrentielles (>100mm/24h) de plus en plus fréquents."
    );
});


document.getElementById('stat-poverty').addEventListener('click', () => {
    showAnalysis(
        "Poches de Pauvreté",
        "229 Poches de Pauvreté identifiées.<br><br>Ce chiffre provient du registre social de Maurice (SRM). Il désigne les zones où la concentration de ménages éligibles aux aides sociales est la plus forte. Ces zones cumulent souvent des risques sociaux (chômage) et environnementaux (inondations, insalubrité)."
    );
});


document.getElementById('stat-flood').addEventListener('click', () => {
    showAnalysis(
        "Statistique : Zones Inondables",
        "<b>Chiffre Clé :</b> 306 Zones à Risque (LDA).<br><br><b>Contexte :</b> La <i>Land Drainage Authority</i> a cartographié ces zones prioritaires. Elles incluent les zones de débordement de rivières, les zones d'accumulation d'eau (cuvettes) et les zones sujettes aux crues éclairs (Flash Floods). 25% de ces zones sont situées en milieu urbain dense."
    );
});


document.getElementById('stat-green').addEventListener('click', () => {
    showAnalysis(
        "Statistique : Énergie Verte",
        "<b>Chiffre Clé :</b> 8+ Projets Solaires Majeurs.<br><br><b>Contexte :</b> Maurice vise 60% d'énergie renouvelable d'ici 2030. Les fermes solaires (comme SARAKO à Bambous) et les projets distribués (Qair) sont essentiels pour réduire la dépendance aux énergies fossiles importées et atténuer l'empreinte carbone nationale."
    );
});


document.getElementById('stat-history').addEventListener('click', () => {
    showAnalysis(
        "Statistique : Historique Crues",
        "<b>Événement Marquant :</b> 30 Mars 2013.<br><br><b>Contexte :</b> Les inondations meurtrières de Port-Louis (11 victimes) ont marqué un tournant dans la conscience du risque climatique à Maurice. Elles ont révélé la vulnérabilité des infrastructures urbaines face aux pluies torrentielles (>150mm en 2h), un phénomène qui s'intensifie avec le changement climatique."
    );
});
