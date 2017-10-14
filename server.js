var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);

app.use(express.static('.'));

server = http.listen(7777, function(){
	console.log('Listening on port 7777');
});

process.on('exit', function () {
	console.log('About to exit, waiting for remaining connections to complete');
	server.close();
});

process.on('SIGTERM', function () {
	console.log('About to exit, waiting for remaining connections to complete');
	server.close();
});

process.on('uncaughtException', function () {
	console.log('About to exit because of an uncaught exception, waiting for remaining connections to complete');
	server.close();
});

io.on('connection', function(socket){
	console.log('Client connected');

    socket.on('disconnect', function(){
        console.log('Client disconnected');
    });

    // socket.on('COMMAND', function(argument) {
    //
    // });
});
