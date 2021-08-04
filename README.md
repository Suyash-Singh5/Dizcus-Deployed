# Dizcus

This application is a part of the Microsoft's Engage Mentorship program, This application helps users to Video call and/or Chat with multiple people in custom rooms, It uses the peer to peer network type to establish connection between 2 users and the mesh topology to scale to multiple users, The best thing is the fact that no expensive server or communication service is required but this limits the scalability. This application is built using the technology stack: React and Nodejs with WebRTC, SimplePeer and Socket.io for communication..

![Screenshot from 2021-07-13 20-16-22](https://user-images.githubusercontent.com/69861341/125500514-455f7958-1a48-41d4-8253-1991ce694ca1.png)

## Demo
https://www.youtube.com/watch?v=jB1Ihyl_xNs

## How to Read the Code ?

The Code is divided to two parts:

1. Front end Code:
   This includes the client folder which is a react app that has these folders inside the src folder:

   - routes folder:
     This folder contains files with each corresponding to a particular page in the website
   - Component folder:
     This folder contains files with each corresponding to a reusable component in the application like the buttons, navigation bar, etc.
   - Images folder:
     This folder contains almost all the images used in this application
   - Other files include:
     - App.js:
       This file is a wrapper of all the front end files
     - Room.css:
       This file contains all the css code used in styling apart from the inline css

2. Back end Code:
   The complete back end code is only in a single file - server.js.
   This is due to the fact that only a signalling server is required in this application which is socket.io in this case.
