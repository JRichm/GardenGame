class GameSquare {
    constructor() {
        this.char = '.';
        this.color = '#ffffff';
        this.plant_id = undefined;
    }
}

class Plant {
    constructor(name, char, color) {
        this.name = name;
        this.char = char;
        this.color = color;
    }
}

export class Game {
    constructor(save_id, user_id, current_currency, leaves_per_second, map_data, upgrades, last_login) {

        this.id = save_id;
        this.user_id = user_id;
        this.current_currency = current_currency;
        this.leaves_per_second = leaves_per_second;
        this.map_data = map_data;
        this.upgrades = upgrades;
        this.last_login = last_login;

        this.map_size = 9
        this.selection = {
            store: null,
            inventory: null,
            game_board: Array(9).fill().map(() => Array(9).fill(new GameSquare()))
        };
    }
    
    updateUserSelection(event) {
        switch (true) {
            case event.target.className === 'shop-item':
                this.selection.store = event.target.firstElementChild.innerHTML
                console.log(this.selection)
                break;
            case event.target.parentElement.className === 'shop-item':
                this.selection.store = event.target.parentElement.firstElementChild.innerHTML
                console.log(this.selection)
                break;
        }
    }
}
