let player = {
    name: "Player One",
    chips: 150, 
}

let cards = []
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""

let playerEl = document.getElementById("player-el")
let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")

playerEl.textContent = player.name + ": $" + player.chips

function startGame() {
    isAlive = true
    let firstCard =  getRandomCard()
    let secondCard =  getRandomCard()
    sum = firstCard + secondCard
    cards = [firstCard, secondCard]
    renderGame()
}

function getRandomCard() {
    let card = Math.floor(Math.random() * 13) + 1
    if (card === 1) {
        return 11
    }
    else if (card > 10) {
        return 10
    }
    else {
        return card
    }
}

function renderGame() {

    // render out firstCard and secondCard
    cardsEl.textContent = "Cards: "

    //for loop for all cards
    for(let i = 0 ; i < cards.length; i += 1) {
        cardsEl.textContent += cards[i] + " "
    }

    // render out ALL the cards we have
    sumEl.textContent = "Sum: " + sum

    if (sum <= 20) {
        message = "Do you want to draw a new card?"
    } 
    else if (sum === 21) {
        message = "You've got Blackjack!"
        hasBlackJack = true
    }
    else {
        message = "You're out of the game!"
        isAlive = false
    }
    
    messageEl.textContent = message
}

function newCard() {

    //If player IS alive and does NOT have blackjack
    if (isAlive && hasBlackJack === false) {
        let card = getRandomCard()
        sum += card
        cards.push(card)
        renderGame()
    }
}