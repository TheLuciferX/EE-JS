import * as Config from './config.js';

export let cameraX;
export let cameraY;

export function initialize(x, y) {
    cameraX = x;
    cameraY = y;
}

export function draw(player, ctx, world, players) {
    cameraX = cameraX - (cameraX - (-player.position.x + Config.VIEW_WIDTH / 2)) * (1 / 16);
    cameraY = cameraY - (cameraY - (-player.position.y + Config.VIEW_HEIGHT / 2)) * (1 / 16);

    var sx = -cameraX;
    var sy = -cameraY;

    var cwidth = Math.min(world.width - sx, Config.VIEW_WIDTH);
    var cheight = Math.min(world.height - sy, Config.VIEW_HEIGHT);

    ctx.clearRect(0, 0, Config.VIEW_WIDTH, Config.VIEW_HEIGHT);

    ctx.translate(Math.round(cameraX), Math.round(cameraY));

    ctx.drawImage(world, 
        sx, sy, 
        cwidth, cheight, 
        sx, sy, 
        cwidth, cheight);

    player.render(ctx);
    for(var i in players) {
        players[i].render(ctx);
    }
    ctx.translate(-Math.round(cameraX), -Math.round(cameraY));
}