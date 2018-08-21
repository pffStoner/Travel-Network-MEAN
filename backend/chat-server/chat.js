const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

module.exports = {
    startSocketServer: function (server) {
        //   /get generate msg as obj;
        const { generateMsg, generateLocationMsg } = require('.//utils/message')
        const { Users } = require('./utils/users');
        // const publicPath = path.join(__dirname, '../public');

        //create web socket server
        //socket.emit - emit to single connection
        //io.emit - emit to every single connection
        var io = socketIO(server);
        var users = new Users();
        var rooms = [];

        // app.use(express.static(publicPath));

        //listen to events
        io.on('connection', (socket) => {
            console.log('user connect');
            socket.emit('rooms', rooms);

            //for angular test
            socket.on('add-message', (message) => {
                io.emit('message', { type: 'new-message', text: message });
            });


            socket.on('join', (params, callback) => {
                //TODO: add validations for names
                room = params.room;
                if( rooms.indexOf(room) < 0){
                    rooms.push(room);
                    
                }

                io.emit('rooms', rooms);

                //remove from other rooms
                users.removeUser(socket.id);
                //add use to list
                users.addUser(socket.id, params.name, params.room)
                //join room
                socket.join(params.room);
                //update list
                console.log(rooms);
                
                io.to(params.room).emit('updatedList', users.getUsersList(params.room));
                //to all when join chat app
               socket.emit('newMessage', generateMsg('Welcome'));
                //for new user join
                socket.broadcast.to(params.room)
                    .emit('newMessage', generateMsg( params.name + ' joined'));
                callback();
            });

            //:LEAVE:Client Supplied Room
socket.on('leave',function(room){  
    try{
      console.log('[socket]','leave room :', room);
      socket.leave(room);
      socket.to(room).emit('user left', socket.id);
      users.removeUser(socket.id);
      io.to(room).emit('updatedList', users.getUsersList(room));
    }catch(e){
      console.log('[error]','leave room :', e);
      socket.emit('error','couldnt perform requested action');
    }
  })




            //listen to createMsg event
            socket.on('createMessageA', (msg, callback) => {
                //get user who send msg
                var user = users.getUser(socket.id);

                if (user && msg.text !== "") {
                    //emit to everyone with io.emit
                    //emit just to room
                    io.to(user.room).emit('newMessage', generateMsg(user.name, msg.text));
                }

                    console.log(msg);
                    
                // callback();

            });

            //send location
            socket.on('createLocationMessage', (coords) => {
                var user = users.getUser(socket.id);

                if (user) {
                    //emit to everyone with io.emit
                    //emit just to room
                    io.to(user.room).emit('newLocationMessage', generateLocationMsg(user.name, coords.lattitude, coords.longitude))
                }
            });





            ///*************ANGULAR********************** */

            // //listen to createMsg event
            // socket.on('createMessageA', (msg, callback) => {

            //     io.emit('newMessage', generateMsg('user.name', msg.text));
            //     // callback();
            // });


            // //when user disconect
            // socket.on('disconnect', () => {
            //     console.log('User was disconected');
            //     var user = users.removeUser(socket.id);

            //     if (user) {
            //         io.to(user.room).emit('updatedList', users.getUsersList(user.room));
            //         io.to(user.room).emit('newMessage', generateMsg('Admin ', user.name + 'has left.'));
            //     }
            // });


            
        });
    }
};
