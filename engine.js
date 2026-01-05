let gameData = {};
let currentRoom = "";
let inventory = [];
let flags = {};

// 1. Load the Game Data
async function initGame() {
    const response = await fetch('world.json');
    gameData = await response.json();
    currentRoom = gameData.start_room;
    flags = gameData.game_flags;
    renderRoom();
}

// 2. Display the current scene
function renderRoom() {
    const room = gameData.rooms[currentRoom];
    let output = `<p class="desc">${room.description}</p>`;
    
    if (room.items && room.items.length > 0) {
        output += `<p class="items">You see: ${room.items.join(', ')}</p>`;
    }
    
    document.getElementById('display').innerHTML += output;
    scrollToBottom();
}

// 3. Process Commands (The Parser)
function processCommand(input) {
    const parts = input.toLowerCase().trim().split(' ');
    const verb = parts[0];
    const noun = parts[1];
    const room = gameData.rooms[currentRoom];

    document.getElementById('display').innerHTML += `<p class="user-input">> ${input}</p>`;

    if (verb === "go") {
        movePlayer(noun, room);
    } else if (verb === "take") {
        takeItem(noun, room);
    } else if (verb === "use" || verb === "give") {
        handleInteraction(noun, room);
    } else if (verb === "inv") {
        print(`Inventory: ${inventory.length ? inventory.join(', ') : 'Empty'}`);
    } else {
        print("I don't understand that command.");
    }
    scrollToBottom();
}

// 4. Logic Gate: Movement
function movePlayer(direction, room) {
    const exit = room.exits[direction];
    if (!exit) {
        print("You can't go that way.");
        return;
    }

    if (typeof exit === 'object') {
        if (flags[exit.required_flag]) {
            currentRoom = exit.target;
            renderRoom();
        } else {
            print(exit.fail_msg);
        }
    } else {
        currentRoom = exit;
        renderRoom();
    }
}

// Helper functions
function print(text) {
    document.getElementById('display').innerHTML += `<p class="msg">${text}</p>`;
}

function scrollToBottom() {
    const display = document.getElementById('display');
    display.scrollTop = display.scrollHeight;
}

initGame();
