var socket;

function pageLoad() {
    socket = io();

    // socket.on('COMMAND', function(argument) {
    //     $('.button').click(function(key) {
    //         socket.emit("SOME COMMAND", argument);
    //     });
    // });

    console.log("Player initialized");
}

document.addEventListener('DOMContentLoaded', pageLoad);
