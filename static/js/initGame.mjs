import { Game } from './game.mjs'


let x = 0;
let y = 0;

let gameSquares = document.getElementsByClassName('game-square');
let shopItems = document.getElementsByClassName('shop-item-info');
let saveButton = document.getElementById('save-game-button');


// get map data from db and feed into newgame Game() constructor
fetch('/mygame').then(response => response.json())
    .then(data => {
        //process the response data
        console.log(data)
    }).catch(err => {
        // handle any errors
        console.error('Error:', err)
    });

// instantiate new game
const newGame = new Game();

// shop buttons event listeners
for (let j = 0; j < shopItems.length; j++) {
    shopItems[j].addEventListener('click', e => newGame.updateUserSelection(e))
}

// game square event listeners
for (let sq = 0; sq < gameSquares.length; sq++) {
    gameSquares[sq].addEventListener('click', e => newGame.userClickGameSquare(e))
    gameSquares[sq].addEventListener('contextmenu', e => newGame.userRightclickGameSquare(e), false)
    //gameSquares[sq].addEventListener('mouseenter', e => newGame.userHoverGameSquare(e))
}

// save game event listener
saveButton.addEventListener('click', e => newGame.saveGame(e))