import * as Game from './game1.js';
import * as Config from './config.js';

export var blocks = {};
export var animations = [];

export function animation(blockId, bitmap, bitmapstart, bitmapend, interval) {
    var id = bitmapstart;
    animations.push(blockId);
    setInterval(function() {
        replace(blockId, bitmap, id, bitmapstart, bitmapend);
        id++;
        if(id > bitmapend) id = bitmapstart;
    }, interval);
}

export function remove(bid, loc) {
    if(blocks[bid] === undefined) return;
    var allLocs = blocks[bid];
    for(var i = 0; i < allLocs.length; i++) {
        if(allLocs[i] === loc) {
            blocks[bid].splice(i, 1);
        }
    }
}

function replace(bId, img, imgid, start, end) {
    var locs = blocks[bId];
    if(locs === undefined) return;

    for(var i = 0; i < locs.length; i++) {
        var x = locs[i].split(";")[0];
        var y = locs[i].split(";")[1];
        var id = imgid + (x % (end-start)) + (y % (end-start));
        id %= (end - start);

        var block = Config.getClippedRegion(img, id*16, 0, 16, 16);
        var empty = Config.getClippedRegion(Config.BLOCKS, 0*16, 0, 16, 16);
        Game.fullmap.drawImage(empty, x*16, y*16);
        Game.fullmap.drawImage(block, x*16, y*16);
    }
}