
// ####       front end functions       #### ///

// plant/upgrades tab buttons
let plantsOpen = true;

let currentPage = 1;
let plantsTab = document.getElementById('plants-tab');
let upgradesTab = document.getElementById('upgrades-tab');

plantsTab.addEventListener('click', e => {
    let pages = document.getElementById('shop-pages').children;
    for (let p = 0; p < pages.length; p++) {
        pages[p].classList.add('hidden')
    }
    document.getElementById('shop-1').classList.remove('hidden')
    currentPage = 1;
    plantsOpen = true
})

upgradesTab.addEventListener('click', e => {
    let pages = document.getElementById('shop-pages').children;
    for (let p = 0; p < pages.length; p++) {
        pages[p].classList.add('hidden')
    }
    document.getElementById('upgrades-1').classList.remove('hidden')
    currentPage = 1;
    plantsOpen = false
})

// shop items selection
const shopItems = document.querySelectorAll('.shop-item');
let selectedShopItem = null;


export function highlightSelection(event) {
    if (selectedShopItem !== null) {
        selectedShopItem.style.backgroundColor = '#e7e6e1';
    }

    if (selectedShopItem === event.currentTarget) {
        event.currentTarget.style.backgroundColor = '#e7e6e1';
        selectedShopItem = null;
    }

    event.currentTarget.style.backgroundColor = '#bdbdbd';
    selectedShopItem = event.currentTarget;
}


// left-right shop buttons
let shopNext = document.getElementById('next-shop')
let shopPrev = document.getElementById('prev-shop')
shopNext.addEventListener('click', e => updateShop(1));
shopPrev.addEventListener('click', e => updateShop(-1));

function updateShop(amount) {

    // plants
    if (plantsOpen) {
        // dont switch to a page that doesn't exist
        if (currentPage + amount > 0 && currentPage + amount < 5) {
            document.getElementById(`shop-${currentPage}`).classList.add('hidden')
            currentPage += amount;
            document.getElementById(`shop-${currentPage}`).classList.remove('hidden')
        }


        // upgrades
    } else {
        // dont switch to a page that doesn't exist
        if (currentPage + amount > 0 && currentPage + amount < 3) {
            document.getElementById(`upgrades-${currentPage}`).classList.add('hidden')
            currentPage += amount;
            document.getElementById(`upgrades-${currentPage}`).classList.remove('hidden')
        }
    }
}

export class upgradeArea {
    constructor(squareID, color) {
        const squareChar = document.getElementById(`csq-${squareID[0]}${squareID[1]}`);
        squareChar.style = `background-color: #${color};`;
    }

    updateUpgradeArea(level) {

    }
}

const titleLines = document.querySelectorAll('#hover-title > p');
const descrLines = document.querySelectorAll('#hover-descr > p');

export function updateHoverText(data) {
    titleLines.forEach((titleLine, index) => {
        if (data[0][0][0][0] === "Empty Game Square") {
            titleLine.innerHTML = '';
            descrLines[index].innerHTML = '';
        } else if (data.length >= 1 && data[0][index]) {
            titleLine.innerHTML = data[0][index][0][0];
            if (data[0][index][1]) {
                titleLine.style.fontWeight = data[0][index][0][1];
            }
        } else {
            titleLine.innerHTML = '';
        }
    });

    descrLines.forEach((descrLine, index) => {
        if (data.length >= 2 && data[1][index]) {
            descrLine.innerHTML = data[1][index][0][0];
            if (data[1][index][1]) {
                descrLine.style.fontWeight = data[1][index][0][1];
            }
        } else {
            descrLine.innerHTML = '';
        }
    });
}