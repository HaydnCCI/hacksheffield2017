var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);

app.use(express.static('.'));

server = http.listen(7777, function() {
	console.log('Listening on port 7777');
});

process.on('exit', function() {
	console.log('About to exit, waiting for remaining connections to complete');
	server.close();
});

process.on('SIGTERM', function() {
	console.log('About to exit, waiting for remaining connections to complete');
	server.close();
});

process.on('uncaughtException', function() {
	console.log('About to exit because of an uncaught exception, waiting for remaining connections to complete');
	server.close();
});

var state = Object();
var players = Object();
initializeGame();

io.on('connection', function(socket) {
	console.log('Client connected');

    socket.on('disconnect', function() {
        console.log('Client disconnected');
    });

    socket.on('PLAY LEFT', function() {
        players.left = socket;
        if (players.right !== null && !state.started) {
            startGame();
        }
    });

    socket.on('PLAY RIGHT', function() {
        players.right = socket;
        if (players.left !== null && !state.started) {
            startGame();
        }
    });

    socket.on('UP', function() {
        var player = getPlayer(socket);
        switch (player) {
            case 'LEFT':
                state.leftPaddle -= 10;
                if (state.leftPaddle < 0) {
                    state.leftPaddle = 0;
                }
                console.log("Left moved up");
                break;
            case 'RIGHT':
                state.rightPaddle -= 10;
                if (state.rightPaddle < 0) {
                    state.rightPaddle = 0;
                }
                console.log("Right moved up");
                break;
            default:
                console.log("Unknown player is trying to move up");
        }
    });

    socket.on('DOWN', function() {
        var player = getPlayer(socket);
        switch (player) {
            case 'LEFT':
                state.leftPaddle += 10;
                if (state.leftPaddle > 1000) {
                    state.leftPaddle = 1000;
                }
                console.log("Left moved down");
                break;
            case 'RIGHT':
                state.rightPaddle += 10;
                if (state.rightPaddle > 1000) {
                    state.rightPaddle = 1000;
                }
                console.log("Right moved down");
                break;
            default:
                console.log("Unknown player is trying to move down");
        }
    });

});

function getPlayer(socket) {
    if (socket === players.left) {
        return 'LEFT';
    } else if (socket === players.right) {
        return 'RIGHT';
    } else {
        return 'NONE';
    }
}

function initializeGame() {
    players.left = null;
    players.right = null;
	// Game size is 1000x1000
    state.started = false;
	state.leftPaddle = 0;
	state.rightPaddle = 0;
	state.ball = Object();
	state.ball.x = 500;
	state.ball.y = 500;
}

function startGame() {
    state.started = true;
    setInterval(gameLoop, 50);
}

function gameLoop() {
	console.log("Loop: sending state to players");
	players.left.emit("STATE", state);
	players.right.emit("STATE", state);
}
