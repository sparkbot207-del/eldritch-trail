// Location Definitions
const LOCATIONS = [
    {
        id: 'danvers',
        name: 'Danvers State Hospital',
        type: 'start',
        description: 'The Gothic towers loom against the gray sky. You must escape before they find you missing.',
        searchable: true,
        canRest: false,
        background: 'assets/backgrounds/asylum.jpg',
        hotspots: [
            { x: 20, y: 30, width: 20, height: 25, onTap: () => Game.examineHotspot('A broken window. Glass shards glitter in the moonlight.') },
            { x: 60, y: 50, width: 15, height: 20, onTap: () => Game.examineHotspot('Old medical records scattered on the floor. Names you recognize...') }
        ]
    },
    {
        id: 'back_roads',
        name: 'Back Roads',
        type: 'road',
        description: 'Winding dirt roads through overgrown farmland. The car rattles over potholes.',
        searchable: false,
        canRest: true,
        background: 'assets/backgrounds/road.jpg',
        hotspots: [
            { x: 40, y: 60, width: 20, height: 15, onTap: () => Game.examineHotspot('Tire tracks. Someone else came this way recently.') }
        ]
    },
    {
        id: 'salem',
        name: 'Outskirts of Salem',
        type: 'town',
        description: 'The witch-haunted town sleeps uneasily. Old sins cast long shadows.',
        searchable: true,
        canRest: true,
        background: 'assets/backgrounds/town.jpg',
        hotspots: [
            { x: 25, y: 45, width: 20, height: 25, onTap: () => Game.examineHotspot('An old cemetery. Some stones date back to 1692.') },
            { x: 65, y: 35, width: 15, height: 20, onTap: () => Game.examineHotspot('A general store. Might find supplies here.') }
        ]
    },
    {
        id: 'forest',
        name: 'Haunted Woods',
        type: 'road',
        description: 'Ancient trees press close. The fog swallows sound. Something watches.',
        searchable: true,
        canRest: false,
        background: 'assets/backgrounds/forest.jpg',
        hotspots: [
            { x: 30, y: 50, width: 25, height: 30, onTap: () => Game.examineHotspot('Strange symbols carved into the bark. They seem to writhe when you look away.') }
        ]
    },
    {
        id: 'ipswich',
        name: 'Ipswich',
        type: 'town',
        description: 'A quiet fishing town. The locals regard strangers with suspicion.',
        searchable: true,
        canRest: true,
        background: 'assets/backgrounds/town.jpg',
        hotspots: [
            { x: 50, y: 40, width: 20, height: 20, onTap: () => Game.examineHotspot('The fishing boats bob gently. One looks abandoned.') },
            { x: 15, y: 55, width: 15, height: 15, onTap: () => Game.examineHotspot('A tavern. You could ask for help... or trouble.') }
        ]
    },
    {
        id: 'marsh',
        name: 'Coastal Marshes',
        type: 'road',
        description: 'Salt marshes stretch to the horizon. The air smells of decay and brine.',
        searchable: false,
        canRest: false,
        background: 'assets/backgrounds/marsh.jpg',
        hotspots: [
            { x: 45, y: 70, width: 25, height: 15, onTap: () => Game.examineHotspot('The water is unnaturally still. Something large moved beneath the surface.') }
        ]
    },
    {
        id: 'newburyport',
        name: 'Newburyport',
        type: 'town',
        description: 'A larger town. More eyes, more danger... but also more resources.',
        searchable: true,
        canRest: true,
        background: 'assets/backgrounds/town.jpg',
        hotspots: [
            { x: 30, y: 35, width: 20, height: 25, onTap: () => Game.examineHotspot('A hospital. Real medicine might help.') },
            { x: 70, y: 50, width: 15, height: 20, onTap: () => Game.examineHotspot('A gas station. Fuel is getting low.') }
        ]
    },
    {
        id: 'border_road',
        name: 'Road to Maine',
        type: 'road',
        description: 'The state line is close. You can almost taste freedom.',
        searchable: false,
        canRest: true,
        background: 'assets/backgrounds/road.jpg',
        hotspots: [
            { x: 50, y: 30, width: 20, height: 20, onTap: () => Game.examineHotspot('A sign: "MAINE - 5 MILES". So close now.') }
        ]
    },
    {
        id: 'maine',
        name: 'Maine Border',
        type: 'end',
        description: 'You made it. Massachusetts fades behind you. But some horrors travel with the mind.',
        searchable: false,
        canRest: false,
        background: 'assets/backgrounds/maine.jpg',
        hotspots: []
    }
];

// Get location by index
function getLocation(index) {
    return LOCATIONS[Math.min(index, LOCATIONS.length - 1)];
}
