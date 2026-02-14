// Scene Management
const Scene = {
    container: null,
    background: null,
    hotspotsLayer: null,
    locationName: null,
    currentHotspots: [],
    
    init() {
        this.container = document.getElementById('scene-container');
        this.background = document.getElementById('scene-background');
        this.hotspotsLayer = document.getElementById('hotspots-layer');
        this.locationName = document.getElementById('location-name');
    },
    
    // Load a location
    loadLocation(location) {
        // Set background
        if (location.background) {
            this.background.style.backgroundImage = `url('${location.background}')`;
        } else {
            // Default dark gradient if no image
            this.background.style.backgroundImage = 'linear-gradient(180deg, #0a0a0f 0%, #1a1520 50%, #0a0a0f 100%)';
        }
        
        // Set location name
        this.locationName.textContent = location.name;
        
        // Clear old hotspots
        this.clearHotspots();
        
        // Add new hotspots
        if (location.hotspots) {
            location.hotspots.forEach(hs => this.addHotspot(hs));
        }
    },
    
    // Add a tappable hotspot
    addHotspot(hotspot) {
        const el = document.createElement('div');
        el.className = 'hotspot';
        el.style.left = hotspot.x + '%';
        el.style.top = hotspot.y + '%';
        el.style.width = (hotspot.width || 15) + '%';
        el.style.height = (hotspot.height || 15) + '%';
        
        el.addEventListener('click', () => {
            if (hotspot.onTap) {
                hotspot.onTap();
            }
        });
        
        this.hotspotsLayer.appendChild(el);
        this.currentHotspots.push(el);
    },
    
    // Clear all hotspots
    clearHotspots() {
        this.currentHotspots.forEach(el => el.remove());
        this.currentHotspots = [];
    },
    
    // Flash effect for events
    flash(color = 'white') {
        const flashEl = document.createElement('div');
        flashEl.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: ${color};
            opacity: 0.8;
            pointer-events: none;
            z-index: 50;
            animation: flashOut 0.3s forwards;
        `;
        this.container.appendChild(flashEl);
        
        setTimeout(() => flashEl.remove(), 300);
    }
};

// Add flash animation
const style = document.createElement('style');
style.textContent = `
    @keyframes flashOut {
        0% { opacity: 0.8; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);
