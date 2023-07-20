import * as Config from './config.js';
import * as Game from './game1.js';
import * as Items from './items.js';

let blocks = [];

export function initializeWorld(fgs) {
    blocks = fgs;
}

function getBlockAt(x, y) {
    return blocks[y*Config.worldHeight / 16 + x];
}

function isForeground(blocks, x, y) {
    return blocks[y*Config.worldHeight / 16 + x];
}

function collidesBlock(x1, y1, player) {
    if (!isForeground(player.blocks, x1, y1)) return false

    let x = x1 * Config.BLOCK_SIZE
    let y = y1 * Config.BLOCK_SIZE

    return (x < player.position.x + Config.BLOCK_SIZE &&
        x + Config.BLOCK_SIZE > player.position.x &&
        y < player.position.y + Config.BLOCK_SIZE &&
        y + Config.BLOCK_SIZE > player.position.y)
}

export function collidesWorld(player) {
    if (player.position.x < 0 || player.position.y < 0 ||
        player.position.x > Config.worldWidth - 16 ||
        player.position.y > Config.worldHeight - 16) return true
    
    for (let x = Math.floor(player.position.x / Config.BLOCK_SIZE); x < (player.position.x + Config.BLOCK_SIZE) / Config.BLOCK_SIZE; ++x)
        for (let y = Math.floor(player.position.y / Config.BLOCK_SIZE); y < (player.position.y + Config.BLOCK_SIZE) / Config.BLOCK_SIZE; ++y) {
            if (collidesBlock(x, y, player) && !player.god)
                return true
        }
            
    return false
}

export function getBlockOnPlayer(player) {
    var px = Math.round(player.prevblock.x / 16);
    var py = Math.round(player.prevblock.y / 16);
    var block = getBlockAt(px, py);
    return block;
}

export function getAllBlocksOnPlayer(player) {
    var blocks = [];
    var px1 = Math.floor(player.prevblock.x / 16);
    var px2 = Math.ceil(player.prevblock.x / 16);
    var py1 = Math.floor(player.prevblock.y / 16);
    var py2 = Math.ceil(player.prevblock.y / 16);
    blocks.push(getBlockAt(px1, py1));
    blocks.push(getBlockAt(px2, py1));
    blocks.push(getBlockAt(px1, py2));
    blocks.push(getBlockAt(px2, py2));
    return blocks;
}

export function hasBlockUnder(player, x, plus) {
    var px = Math.round(player.position.x / 16);
    var px1 = Math.floor(player.position.x / 16);
    var px2 = Math.ceil(player.position.x / 16);
    var py = Math.round(player.position.y / 16);
    var py1 = Math.floor(player.position.y / 16);
    var py2 = Math.ceil(player.position.y / 16);
    if(x) {
        if(plus) {
            return isForeground(player.blocks, px + 1, py1) || isForeground(player.blocks, px + 1, py2);
        } else {
            return isForeground(player.blocks, px - 1, py1) || isForeground(player.blocks, px - 1, py2);
        }
    } else {
        if(plus) {
            return isForeground(player.blocks, px1, py + 1) || isForeground(player.blocks, px2, py + 1);
        } else {
            return isForeground(player.blocks, px1, py - 1) || isForeground(player.blocks, px2, py - 1);
        }
    }
}

export function openDoors(player) {
    var allBlocks = getAllBlocksOnPlayer(player);
    var id = player.id === Game.player.id ? -1 : player.id;
    if(player.god) {
        if(player.showingred) {
            player.showingred = false;
            if(!Config.red) {
                if(player.id === Game.player.id) {
                    Game.replace(24, Config.BLOCKS, Items.fgs[24].bitmapid);
                    Game.replace(27, Config.BLOCKS, Items.fgs[27].bitmapid);
                }
                Game.changeType(id, 24, "fg");
                Game.changeType(id, 27, "deco");
            }
        }
        if(player.showinggreen) {
            player.showinggreen = false;
            if(!Config.green) {
                if(player.id === Game.player.id) {
                    Game.replace(25, Config.BLOCKS, Items.fgs[25].bitmapid);
                    Game.replace(28, Config.BLOCKS, Items.fgs[28].bitmapid);
                }
                Game.changeType(id, 25, "fg");
                Game.changeType(id, 28, "deco");
            }
        }
        if(player.showingblue) {
            player.showingblue = false;
            if(!Config.blue) {
                if(player.id === Game.player.id) {
                    Game.replace(26, Config.BLOCKS, Items.fgs[26].bitmapid);
                    Game.replace(29, Config.BLOCKS, Items.fgs[29].bitmapid);
                }
                Game.changeType(id, 26, "fg");
                Game.changeType(id, 29, "deco");
            }
        }
    } else {
        var reddoor = allBlocks.includes(24);
        var greendoor = allBlocks.includes(25);
        var bluedoor = allBlocks.includes(26);
        var redgate = allBlocks.includes(27);
        var greengate = allBlocks.includes(28);
        var bluegate = allBlocks.includes(29);

        if((!Config.red && reddoor && !player.showingred) || (Config.red && redgate && !player.showingred)) {
            player.showingred = true;
            if(player.id === Game.player.id) {
                if(reddoor) {
                    Game.replace(24, Config.DOORS, 0);
                    Game.replace(27, Config.DOORS, 3);
                } else {
                    Game.replace(24, Config.BLOCKS, Items.fgs[24].bitmapid);
                    Game.replace(27, Config.BLOCKS, Items.fgs[27].bitmapid);
                }
            }
            if(reddoor) {
                Game.changeType(id, 24, "deco");
                Game.changeType(id, 27, "fg");
            } else {
                Game.changeType(id, 24, "fg");
                Game.changeType(id, 27, "deco");
            }
        } else if(player.showingred && !reddoor && !redgate) {
            player.showingred = false;
            if(player.id === Game.player.id) {
                if(Config.red) {
                    Game.replace(24, Config.DOORS, 0);
                    Game.replace(27, Config.DOORS, 3);
                } else {
                    Game.replace(24, Config.BLOCKS, Items.fgs[24].bitmapid);
                    Game.replace(27, Config.BLOCKS, Items.fgs[27].bitmapid);
                }
            }
            if(Config.red) {
                Game.changeType(id, 24, "deco");
                Game.changeType(id, 27, "fg");
            } else {
                Game.changeType(id, 24, "fg");
                Game.changeType(id, 27, "deco");
            }
        }
        if((!Config.green && greendoor && !player.showinggreen) || (Config.green && greengate && !player.showinggreen)) {
            player.showinggreen = true;
            if(player.id === Game.player.id) {
                if(greendoor) {
                    Game.replace(25, Config.DOORS, 1);
                    Game.replace(28, Config.DOORS, 4);
                } else {
                    Game.replace(25, Config.BLOCKS, Items.fgs[25].bitmapid);
                    Game.replace(28, Config.BLOCKS, Items.fgs[28].bitmapid);
                }
            }
            if(greendoor) {
                Game.changeType(id, 25, "deco");
                Game.changeType(id, 28, "fg");
            } else {
                Game.changeType(id, 25, "fg");
                Game.changeType(id, 28, "deco");
            }
        } else if(player.showinggreen && !greendoor && !greengate) {
            player.showinggreen = false;
            if(player.id === Game.player.id) {
                if(Config.green) {
                    Game.replace(25, Config.DOORS, 1);
                    Game.replace(28, Config.DOORS, 4);
                } else {
                    Game.replace(25, Config.BLOCKS, Items.fgs[25].bitmapid);
                    Game.replace(28, Config.BLOCKS, Items.fgs[28].bitmapid);
                }
            }
            if(Config.green) {
                Game.changeType(id, 25, "deco");
                Game.changeType(id, 28, "fg");
            } else {
                Game.changeType(id, 25, "fg");
                Game.changeType(id, 28, "deco");
            }
        }
        if((!Config.blue && allBlocks.includes(26) && !player.showingblue) || (Config.blue && bluegate && !player.showingblue)) {
            player.showingblue = true;
            if(player.id === Game.player.id) {
                if(bluedoor) {
                    Game.replace(26, Config.DOORS, 2);
                    Game.replace(29, Config.DOORS, 5);
                } else {
                    Game.replace(26, Config.BLOCKS, Items.fgs[26].bitmapid);
                    Game.replace(29, Config.BLOCKS, Items.fgs[29].bitmapid);
                }
            }
            if(bluedoor) {
                Game.changeType(id, 26, "deco");
                Game.changeType(id, 29, "fg");
            } else {
                Game.changeType(id, 26, "fg");
                Game.changeType(id, 29, "deco");
            }
        } else if(player.showingblue && !bluedoor && !bluegate) {
            player.showingblue = false;
            if(player.id === Game.player.id) {
                if(Config.blue) {
                    Game.replace(26, Config.DOORS, 2);
                    Game.replace(29, Config.DOORS, 5);
                } else {
                    Game.replace(26, Config.BLOCKS, Items.fgs[26].bitmapid);
                    Game.replace(29, Config.BLOCKS, Items.fgs[29].bitmapid);
                }
            }
            if(Config.blue) {
                Game.changeType(id, 26, "deco");
                Game.changeType(id, 29, "fg");
            } else {
                Game.changeType(id, 26, "fg");
                Game.changeType(id, 29, "deco");
            }
        }
    }
}