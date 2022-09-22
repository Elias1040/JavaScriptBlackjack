// const {rando, randoSequence} = require('@nastyox/rando.js')

var deck = []
var usersTurn = true;
var userStand = false;
var endGame = false;

const suits = { 0: "Hearts", 1: "Diamonds", 2: "Spades", 3: "Clubs"}

class Card {
    constructor(suit, value){
        this.suit = suits[suit]
        this.value = value
    }
}

LoadDeck()
Shuffle()
var userCards = [deck.pop(), deck.pop()]
var dealerCards = [deck.pop(), deck.pop()]

// while (!endGame){
//     DrawCard()
// }

function StartGame(){
    document.getElementById("startBtn").hidden = true;
    userCards.forEach(x => UserCardHtml(x))
    dealerCards.forEach(x => DealerCardHtml(x))
    endGame = false
    // while (!endGame){
    //     DrawCard()
    // }
}

function LoadDeck(){
        for (let suit = 0; suit < 4; suit++) {
            for (let card = 1; card < 13; card++)
            {
                deck.push(new Card(suit, (card == 0 ? 0 : (card <= 10 ? card : 10))))
            }
        }
}

function UserCardHtml(card){
    let htmlCard = document.createElement("div")
    htmlCard.className = "col-3 border border-black border-2"
    let htmlPoints = document.createElement("p")
    htmlPoints.innerText = card.suit + " " + card.value
    htmlCard.appendChild(htmlPoints)
    document.getElementById("UserSide").appendChild(htmlCard)
}

function DealerCardHtml(card){
    var htmlCard = document.createElement("div")
    htmlCard.className = "col-3 border border-black border-2"
    var htmlPoints = document.createElement("p")
    htmlPoints.innerText = card.suit + " " + card.value
    htmlCard.appendChild(htmlPoints)
    document.getElementById("DealerSide").appendChild(htmlCard)
}

function ResultHtml(result){
    document.getElementById("Result").innerText = result
}

function Shuffle(){
    for (let i = 0; i < Math.floor(Math.random() * 10); i++){
        let deckCopy = deck;
        let index = []
        deckCopy.forEach(x => index.push(deckCopy.indexOf(x)))
        deck.forEach(x => deckCopy[index.splice(Math.floor(Math.random() * index.length), 1)[0]] = x)
        deck = deckCopy
    }
}

function UserHit(){
    DrawCard()
}

function UserStand(){
    userStand = true;
}

function DrawCard(){
    if (!userStand) {
        userCards.push(deck.pop())
        UserCardHtml(userCards[userCards.length - 1])
        CheckPoints()
        }
    else {
        dealerCards.push(deck.pop())
        DealerCardHtml(dealerCards[dealerCards.length - 1])
        CheckPoints()
    }
}

function CheckPoints(){
    let userPointSum = AddPoints(userCards)
    let dealerPointSum = AddPoints(dealerCards)

    UserPointsHtml(userPointSum)
    DealerPointsHtml(dealerPointSum)

    if (userPointSum > 21 || dealerPointSum == 21 || (dealerPointSum < 21 && dealerPointSum > userPointSum && userStand)) {
        console.log("you lost")
        ResultHtml("You lose!")
        endGame = true
    }
    else if (userPointSum == 21 || (dealerPointSum > 21 && userPointSum <= 21)) {
        console.log("you won")
        ResultHtml("You win!")
        endGame = true
    }
}

function UserPointsHtml(points){
    document.getElementById("UserPoints").innerText = points
}

function DealerPointsHtml(points){
    document.getElementById("DealerPoints").innerText = points
}

function AddPoints(cards) {
    let points = []
    cards.forEach(x => {
        if (!Array.isArray(x.value)){
            points.push(x.value)
        }
        else{
            points.push(x.value[1])
        }
    }, this)

    let aceCards = cards.filter(x => Array.isArray(x.value), this)

    if (points.reduce((x, y) => x + y) > 21 && aceCards.length > 0) {
        aceCards.forEach(x => {
            if (points.reduce((x, y) => x + y) > 21){
                points[points.findIndex(p => p == x.value[1])] = x.value[0]
            }
        }, this);
    }

    return points.reduce((x, y) => x + y)
}

