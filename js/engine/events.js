// Event System
const Events = {
    overlay: null,
    titleEl: null,
    textEl: null,
    choicesEl: null,
    currentEvent: null,
    onEventEnd: null,
    
    init() {
        this.overlay = document.getElementById('event-overlay');
        this.titleEl = document.getElementById('event-title');
        this.textEl = document.getElementById('event-text');
        this.choicesEl = document.getElementById('event-choices');
    },
    
    // Trigger a random event based on location type
    triggerRandom(locationType) {
        const possibleEvents = EVENTS.filter(e => 
            !e.locationType || e.locationType === locationType || e.locationType === 'any'
        );
        
        // Weight-based selection
        const totalWeight = possibleEvents.reduce((sum, e) => sum + (e.weight || 1), 0);
        let roll = Math.random() * totalWeight;
        
        for (const event of possibleEvents) {
            roll -= (event.weight || 1);
            if (roll <= 0) {
                this.show(event);
                return;
            }
        }
    },
    
    // Show an event
    show(event, callback) {
        this.currentEvent = event;
        this.onEventEnd = callback;
        
        this.titleEl.textContent = event.title;
        this.textEl.textContent = event.text;
        
        // Clear old choices
        this.choicesEl.innerHTML = '';
        
        // Add choices
        event.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', () => this.selectChoice(index));
            this.choicesEl.appendChild(btn);
        });
        
        this.overlay.classList.add('active');
    },
    
    // Handle choice selection
    selectChoice(index) {
        const choice = this.currentEvent.choices[index];
        
        // Apply effects
        let resultText = choice.result || '';
        
        if (choice.effects) {
            if (choice.effects.sanity) {
                GameState.modifySanity(choice.effects.sanity);
            }
            if (choice.effects.supplies) {
                GameState.modifySupplies(choice.effects.supplies);
            }
            if (choice.effects.fuel) {
                GameState.modifyFuel(choice.effects.fuel);
            }
            if (choice.effects.pursuit) {
                GameState.modifyPursuit(choice.effects.pursuit);
            }
            if (choice.effects.addParty) {
                GameState.addPartyMember(choice.effects.addParty);
            }
        }
        
        // Show result if any
        if (choice.result) {
            this.textEl.textContent = choice.result;
            this.choicesEl.innerHTML = '';
            
            const continueBtn = document.createElement('button');
            continueBtn.className = 'choice-btn';
            continueBtn.textContent = 'Continue';
            continueBtn.addEventListener('click', () => this.close());
            this.choicesEl.appendChild(continueBtn);
        } else {
            this.close();
        }
    },
    
    // Close event overlay
    close() {
        this.overlay.classList.remove('active');
        if (this.onEventEnd) {
            this.onEventEnd();
        }
    }
};
