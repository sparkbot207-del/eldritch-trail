// Game State Management
const GameState = {
    // Player
    character: null,
    
    // Resources
    sanity: 100,
    supplies: 10,
    fuel: 5,
    
    // Progress
    currentLocation: 0,
    pursuit: 0,
    day: 1,
    
    // Party (including main character)
    party: [],
    
    // Flags
    hasSearchedLocation: false,
    hasRestedToday: false,
    
    // Initialize new game
    init(character) {
        this.character = character;
        this.sanity = character.startSanity || 100;
        this.supplies = character.startSupplies || 10;
        this.fuel = character.startFuel || 5;
        this.currentLocation = 0;
        this.pursuit = 0;
        this.day = 1;
        this.hasSearchedLocation = false;
        this.hasRestedToday = false;
        
        // Party starts with just the player
        this.party = [{
            name: character.name,
            occupation: character.occupation,
            status: 'healthy',
            isPlayer: true
        }];
        
        // Some characters start with companions
        if (character.startsWithCompanion) {
            this.party.push({
                name: character.companionName,
                occupation: character.companionOccupation,
                status: 'healthy',
                isPlayer: false
            });
        }
    },
    
    // Resource modification
    modifySanity(amount) {
        this.sanity = Math.max(0, Math.min(100, this.sanity + amount));
        return this.sanity;
    },
    
    modifySupplies(amount) {
        this.supplies = Math.max(0, this.supplies + amount);
        return this.supplies;
    },
    
    modifyFuel(amount) {
        this.fuel = Math.max(0, this.fuel + amount);
        return this.fuel;
    },
    
    modifyPursuit(amount) {
        this.pursuit = Math.max(0, Math.min(10, this.pursuit + amount));
        return this.pursuit;
    },
    
    // Travel to next location
    travel() {
        if (this.fuel <= 0) return false;
        
        this.fuel--;
        this.currentLocation++;
        this.hasSearchedLocation = false;
        this.day++;
        
        // Pursuit catches up slightly each day
        if (Math.random() < 0.3) {
            this.pursuit++;
        }
        
        return true;
    },
    
    // Rest
    rest() {
        if (this.supplies < 2) return { success: false, reason: 'Not enough supplies' };
        
        this.supplies -= 2;
        this.hasRestedToday = true;
        
        // Restore some sanity
        const sanityGain = 10 + Math.floor(Math.random() * 10);
        this.modifySanity(sanityGain);
        
        // But pursuit catches up
        this.pursuit++;
        
        return { success: true, sanityGain };
    },
    
    // Search location
    search(location) {
        if (this.hasSearchedLocation) {
            return { success: false, reason: 'Already searched here' };
        }
        
        this.hasSearchedLocation = true;
        
        // Determine what we find based on location
        const roll = Math.random();
        const finds = [];
        
        if (location.searchable) {
            // Supplies
            if (roll < 0.4) {
                const amount = Math.floor(Math.random() * 3) + 1;
                this.supplies += amount;
                finds.push({ type: 'supplies', amount });
            }
            // Fuel
            else if (roll < 0.6) {
                const amount = Math.floor(Math.random() * 2) + 1;
                this.fuel += amount;
                finds.push({ type: 'fuel', amount });
            }
            // Sanity-affecting discovery
            else if (roll < 0.8) {
                const sanityChange = Math.random() < 0.5 ? 10 : -15;
                this.modifySanity(sanityChange);
                finds.push({ type: 'sanity', amount: sanityChange });
            }
            // Nothing
            else {
                finds.push({ type: 'nothing' });
            }
        } else {
            finds.push({ type: 'nothing' });
        }
        
        return { success: true, finds };
    },
    
    // Add party member
    addPartyMember(member) {
        this.party.push({
            name: member.name,
            occupation: member.occupation || 'Stranger',
            status: 'healthy',
            isPlayer: false
        });
    },
    
    // Hurt/kill party member
    hurtPartyMember(index, status = 'injured') {
        if (this.party[index]) {
            this.party[index].status = status;
        }
    },
    
    // Check game over conditions
    checkGameOver() {
        if (this.sanity <= 0) {
            return { over: true, reason: 'madness' };
        }
        if (this.pursuit >= 10) {
            return { over: true, reason: 'caught' };
        }
        if (this.party.filter(m => m.status !== 'dead').length === 0) {
            return { over: true, reason: 'death' };
        }
        return { over: false };
    },
    
    // Check victory
    checkVictory(location) {
        return location && location.type === 'end';
    }
};
