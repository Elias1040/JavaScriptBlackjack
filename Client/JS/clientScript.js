// const WebSocket = require('ws')
var socket = new WebSocket("ws://192.168.137.1:80/")
// let socket1 = new WebSocket("ws://192.168.137.1:25565/")

var playerId

socket.onopen = () => {

    // socket.send()

}

socket.onmessage = (event) => {
    let message = event.data.split(',')
    switch (message[0]) {
        case "onstartgame":
            OnStartGame(message)
            break;
        case "returnhit":
            ReturnHit(message)
            break;
        case "dealerCards":
            DealerCards(message)
            break;
        case "endresult":
            EndResult(message)
            break;
        case "othercards":
            OtherCards(message)
            break;
        case "restartGame":
            RestartGame()
            break;
        case "revealcard":
            document.getElementById("DealerHand").lastChild.src = message[1]
            document.getElementById("DealerPoints").innerText = message[2]
            break;
        case "stand":
            document.getElementById("stand").parentElement.className = "d-none"
            break;
        case "redirect":
            socket.close()
            location.assign("/SinglePlayer_Blackjack.html")
            break;
    }
}

socket.onerror = error => { console.log(error.message) }

// Starts the game on the recieved startgame message
function OnStartGame(message) {
    document.getElementById("startGame").className = "d-none"
    document.getElementById("canvas").className = "col-12 h-100"
    playerId = message[1]
    for (let i = 2; i < 4; i++) {
        let card = document.createElement("img")
        card.src = message[i]
        card.height = 200
        card.width = 125
        card.className = "border rounded"
        document.getElementById("PlayerHand").appendChild(card)
        document.getElementById("PlayerPoints").innerText = message[4]
    }
    document.getElementById("stand").parentElement.className = "col-12 d-flex justify-content-center gap-3"
}

// Displays the recieved card from hit
function ReturnHit(message) {
    let card = document.createElement("img")
    card.src = message[1]
    card.height = 200
    card.width = 125
    card.className = "border rounded"
    document.getElementById("PlayerHand").appendChild(card)
    document.getElementById("PlayerPoints").innerText = message[2]
}

// Displays the cards recieved dealer cards
function DealerCards(message) {
    let card = document.createElement("img")
    card.src = message[1]
    card.height = 200
    card.width = 125
    card.className = "border rounded"
    document.getElementById("DealerHand").appendChild(card)
    document.getElementById("DealerPoints").innerText = message[2]
}

// Displays the other players recieved card
function OtherCards(message) {
    let card = document.createElement("img")
    card.src = message[1]
    card.height = 200
    card.width = 125
    card.className = "border rounded"
    document.getElementById("OtherHand").appendChild(card)
    document.getElementById("OthersPoints").innerText = message[2]
}

// Clears the page on recieved restart message
function RestartGame() {
    document.getElementById("DealerHand").innerHTML = ""
    document.getElementById("OtherHand").innerHTML = ""
    document.getElementById("PlayerHand").innerHTML = ""
    document.getElementById("canvas").className = "col-12 h-100"
    document.getElementById("result").parentElement.parentElement.className = "d-none"
    document.getElementById("result").innerText = ""
}

// Displays the recieved end result
function EndResult(message) {
    document.getElementById("canvas").className += " blur"
    document.getElementById("result").innerText = message[1]
    document.getElementById("result").parentElement.parentElement.className = "d-flex col-12 h-50 justify-content-center position-absolute top-50 start-50 translate-middle"
    document.getElementById("result").parentElement.className = "col-3 border border-2 border bg-white text-center fade-in-top"
}