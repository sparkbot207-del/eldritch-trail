// Main Game Controller
const Game = {
    screens: {},
    buttons: {},
    
    init() {
        // Cache screens
        this.screens = {
            title: document.getElementById('title-screen'),
            character: document.getElementById('character-screen'),
            game: document.getElementById('game-screen'),
            gameover: document.getElementById('gameover-screen'),
            victory: document.getElementById('victory-screen')
        };
        
        // Cache buttons
        this.buttons = {
            start: document.getElementById('btn-start'),
            backTitle: document.getElementById('btn-back-title'),
            travel: document.getElementById('btn-travel'),
            search: document.getElementById('btn-search'),
            rest: document.getElementById('btn-rest'),
            party: document.getElementById('btn-party'),
            restart: document.getElementById('btn-restart'),
            playAgain: document.getElementById('btn-play-again'),
            closeParty: document.getElementById('btn-close-party'),
            closeSearch: document.getElementById('btn-close-search')
        };
        
        // Initialize subsystems
        Dialogue.init();
        Scene.init();
        Events.init();
        
        // Set up event listeners
        this.setupListeners();
        
        console.log('Eldritch Trail initialized');
    },
    
    setupListeners() {
        // Title screen
        this.buttons.start.addEventListener('click', () => this.showCharacterSelect());
        
        // Character select
        this.buttons.backTitle.addEventListener('click', () => this.showScreen('title'));
        
        // Game actions
        this.buttons.travel.addEventListener('click', () => this.travel());
        this.buttons.search.addEventListener('click', () => this.search());
        this.buttons.rest.addEventListener('click', () => this.rest());
        this.buttons.party.addEventListener('click', () => this.showParty());
        
        // Overlays
        this.buttons.closeParty.addEventListener('click', () => this.hideOverlay('party-overlay'));
        this.buttons.closeSearch.addEventListener('click', () => this.hideOverlay('search-overlay'));
        
        // End screens
        this.buttons.restart.addEventListener('click', () => this.restart());
        this.buttons.playAgain.addEventListener('click', () => this.restart());
        
        // Skip dialogue on tap
        document.getElementById('dialogue-box').addEventListener('click', () => Dialogue.skip());
    },
    
    showScreen(name) {
        Object.values(this.screens).forEach(s => s.classList.remove('active'));
        this.screens[name].classList.add('active');
    },
    
    showOverlay(id) {
        document.getElementById(id).classList.add('active');
    },
    
    hideOverlay(id) {
        document.getElementById(id).classList.remove('active');
    },
    
    // Character Selection
    showCharacterSelect() {
        const grid = document.getElementById('character-list');
        grid.innerHTML = '';
        
        CHARACTERS.forEach(char => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <h4>${char.name}</h4>
                <div class="occupation">${char.occupation}</div>
                <div class="ability">${char.ability}</div>
            `;
            card.addEventListener('click', () => this.selectCharacter(char));
            grid.appendChild(card);
        });
        
        this.showScreen('character');
    },
    
    selectCharacter(character) {
        GameState.init(character);
        this.showScreen('game');
        this.loadLocation();
    },
    
    // Load current location
    loadLocation() {
        const location = getLocation(GameState.currentLocation);
        Scene.loadLocation(location);
        Dialogue.typeText(location.description);
        this.updateUI();
        this.updateButtons(location);
        
        // Check victory
        if (GameState.checkVictory(location)) {
            setTimeout(() => this.victory(), 2000);
        }
    },
    
    // Update resource displays
    updateUI() {
        // Sanity bar
        document.querySelector('.sanity-fill').style.width = GameState.sanity + '%';
        
        // Resource counts
        document.getElementById('supplies-count').textContent = GameState.supplies;
        document.getElementById('fuel-count').textContent = GameState.fuel;
        document.getElementById('pursuit-count').textContent = GameState.pursuit;
        
        // Pursuit color warning
        const pursuitEl = document.getElementById('pursuit-display');
        if (GameState.pursuit >= 7) {
            pursuitEl.style.color = '#ff4444';
        } else if (GameState.pursuit >= 4) {
            pursuitEl.style.color = '#ffaa44';
        } else {
            pursuitEl.style.color = '#b86b6b';
        }
    },
    
    // Update button states based on location
    updateButtons(location) {
        // Search: only if location is searchable and hasn't been searched
        this.buttons.search.disabled = !location.searchable || GameState.hasSearchedLocation;
        
        // Rest: only if location allows rest and have supplies
        this.buttons.rest.disabled = !location.canRest || GameState.supplies < 2;
        
        // Travel: need fuel
        this.buttons.travel.disabled = GameState.fuel <= 0;
    },
    
    // TRAVEL
    travel() {
        if (GameState.fuel <= 0) {
            Dialogue.showText('No fuel! You\'re stranded...');
            return;
        }
        
        const success = GameState.travel();
        if (success) {
            // Random event chance (40%)
            if (Math.random() < 0.4) {
                const location = getLocation(GameState.currentLocation);
                Events.triggerRandom(location.type);
                Events.onEventEnd = () => {
                    this.loadLocation();
                    this.checkGameState();
                };
            } else {
                this.loadLocation();
                this.checkGameState();
            }
        }
    },
    
    // SEARCH
    search() {
        const location = getLocation(GameState.currentLocation);
        const result = GameState.search(location);
        
        if (!result.success) {
            Dialogue.showText(result.reason);
            return;
        }
        
        // Show search overlay with results
        const titleEl = document.getElementById('search-title');
        const textEl = document.getElementById('search-text');
        
        titleEl.textContent = 'Search Results';
        
        let resultText = '';
        result.finds.forEach(find => {
            switch (find.type) {
                case 'supplies':
                    resultText = `You found ${find.amount} supplies hidden in the debris!`;
                    break;
                case 'fuel':
                    resultText = `A forgotten fuel can! +${find.amount} fuel.`;
                    break;
                case 'sanity':
                    if (find.amount > 0) {
                        resultText = `A moment of peace. Your mind steadies. (+${find.amount} Sanity)`;
                    } else {
                        resultText = `You find something that shouldn't exist. The sight sears your mind. (${find.amount} Sanity)`;
                    }
                    break;
                case 'nothing':
                    resultText = 'Nothing useful here. Just dust and shadows.';
                    break;
            }
        });
        
        textEl.textContent = resultText;
        this.showOverlay('search-overlay');
        this.updateUI();
        this.updateButtons(location);
    },
    
    // REST
    rest() {
        const location = getLocation(GameState.currentLocation);
        
        if (!location.canRest) {
            Dialogue.showText('This place offers no rest. The shadows press too close.');
            return;
        }
        
        const result = GameState.rest();
        
        if (!result.success) {
            Dialogue.showText(result.reason);
            return;
        }
        
        // Show rest result in search overlay
        const titleEl = document.getElementById('search-title');
        const textEl = document.getElementById('search-text');
        
        titleEl.textContent = 'Rest';
        textEl.textContent = `You rest uneasily. Dreams of writhing shapes fade as dawn approaches. (+${result.sanityGain} Sanity, -2 Supplies, +1 Pursuit)`;
        
        this.showOverlay('search-overlay');
        this.updateUI();
        this.updateButtons(location);
        this.checkGameState();
    },
    
    // PARTY
    showParty() {
        const list = document.getElementById('party-list');
        list.innerHTML = '';
        
        GameState.party.forEach(member => {
            const el = document.createElement('div');
            el.className = 'party-member' + (member.status === 'dead' ? ' dead' : '');
            el.innerHTML = `
                <div>
                    <div class="member-name">${member.name}${member.isPlayer ? ' (You)' : ''}</div>
                    <div class="member-status">${member.occupation}</div>
                </div>
                <div class="member-status">${member.status}</div>
            `;
            list.appendChild(el);
        });
        
        this.showOverlay('party-overlay');
    },
    
    // Hotspot interaction
    examineHotspot(text) {
        Dialogue.typeText(text);
        Scene.flash('rgba(139, 115, 85, 0.3)');
    },
    
    // Check for game over
    checkGameState() {
        const result = GameState.checkGameOver();
        if (result.over) {
            this.gameOver(result.reason);
        }
    },
    
    // Game Over
    gameOver(reason) {
        const titleEl = document.getElementById('gameover-title');
        const textEl = document.getElementById('gameover-text');
        
        switch (reason) {
            case 'madness':
                titleEl.textContent = 'MADNESS';
                textEl.textContent = 'The visions consume you entirely. Your mind fractures into a thousand screaming shards. You join the chorus of the damned.';
                break;
            case 'caught':
                titleEl.textContent = 'CAPTURED';
                textEl.textContent = 'They find you. The white coats descend. The needles pierce. You return to Danvers, and this time, they won\'t let you leave.';
                break;
            case 'death':
                titleEl.textContent = 'DEATH';
                textEl.textContent = 'The cold claims you. Your body is found weeks later, frozen in the undergrowth. Just another tragedy on a Massachusetts backroad.';
                break;
        }
        
        setTimeout(() => this.showScreen('gameover'), 500);
    },
    
    // Victory
    victory() {
        const textEl = document.getElementById('victory-text');
        const statsEl = document.getElementById('final-stats');
        
        textEl.textContent = 'You cross into Maine as dawn breaks. The horrors of Danvers fade behind you—but some things cannot be unseen. You carry the darkness within you now.';
        
        statsEl.innerHTML = `
            <div>Days survived: ${GameState.day}</div>
            <div>Final sanity: ${GameState.sanity}%</div>
            <div>Party members: ${GameState.party.filter(m => m.status !== 'dead').length}</div>
        `;
        
        this.showScreen('victory');
    },
    
    // Restart
    restart() {
        this.showScreen('title');
    }
};

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => Game.init());
