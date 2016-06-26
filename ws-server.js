'use strict'
const WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8090})

let wordArr = ['Monkey', 'Dog', 'Bear', 'Flower', 'Girl']

wss.on('connection', function(ws) {
    console.log('connected.')

    let keyWord = ((arr) => {
            let num = Math.floor(Math.random()*arr.length)
            return arr[num]
        })(wordArr)

    ws.on('message', function(message) {
        console.log('received: %s', message)
        if (message == keyWord) {
            console.log('correct')
            wss.clients.forEach((client) => {
                client.send('答对了！！')
            })
        } else {
            console.log('wrong')
            wss.clients.forEach((client) => {
                client.send(message)
            })
        }
    })

    wss.clients.forEach((client) => {
        client.send('keyword:' + keyWord)
    })
})