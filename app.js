// Mapbox Access Token
mapboxgl.accessToken = CONFIG.MAPBOX_TOKEN;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v11', // Dark mode style
    center: [57.5, -20.2], // Starting position [lng, lat]
    zoom: 10, // Starting zoom
    pitch: 45, // Pitch for 3D effect
    bearing: -17.6, // Bearing for 3D effect
    projection: 'globe' // Display as a globe
});

// Add navigation controls
map.addControl(new mapboxgl.NavigationControl());

map.on('load', async () => {

    // Add Terrain (3D)
    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
    });
    // add the DEM source as a terrain layer with exaggerated height
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

    // Add Sky Atmosphere
    map.setFog({
        'range': [0.5, 10],
        'color': '#fafafa',
        'horizon-blend': 0.1,
        'high-color': '#add8e6',
        'space-color': '#1a237e',
        'star-intensity': 0.5
    });

    // Add 3D Buildings Layer
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
    ).id;

    map.addLayer(
        {
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#aaa',

                // Use an 'interpolate' expression to
                // add a smooth transition effect to
                // the buildings as the user zooms in.
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'height']
                ],
                'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
            }
        },
        labelLayerId
    );

    // Altitude Readout Logic
    map.on('mousemove', (e) => {
        // Query elevation at the cursor position
        // { exaggerated: false } gives the real world elevation in meters
        const elevation = map.queryTerrainElevation(e.lngLat, { exaggerated: false });
        const elevationDisplay = document.getElementById('elevation-display');

        if (elevationDisplay) {
            if (elevation !== null) {
                elevationDisplay.innerHTML = `Altitude: <b>${Math.round(elevation)} m</b>`;
            } else {
                elevationDisplay.innerHTML = 'Altitude: 0 m';
            }
        }
    });

    // Function to add a layer
    function addGeoJsonLayer(id, data, color, type = 'polygon') {
        map.addSource(id, {
            'type': 'geojson',
            'data': data
        });

        if (type === 'polygon') {
            map.addLayer({
                'id': id,
                'type': 'fill',
                'source': id,
                'layout': {},
                'paint': {
                    'fill-color': color,
                    'fill-opacity': 0.6
                }
            });
            map.addLayer({
                'id': id + '-outline',
                'type': 'line',
                'source': id,
                'layout': {},
                'paint': {
                    'line-color': '#ffffff',
                    'line-width': 1
                }
            });
        } else if (type === 'circle') {
            map.addLayer({
                'id': id,
                'type': 'circle',
                'source': id,
                'paint': {
                    'circle-radius': 6,
                    'circle-color': color,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#ffffff',
                    'circle-opacity': 0.8
                }
            });
        }
        // Change the cursor to a pointer when the mouse is over the layer.
        map.on('mouseenter', id, () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', id, () => {
            map.getCanvas().style.cursor = '';
        });

        // Add Click Action
        map.on('click', id, (e) => {
            const coordinates = e.lngLat;
            const props = e.features[0].properties;
            let description = `<b>${props.name}</b>`;
            if (props.desc) description += `<br>${props.desc}`;
            if (props.type) description += `<br>${props.type}`;
            if (props.loc) description += `<br>${props.loc}`;
            if (props.risk) description += `<br>${props.risk}`;
            if (props.stats) description += `<br><em>${props.stats}</em>`;
            if (props.date) description += `<br><em>${props.date}</em>`;

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });
    }

    // Helper to create Point FeatureCollection
    function createFeatureCollection(items) {
        return {
            type: 'FeatureCollection',
            features: items.map(item => ({
                type: 'Feature',
                properties: item,
                geometry: {
                    type: 'Point',
                    // Swap from [lat, lng] to [lng, lat]
                    coordinates: [item.coords[1], item.coords[0]]
                }
            }))
        };
    }

    // Helper for Polygons
    function createPolygonCollection(items) {
        return {
            type: 'FeatureCollection',
            features: items.map(item => ({
                type: 'Feature',
                properties: item,
                geometry: {
                    type: 'Polygon',
                    // Swap coords inside polygon
                    coordinates: [item.coords.map(c => [c[1], c[0]])]
                }
            }))
        };
    }


    // Use APP_DATA directly (loaded from data.js)
    const db = APP_DATA;

    // Polygon Layers
    addGeoJsonLayer('layer-poverty', createPolygonCollection(db.povertyZones), '#f97316');
    addGeoJsonLayer('layer-flood', createPolygonCollection(db.floodZones), '#3b82f6');
    addGeoJsonLayer('layer-coastal', createPolygonCollection(db.coastalRisks), '#ef4444');
    addGeoJsonLayer('layer-districts', createPolygonCollection(db.districtPolygons), '#94a3b8');
    map.setPaintProperty('layer-districts', 'fill-opacity', 0.1);

    // Point Layers
    // Group points by category for layers
    const points = db.pointsOfInterest;

    addGeoJsonLayer('layer-green', createFeatureCollection(points.filter(p => p.cat === 'green')), '#10b981', 'circle');
    addGeoJsonLayer('layer-history', createFeatureCollection(points.filter(p => p.cat === 'history')), '#8b5cf6', 'circle');

    addGeoJsonLayer('layer-health', createFeatureCollection(points.filter(p => p.cat === 'health')), '#ec4899', 'circle');
    addGeoJsonLayer('layer-pharmacy', createFeatureCollection(points.filter(p => p.cat === 'pharmacy')), '#be185d', 'circle');
    addGeoJsonLayer('layer-social', createFeatureCollection(points.filter(p => p.cat === 'social')), '#db2777', 'circle');

    addGeoJsonLayer('layer-emergency', createFeatureCollection(points.filter(p => p.cat === 'emergency')), '#ef4444', 'circle');
    addGeoJsonLayer('layer-camera', createFeatureCollection(points.filter(p => p.cat === 'camera')), '#f87171', 'circle');
    addGeoJsonLayer('layer-danger', createFeatureCollection(points.filter(p => p.cat === 'danger')), '#b91c1c', 'circle');

    addGeoJsonLayer('layer-metro', createFeatureCollection(points.filter(p => p.cat === 'metro')), '#6366f1', 'circle');
    addGeoJsonLayer('layer-bus', createFeatureCollection(points.filter(p => p.cat === 'bus')), '#818cf8', 'circle');
    addGeoJsonLayer('layer-transport', createFeatureCollection(points.filter(p => p.cat === 'transport')), '#4f46e5', 'circle');
    addGeoJsonLayer('layer-post', createFeatureCollection(points.filter(p => p.cat === 'post')), '#a5b4fc', 'circle');

    addGeoJsonLayer('layer-tourist', createFeatureCollection(points.filter(p => p.cat === 'tourist')), '#facc15', 'circle');
    addGeoJsonLayer('layer-mall', createFeatureCollection(points.filter(p => p.cat === 'mall')), '#eab308', 'circle');
    addGeoJsonLayer('layer-ict', createFeatureCollection(points.filter(p => p.cat === 'ict')), '#ca8a04', 'circle');
    addGeoJsonLayer('layer-finance', createFeatureCollection(points.filter(p => p.cat === 'finance')), '#22c55e', 'circle');

    addGeoJsonLayer('layer-education', createFeatureCollection(points.filter(p => p.cat === 'education')), '#14b8a6', 'circle');
    addGeoJsonLayer('layer-islets', createFeatureCollection(points.filter(p => p.cat === 'islets')), '#0d9488', 'circle');
    addGeoJsonLayer('layer-utilities', createFeatureCollection(points.filter(p => p.cat === 'utilities')), '#0f766e', 'circle');
    addGeoJsonLayer('layer-fishing', createFeatureCollection(points.filter(p => p.cat === 'fishing')), '#3b82f6', 'circle');

    // Manual Metro Line (harder to allow generic due to LineString type, usually static or separate file)
    const metroLineCoords = [
        [-20.164, 57.500], [-20.190, 57.480], [-20.226, 57.472], [-20.242, 57.474], [-20.265, 57.479],
        [-20.279, 57.496], [-20.297, 57.496], [-20.319, 57.524]
    ];
    map.addSource('layer-metro-line', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': metroLineCoords.map(c => [c[1], c[0]])
            }
        }
    });
    map.addLayer({
        'id': 'layer-metro-line',
        'type': 'line',
        'source': 'layer-metro-line',
        'layout': { 'line-join': 'round', 'line-cap': 'round' },
        'paint': { 'line-color': '#6366f1', 'line-width': 4 }
    });


    // Layer Toggling Logic
    function toggleLayer(checkboxId, layerId) {
        const checkbox = document.getElementById(checkboxId);
        if (!checkbox) return;

        checkbox.addEventListener('change', (e) => {
            const visibility = e.target.checked ? 'visible' : 'none';
            if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, 'visibility', visibility);
                if (map.getLayer(layerId + '-outline')) {
                    map.setLayoutProperty(layerId + '-outline', 'visibility', visibility);
                }
            }
        });

        // Initial state logic if needed (Mapbox defaults to visible)
        if (!checkbox.checked) {
            // Need to wait slightly for layers to add if async, but here we add layers then run this.
            // Since this runs after await fetch, layers exist.
            if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, 'visibility', 'none');
                if (map.getLayer(layerId + '-outline')) {
                    map.setLayoutProperty(layerId + '-outline', 'visibility', 'none');
                }
            }
        }
    }

    const layersToToggle = [
        ['layer-poverty', 'layer-poverty'],
        ['layer-flood', 'layer-flood'],
        ['layer-coastal', 'layer-coastal'],
        ['layer-green', 'layer-green'],
        ['layer-history', 'layer-history'],
        ['layer-health', 'layer-health'],
        ['layer-pharmacy', 'layer-pharmacy'],
        ['layer-social', 'layer-social'],
        ['layer-emergency', 'layer-emergency'],
        ['layer-camera', 'layer-camera'],
        ['layer-danger', 'layer-danger'],
        ['layer-metro', 'layer-metro'], // Handled specially below for line
        ['layer-bus', 'layer-bus'],
        ['layer-transport', 'layer-transport'],
        ['layer-post', 'layer-post'],
        ['layer-tourist', 'layer-tourist'],
        ['layer-mall', 'layer-mall'],
        ['layer-ict', 'layer-ict'],
        ['layer-finance', 'layer-finance'],
        ['layer-education', 'layer-education'],
        ['layer-islets', 'layer-islets'],
        ['layer-utilities', 'layer-utilities'],
        ['layer-fishing', 'layer-fishing'],
        ['layer-districts', 'layer-districts']
    ];

    // We need to run toggle logic AFTER layers are added.
    // However, if checkboxes are unchecked by default, we need to hide them.
    // Best is to run this inside the async block or after it. 
    // Since we are inside the async load function, we can run it here.

    layersToToggle.forEach(pair => toggleLayer(pair[0], pair[1]));

    // Special handling for Metro Line to toggle with Metro Stations
    document.getElementById('layer-metro').addEventListener('change', (e) => {
        const visibility = e.target.checked ? 'visible' : 'none';
        if (map.getLayer('layer-metro-line')) {
            map.setLayoutProperty('layer-metro-line', 'visibility', visibility);
        }
    });

    // 3D/2D Toggle Logic
    let is3D = true;
    const toggleBtn = document.getElementById('toggle-3d');

    toggleBtn.addEventListener('click', () => {
        is3D = !is3D;

        if (is3D) {
            // Switch to 3D
            toggleBtn.textContent = 'Vue 2D'; // Button says what clicking will do (switch to 2D) -> No, usually it describes current state or target state. Let's make it "Vue 2D" to switch TO 2D.
            // Wait, logic above in plan was: if in 3D, button says "2D View" (to go to 2D).

            map.easeTo({ pitch: 45, bearing: -17.6 });

            if (map.getLayer('add-3d-buildings')) {
                map.setLayoutProperty('add-3d-buildings', 'visibility', 'visible');
            }
            // Restore terrain
            map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        } else {
            // Switch to 2D
            toggleBtn.textContent = 'Vue 3D'; // Button says switch to 3D

            map.easeTo({ pitch: 0, bearing: 0 });

            if (map.getLayer('add-3d-buildings')) {
                map.setLayoutProperty('add-3d-buildings', 'visibility', 'none');
            }
            // Remove terrain for flat view
            map.setTerrain(null);
        }
    });

});

// Chart.js and UI Logic (Preserved)

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
