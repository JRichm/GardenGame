class GameSquare {
    constructor(x, y) {
        this.char = '.';
        this.color = '#ffffff';
        this.plant_id = undefined;
        this.square_id = '' + x + y
        this.squareIndex = [x, y]
        this.element = document.getElementById(this.square_id)
    }

    userClick() {
        this.element.style = 'background-color:white;'
    }

    userHover() {
        this.element.style = 'background-color:#202129;'
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
        this.game_board = Array(9).fill().map((_, rowIndex) => Array(9).fill().map((_, colIndex) => new GameSquare(rowIndex, colIndex)))
        this.selection = {
            store: null,
            inventory: null
        };
    }
    
    updateUserSelection(event) {
        switch (true) {

            // click shop item box
            case event.target.className === 'shop-item':
                this.selection.store = event.target.firstElementChild.innerHTML
                console.log(this.selection)
                break;
            
            // click shop item name
            case event.target.parentElement.className === 'shop-item':
                this.selection.store = event.target.parentElement.firstElementChild.innerHTML
                console.log(this.selection)
                break;
        }
    }

    userClickGameSquare(event) {
        switch (true) {

            // double check that user clicked game-square
            case event.target.className === 'game-square':

                // get index from html elements id
                let index = event.target.id.split('').map(Number)
                this.game_board[index[0]][index[1]].userClick()
        }
    }

    userHoverGameSquare(event) {
        switch (true) {

            // only do stuff when event is game-square
            case event.target.className === 'game-square':

            // get index from html elements id
            let index = event.target.id.split('').map(Number)
            this.game_board[index[0]][index[1]].userHover()

        }
    }
}
