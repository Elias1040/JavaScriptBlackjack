// const WebSocket = require('ws')
var socket = new WebSocket("ws://192.168.1.18:80/")
// let socket1 = new WebSocket("ws://192.168.137.1:25565/")

var playerId

socket.onopen = () => {

    // socket.send()

}

socket.onmessage = (event) => {
    let message = event.data.split(',')
    switch (message[0]) {
        case "onstartgame":
            {
                playerId = message[1]
                let card = document.createElement("img")
                card.src = message[2]
                document.body.appendChild(card)
                card = document.createElement("img")
                card.src = message[3]
                document.body.appendChild(card)
            }
            break;
        case "returnhit":
            {
                let card = document.createElement("img")
                card.src = message[1]
                document.body.appendChild(card)
            }
            break;
    }
}

// socket1.onopen = () => {
//     socket1.send(1);
// }

// socket1.onmessage = (event) => {
//     console.log(event.data);

// }

socket.onerror = error => { console.log(error.message) }



// socket1.onerror = error => {console.log(error.message)}
