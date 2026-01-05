let gameData = {};
let currentRoom = "";
let inventory = [];
let flags = {};

const display = document.getElementById('display');
const inputField = document.getElementById('cmd-input');

// 1. Load the Game Data
async function initGame() {
    try {
        const response = await fetch('world.json');
        if (!response.ok) throw new Error("Could not find world.json");
        gameData = await response.json();
        
        currentRoom = gameData.start_room;
        flags = gameData.game_flags || {};
        
        renderRoom();
    } catch (err) {
        print("Error: " + err.message + ". Make sure world.json exists in your repo!");
    }
}

// 2. The "Wiring" - Listen for the Enter Key
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const val = inputField.value;
        inputField.value = ''; // Clear the input
        processCommand(val);
    }
});

function renderRoom() {
    const room = gameData.rooms[currentRoom];
    print(`<strong>${currentRoom.replace('_', ' ').toUpperCase()}</strong>`);
    print(room.description);
    
    if (room.items && room.items.length > 0) {
        print(`<span style="color: #55FFFF">You see: ${room.items.join(', ')}</span>`);
    }
}

function processCommand(input) {
    const parts = input.toLowerCase().trim().split(' ');
    const verb = parts[0];
    const noun = parts[parts.length - 1]; // Grabs the last word as the object
    const room = gameData.rooms[currentRoom];

    print(`<span class="user-input">> ${input}</span>`);

    if (verb === "go" || verb === "move") {
        movePlayer(noun, room);
    } else if (verb === "take" || verb === "get") {
        takeItem(noun, room);
    } else if (verb === "inv" || verb === "inventory") {
        print("Inventory: " + (inventory.length ? inventory.join(', ') : "Nothing"));
    } else if (verb === "help") {
        print("Commands: GO [direction], TAKE [item], INV, HELP");
    } else {
        print("I don't know how to '" + verb + "'.");
    }
}

function movePlayer(direction, room) {
    if (room.exits && room.exits[direction]) {
        currentRoom = room.exits[direction];
        renderRoom();
    } else {
        print("You can't go that way.");
    }
}

function takeItem(item, room) {
    if (room.items && room.items.includes(item)) {
        inventory.push(item);
        room.items = room.items.filter(i => i !== item);
        print("You took the " + item + ".");
    } else {
        print("That's not here.");
    }
}

function print(text) {
    display.innerHTML += `<p>${text}</p>`;
    display.scrollTop = display.scrollHeight;
}

initGame();
