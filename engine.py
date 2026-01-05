import json
import os

class AdventureGame:
    def __init__(self, data_file):
        with open(data_file, 'r') as f:
            self.data = json.load(f)
        
        self.current_room = self.data['start_room']
        self.inventory = []
        self.flags = self.data['game_flags']

    def play(self):
        print("--- ADVENTURE START ---")
        while True:
            room = self.data['rooms'][self.current_room]
            print(f"\n{room['description']}")
            
            if room.get('items'):
                print(f"Items here: {', '.join(room['items'])}")

            cmd = input("\n> ").lower().split()
            if not cmd: continue
            
            verb = cmd[0]
            noun = cmd[1] if len(cmd) > 1 else None

            if verb == "go":
                self.move(noun)
            elif verb == "take":
                self.take_item(noun)
            elif verb == "use" or verb == "give":
                self.interact(noun)
            elif verb == "inv":
                print(f"Inventory: {self.inventory}")
            elif verb == "quit":
                break
            else:
                print("I don't know how to do that.")

    def move(self, direction):
        room = self.data['rooms'][self.current_room]
        if direction in room['exits']:
            exit_data = room['exits'][direction]
            
            # Logic Gate Check
            if isinstance(exit_data, dict):
                if self.flags.get(exit_data['required_flag']):
                    self.current_room = exit_data['target']
                else:
                    print(exit_data['fail_msg'])
            else:
                self.current_room = exit_data
        else:
            print("You can't go that way.")

    def take_item(self, item):
        room = self.data['rooms'][self.current_room]
        if item in room.get('items', []):
            self.inventory.append(item)
            room['items'].remove(item)
            print(f"Picked up {item}.")
        else:
            print("That isn't here.")

    def interact(self, noun):
        room = self.data['rooms'][self.current_room]
        # Check interactions defined in world.json
        for action, details in room.get('interactions', {}).items():
            if details['item_required'] in self.inventory:
                self.flags[details['set_flag']] = True
                self.inventory.remove(details['item_required'])
                print(details['success_msg'])
                return
        print("Nothing happened.")

if __name__ == "__main__":
    game = AdventureGame('world.json')
    game.play()
