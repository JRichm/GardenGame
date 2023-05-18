class GameSquare {
    constructor(x, y, base_plants) {
        this.char = '.';
        this.color = 'ffffff';
        this.plant_id = undefined;
        this.current_leaves_per_second
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

    get_current_yield() {
        return this.current_leaves_per_second
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
    }

    removePlant() {
        this.char = '.'
        this.color = '#555555'
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

        this.map_size = 9;
        this.selection = {
            store: undefined,
            inventory: undefined
        };

        this.base_plants = this.getBasePlants();
        this.game_board;

        setTimeout(() => {
            this.game_board = Array(9).fill().map((_, rowIndex) => Array(9).fill().map((_, colIndex) => new GameSquare(rowIndex, colIndex, this.base_plants)));
        }, 500)

        this.loadGame(this.id);
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
        console.log('\nLeaves per second:')
        let squareArray = this.map_data.split(',');
        let leaves_per_second = 0

        squareArray.forEach(square => {
            let squareCords = square.split('w')[0].split('')
            if (squareCords[1] === '' || squareCords[0] === undefined) return
            leaves_per_second += this.game_board[squareCords[0]][squareCords[1]].get_current_yield()
        })
        this.leaves_per_second = leaves_per_second;
        console.log(this.leaves_per_second)
        document.getElementById('current-LPS').innerHTML = this.leaves_per_second
    }

    updateCurrentLeaves() {
        const startTime = Date.now(); // Get the current timestamp
        let currentLeaves = 0;
        const update = () => {

            console.log(this.leaves_per_second)
            const currentTime = Date.now();
            const deltaTime = (currentTime - startTime) / 1000; // Calculate the time difference in seconds
            currentLeaves = this.leaves_per_second * deltaTime;

            // Update the current leaves value on the screen
            document.getElementById('current-leaves').innerHTML = currentLeaves.toFixed(0); // Replace 'current-leaves' with the current leaves with two decimal places

            requestAnimationFrame(update); // Call update function recursively for continuous updates
        }

        update(); // Initial call to start the update loop
    }

    saveGame() {
        let saveString = ''
        for (let sqx = 0; sqx < 9; sqx++) {
            for (let sqy = 0; sqy < 9; sqy++) {
                let squareData = this.game_board[sqx][sqy].getSaveData();
                if (squareData)
                    saveString += squareData + ',';
            }
        }
        this.map_data = saveString;
        this.calculateLeavesPerSecond()

        fetch(`/savegame/${this.id}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'map_data': saveString }),
            })
            .then(data => console.log(data))
            .catch(err => console.log(err))
    }

    loadGame(map_id) {

        document.getElementById('shop-1').classList.remove('hidden');
        setTimeout(() => {
            this.id = userSave.map_id;
            this.map_data = userSave.map_data;

            if (this.map_data === null) return;

            let mapData = this.map_data.split(',');
            for (let sq = 0; sq < mapData.length; sq++) {
                if (mapData[0]) {
                    let squarePos = mapData[sq].split('w')[0].split('');
                    let plant_id = mapData[sq].split('w')[1];
                    if (squarePos[0] !== undefined) {
                        this.game_board[squarePos[0]][squarePos[1]].plantSeed(plant_id);
                    }
                }
            }
            this.calculateLeavesPerSecond()
            this.updateCurrentLeaves()
        }, 500);
    }

    getBasePlants() {
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

