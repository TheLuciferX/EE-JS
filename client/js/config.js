export function getClippedRegion(image, x, y, width, height) {
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, x, y, width, height,  0, 0, width, height);
    return canvas;
}

export const BLOCK_SIZE = 16;

export let VIEW_WIDTH = window.innerWidth - window.innerWidth / 5;
export let VIEW_HEIGHT = window.innerHeight;

export const BLOCKS = new Image();
BLOCKS.src = "client/img/blocks.png";
export const SMILEY = new Image();
SMILEY.src = "client/img/smiley.png";
export const GODAURA = new Image();
GODAURA.src = "client/img/god.png";
export const PICKER = new Image();
PICKER.src = "client/img/picker.png";
export const ANIMATED = new Image();
ANIMATED.src = "client/img/animated.png";
export const DOORS = new Image();
DOORS.src = "client/img/doors.png";

$(window).resize(function(){
    $("#fgs")[0].width = window.innerWidth - window.innerWidth/5;
    $("#fgs")[0].height = window.innerHeight;
    VIEW_WIDTH = window.innerWidth - window.innerWidth / 5;
    VIEW_HEIGHT = window.innerHeight;
    var height = $("#blockpicker").css("height");
    $("#blockpicker").css("marginTop", "100vh").css("marginTop", "-=" + height).css("marginTop", "-=40px");



    var visible = $("#blockpicker").css("display") === "block";
    var visibleTab = $("#blocks").css("display") === "block" ? $("#blocks")[0] : $("#action").css("display") === "block" ? $("#action")[0] : $("#decoration").css("display") === "block" ? $("#decoration")[0] : $("#background")[0];

    if(!visible) $("#blockpicker").css("display", "block");
    if(visibleTab !== $("#blocks")[0]) $("#blocks").css("display", "block");
    if(visibleTab !== $("#action")[0]) $("#action").css("display", "block");
    if(visibleTab !== $("#decoration")[0]) $("#decoration").css("display", "block");
    if(visibleTab !== $("#background")[0]) $("#background").css("display", "block");
    var maxHeight = Math.max($("#blocks").height(), $("#action").height(), $("#decoration").height(), $("#background").height());
    $("#blocks").height(maxHeight);
    $("#action").height(maxHeight);
    $("#decoration").height(maxHeight);
    $("#background").height(maxHeight);
    if(!visible) $("#blockpicker").css("display", "none");
    if(visibleTab !== $("#blocks")[0]) $("#blocks").css("display", "none");
    if(visibleTab !== $("#action")[0]) $("#action").css("display", "none");
    if(visibleTab !== $("#decoration")[0]) $("#decoration").css("display", "none");
    if(visibleTab !== $("#background")[0]) $("#background").css("display", "none");
});

export let worldWidth;
export let worldHeight;

export let red = false;
export let green = false;
export let blue = false;

export function setKey(i, b) {
    if(i === 0)red = b;
    else if(i === 1)green = b;
    else if(i === 2)blue = b;
}

export function initialWorld(w, h) {
    worldWidth = w;
    worldHeight = h;
}

export class Vector2D {
    constructor(x, y) {
        if (y == undefined) { y = x.y; x = x.x }
        this.x = x
        this.y = y
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    remove(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    scalarMul(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }
    scalarDiv(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }
    mulX(n) {
        this.x *= n;
        return this;
    }
    mulY(n) {
        this.y *= n;
        return this;
    }
    addX(x) {
        this.x += x;
        return this;
    }
    addY(y) {
        this.y += y;
        return this;
    }
}