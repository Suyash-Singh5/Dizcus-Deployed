require("dotenv").config();
const path = require("path")
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

let videoNamesDict = {} // Dictionary stores all the socketid, usernames pairs in the video room
let chatNamesDict = {} // Dictionary stores all the socketid, usernames pairs in the chat room
const videoRooms = {}; // Dictionary stores all the room IDs and array socket ids in the video room pairs
const chatRooms = {}; // Dictionary stores all the room IDs and array socket ids in the chat room pairs
const socketdict = {}; // Dictionary stores all the socketid and room ID pairs 

// Checks if a Dictionary is empty

const isEmpty = (dic) =>{
    for(var i in dic)
    { 
        return false;
    }
   return true;
}

// Fires when a socket is connected to the server

io.on('connection', socket => {
    
    // Adds socket to the room as well as to the disctionaries
    
    socket.on("join room", (roomID,username,chat) => {
        
        // Adding to a video room
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
        }
        
        // Adding to a chat room
        else 
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

    // Emits a boolean value which is true if there are no duplicates

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

    // Sends signal to other peers about new user

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    // Returns the signal to the new user

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    // Fires when the user clicks on leave call button in video room or join video button or leave call button in chat room

    socket.on("cut call",()=> {
        const roomID = socketdict[socket.id];
        let room = null;
        let disconchat = false; // True if user should be disconnected from chat room
        
        // Checking user in video room 
        if (!isEmpty(videoRooms[roomID])) 
        {
            videoRooms[roomID].forEach(user=>{
                if(user===socket.id)
                {
                    room = videoRooms[roomID]
                }
            })
            
        }

        // Checking user in chat room
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

        // Removing the socket from all the disctionaries in video room nested if are just to prevent errors
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

        // Removing the socket from all the disctionaries in chat room
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

    // Emits all the users in the room (both video and chat)

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

    // Emits the name of which a particular socketid is linked to

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

    // Sends the chat message to all the users in the room along with the name of the person 

    socket.on("send message",(message)=>{
        const roomID = socketdict[socket.id];
        let name = null; // name of person who sent the message
        
        // Checking in Video Room
        if(videoNamesDict[roomID])
        {
            if (videoNamesDict[roomID][socket.id]) 
            {
                name = videoNamesDict[roomID][socket.id];
            }
        }

        // Checking in Chat Room
        if(chatNamesDict[roomID])
        {
            if (chatNamesDict[roomID][socket.id]) 
            {
                name = chatNamesDict[roomID][socket.id];
            }
        }

        // Emitting message to all participants in the video room
        if(videoRooms[roomID])
        {
            videoRooms[roomID].forEach( participant => {
                if(participant!==socket.id)
                {
                    io.to(participant).emit('recieve message',{message: message,name: name} )
                }
            });
        }

        // Emitting message to all participants in the chat room
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

    // Same as the cut call with the difference that this fires when the user is disconnected
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

// Checking if in production environment
if(process.env.PROD){
    app.use(express.static(path.join(__dirname,"./client/build")));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'./client/build/index.html'));
    });
}

const port = process.env.PORT || 3030
server.listen(port,()=>{console.log(`server running at port ${port}`)});
