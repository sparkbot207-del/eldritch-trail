// Random Events
const EVENTS = [
    // Road Events
    {
        id: 'flat_tire',
        title: 'Flat Tire',
        text: 'A loud pop echoes through the night. The car lurches to one side. You have a flat tire.',
        locationType: 'road',
        weight: 3,
        choices: [
            {
                text: 'Use spare tire (-1 Supplies)',
                effects: { supplies: -1 },
                result: 'You change the tire quickly. The cold seeps into your bones as you work.'
            },
            {
                text: 'Abandon the car and walk',
                effects: { fuel: -99, pursuit: 2 },
                result: 'Without the car, they\'ll catch up faster. But you press on through the darkness.'
            }
        ]
    },
    {
        id: 'roadblock',
        title: 'Roadblock Ahead',
        text: 'Flashlights pierce the fog. A police roadblock. They might be looking for escaped patients.',
        locationType: 'road',
        weight: 2,
        choices: [
            {
                text: 'Drive through!',
                effects: { pursuit: 3, sanity: -10 },
                result: 'Shots ring out as you speed past. Your hands shake on the wheel. They know you\'re here now.'
            },
            {
                text: 'Find another route (-1 Fuel)',
                effects: { fuel: -1 },
                result: 'A narrow logging road takes you around. It costs precious fuel, but you remain unseen.'
            },
            {
                text: 'Act normal and pass through',
                effects: { sanity: -5 },
                result: 'Your heart pounds as the officer peers into the car. After an eternity, he waves you through.'
            }
        ]
    },
    {
        id: 'strange_lights',
        title: 'Strange Lights',
        text: 'Ethereal lights dance in the trees alongside the road. They pulse with an unnatural rhythm.',
        locationType: 'road',
        weight: 2,
        choices: [
            {
                text: 'Follow the lights',
                effects: { sanity: -20, supplies: 3 },
                result: 'You find an abandoned camp. Supplies remain, but the visions won\'t leave your mind.'
            },
            {
                text: 'Keep driving',
                effects: { sanity: -5 },
                result: 'You force your eyes forward. The lights follow for miles before fading.'
            }
        ]
    },
    
    // Town Events
    {
        id: 'helpful_stranger',
        title: 'A Helpful Stranger',
        text: 'A nervous young man approaches your car. "You look like you need help. I know a thing or two about running."',
        locationType: 'town',
        weight: 2,
        choices: [
            {
                text: 'Accept his help',
                effects: { addParty: { name: 'Samuel', occupation: 'Drifter' } },
                result: 'Samuel joins your escape. He doesn\'t ask questions. Neither do you.'
            },
            {
                text: 'Politely decline',
                effects: {},
                result: 'He nods sadly and melts back into the shadows. You wonder if you made the right choice.'
            },
            {
                text: 'It\'s a trap - drive away!',
                effects: { fuel: -1 },
                result: 'You peel away from the curb. Maybe you\'re paranoid. Maybe you\'re right.'
            }
        ]
    },
    {
        id: 'suspicious_sheriff',
        title: 'Suspicious Sheriff',
        text: 'The local sheriff eyes your car from across the street. He reaches for his radio.',
        locationType: 'town',
        weight: 2,
        choices: [
            {
                text: 'Leave immediately',
                effects: { pursuit: 1 },
                result: 'You drive away as casually as you can manage. Did he call it in?'
            },
            {
                text: 'Approach and bluff',
                effects: { sanity: -10 },
                result: 'You spin a tale of visiting relatives. He seems convinced, but the stress takes its toll.'
            }
        ]
    },
    {
        id: 'gas_station',
        title: 'Empty Gas Station',
        text: 'An old gas station sits dark and abandoned. The pumps might still have fuel.',
        locationType: 'town',
        weight: 3,
        choices: [
            {
                text: 'Siphon the pumps',
                effects: { fuel: 2 },
                result: 'Success! You manage to extract some fuel from the old tanks.'
            },
            {
                text: 'Search the building',
                effects: { supplies: 2, sanity: -5 },
                result: 'You find canned food and bottled water. Also a journal describing... things you wish you hadn\'t read.'
            },
            {
                text: 'Too risky - move on',
                effects: {},
                result: 'Trust your instincts. Not every opportunity is worth the risk.'
            }
        ]
    },
    
    // Start Events (Asylum)
    {
        id: 'guard_patrol',
        title: 'Guard Patrol',
        text: 'Flashlight beams sweep across the grounds. Guards are doing their rounds.',
        locationType: 'start',
        weight: 3,
        choices: [
            {
                text: 'Wait in the shadows',
                effects: { pursuit: 1 },
                result: 'The guards pass without seeing you. But every moment lost lets them realize you\'re gone.'
            },
            {
                text: 'Create a distraction',
                effects: { supplies: -1, pursuit: -1 },
                result: 'A thrown bottle shatters in the distance. The guards investigate, buying you time.'
            }
        ]
    },
    {
        id: 'fellow_patient',
        title: 'Fellow Patient',
        text: 'A wide-eyed patient clutches your arm. "Take me with you! I\'m not crazy, I swear. I saw what they did in Ward B..."',
        locationType: 'start',
        weight: 2,
        choices: [
            {
                text: 'Take them along',
                effects: { addParty: { name: 'Patient #31', occupation: 'Unknown' }, sanity: -5 },
                result: 'Their ramblings unsettle you, but no one deserves to stay in this place.'
            },
            {
                text: 'Leave them behind',
                effects: { sanity: -10 },
                result: 'Their sobs follow you into the night. You tell yourself you had no choice.'
            }
        ]
    },
    
    // Universal Events
    {
        id: 'nightmare',
        title: 'Waking Nightmare',
        text: 'The boundaries between sleep and waking blur. Shapes writhe at the edge of vision. Is this real?',
        locationType: 'any',
        weight: 2,
        choices: [
            {
                text: 'Focus on something real',
                effects: { sanity: -10 },
                result: 'You count your fingers. Five. Five. Five... wait, five? The visions recede.'
            },
            {
                text: 'Give in to the vision',
                effects: { sanity: -20, supplies: 1 },
                result: 'The shapes reveal a hidden cache nearby. But the knowledge comes at a price.'
            }
        ]
    },
    {
        id: 'memories',
        title: 'Fragmented Memories',
        text: 'Images flash unbidden: electrodes, screaming, a face in the mirror that wasn\'t yours...',
        locationType: 'any',
        weight: 2,
        choices: [
            {
                text: 'Try to remember more',
                effects: { sanity: -15 },
                result: 'The memories crystallize. You know now why they locked you away. You wish you didn\'t.'
            },
            {
                text: 'Push it away',
                effects: { sanity: -5 },
                result: 'Some doors are better left closed. You focus on the road ahead.'
            }
        ]
    },
    {
        id: 'car_trouble',
        title: 'Engine Trouble',
        text: 'The engine sputters and coughs. A plume of steam rises from under the hood.',
        locationType: 'any',
        weight: 2,
        choices: [
            {
                text: 'Attempt repairs (-2 Supplies)',
                effects: { supplies: -2 },
                result: 'With improvised tools and desperation, you get the engine running again.'
            },
            {
                text: 'Find water to cool it',
                effects: { fuel: -1, sanity: -5 },
                result: 'A detour to a stream costs fuel, and the water reflects shapes that shouldn\'t be there.'
            }
        ]
    }
];
