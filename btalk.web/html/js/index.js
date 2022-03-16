
var socket = io.connect('http://localhost:9090')
let streaming = stream => {
    socket.emit('stream', stream)
}

let addVideoStream = (stream, player, grid) => {
    player.muted = true    
    player.srcObject = stream
    player.addEventListener('loadedmetadata', () => {
        player.play()
    })

    grid.append(player)

}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then( stream => {
    addVideoStream(
        stream,
        document.createElement("video"), 
        document.getElementById("grid")
    )

    //handle new user : userId
    //share(userId, stream)

    streaming(stream)

})