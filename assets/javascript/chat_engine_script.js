class ChatEngine{
    constructor(chatBoxId,userEmail,userName,envName){
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        this.userName=userName;
        let ip;
        if(envName=='developement')
        ip='localhost'
        else if(envName=='production')
        ip='65.1.92.43'
        //initiate connection
        //io is global var provided by socket cdn
        this.socket=io.connect(`http://${ip}:5000` ,{ transports : ['websocket'] });
        //At very first emitting 'connection' event to  observer  (we cud have explicitly written io.emit.connect)

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    //creating connection handler
    connectionHandler(){
        let self=this;

        //here 'on' detects an event 'connect'
        this.socket.on('connect',function(){        //Observer emited acknowledgement with 'connect' event
            console.log('Connection established using sockets...!');
            self.socket.emit('join_room',{  //emitting/sending event or request with data to join chatroom
                user_email:self.userEmail,
                user_name:self.userName,
                chatroom:'codeial'
            });

            self.socket.on('user_joined',function(data){
                console.log('A user joined',data);
            });

        });

        //emiting 'send_msg' event click button and if message container is not empty
        $('#send-message').click(function(){            
            let msg=$('#chat-message-input').val();
            if(msg != ''){
                self.socket.emit('send_msg',{
                    message:msg,
                    user_email:self.userEmail,
                    user_name:self.userName,
                    chatroom:'codeial'
                });
            }
        });    
        
        //Detecting 'receive_msg' event to receive msg from observer    
        self.socket.on('receive_msg',function(data){
            console.log('Received msg',data);
            let newMessge=$('<li>');
            let messageType='other-message';
            if(data.user_email==self.userEmail){
                messageType='self-message';
            }
            newMessge.append($('<span>',{
                html:data.message
            }));
            newMessge.append($('<sub>',{
                html:data.user_name
            }));

            newMessge.addClass(messageType);
            $('#chat-messages-list').append(newMessge);
            $('#chat-message-input').val('');

            $("#chat-messages-list").animate({ scrollTop: 20000000 }, "slow");
        });
        
    }
}