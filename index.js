// ------------------- Game Data -------------------
let player = { name: "Player", chips: 200 };
let playerCards = [], dealerCards = [];
let playerSum = 0, dealerSum = 0;
let isAlive = false, hasBlackJack = false;
const betAmount = 20;

const suits = ["♠", "♥", "♦", "♣"];
const values = [
    { display: "A", value: 11 }, { display: "2", value: 2 }, { display: "3", value: 3 }, { display: "4", value: 4 },
    { display: "5", value: 5 }, { display: "6", value: 6 }, { display: "7", value: 7 }, { display: "8", value: 8 },
    { display: "9", value: 9 }, { display: "10", value: 10 }, { display: "J", value: 10 }, { display: "Q", value: 10 }, { display: "K", value: 10 }
];

const messageEl = document.getElementById("message-el");
const sumEl = document.getElementById("sum-el");
const playerEl = document.getElementById("player-el");
const cardsEl = document.getElementById("cards-el");
const dealerEl = document.getElementById("dealer-cards");

// ------------------- Player Name -------------------
function setPlayerName() {
    const input = document.getElementById("player-name-input");
    const name = input.value.trim();
    if (name) {
        player.name = name;
        playerEl.textContent = `${player.name}: $${player.chips}`;
        input.disabled = true;
        input.nextElementSibling.disabled = true;
        messageEl.textContent = `Welcome ${player.name}! Click START GAME to play.`;
    } else alert("Enter a valid name!");
}

// ------------------- Utility Functions -------------------
function getRandomCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const valueObj = values[Math.floor(Math.random() * values.length)];
    return { display: valueObj.display, value: valueObj.value, suit: suit };
}

function adjustForAces(cards, sum) {
    let aceCount = cards.filter(c => c.value === 11).length;
    while (sum > 21 && aceCount > 0) {
        sum -= 10; aceCount--;
    }
    return sum;
}

// ------------------- Render Functions -------------------
function renderCards(cards, container, hideFirst = false) {
    container.innerHTML = "";
    cards.forEach((card, i) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        if (card.suit === "♥" || card.suit === "♦") cardDiv.classList.add("red");
        let topLeft = card.display + card.suit;
        let bottomRight = card.suit;
        cardDiv.innerHTML = `
      <span class="card-top-left">${hideFirst && i === 0 ? "?" : topLeft}</span>
      <span class="card-center">${hideFirst && i === 0 ? "?" : card.suit}</span>
      <span class="card-bottom-right">${hideFirst && i === 0 ? "?" : bottomRight}</span>
    `;
        container.appendChild(cardDiv);
    });
}

// ------------------- Game Logic -------------------
function startGame() {
    document.getElementById("dealer-sum-el").textContent = "Sum: ?";

    if (player.chips < betAmount) {
        messageEl.textContent = "Not enough chips! Reset to play.";
        return;
    }
    isAlive = true;
    hasBlackJack = false;
    playerCards = [getRandomCard(), getRandomCard()];
    dealerCards = [getRandomCard(), getRandomCard()];
    playerSum = adjustForAces(playerCards, playerCards[0].value + playerCards[1].value);
    dealerSum = adjustForAces(dealerCards, dealerCards[0].value + dealerCards[1].value);
    renderCards(playerCards, cardsEl);
    renderCards(dealerCards, dealerEl, true); // hide first dealer card
    sumEl.textContent = `Sum: ${playerSum}`;
    messageEl.textContent = "Hit or Stand?";
    playerEl.textContent = `${player.name}: $${player.chips}`;
}

function hit() {
    if (!isAlive || hasBlackJack) return;
    const card = getRandomCard();
    playerCards.push(card);
    playerSum += card.value;
    playerSum = adjustForAces(playerCards, playerSum);
    renderCards(playerCards, cardsEl);
    sumEl.textContent = `Sum: ${playerSum}`;
    if (playerSum > 21) {
        endGame();
    }
}

function stand() {
    if (!isAlive) return;
    endGame();
}

function dealerPlay() {
    dealerSum = adjustForAces(dealerCards, dealerCards.reduce((a, c) => a + c.value, 0));
    while (dealerSum < 17) {
        const card = getRandomCard();
        dealerCards.push(card);
        dealerSum += card.value;
        dealerSum = adjustForAces(dealerCards, dealerSum);
    }
}

function endGame() {
    dealerPlay();
    renderCards(dealerCards, dealerEl);

    const dealerSumEl = document.getElementById("dealer-sum-el");
    dealerSumEl.textContent = `Sum: ${dealerSum}`;

    if (playerSum > 21) {
        messageEl.textContent = "You busted! Dealer wins.";
        player.chips -= betAmount;
    } else if (dealerSum > 21 || playerSum > dealerSum) {
        messageEl.textContent = "You win!";
        player.chips += betAmount;
    } else if (playerSum === dealerSum) {
        messageEl.textContent = "Push! It's a tie.";
    } else {
        messageEl.textContent = "Dealer wins!";
        player.chips -= betAmount;
    }
    playerEl.textContent = `${player.name}: $${player.chips}`;
    isAlive = false;
}

function resetGame() {
    document.getElementById("dealer-sum-el").textContent = "Sum: ?";

    playerCards = []; dealerCards = [];
    playerSum = 0; dealerSum = 0;
    isAlive = false; hasBlackJack = false;
    cardsEl.innerHTML = ""; dealerEl.innerHTML = "";
    sumEl.textContent = "Sum: 0";
    messageEl.textContent = "Enter your name to start!";
    player.chips = 200;
    playerEl.textContent = `${player.name}: $${player.chips}`;
    const input = document.getElementById("player-name-input");
    input.disabled = false; input.nextElementSibling.disabled = false;
    input.value = "";
}
