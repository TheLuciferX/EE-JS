import * as Config from './config.js';
import * as Animation from './animation.js';

export let fgs = {};
export let bgs = {};

function blockPacks() {
    var packs = {};
    packs.basic = new Pack("basic", 0, "Basic blocks to get you started", [
        new Item(1, TYPE.foreground, "#ffffff", ["white", "basic", "bright"], false, false, TAB.blocks, Config.BLOCKS, 1),
        new Item(2, TYPE.foreground, "#999999", ["gray", "basic"], false, false, TAB.blocks, Config.BLOCKS, 2),
        new Item(3, TYPE.foreground, "#333333", ["black", "basic", "dark"], false, false, TAB.blocks, Config.BLOCKS, 3),
        new Item(4, TYPE.foreground, "#990000", ["red", "basic"], false, false, TAB.blocks, Config.BLOCKS, 4),
        new Item(5, TYPE.foreground, "#db750f", ["orange", "basic"], false, false, TAB.blocks, Config.BLOCKS, 5),
        new Item(6, TYPE.foreground, "#ffc400", ["yellow", "basic"], false, false, TAB.blocks, Config.BLOCKS, 6),
        new Item(7, TYPE.foreground, "#07c700", ["green", "basic"], false, false, TAB.blocks, Config.BLOCKS, 7),
        new Item(8, TYPE.foreground, "#00b0ad", ["cyan", "basic", "light", "blue", "bright"], false, false, TAB.blocks, Config.BLOCKS, 8),
        new Item(9, TYPE.foreground, "#0049a8", ["blue", "basic"], false, false, TAB.blocks, Config.BLOCKS, 9),
        new Item(10, TYPE.foreground, "#b602bd", ["pink", "basic", "purple"], false, false, TAB.blocks, Config.BLOCKS, 10),
        new Item(11, TYPE.foreground, "#b602bd", ["pink", "basic", "purple"], false, false, TAB.blocks, Config.BLOCKS, 11),
        new Item(12, TYPE.foreground, "#b602bd", ["pink", "basic", "purple"], false, false, TAB.blocks, Config.BLOCKS, 12),
        new Item(13, TYPE.foreground, "#b602bd", ["pink", "basic", "purple"], false, false, TAB.blocks, Config.BLOCKS, 13),
        new Item(14, TYPE.foreground, "#b602bd", ["pink", "basic", "purple"], false, false, TAB.blocks, Config.BLOCKS, 14)
    ]);
    packs.gravity = new Pack("gravity", 0, "Gravity blocks which changes the direction of your movement", [
        new Item(0, TYPE.decoration, "-1", ["normal", "clear", "nothing", "empty", "gravity", "default", "regular"], false, false, TAB.action, Config.BLOCKS, 0),
        new Item(15, TYPE.decoration, "-1", ["left", "arrow", "gravity"], false, false, TAB.action, Config.BLOCKS, 15),
        new Item(16, TYPE.decoration, "-1", ["up", "arrow", "gravity"], false, false, TAB.action, Config.BLOCKS, 16),
        new Item(17, TYPE.decoration, "-1", ["right", "arrow", "gravity"], false, false, TAB.action, Config.BLOCKS, 17),
        new Item(18, TYPE.decoration, "-1", ["dot", "no gravity", "gravity"], false, false, TAB.action, Config.BLOCKS, 18)
    ]);
    packs.keys = new Pack("keys", 0, "Keys to open doors and close gates", [
        new Item(21, TYPE.decoration, "-1", ["red", "key"], false, false, TAB.action, Config.BLOCKS, 19),
        new Item(22, TYPE.decoration, "-1", ["green", "key"], false, false, TAB.action, Config.BLOCKS, 20),
        new Item(23, TYPE.decoration, "-1", ["blue", "key"], false, false, TAB.action, Config.BLOCKS, 21),
    ]);
    packs.doors = new Pack("doors", 0, "Doors that can be opened by keys", [
        new Item(24, TYPE.foreground, "-1", ["red", "door", "closed"], false, false, TAB.action, Config.BLOCKS, 22),
        new Item(25, TYPE.foreground, "-1", ["green", "door", "closed"], false, false, TAB.action, Config.BLOCKS, 23),
        new Item(26, TYPE.foreground, "-1", ["blue", "door", "closed"], false, false, TAB.action, Config.BLOCKS, 24),
    ]);
    packs.gates = new Pack("gates", 0, "Gates that can be closed by keys", [
        new Item(27, TYPE.decoration, "-1", ["red", "gate", "opened"], false, false, TAB.action, Config.BLOCKS, 25),
        new Item(28, TYPE.decoration, "-1", ["green", "gate", "opened"], false, false, TAB.action, Config.BLOCKS, 26),
        new Item(29, TYPE.decoration, "-1", ["blue", "gate", "opened"], false, false, TAB.action, Config.BLOCKS, 27),
    ]);
    packs.coins = new Pack("coins", 0, "Challenges for your world.", [
        new Item(19, TYPE.above, "-1", ["coin", "gold", "yellow"], false, false, TAB.action, Config.ANIMATED, 0),
    ]);
    return packs;
}

function Pack(name, shopId, description, items) {
    this.name = name;
    this.shopId = shopId;
    this.description = description;
    this.items = items;
}

function Item(id, type, mapColour, tags, ownerOnly, adminOnly, tab, bitmap, bitmapid) {
    this.name = name;
    this.id = id;
    this.type = type;
    this.mapColour = mapColour;
    this.tags = tags;
    this.ownerOnly = ownerOnly;
    this.adminOnly = adminOnly;
    this.tab = tab;
    this.bitmap = bitmap;
    this.bitmapid = bitmapid;
    if(type === TYPE.background) {
        bgs[id] = this;
    } else {
        fgs[id] = this;
    }
}


export const TYPE = {
    foreground: 0,
    background: 1,
    decoration: 2,
    above: 3
}

const TAB = {
    blocks: 0,
    action: 1,
    decoration: 2,
    background: 3
}

export function createAnimations() {
    Animation.animation(19, Config.ANIMATED, 0, 17, 75);
}

export function addBlocksToPicker() {
    var blocksTab = $("#blocks");
    var actionTab = $("#action");
    var decTab = $("#decoration");
    var bgTab = $("#background");
    var packs = blockPacks();
    for(var i in packs) {
        var pack = packs[i];
        if(pack.shopId === 0) {
            var allBlocks = [];
            var allActions = [];
            var allDecos = [];
            var allBgs = [];
            for(var j = 0; j < pack.items.length; j++) {
                if(pack.items[j].tab === TAB.blocks) allBlocks.push(pack.items[j]);
                else if(pack.items[j].tab === TAB.action) allActions.push(pack.items[j]);
                else if(pack.items[j].tab === TAB.decoration) allDecos.push(pack.items[j]);
                else if(pack.items[j].tab === TAB.background) allBgs.push(pack.items[j]);
            }
            if(allBlocks.length > 0) {
                var div = document.createElement('div');
                $(div).css("height", "fitContent");
                $(div).css("width", "fitContent");
                $(div).css("margin", "0 5px");
                $(div).css("display", "inline-block");
                document.body.appendChild(div);
                var par = document.createElement('p');
                $(par).css("margin", "0");
                $(par).text(pack.name);
                document.body.appendChild(par);
                div.appendChild(par);
                for(var j = 0; j < allBlocks.length; j++) {
                    var img = document.createElement('img');
                    img.fgid = allBlocks[j].id;
                    $(img).addClass("block");
                    var block = allBlocks[j];
                    var bid = block.id;
                    var empty = Config.getClippedRegion(Config.BLOCKS, 16*0, 0, 16, 16);
                    var blockimg = Config.getClippedRegion(block.bitmap, 16*block.bitmapid, 0, 16, 16);
                    var ctx = empty.getContext("2d");
                    ctx.drawImage(blockimg, 0, 0);
                    var src = empty.toDataURL();
                    $(img).attr("src", src);
                    document.body.appendChild(img);
                    div.appendChild(img);
                }
                blocksTab[0].appendChild(div);
            }
            if(allActions.length > 0) {
                var div = document.createElement('div');
                $(div).css("height", "fitContent");
                $(div).css("width", "fitContent");
                $(div).css("margin", "0 5px");
                $(div).css("display", "inline-block");
                document.body.appendChild(div);
                var par = document.createElement('p');
                $(par).css("margin", "0");
                $(par).text(pack.name);
                document.body.appendChild(par);
                div.appendChild(par);
                for(var j = 0; j < allActions.length; j++) {
                    var img = document.createElement('img');
                    img.fgid = allActions[j].id;
                    $(img).addClass("block");
                    var block = allActions[j];
                    var bid = block.id;
                    var empty = Config.getClippedRegion(Config.BLOCKS, 16*0, 0, 16, 16);
                    var blockimg = Config.getClippedRegion(block.bitmap, 16*block.bitmapid, 0, 16, 16);
                    var ctx = empty.getContext("2d");
                    ctx.drawImage(blockimg, 0, 0);
                    var src = empty.toDataURL();
                    $(img).attr("src", src);
                    document.body.appendChild(img);
                    div.appendChild(img);
                }
                actionTab[0].appendChild(div);
            }
            if(allDecos.length > 0) {
                var div = document.createElement('div');
                $(div).css("height", "fitContent");
                $(div).css("width", "fitContent");
                $(div).css("margin", "0 5px");
                $(div).css("display", "inline-block");
                document.body.appendChild(div);
                var par = document.createElement('p');
                $(par).css("margin", "0");
                $(par).text(pack.name);
                document.body.appendChild(par);
                div.appendChild(par);
                for(var j = 0; j < allDecos.length; j++) {
                    var img = document.createElement('img');
                    img.fgid = allDecos[j].id;
                    $(img).addClass("block");
                    var block = allDecos[j];
                    var bid = block.id;
                    var empty = Config.getClippedRegion(Config.BLOCKS, 16*0, 0, 16, 16);
                    var blockimg = Config.getClippedRegion(block.bitmap, 16*block.bitmapid, 0, 16, 16);
                    var ctx = empty.getContext("2d");
                    ctx.drawImage(blockimg, 0, 0);
                    var src = empty.toDataURL();
                    $(img).attr("src", src);
                    document.body.appendChild(img);
                    div.appendChild(img);
                }
                decTab[0].appendChild(div);
            }
            if(allBgs.length > 0) {
                var div = document.createElement('div');
                $(div).css("height", "fitContent");
                $(div).css("width", "fitContent");
                $(div).css("margin", "0 5px");
                $(div).css("display", "inline-block");
                document.body.appendChild(div);
                var par = document.createElement('p');
                $(par).css("margin", "0");
                $(par).text(pack.name);
                document.body.appendChild(par);
                div.appendChild(par);
                for(var j = 0; j < allBgs.length; j++) {
                    var img = document.createElement('img');
                    img.bgid = allBgs[j].id;
                    $(img).addClass("block");
                    var block = allBgs[j];
                    var bid = block.id;
                    var empty = Config.getClippedRegion(Config.BLOCKS, 16*0, 0, 16, 16);
                    var blockimg = Config.getClippedRegion(block.bitmap, 16*block.bitmapid, 0, 16, 16);
                    var ctx = empty.getContext("2d");
                    ctx.drawImage(blockimg, 0, 0);
                    var src = empty.toDataURL();
                    $(img).attr("src", src);
                    document.body.appendChild(img);
                    div.appendChild(img);
                }
                bgTab[0].appendChild(div);
            }
        }
    }
    var height = $("#blockpicker").css("height");
    $("#blockpicker").css("marginTop", "100vh").css("marginTop", "-=" + height).css("marginTop", "-=40px");


    $("#blockpicker").css("display", "block");
    $("#action").css("display", "block");
    $("#decoration").css("display", "block");
    $("#background").css("display", "block");
    var maxHeight = Math.max($("#blocks").height(), $("#action").height(), $("#decoration").height(), $("#background").height());
    $("#blocks").height(maxHeight);
    $("#action").height(maxHeight);
    $("#decoration").height(maxHeight);
    $("#background").height(maxHeight);
    $("#blockpicker").css("display", "none");
    $("#action").css("display", "none");
    $("#decoration").css("display", "none");
    $("#background").css("display", "none");
}