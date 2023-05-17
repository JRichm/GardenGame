class GameSquare {
    constructor(x, y, base_plants) {
        this.char = '.';
        this.color = 'ffffff';
        this.plant_id = undefined;
        this.square_id = '' + x + y;
        this.squareIndex = [x, y];
        this.element = document.getElementById('gs-' + this.square_id);
        this.plantable = true;
        this.base_plants = base_plants;
    }


    userClick(selection) {
        if (this.plantable) {
            if (selection.store) {
                this.plant_id = selection.store;
                this.plantSeed();
                this.plantable = false;
            }
        }
    }

    userRightClick(selection) {
        if (this.plant_id) {
            this.removePlant();
            this.plantable = true;
        }
        return false;
    }

    userHover() {

        this.element.style = 'background-color:#202129;';
    }

    plantSeed() {
        this.char = this.base_plants[parseInt(this.plant_id) - 1].name.charAt(0)
        this.color = this.base_plants[parseInt(this.plant_id) - 1].color
        this.element.firstElementChild.innerHTML = this.char;
        this.element.firstElementChild.style = `color: #${this.color};`
    }

    removePlant() {
        this.char = '.'
        this.color = '#555555'
        this.element.firstElementChild.innerHTML = this.char;
        this.element.firstElementChild.style = `color: #${this.color}`
        return false;
    }

    returnSaveData() {
        // this function will be called whenever the 'map_data' string gets updated
        // let's call this whenever the player places a new plant or deletes one
        // and maybe when the user hovers over the header as if to close the game

        // the data that this function returns needs to hold all of the data that 
        // needs to be saved to the server so the user can close the window and come back

        // the data that we will need to save is:
        //      
        //      square_id
        //      plant_id
        if (this.plant_id) {
            console.log(`saved ${this.plant_id} at location ${this.squareIndex}`)
            return `${this.squareIndex}w${this.plant_id}`
        }
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
            store: undefined,
            inventory: undefined
        };

        this.base_plants = []
        for (let i = 1; i < 17; i++) {
            fetch(`/gameplantinfo/${i}`)
                .then(response => response.json())
                .then(data => {
                    let base_plant = {
                        'plant_id': data.plant_id,
                        'name': data.name,
                        'price': data.price,
                        'base_return': data.base_return,
                        'color': data.color
                    }
                    this.base_plants.push(base_plant)
                }).catch(err => {
                    console.log(err);
                })
        }

        this.game_board = Array(9).fill().map((_, rowIndex) => Array(9).fill().map((_, colIndex) => new GameSquare(rowIndex, colIndex, this.base_plants)));
    }

    updateUserSelection(event) {
        switch (true) {

            // click shop item box
            case event.target.className === 'shop-item-info':
                this.selection.store = event.target.id;
                console.log(this.selection);
                break;

            // click shop item name
            case event.target.parentElement.className === 'shop-item-info':
                this.selection.store = event.target.parentElement.id;
                console.log(this.selection);
                break;
        }
    }

    userClickGameSquare(event) {
        switch (true) {

            // only do stuff when click event is game-square
            case event.target.className === 'game-square':

                // get index from html elements id
                let number = event.target.id.split('-')[1]; // Extract the number after 'gs-'
                let digits = number.split('').map(Number);

                this.game_board[digits[0]][digits[1]].userClick(this.selection);
        }
    }

    userRightClickGameSquare(event) {
        switch (true) {

            // only do stuff when click event is game-square
            case event.target.className === 'game-square':

                // get index from html elements id
                let number = event.target.id.split('-')[1]; // Extract the number after 'gs-'
                let digits = number.split('').map(Number);

                this.game_board[digits[0]][digits[1]].userRightClick(this.selection);
                return false;
        }
    }

    userHoverGameSquare(event) {
        switch (true) {

            // only do stuff when hover event is game-square
            case event.target.className === 'game-square':

                // get index from html elements id
                let number = event.target.id.split('-')[1]; // Extract the number after 'gs-'
                let digits = number.split('').map(Number);

                this.game_board[digits[0]][digits[1]].userHover();
        }
    }

    saveGame() {
        for (let sqx = 0; sqx < 9; sqx++) {
            for (let sqy = 0; sqy < 9; sqy++) {
                this.game_board[sqx][sqy].getSaveData
            }
        }
    }
}
