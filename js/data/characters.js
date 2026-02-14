// Character Definitions
const CHARACTERS = [
    {
        id: 'doctor',
        name: 'Dr. Eleanor Marsh',
        occupation: 'Alienist',
        description: 'A psychiatrist who uncovered too much.',
        ability: 'Medical Training: +20 starting Sanity',
        startSanity: 100,
        startSupplies: 8,
        startFuel: 5
    },
    {
        id: 'reporter',
        name: 'Jack Brennan',
        occupation: 'Reporter',
        description: 'Chasing the story of a lifetime.',
        ability: 'Resourceful: +3 starting Supplies',
        startSanity: 80,
        startSupplies: 13,
        startFuel: 5
    },
    {
        id: 'professor',
        name: 'Prof. Harold Armitage',
        occupation: 'Occultist',
        description: 'Knowledge of the forbidden.',
        ability: 'Arcane Lore: Events reveal more info',
        startSanity: 70,
        startSupplies: 10,
        startFuel: 5
    },
    {
        id: 'nurse',
        name: 'Mary Sullivan',
        occupation: 'Asylum Nurse',
        description: 'She knows the layout and the guards.',
        ability: 'Inside Knowledge: +2 starting Fuel',
        startSanity: 90,
        startSupplies: 10,
        startFuel: 7
    },
    {
        id: 'veteran',
        name: 'Thomas "Red" McCarthy',
        occupation: 'War Veteran',
        description: 'Survived the trenches. Survives this.',
        ability: 'Combat Ready: Better outcomes in fights',
        startSanity: 60,
        startSupplies: 12,
        startFuel: 5
    },
    {
        id: 'heiress',
        name: 'Victoria Blackwood',
        occupation: 'Heiress',
        description: 'Money can\'t buy sanity, but it helps.',
        ability: 'Wealthy: Starts with a companion',
        startSanity: 85,
        startSupplies: 15,
        startFuel: 6,
        startsWithCompanion: true,
        companionName: 'Charles',
        companionOccupation: 'Butler'
    }
];
