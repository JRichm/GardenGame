class GameSquare {
    constructor(x, y, base_plants) {
        this.char = '.';
        this.color = 'ffffff';
        this.plant_id = undefined;
        this.current_leaves_per_second = 0;
        this.square_id = '' + x + y;
        this.squareIndex = [x, y];
        this.element = document.getElementById('gs-' + this.square_id);
        this.plantable = true;
        this.base_plants = base_plants
    }

    userClick(selection) {
        if (this.plantable) {
            if (selection.store) {
                let plant_id = selection.store;
                this.plantSeed(plant_id);
            }
        }
    }

    userRightClick(selection) {
        if (this.plant_id) {
            this.removePlant();
        }
        return false;
    }

    userHover() {
        this.element.style = 'background-color:#202129;';
    }

    plantSeed(plant_id) {
        this.plant_id = plant_id;
        this.plantable = false;
        let plant = this.base_plants[parseInt(this.plant_id) - 1]
        this.current_leaves_per_second = plant.base_return
        this.char = plant.name.charAt(0)
        this.color = plant.color
        this.element.firstElementChild.innerHTML = this.char;
        this.element.firstElementChild.style = `color: #${this.color};`
        let qty = document.getElementById(`${plant_id}-qty`)
        qty.innerHTML = +qty.innerHTML + 1
        let lps = document.getElementById(`total-${plant_id}-lps`)
        lps.innerHTML = plant.base_return * (+qty.innerHTML)
    }

    removePlant() {
        this.char = '.'
        this.color = '#555555'
        this.current_leaves_per_second = 0;
        this.plant_id = undefined
        this.element.firstElementChild.innerHTML = this.char;
        this.element.firstElementChild.style = `color: #${this.color}`
        this.plantable = true;
        return false;
    }

    getSaveData() {
        if (this.plant_id) {
            return `${this.square_id}w${this.plant_id}`
        } else {
            return undefined
        }
    }

    getCurrentYield() {
        return this.current_leaves_per_second
    }
}

export class Game {
    constructor(save_id, user_id, current_currency, leaves_per_second, map_data, upgrades, last_login) {
        this.id = save_id;
        this.user_id = user_id;
        this.current_leaves = current_currency;
        this.leaves_per_second = leaves_per_second;
        this.map_data = map_data;
        this.upgrades = upgrades;
        this.last_login = last_login;

        this.map_size = 9;
        this.selection = {
            store: undefined,
            inventory: undefined
        };
        this.startTime = Date.now();

        this.base_plants = this.getBasePlants();
        this.game_board;

        setTimeout(() => {
            this.game_board = Array(9).fill().map((_, rowIndex) => Array(9).fill().map((_, colIndex) => new GameSquare(rowIndex, colIndex, this.base_plants)));
        }, 500);

        // Call the loadGame function after the game_board is fully initialized
        setTimeout(() => {
            this.loadGame(this.id);
        }, 500);
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
                let clickSquare = this.game_board[digits[0]][digits[1]]

                clickSquare.userClick(this.selection);
                this.saveGame()
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

    calculateLeavesPerSecond() {

        // get individual square data
        let squareArray = this.map_data.split(',');
        let leaves_per_second = 0

        // loop through squares with plants
        squareArray.forEach(square => {
            let squareCords = square.split('w')[0].split('')
            if (squareCords[1] === '' || squareCords[0] === undefined) return

            // add each plants current yield to new leaves per second value
            leaves_per_second += this.game_board[squareCords[0]][squareCords[1]].getCurrentYield()
        })

        // update game object and front end's lps
        this.leaves_per_second = leaves_per_second;
        document.getElementById('current-LPS').innerHTML = this.leaves_per_second

    }

    updateCurrentLeaves = () => {
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.startTime) / 1000;

        // Calculate the amount of leaves to give the player based on the current LPS and deltaTime
        const leavesToAdd = this.leaves_per_second * deltaTime;

        // Add the calculated leaves to the current leaves value
        this.current_leaves += leavesToAdd;

        // Update the current leaves value on the screen
        document.getElementById('current-leaves').innerHTML = this.current_leaves.toFixed(1);

        // Call the update function recursively for continuous updates
        this.startTime = Date.now();
        requestAnimationFrame(this.updateCurrentLeaves);
    }

    saveGame() {
        let saveString = ''

        // loop through game squares in map data
        for (let sqx = 0; sqx < 9; sqx++) {
            for (let sqy = 0; sqy < 9; sqy++) {
                let squareData = this.game_board[sqx][sqy].getSaveData();

                // check if square has data
                if (squareData)

                    // capture square data
                    saveString += squareData + ',';
            }
        }

        // save map_data to game object and update lps
        this.map_data = saveString;
        this.calculateLeavesPerSecond()

        // send map_data to server to update 'saves' table
        fetch(`/savegame/${this.id}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'map_data': saveString,
                    'current_currency': this.current_leaves
                }),
            })
            .then(data => console.log(data))
            .catch(err => console.log(err))
    }

    loadGame(map_id) {
        // open shop
        document.getElementById('shop-1').classList.remove('hidden');

        // wait for map data to get back from server
        setTimeout(() => {
            this.id = userSave.map_id;
            this.map_data = userSave.map_data;
            this.current_leaves = userSave.current_currency;
            console.log(this.current_leaves)

            // if map data is empty, dont load anything
            if (this.map_data === null) return;

            // loop through map data
            let mapData = this.map_data.split(',');
            for (let sq = 0; sq < mapData.length; sq++) {
                if (mapData[0]) {
                    let squarePos = mapData[sq].split('w')[0].split('');
                    let plant_id = mapData[sq].split('w')[1];
                    if (squarePos[0] !== undefined) {

                        // update game board where plants exist
                        this.game_board[squarePos[0]][squarePos[1]].plantSeed(plant_id);
                    }
                }
            }

            // update current leaves and lps
            this.startTime = Date.now();
            this.calculateLeavesPerSecond()
            this.updateCurrentLeaves()
        }, 500);
    }

    getBasePlants() {
        // returns a list of the base plants
        return fetch('/getbaseplants')
            .then(response => response.json())
            .then(data => {
                this.base_plants = data;
                return data
            })
            .catch(err => {
                console.log('Error', err);
                return ['err'];
            })
    }
}

