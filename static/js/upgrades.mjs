
//upgrades.mjs

import { upgradeArea } from './gameUI.mjs'

class BaseUpgrade {
    constructor(upgrade_id, squareID, game) {
        this.upgrade_id = upgrade_id;
        this.squareID = squareID;
        this.game = game;
        this.level = 0;
        this.name = upgrades[this.upgrade_id - 1].name;
        this.color = upgrades[this.upgrade_id - 1].color;
        this.char = this.name.charAt(0);
        this.displayArea = new upgradeArea(this.squareID, upgrades[this.upgrade_id - 1].color);
    }

    activate(upgrade_id) {
        this.level++;
        let upgradeString = undefined

        switch (upgrade_id) {

            // Mushroom Magic:   [nt-25][nt-33][nt-41][nt-50]
            case 1:
                upgradeString = `nt-${(8.333 * (this.level - 1) + 25)}`;
                break;

            // Yield Multiplier: [rx-05][rx-10][rx-15][rx-20]
            case 2:
                upgradeString = `rx-${(this.level * 5)}`;
                break;
        }

        if (upgradeString) {
            for (let x = this.squareID[1] - this.level; x <= this.squareID[1] + this.level; x++) {
                for (let y = this.squareID[0] - this.level; y <= this.squareID[0] + this.level; y++) {
                    if (this.game.game_board[y][x].plant_id) {
                        this.game.game_board[y][x].receiveUpgrade(upgradeString)
                    }
                }
            }
        }
    }
}

export function getUpgrade(upgrade_id, squareIndex, gameObject) {
    return new BaseUpgrade(upgrade_id, squareIndex, gameObject)
}