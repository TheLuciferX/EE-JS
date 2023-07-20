var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    User           = require("./server/models/user"),
    World          = require("./server/models/world"),
    cookieParser   = require("cookie-parser"),
    session        = require("express-session"),
    seed           = require("./seeds");
    server         = require("http").Server(app);

const MongoStore = require('connect-mongo')(session);
mongoose.connect('mongodb://127.0.0.1:27017/ee', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser("MSDKOhjd8s9fnmMIASD9Fo"));

var sessionStore = new MongoStore({
    url: 'mongodb://127.0.0.1:27017/ee',
    ttl: 1 * 24 * 60 * 60, // = 1 days. Default
    autoReconnect: true
})
var sessionMiddleware = session({
    store: sessionStore,
    secret: "H89HIUahs78hiuasIy299*@^&*#$ASkijd*&",
    resave: true,
    saveUninitialized: true
});
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/client/index.html");
});

app.get("/webgl", function(req, res) {
    res.sendFile(__dirname + "/client/webgl/index.html");
});

var id = 0;

app.use("/client", express.static(__dirname + "/client"));

server.listen(3000);


var blocks = [
    0, // empty
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, // basic
    15, 16, 17, 18, // gravity
    19, 20, // coins
    21, 22, 23, 24, 25, 26, 27, 28, 29 // doors
];

var fgs = [];
for(var x = 0; x < 50; x++) {
    for(var y = 0; y < 50; y++) {
        if(x === 0 || y === 0 || x === 49 || y === 49) {
            fgs[y*50 + x] = 2;
        } else {
            fgs[y*50 + x] = 0;
        }
    }
}

var SOCKET_LIST = {};
var PLAYER_LIST = {};

var Player = function(uid) {
    var self = {
        x:16,
        y:16,
        hor:0,
        ver:0,
        jumping:false,
        id:uid,
        pid:id,
        god: false
    }
    return self;
}

var red = false;
var green = false;
var blue = false;
var rt;
var gt;
var bt;

var io = require("socket.io")(server, {});
io.sockets.on("connection", function(socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    console.log("connected");
    var player = Player(socket.id);
    PLAYER_LIST[socket.id] = player;
    World.findById("5d49142009d94a1398ca2c6f", function(err, world) {
        if(err || world === undefined || world === null) {
            console.log("error");
            console.log(err);
            return;
        }
        socket.emit("init", world.width, world.height, world.fgs, id, "5d49142009d94a1398ca2c6f");
        id++;

        socket.on("b", function(l, x, y, bid) {
            if(l === 0) {
                //setBlockAt(blocks, x, y, bid);
                if(!blocks.includes(bid)) return;
                for(var i in SOCKET_LIST) {
                    var socket2 = SOCKET_LIST[i];
                    socket2.emit("b", l, x, y, bid);
                }
            }
        });

    });
    socket.on("disconnect", function() {
        var id = player.pid;
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
        for(var i in SOCKET_LIST) {
            var socket2 = SOCKET_LIST[i];
            socket2.emit("left", id);
        }
    });

    socket.on("m", function(x, y, hor, ver, jumping) {
        player.x = x;
        player.y = y;
        player.hor = hor;
        player.ver = ver;
        player.jumping = jumping;
        for(var i in SOCKET_LIST) {
            if(SOCKET_LIST[i] !== socket) {
                SOCKET_LIST[i].emit("m", player.pid, x, y, hor, ver, jumping);
            }
        }
    });

    socket.on("god", function(god) {
        player.god = god;

        for(var i in SOCKET_LIST) {
            var socket2 = SOCKET_LIST[i];
            socket2.emit("god", player.pid, god);
        }
    });

    socket.on("init2", function() {
        for(var i in PLAYER_LIST) {
            var plr = PLAYER_LIST[i];
            socket.emit("add", plr.pid, "5d49142009d94a1398ca2c6f", plr.x, plr.y, plr.hor, plr.ver, plr.jumping, plr.god);
        }
        for(var j in SOCKET_LIST) {
            var socket2 = SOCKET_LIST[j];
                if(socket !== socket2) {
                socket2.emit("add", player.pid, "5d49142009d94a1398ca2c6f", player.x, player.y, player.hor, player.ver, player.jumping, player.god);
            }
        }
    });
    
    socket.on("key", function(key, x, y) {
        for(var i in SOCKET_LIST) {
            var socket2 = SOCKET_LIST[i];
            socket2.emit("show", key);
        }
        if(key === "r") {
            if(!red) {
                red = true;
            }
            else {
                clearTimeout(rt);
            }
            rt = setTimeout(function() {
                for(var i in SOCKET_LIST) {
                    var socket2 = SOCKET_LIST[i];
                    socket2.emit("hide", "r");
                }
                red = false;
                rt = null;
            }, 5000);
        } else if(key === "g") {
            if(!green) {
                green = true;
            }
            else {
                clearTimeout(gt);
            }
            gt = setTimeout(function() {
                for(var i in SOCKET_LIST) {
                    var socket2 = SOCKET_LIST[i];
                    socket2.emit("hide", "g");
                }
                green = false;
                gt = null;
            }, 5000);
        } else if(key === "b") {
            if(!blue) {
                ble = true;
            }
            else {
                clearTimeout(bt);
            }
            bt = setTimeout(function() {
                for(var i in SOCKET_LIST) {
                    var socket2 = SOCKET_LIST[i];
                    socket2.emit("hide", "b");
                }
                blue = false;
                bt = null;
            }, 5000);
        }
    });
});