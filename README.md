[EE-JS](https://github.com/TheLuciferX/EE-JS)
===============
EE JS is a web game developed using node.js

* This is a game made in a node.js web application.
* The game is a sandbox game, a remake of the Flash (AS3) game Everybody Edits.
* All in-game graphic assets were taken from the game Everybody Edits.


* Uses mobgoDB as the database (must run a mongodb server to use).
* This game also has multiplayer support.

How does multiplayer work:
------------
1. The server & client use socket.io to interact whith each other.
2. Any interaction the player makes in his client-side, whether it is movement, placing blocks, touching things, the client sends an appropriate message to the server.
3. The server recieves that message, checks that eveything is correct, and runs necessary code.
4. Once done with that, sends back a message to all connected clients, so the foreign clients (all clients except the one mentioned above) can implement the necessary changes.

Multiplayer Examples:
------------
Placing a block:
1. Client sends message "b" to server
2. Server receives message "b" with parameters x, y (locations), and block ID.
3. Server updates it's block list, and changes the block in x,y to the new block ID.
4. Server then sends message "b" back to all connected clients, to update the block visually.

Ingame Examples:
![movement](https://github.com/TheLuciferX/EE-JS/blob/main/gifs/multi-movement.gif)
----
![blocks](https://github.com/TheLuciferX/EE-JS/blob/main/gifs/multi-blocks.gif)
----
![arrows](https://github.com/TheLuciferX/EE-JS/blob/main/gifs/multi-arrows.gif)
----
![keydoors](https://github.com/TheLuciferX/EE-JS/blob/main/gifs/multi-keydoors.gif)