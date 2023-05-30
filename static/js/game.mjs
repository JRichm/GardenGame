import { highlightSelection, updateHoverText } from './gameUI.mjs'
import { getUpgrade } from './upgrades.mjs'

class GameSquare {
    constructor(x, y, gameObject) {
        this.char = '.';
        this.name = 'Empty Game Square';
        this.color = 'ffffff';
        this.plant_id = undefined;
        this.current_leaves_per_second = 0;
        this.square_id = '' + x + y;
        this.squareIndex = [x, y];
        this.element = document.getElementById('gc-' + this.square_id);
        this.plantable = true;
        this.base_plants = base_plants;
        this.upgrades = upgrades
        this.gameObject = gameObject;
        this.timesToNurture;
        this.nurtureAmount = 0;
        this.readyToHarvest = false
    }

    userClick(selection) {
        if (this.plantable) {
            if (selection.store) {
                let itemID = selection.store;

                // check what selection type is (plants/upgrade)
                switch (selection.type) {

                    // if a plant is selected
                    case 'p':

                        // check if user has enough funds
                        if (this.gameObject.current_leaves >= this.base_plants[itemID - 1]['price']) {

                            // plant seed and adjust current amount of leaves
                            this.plantSeed(itemID);
                            this.gameObject.current_leaves -= this.base_plants[itemID - 1]['price']
                        } else console.log('not enough funds');
                        break;

                    // if an upgrade is selected
                    case 'u':

                        // check if user has enough funds
                        if (this.gameObject.current_leaves >= this.upgrades[itemID - 1]['price']) {

                            // plant seed and adjust current amount of leaves
                            this.plantUpgrade(itemID);
                            this.gameObject.current_leaves -= this.upgrades[itemID - 1]['price']
                        } else console.log('not enough funds');
                        break;
                }
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
        if (this.plant_id !== undefined) {
            if (this.readyToHarvest == true) {
                this.harvestPlant();
            } else if (this.nurtureAmount >= this.timesToNurture) {
                this.boldPlant();
            } else if (this.nurtureAmount <= this.timesToNurture) {
                this.gameObject.addLeaves(1)
                this.nurtureAmount++;
            }
        }

        let hoverData = [
            [[[`${this.name}`, 'bold']],
            [[`Return: +${+this.current_leaves_per_second}£ps`],
            [`Upgrade Bonus: +${+this.current_leaves_per_second - +this.base_return}£ps`]]]
        ]

        updateHoverText(hoverData)
    }

    boldPlant() {
        this.element.parentElement.style = `font-weight:bold;`;
        this.element.style.fontSize = '60px'
        this.readyToHarvest = true;
    }

    harvestPlant() {
        this.element.parentElement.style = `font-weight:400;`;
        this.element.style.fontSize = '45px'
        this.readyToHarvest = false;
        this.nurtureAmount = 0
        this.gameObject.addLeaves(Number(this.base_return) * 5)
    }

    plantSeed(plant_id) {
        this.plant_id = plant_id;
        this.plantable = false;
        let plant = this.base_plants[parseInt(this.plant_id) - 1];
        this.base_return = plant.base_return;
        this.name = plant.name;
        this.char = plant.name.charAt(0);
        this.color = plant.color;
        this.element.innerHTML = this.char;
        this.element.style = `color: #${this.color};`
        this.timesToNurture = 1 + (this.plant_id * 7);
        this.current_leaves_per_second = this.base_return;
    }

    plantUpgrade(upgrade_id) {
        let upgrade = getUpgrade(upgrade_id, this.squareIndex, this.gameObject)
        if (upgrade) {
            this.upgrade_id = upgrade_id
            this.name = upgrade.name;
            this.plantable = false;
            this.char = upgrade.name.charAt(0)
            this.color = upgrade.color
            this.element.innerHTML = this.char;
            this.element.style = `color: #${this.color};`
            console.log(upgrade.color)

            upgrade.activate(this.upgrade_id);
        } else {
            console.log('Invalid Upgrade ID')
        }
    }

    receiveUpgrade(upgrade_value) {
        // each upgrade value will contain the target and the multiplier
        // something like {value to change}{multiplier}
        // switch
        let upgradeString = upgrade_value.split('-');
        switch (upgradeString[0]) {

            // reduces times to nurture
            case 'nt':
                this.timesToNurture = 1 + this.plant_id * 7 * (1 - upgradeString[1]);
                break;

            // adds to base return
            case 'rx':
                this.current_leaves_per_second = this.base_return + (this.base_return * upgradeString[1]);

                break;

            // give money to player if plant is removed
            // Zero Waste:       [zm-25][]
            case 'zm':
                console.log('zombie cash')
                break;
        }

        console.log(this.char + ' received an upgrade of ' + upgrade_value);
    }

    removePlant() {
        this.char = '.'
        this.color = '#555555'
        this.plant_id = undefined
        this.element.innerHTML = this.char;
        this.element.style = `color: #${this.color}`
        this.plantable = true;
        this.base_return = 0;
        this.current_leaves_per_second = 0
        return false;
    }

    getSaveData() {

        if (this.plant_id) {
            return `${this.square_id}w${this.plant_id}`
        } else if (this.upgrade_id) {
            return `${this.square_id}w${this.upgrade_id + 17}`
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
        this.previousSelection = undefined;
        this.total_leaves_since_save = 0

        this.map_size = 9;
        this.selection = {
            store: undefined,
            type: undefined
        };
        this.startTime = Date.now();

        this.base_plants = this.getBasePlants();
        this.game_board;

        setTimeout(() => {
            this.game_board = Array(9).fill().map((_, rowIndex) => Array(9).fill().map((_, colIndex) => new GameSquare(rowIndex, colIndex, this)));
        }, 500);

        // Call the loadGame function after the game_board is fully initialized
        setTimeout(() => {
            this.loadGame(this.id);
        }, 500);
    }

    updateUserSelection(event) {
        let shopItem = event.target.closest('.shop-item');
        if (shopItem) {
            this.selection.store = +shopItem.id.split('-')[0];
            this.selection.type = shopItem.id.split('-')[1];
            highlightSelection(event)
        }
    }

    userClickGameSquare(event) {
        switch (true) {

            // only do stuff when click event is game-square
            case event.target.className === 'click-div':

                // get index from html elements id
                let number = event.target.nextElementSibling.id.split('-')[1]; // Extract the number after 'gs-'
                let digits = number.split('').map(Number);
                let clickSquare = this.game_board[digits[0]][digits[1]]

                clickSquare.userClick(this.selection);
                this.saveGame()
        }
    }

    userRightClickGameSquare(event) {
        switch (true) {

            // only do stuff when click event is game-square
            case event.target.className === 'click-div':

                // get index from html elements id
                let number = event.target.id.split('-')[1]; // Extract the number after 'gc-'
                let digits = number.split('').map(Number);

                this.game_board[digits[0]][digits[1]].userRightClick(this.selection);
                return false;
        }
    }

    userHoverGameSquare(event) {
        switch (true) {

            // only do stuff when hover event is game-square
            case event.target.className === 'click-div':

                // get index from html elements id
                let number = event.target.nextElementSibling.id.split('-')[1]; // Extract the number after 'gc-'
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
            let sqc = square.split('w')[0].split('')
            if (sqc[1] === '' || sqc[0] === undefined) return

            // add each plants current yield to new leaves per second value
            leaves_per_second += this.game_board[sqc[0]][sqc[1]].getCurrentYield()
        })

        // update game object and front end's lps
        this.leaves_per_second = leaves_per_second;
        document.getElementById('current-LPS').innerHTML = this.leaves_per_second

    }

    updateCurrentLeaves = () => {

        // Caclulate the difference in time between this call and last
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.startTime) / 1000;

        // Calculate the amount of leaves to give the player based on the current LPS and deltaTime
        const leavesToAdd = this.leaves_per_second * deltaTime;

        // Add the calculated leaves to the current leaves value
        this.current_leaves += leavesToAdd;
        this.total_leaves_since_save += +leavesToAdd

        // Update the current leaves value on the screen
        document.getElementById('current-leaves').innerHTML = this.current_leaves.toFixed(0);

        // Call the update function recursively for continuous updates
        this.startTime = Date.now();
        requestAnimationFrame(this.updateCurrentLeaves);
    }

    addLeaves(amount) {
        this.current_leaves += +amount
    }

    showShopItemStats(event) {
        if (this.previousSelection) {
            document.getElementById(`ipi-${this.previousSelection}`).classList.remove('hidden')
            document.getElementById(`iqi-${this.previousSelection}`).classList.add('hidden')
        }

        document.getElementById(`iqi-${event.target.id}`).classList.remove('hidden')
        document.getElementById(`ipi-${event.target.id}`).classList.add('hidden')

        this.previousSelection = event.target.id

        setTimeout(() => {
            document.getElementById(`ipi-${this.previousSelection}`).classList.remove('hidden')
            document.getElementById(`iqi-${this.previousSelection}`).classList.add('hidden')
        }, 5000)
    }


    saveGame() {
        let saveString = ''

        // loop through game squares in map data
        for (let sqx = 0; sqx < 9; sqx++) {
            for (let sqy = 0; sqy < 9; sqy++) {
                let squareData = this.game_board[sqx][sqy].getSaveData();

                // check if square has data
                if (squareData) {
                    // capture square data
                    saveString += squareData + ',';
                }
            }
        }

        // save map_data to game object and update lps
        this.map_data = saveString;
        this.up
        this.calculateLeavesPerSecond()

        // send map_data to server to update 'saves' table
        fetch(`/savegame/${this.id}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'map_data': saveString,
                    'current_currency': this.current_leaves,
                    'leaves_per_second': this.leaves_per_second,
                    'last_login': Date.now(),
                    'total_leaves': Math.floor(this.total_leaves_since_save)
                }),
            })
            .then(this.total_leaves_since_save = 0)
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

            // if map data is empty, dont load anything
            if (this.map_data === null) return;

            // loop through saved plants
            let mapData = this.map_data.split(',');
            let upgradeSquares = [];
            for (let sq = 0; sq < mapData.length; sq++) {
                if (mapData[0]) {
                    let squarePos = mapData[sq].split('w')[0].split('');
                    let plant_id = mapData[sq].split('w')[1];
                    if (squarePos[0] !== undefined) {
                        if (plant_id >= 17) upgradeSquares.push([this.game_board[squarePos[0]][squarePos[1]], plant_id]);
                        else this.game_board[squarePos[0]][squarePos[1]].plantSeed(plant_id);

                        // update game board where plants exist

                    }
                }
            }

            upgradeSquares.forEach(each => each[0].plantUpgrade(each[1] - 17));

            // update current leaves and lps
            this.startTime = Date.now();
            this.calculateLeavesPerSecond()
            this.updateCurrentLeaves()
        }, 600);
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


