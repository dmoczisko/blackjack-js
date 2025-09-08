let player = {
    name: "Player",
    chips: 200
};

let cards = [];
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let message = "";
let betAmount = 20;

const suits = ["♠", "♥", "♦", "♣"];
const values = [
    { display: "A", value: 11 },
    { display: "2", value: 2 },
    { display: "3", value: 3 },
    { display: "4", value: 4 },
    { display: "5", value: 5 },
    { display: "6", value: 6 },
    { display: "7", value: 7 },
    { display: "8", value: 8 },
    { display: "9", value: 9 },
    { display: "10", value: 10 },
    { display: "J", value: 10 },
    { display: "Q", value: 10 },
    { display: "K", value: 10 }
];

let messageEl = document.getElementById("message-el");
let sumEl = document.getElementById("sum-el");
let cardsEl = document.getElementById("cards-el");
let playerEl = document.getElementById("player-el");

updatePlayerInfo();

function setPlayerName() {
    const input = document.getElementById("player-name-input");
    const name = input.value.trim();
    if (name) {
        player.name = name;
        updatePlayerInfo();
        messageEl.textContent = `Welcome, ${player.name}! Ready to play?`;
        input.disabled = true;
        input.nextElementSibling.disabled = true;
    } else {
        alert("Please enter a valid name.");
    }
}

function updatePlayerInfo() {
    playerEl.textContent = player.name + ": $" + player.chips;
}

function getRandomCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const valueObj = values[Math.floor(Math.random() * values.length)];
    return { value: valueObj.value, display: valueObj.display, suit: suit };
}

function startGame() {
    if (!isAlive && player.chips >= betAmount) {
        isAlive = true;
        hasBlackJack = false;
        cards = [getRandomCard(), getRandomCard()];
        sum = cards[0].value + cards[1].value;
        adjustForAces();
        renderGame();
    } else if (player.chips < betAmount) {
        messageEl.textContent = "You're out of chips! Reset to play again.";
    }
}

function adjustForAces() {
    let aceCount = cards.filter(card => card.value === 11).length;
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount--;
    }
}

function renderGame() {
    adjustForAces();

    renderCards();
    sumEl.textContent = "Sum: " + sum;

    if (sum <= 20) {
        message = "Do you want to draw a new card?";
    } else if (sum === 21) {
        message = "You've got Blackjack!";
        hasBlackJack = true;
        player.chips += betAmount * 1.5;
        isAlive = false;
    } else {
        message = "You're out of the game!";
        isAlive = false;
        player.chips -= betAmount;
    }

    updatePlayerInfo();
    messageEl.textContent = message;
}

function renderCards() {
    cardsEl.innerHTML = "";
    cards.forEach(card => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        if (card.suit === "♥" || card.suit === "♦") cardDiv.classList.add("red");
        cardDiv.innerHTML = `
      <span class="card-top">${card.display}${card.suit}</span>
      <span class="card-center">${card.display}</span>
      <span class="card-bottom">${card.suit}</span>
    `;
        cardsEl.appendChild(cardDiv);
    });
}

function newCard() {
    if (isAlive && !hasBlackJack) {
        const card = getRandomCard();
        cards.push(card);
        sum += card.value;
        adjustForAces();
        renderGame();
    }
}

function resetGame() {
    cards = [];
    sum = 0;
    hasBlackJack = false;
    isAlive = false;
    player.chips = 200;
    updatePlayerInfo();
    cardsEl.innerHTML = "";
    sumEl.textContent = "Sum:";
    messageEl.textContent = "Want to play a round?";

    const input = document.getElementById("player-name-input");
    input.disabled = false;
    input.nextElementSibling.disabled = false;
    input.value = "";
}
