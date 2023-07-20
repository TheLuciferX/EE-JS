[EE-JS](https://github.com/TheLuciferX/EE-JS)
===============
EE JS is a web game developed using node.js

* [About & Features](#about--features)
* [Ingame Examples](#ingame-examples)
* [Multiplayer](#multiplayer)
* [Ingame Multiplayer Examples](#ingame-multiplayer-examples)
* [Scaling](#scaling)

## About & Features
General information:
* EE-JS is a sandbox game developed in JavaScript, as a remake of the Flash (AS3) game Everybody Edits.
* All in-game graphic assets have been taken from the game Everybody Edits, and do not belong to me.
* Server is coded in Node.JS and uses a MongoDB database (for future uses).
* Contains multiplayer support.

## Ingame Examples

![gameplay](https://github.com/TheLuciferX/EE-JS/blob/main/gifs/single-gameplay.gif)

## Multiplayer

So how does multiplayer work here?
1. The server & client use socket.io to interact whith each other.
2. Any interaction the player makes in his client-side, whether it is movement, placing blocks, touching things, the client sends an appropriate message to the server.
3. The server recieves that message, checks that eveything is correct, and runs necessary code.
4. Once done with that, sends back a message to all connected clients, so the foreign clients (all clients except the one mentioned above) can implement the necessary changes.

For example, if I wanted to place a block:
1. Client sends message "b" to server
2. Server receives message "b" with parameters x, y (locations), and block ID.
3. Server updates it's block list, and changes the block in x,y to the new block ID.
4. Server then sends message "b" back to all connected clients, to update the block visually.

## Ingame Multiplayer Examples

![movement](https://github.com/TheLuciferX/EE-JS/blob/main/gifs/multi-movement.gif)
----
![blocks](https://github.com/TheLuciferX/EE-JS/blob/main/gifs/multi-blocks.gif)
----
![arrows](https://github.com/TheLuciferX/EE-JS/blob/main/gifs/multi-arrows.gif)
----
![keydoors](https://github.com/TheLuciferX/EE-JS/blob/main/gifs/multi-keydoors.gif)

## Scaling

So what is scaling?
* Scaling is basically the technology to scale the whole gameplay, while we zoom in/out (with our browser).
* This technology allows us to capture more (or less) of the in-game screen, in exchange for a comfortable playable size.

Example:
![scaling](https://github.com/TheLuciferX/EE-JS/blob/main/gifs/single-scaling.gif)