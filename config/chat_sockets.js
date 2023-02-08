module.exports.chatSockets=function(socketServer){
    let io=require('socket.io')(socketServer);

    //As 'connection' event is detected by observer (we emited 'connection' event from subscriber)
    io.sockets.on('connection',function(socket){        //this will also emit/send acknowledgement about connection to subscriber
        console.log('New connection received',socket.id);

        //when client is disconnected 
        socket.on('disconnect',function(){
            console.log('Socket disconnected!');
        });

        socket.on('join_room',function(data){
            console.log('joining req received',data);
            socket.join(data.chatroom); //if that chatroom exist then join it, if not create and join it

            //sending notification to other , that i joined room
            io.in(data.chatroom).emit('user_joined',data);  //io.in specify which chatroom to emit
        });

        //detect send_message event and broadcast data passed with it
        socket.on('send_msg',function(data){
            io.in(data.chatroom).emit('receive_msg',data);
        });
    });  
}