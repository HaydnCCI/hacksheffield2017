var socket;

function pageLoad() {
    socket = io();

    // socket.on('COMMAND', function(argument) {
    //     $('.button').click(function(key) {
    //         socket.emit("SOME COMMAND", argument);
    //     });
    // });

    console.log("Client initialized");
}

document.addEventListener('DOMContentLoaded', pageLoad);
