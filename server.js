require("dotenv").config();
const path = require("path")
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

let videoNamesDict = {}
let chatNamesDict = {}

const videoRooms = {};

const chatRooms = {};

const socketdict = {};

const isEmpty = (dic) =>{
    for(var i in dic){ return false;}
   return true;
}

io.on('connection', socket => {
    socket.on("join room", (roomID,username,chat) => {
        if(!chat)
        {
            if (videoRooms[roomID]) 
            {
                const length = videoRooms[roomID].length;
                if (length === 9) 
                {
                    socket.emit("room full");
                    return;
                }
                videoRooms[roomID].push(socket.id);
                
            } else
            {
                if(!videoNamesDict[roomID])
                {
                    videoNamesDict[roomID] = {}
                }
                
                videoRooms[roomID] = [socket.id];
            }
            const usersInThisRoom = videoRooms[roomID].filter(id => id !== socket.id);
            videoNamesDict[roomID][socket.id] = username;
            socket.emit("all users", usersInThisRoom);
        }else 
        {
            if (chatRooms[roomID]) 
            {
                chatRooms[roomID].push(socket.id);   
            } else
            {
                if(!chatNamesDict[roomID])
                {
                    chatNamesDict[roomID] = {}
                }
                chatRooms[roomID] = [socket.id];
            }            
            chatNamesDict[roomID][socket.id] = username;
        }
        socketdict[socket.id] = roomID;
        
    });

    socket.on("current users", (newuser,roomID)=> {
        let add = true;
        if(videoRooms[roomID])
        {
            videoRooms[roomID].forEach(user=>{
            if (user===newuser) {
                add = false;
            }
        })
        }
        socket.emit('add user',add);
    })


    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on("cut call",()=> {
        const roomID = socketdict[socket.id];
        let room = null;
        let disconchat = false;
        if (!isEmpty(videoRooms[roomID])) 
        {
            videoRooms[roomID].forEach(user=>{
                if(user===socket.id)
                {
                    room = videoRooms[roomID]
                }
            })
            
        }
        if (!isEmpty(chatRooms[roomID]))
        {
            chatRooms[roomID].forEach(user=>{
                if(user===socket.id)
                {
                    room = chatRooms[roomID]
                    disconchat = true
                }
            })
        }

        if(!disconchat)
        {
            if (!isEmpty(videoNamesDict)) 
            {
                if(!isEmpty(videoNamesDict[roomID]))
                {
                    if(videoNamesDict[roomID][socket.id])
                    {
                        console.log(`${videoNamesDict[roomID][socket.id]} Left`)
                        delete videoNamesDict[roomID][socket.id];
                        if (isEmpty(videoNamesDict[roomID])) 
                        {
                            delete videoNamesDict[roomID];

                            delete videoRooms[roomID];
                        }
                        else if (room) 
                        {
                            room = room.filter(id => id !== socket.id);
                            videoRooms[roomID] = room;
                        }
                    }
                }
            }
        }
        else 
        {
            if (!isEmpty(chatNamesDict)) 
            {
                if(!isEmpty(chatNamesDict[roomID]))
                {
                    if(chatNamesDict[roomID][socket.id])
                    {
                        console.log(`${chatNamesDict[roomID][socket.id]} Left`)
                        delete chatNamesDict[roomID][socket.id];
                        if (isEmpty(chatNamesDict[roomID])) 
                        {
                            delete chatNamesDict[roomID];
                            delete chatRooms[roomID];
                        }
                        else if (room) 
                        {
                            room = room.filter(id => id !== socket.id);
                            chatRooms[roomID] = room;
                        }
                    }
                }
            }
        }
        socket.broadcast.emit('user left',socket.id);
    });

    socket.on("display users", ()=> {
        const roomID = socketdict[socket.id];
        let vidnames = []
        let chatnames = []
        for(let i in videoNamesDict[roomID])
        {
            vidnames.push(videoNamesDict[roomID][i])
        }
        for(let i in chatNamesDict[roomID])
        {
            chatnames.push(chatNamesDict[roomID][i])
        }
        socket.emit('all names',vidnames,chatnames)
    })

    socket.on("get name", (id)=> {
        const roomID = socketdict[id]
        let name = null;
        if (videoNamesDict[roomID]) {
            if (videoNamesDict[roomID][id]) {
                name = videoNamesDict[roomID][id]
            }
        }
        if (chatNamesDict[roomID]) {
            if (chatNamesDict[roomID][id]) {
                name = chatNamesDict[roomID][id]
            }
        }
        socket.emit('fetch name',name)
    })

    socket.on("send message",(message)=>{
        const roomID = socketdict[socket.id];
        let name = null;
        if(videoNamesDict[roomID])
        {
            if (videoNamesDict[roomID][socket.id]) 
            {
                name = videoNamesDict[roomID][socket.id];
            }
        }
        if(chatNamesDict[roomID])
        {
            if (chatNamesDict[roomID][socket.id]) 
            {
                name = chatNamesDict[roomID][socket.id];
            }
        }
        if(videoRooms[roomID])
        {
            videoRooms[roomID].forEach( participant => {
                if(participant!==socket.id)
                {
                    io.to(participant).emit('recieve message',{message: message,name: name} )
                }
            });
        }
        if (chatRooms[roomID]) 
        {
            chatRooms[roomID].forEach( participant => {
                if(participant!==socket.id)
                {
                    io.to(participant).emit('recieve message',{message: message,name: name} )
                }
            });
        }
    })

    socket.on('disconnect', () => {
        const roomID = socketdict[socket.id];
        let room = null;
        let disconchat = false;
        if (!isEmpty(videoRooms[roomID])) 
        {
            videoRooms[roomID].forEach(user=>{
                if(user===socket.id)
                {
                    room = videoRooms[roomID]
                }
            })
            
        }
        if (!isEmpty(chatRooms[roomID]))
        {
            chatRooms[roomID].forEach(user=>{
                if(user===socket.id)
                {
                    room = chatRooms[roomID]
                    disconchat = true
                }
            })
        }

        if(!disconchat)
        {
            if (!isEmpty(videoNamesDict)) 
            {
                if(!isEmpty(videoNamesDict[roomID]))
                {
                    if(videoNamesDict[roomID][socket.id])
                    {
                        console.log(`${videoNamesDict[roomID][socket.id]} Left`)
                        delete videoNamesDict[roomID][socket.id];
                        if (isEmpty(videoNamesDict[roomID])) 
                        {
                            delete videoNamesDict[roomID];
                            delete videoRooms[roomID];
                        }
                        else if (room) 
                        {
                            room = room.filter(id => id !== socket.id);
                            videoRooms[roomID] = room;
                        }
                    }
                }
            }
        }
        else 
        {
            if (!isEmpty(chatNamesDict)) 
            {
                if(!isEmpty(chatNamesDict[roomID]))
                {
                    if(chatNamesDict[roomID][socket.id])
                    {
                        console.log(`${chatNamesDict[roomID][socket.id]} Left`)
                        delete chatNamesDict[roomID][socket.id];
                        if (isEmpty(chatNamesDict[roomID])) 
                        {
                            delete chatNamesDict[roomID];
                            delete chatRooms[roomID];
                        }
                        else if (room) 
                        {
                            room = room.filter(id => id !== socket.id);
                            chatRooms[roomID] = room;
                        }
                    }
                }
            }
        }
        
        socket.broadcast.emit('user left',socket.id)
    });

});

if(process.env.PROD){
    app.use(express.static(path.join(__dirname,"./client/build")));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'./client/build/index.html'));
    });
}

const port = process.env.PORT || 3030
server.listen(port,()=>{console.log(`server running at port ${port}`)});
