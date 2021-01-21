const { futimesSync } = require("fs");

const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)

let colors = ["red", "blue", "limegreen", "gold", "purple", "hotpink", "orange", "cyan"]

app.get("/", function(req, res) {
    res.sendFile(__dirname+"/static/index.html");
})

let onlineUsers = []

io.sockets.on("connection", function(socket) {

    socket.on("join", function(username) {
        socket.username = username
        socket.color = colors[Math.floor(Math.random()*colors.length)]
        onlineUsers.push(socket.username)
        io.emit("join message", `<p style="font-style: italic;">${socket.username} joined. Hello!</p>`)
        io.emit("update online members", `${onlineUsers.length} Online`)
    })

    socket.on("chat message", function(msg) {
        io.emit("chat message", `<p><span id="messageUsername" style="color: ${socket.color}">${socket.username}: </span>${msg}</p>`)
    })

    socket.on("change username", function(username) {
        let oldUsername = socket.username
        onlineUsers.splice(onlineUsers.indexOf(socket.username), 1)
        socket.username = username
        onlineUsers.push(socket.username)
        io.emit("change username", `<p style="font-style: italic;">${oldUsername} changed their name to ${socket.username}.</p>`)
    })

    socket.on("disconnect", function(username) {
        onlineUsers.splice(onlineUsers.indexOf(socket.username), 1)
        io.emit("leave message", `<p style="font-style: italic;">${socket.username} left. Goodbye :(</p>`)
        io.emit("update online members", `${onlineUsers.length} Online`)
    }) 
}) 

http.listen(3000, function() {
    console.log("server running")
})