const { Server } = require("socket.io")


exports.socketConnection = (server)=>{
    const io = new Server(server,{
        cors: {
         origin: "*",
        methods: "*"
        }
    })
    
    const namespace = io.of("/chat")

    namespace.on("connection", (socket)=>{
        //console.log("socket connect to server !!!")
        
        socket.on("JOIN_ROOM", (room)=>{
            if(room.prevRoom){

                socket.leave(room.prevRoom)
                if( socket.nsp.adapter.rooms.get(room.prevRoom)){
                    const usersOnlineInRoom = socket.nsp.adapter.rooms.get(room.prevRoom).size.toString()
                    socket.nsp.to(room.prevRoom).emit("RECIEVE_USERS_LEFT_IN_ROOM", usersOnlineInRoom)
                    console.log("leave from room "+room.prevRoom+" "+socket.id+" "+usersOnlineInRoom)
                }
            }

            socket.join(room.currentRoom)
            const usersOnlineInRoom = socket.nsp.adapter.rooms.get(room.currentRoom).size.toString()
            socket.nsp.to(room.currentRoom).emit("RECIEVE_USERS_ONLINE_IN_ROOM", usersOnlineInRoom)
            console.log("joined to room "+room.currentRoom+" "+socket.id+" "+usersOnlineInRoom)
        })

        socket.on("SEND_MESSAGE", (data)=>{
            socket.nsp.to(data.room).emit("RECIEVE_MESSAGE",data)
            //socket.broadcast.emit("RECIEVE_MESSAGE", data)
            //namespace.emit("RECIEVE_MESSAGE", data)
        })

        socket.on("IS_TYPING", (data)=>{
            socket.broadcast.to(data.room).emit("RECIEVE_TYPING", data.isTyping)
        })
    })
}