import * as Config from './config.js';
import Player from './player.js';
import * as Camera from './camera.js';
import * as World from './world.js';
import * as Items from './items.js';
import * as Animation from './animation.js';

document.addEventListener('contextmenu', event => event.preventDefault());

export var socket = io();

export var fullmap = document.createElement('canvas');
fullmap.width = 800;
fullmap.height = 800;
fullmap = fullmap.getContext("2d");

var fgs = document.getElementById("fgs").getContext("2d");
fgs.canvas.width = Config.VIEW_WIDTH;
fgs.canvas.height = Config.VIEW_HEIGHT;

export var player;
var players = {};

var selectedBlock = 0;
var tab = "blocks";

var keys = [];
var worldFgs = [];

var initialized = false;

var worldwidth;
var worldheight;

var timeNew = null;
var timeOld = null;

function getBlockAt(x, y) {
    return worldFgs[y*worldheight / 16 + x];
}
function setBlockAt(x, y, bid) {
    worldFgs[y*worldheight / 16 + x] = bid;
}
function getForegroundAt(blocks, x, y) {
    return blocks[y*worldheight / 16 + x];
}
function setForegroundAt(blocks, x, y, isForeground) {
    blocks[y*worldheight / 16 + x] = isForeground;
}

$("p").on("click", function() {
    if($(this).text() === "blocks" || $(this).text() === "action" || $(this).text() === "decoration" || $(this).text() === "background") {
        $("li").removeClass("active");
        $(this).parent().addClass("active");
        $("#" + tab).css("display", "none");
        $("#" + $(this).text()).css("display", "block");
        tab = $(this).text()
    }
});


$("img").on("click", function() {
    $("img").removeClass("quickpicker_selected");
    selectedBlock = $(this)[0].fgid;
    $(this).addClass("quickpicker_selected");
});

$("body").on("click", "img.block", function() {
    $(".block").css("border", "none");
    $(this).css("border", "1px dotted white");
    selectedBlock = $(this)[0].fgid;
});

$("#showmore").on("click", function() {
    $("#blockpicker").css("display",  $("#blockpicker").css("display") === "block" ? "none" : "block");
    $("#showmore").text($("#showmore").text() === "more" ? "less" : "more");
});

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return {
        x: x,
        y: y
    }
}

var drag = false;
var empty = false;

$("#fgs").on('mousedown', function(e) {
    var coords = getCursorPosition($(this)[0], e);
    var bx = Math.floor((coords.x - ((window.innerWidth - window.innerWidth / 5) / 2) + player.position.x) / 16);
    var by = Math.floor((coords.y - (window.innerHeight / 2) + player.position.y) / 16);
    if(e.which === 1) { //left click
        drag = true;
        // startpoint.x = bx;
        // startpoint.y = by;
        // endpoint.x = bx;
        // endpoint.y = by;
        // drawevent = e;
        socket.emit("b", 0, bx, by, selectedBlock);
        // holding = true;
    } else if (e.which === 2) { //middle click
        var images = $("img");
        var id = getBlockAt(bx, by);
        for(var i = 0; i < images.length; i++) {
            $(images[i]).removeClass("quickpicker_selected");
        }
        selectedBlock = getBlockAt(bx, by);
        $(images[id]).addClass("quickpicker_selected");
    } else if (e.which === 3) { //right click
        drag = true;
        empty = true;
        socket.emit("b", 0, bx, by, 0);
        // holding = false;
        // rightclick = true;
    }
});

$("#fgs").on('mousemove', function(e) {
    if(drag) {
        var coords = getCursorPosition($(this)[0], e);
        var bx = Math.floor((coords.x - ((window.innerWidth - window.innerWidth / 5) / 2) + player.position.x) / 16);
        var by = Math.floor((coords.y - (window.innerHeight / 2) + player.position.y) / 16);
        socket.emit("b", 0, bx, by, empty ? 0 : selectedBlock);
    }
    // if(holding) {
    //     drawevent = e;
    // }
});

$("#fgs").on('mouseup', function(e) {
    if(drag) {
        drag = false;
        var coords = getCursorPosition($(this)[0], e);
        var bx = Math.floor((coords.x - ((window.innerWidth - window.innerWidth / 5) / 2) + player.position.x) / 16);
        var by = Math.floor((coords.y - (window.innerHeight / 2) + player.position.y) / 16);
        socket.emit("b", 0, bx, by, empty ? 0 : selectedBlock);
        empty = false;
    }
    // holding = false;
    // rightclick = false;
    // drawevent = null;
});

socket.on("init", function(width, height, worldfgs, pid, wid) {
    player = new Player(pid, wid);
    Camera.initialize(Config.VIEW_HEIGHT / 2 - player.position.x, Config.VIEW_HEIGHT / 2 - player.position.y);
    worldFgs = worldfgs;
    worldwidth = width * 16;
    worldheight = height * 16;
    Config.initialWorld(worldwidth, worldheight);
    World.initializeWorld(worldfgs);

    fullmap.canvas.width = worldwidth;
    fullmap.canvas.height = worldheight;
    $(document).ready(function() {
        for(var i = 0; i < worldwidth; i+=16) {
            for(var j = 0; j < worldheight; j+=16) {
                var x = i / 16;
                var y = j / 16;
                var block = getBlockAt(x, y);
                var blockImg = Config.getClippedRegion(Config.BLOCKS, 16*block, 0, 16, 16);
                fullmap.drawImage(blockImg, i, j);
            }
        }
        var blockButtons = $("img");
        for(var i = 0; i < blockButtons.length; i++) {
            var ii = i;
            if(ii > 7) {
                ii += 7;
            }
            var image = new Image();
            var canvas = Config.getClippedRegion(Config.BLOCKS, 16*ii, 0, 16, 16);
            if(i <= 9) {
                var font = Config.getClippedRegion(Config.PICKER, 16*(i+1), 0, 16, 16);
                if(i === 9) font = Config.getClippedRegion(Config.PICKER, 0, 0, 16, 16);
                var ctx = canvas.getContext("2d");
                ctx.drawImage(font, 0, 0);
            }
            image.src = canvas.toDataURL();
            image.style.margin = "0";
            blockButtons[i].src = image.src;
            blockButtons[i].fgid = ii;
        }
        Items.addBlocksToPicker();
        Items.createAnimations();
        socket.emit("init2");
        initialized = true;
    });
});
socket.on("add", function(pid, world, x, y, hor, ver, jumping, god) {
    if(pid === player.id) {
        player.initialize(worldFgs);
        initialized = true;
    } else {
        socket.emit("m", player.position.x, player.position.y, player.movement.x, player.movement.y, player.jumping);
        socket.emit("god", player.god);
        players[pid] = new Player(pid, world);
        players[pid].position.x = x;
        players[pid].position.y = y;
        players[pid].movement.x = hor;
        players[pid].movement.y = ver;
        players[pid].jumping = jumping;
        players[pid].god = god;
        players[pid].initialize(worldFgs);
    }
});
socket.on("left", function(pid) {
    delete players[pid];
});
socket.on("m", function(pid, x, y, hor, ver, jumping) {
    players[pid].position.x = x;
    players[pid].position.y = y;
    players[pid].movement.x = hor;
    players[pid].movement.y = ver;
    players[pid].jumping = jumping;
});
socket.on("god", function(pid, god) {
    if(pid === player.id) player.god = god;
    else players[pid].god = god;
    Camera.draw(player, fgs, fullmap.canvas, players);
});
socket.on("b", function(l, x, y, bid) {
    if(l === 0) {
        Animation.remove(getBlockAt(x, y), x + ";" + y);
        if(Animation.animations.includes(bid)) {
            if(Animation.blocks[bid] === undefined) Animation.blocks[bid] = [];
            Animation.blocks[bid].push(x + ";" + y);
        }
        setBlockAt(x, y, bid)
        var bg = Config.getClippedRegion(Config.BLOCKS, 0, 0, 16, 16);
        var newBlock = Config.getClippedRegion(Items.fgs[bid].bitmap, 16*Items.fgs[bid].bitmapid, 0, 16, 16);
        fullmap.drawImage(bg, Math.round(x*16), Math.round(y*16));
        fullmap.drawImage(newBlock, Math.round(x*16), Math.round(y*16));
        setForegroundAt(player.blocks, x, y, Items.fgs[bid].type === Items.TYPE.foreground);
        for(var i in players) {
            setForegroundAt(players[i].blocks, x, y, Items.fgs[bid].type === Items.TYPE.foreground);
        }
    }
});
socket.on("show", function(key) {
    if(key === "r") {
        if(!Config.red) {
            Config.setKey(0, true);
            replace(24, Config.DOORS, 0, "deco");
            replace(27, Config.DOORS, 3, "fg");
            changeType(-1, 24, "deco");
            changeType(-1, 27, "fg");
            for(var i in players) {
                changeType(i, 24, "deco");
                changeType(i, 27, "fg");
            }
        }
    } else if(key === "g") {
        if(!Config.green) {
            Config.setKey(1, true);
            replace(24, Config.DOORS, 1, "deco");
            replace(27, Config.DOORS, 4, "fg");
            changeType(-1, 25, "deco");
            changeType(-1, 28, "fg");
            for(var i in players) {
                changeType(i, 25, "deco");
                changeType(i, 28, "fg");
            }
        }
    } else if(key === "b") {
        if(!Config.blue) {
            Config.setKey(2, true);
            replace(24, Config.DOORS, 2, "deco");
            replace(27, Config.DOORS, 5, "fg");
            changeType(-1, 26, "deco");
            changeType(-1, 29, "fg");
            for(var i in players) {
                changeType(i, 26, "deco");
                changeType(i, 29, "fg");
            }
        }
    }
});
socket.on("hide", function(key) {
    if(key === "r") {
        Config.setKey(0, false);
        replace(24, Config.BLOCKS, Items.fgs[24].bitmapid, "fg");
        replace(27, Config.BLOCKS, Items.fgs[27].bitmapid, "deco");
        changeType(-1, 24, "fg");
        changeType(-1, 27, "deco");
        for(var i in players) {
            changeType(i, 24, "fg");
            changeType(i, 27, "deco");
        }
    } else if(key === "g") {
        Config.setKey(1, false);
        replace(24, Config.BLOCKS, Items.fgs[25].bitmapid, "fg");
        replace(27, Config.BLOCKS, Items.fgs[28].bitmapid, "deco");
        changeType(-1, 25, "fg");
        changeType(-1, 28, "deco");
        for(var i in players) {
            changeType(i, 25, "fg");
            changeType(i, 28, "deco");
        }
    } else if(key === "b") {
        Config.setKey(2, false);
        replace(24, Config.BLOCKS, Items.fgs[26].bitmapid, "fg");
        replace(27, Config.BLOCKS, Items.fgs[29].bitmapid, "deco");
        changeType(-1, 26, "fg");
        changeType(-1, 29, "deco");
        for(var i in players) {
            changeType(i, 26, "fg");
            changeType(i, 29, "deco");
        }
    }
});


export function replace(bId, img, imgid) {
    for(var i = 0; i < worldFgs.length; i++)
        if (worldFgs[i] === bId) {
            var y = Math.floor(i / (worldheight / 16));
            var x = -(y*worldheight / 16) + i;
            var block = Config.getClippedRegion(img, imgid*16, 0, 16, 16);
            var empty = Config.getClippedRegion(Config.BLOCKS, 0*16, 0, 16, 16);
            fullmap.drawImage(empty, x*16, y*16);
            fullmap.drawImage(block, x*16, y*16);
        }
}

export function changeType(uid, bId, type) {
    for(var i = 0; i < worldFgs.length; i++)
        if (worldFgs[i] === bId) {
            var y = Math.floor(i / (worldheight / 16));
            var x = -(y*worldheight / 16) + i;
            if(type === "fg") {
                if(uid === -1) setForegroundAt(player.blocks, x, y, true);
                else setForegroundAt(players[uid].blocks, x, y, true);
            } else if(type === "deco") {
                if(uid === -1) setForegroundAt(player.blocks, x, y, false);
                else setForegroundAt(players[uid].blocks, x, y, false);
            }
        }
}

document.onkeydown = function(event) {
    if(event.keyCode === 84 || event.keyCode === 13) {
        if($(".chat").css("display") === "block") {
            $(".chat").css("display", "none");
            $(".chat").val("");
        } else {
            $(".chat").css("display", "block");
            $(".chat").focus();
        }
    } else if(event.keyCode === 27) {
        if($(".chat").css("display") === "block") {
            $(".chat").css("display", "none")
            $(".chat").val("");
        }
    }else {
        if(!$(".chat").is(":focus")) {
            if(event.keyCode === 71) {
                socket.emit("god", !player.god);
            } else if(event.keyCode >= 48 && event.keyCode <= 57) {
                $("img").removeClass("quickpicker_selected");
                selectedBlock = $("img")[$("img").length - 12 + (event.keyCode - 48)].fgid;
                if(event.keyCode === 48) {
                    selectedBlock = $("img")[$("img").length - 2].fgid;
                    $($("img")[$("img").length - 2]).addClass("quickpicker_selected");
                } else $($("img")[$("img").length - 12 + (event.keyCode - 48)]).addClass("quickpicker_selected");
            } else {
                if(!keys.includes(event.keyCode)) {
                    keys.push(event.keyCode);
                }
                var kc = event.keyCode;
                if(kc === 68 || kc === 39 || kc === 65 || kc === 37 || kc === 83 || kc === 40 || kc === 87 || kc === 38 || kc === 32) {
                    socket.emit("m", player.position.x, player.position.y, getMovement().hor, getMovement().ver, getMovement().jumping);
                }
            }
        }
    }
}
document.onkeyup = function(event) {
    for(var i = 0; i < keys.length; i++) {
        if(keys[i] === event.keyCode) {
            keys.splice(i, 1);
        }
    }
    var kc = event.keyCode;
    if(kc === 68 || kc === 39 || kc === 65 || kc === 37 || kc === 83 || kc === 40 || kc === 87 || kc === 38 || kc === 32) {
        socket.emit("m", player.position.x, player.position.y, getMovement().hor, getMovement().ver, getMovement().jumping);
    }
}
function getMovement() {
    var hor = 0;
    var ver = 0;
    var jumping = false;
    if(keys.includes(68) || keys.includes(39))
        hor += 1;
    if(keys.includes(65) || keys.includes(37))
        hor -= 1;
    if(keys.includes(83) || keys.includes(40))
        ver += 1;
    if(keys.includes(87) || keys.includes(38))
        ver -= 1;
    if(keys.includes(32))
        jumping = true;
    return {hor: hor, ver: ver, jumping: jumping};
}

function updateposition(hor, ver, jumping) {
    player.movement.x = hor;
    player.movement.y = ver;
    player.jumping = jumping;
    var ticks = (timeNew - timeOld)*2/(1000/60);
    player.update(Math.round(ticks));
    for(var i in players) {
        players[i].update(Math.round(ticks));
    }
    Camera.draw(player, fgs, fullmap.canvas, players);
}


setInterval(function() {
    if(initialized) {
        var hor = getMovement().hor;
        var ver = getMovement().ver;
        var jumping = getMovement().jumping;
        updateposition(hor, ver, jumping);
        if(timeNew === null) {
            timeNew = Date.now();
            timeOld = Date.now();
        } else {
            timeOld = timeNew;
            timeNew = Date.now();
        }
    }
}, 1000 / 60);