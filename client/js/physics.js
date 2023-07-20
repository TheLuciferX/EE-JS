import * as Config from './config.js';
import * as World from './world.js';
import * as Game from './game1.js';

const FRICTION = 0.98;
const MOVE_SPEED = 1;
const GRAVITY_SPEED = 2;
const GOD_SPEED = 1;
const JUMP_SPEED = 52.5;


const NORMAL_DRAG = 0.906;


export function normaliseVelocity(vel) {
    if (vel.x > 140) vel.x = 140;
    else if (vel.x < -140) vel.x = -140;

    if (vel.y > 140) vel.y = 140;
    else if (vel.y < -140) vel.y = -140;
}


export function update(player) {
    let acceleration = player.movement

    World.openDoors(player);

    if(player.god) {
        let MOVE_VECTOR = new Config.Vector2D(0, 0);
        if(acceleration.x == 1) MOVE_VECTOR.x = GOD_SPEED
        else if(acceleration.x == -1) MOVE_VECTOR.x = -GOD_SPEED

        if(acceleration.y == 1) MOVE_VECTOR.y = GOD_SPEED
        else if(acceleration.y == -1) MOVE_VECTOR.y = -GOD_SPEED

        player.velocity = player.velocity.add(MOVE_VECTOR).scalarMul(FRICTION);
    }
    else {
        const blockOnPlayer = World.getBlockOnPlayer(player);

        let injump = player.velocity.y === 0 && player.jumping;
        let hasBlockUnder = false;

        let MOVE_VECTOR = new Config.Vector2D(0, 0);
        let FORCE_VECTOR = new Config.Vector2D(0, 0);
        switch(blockOnPlayer) {
            case 15:
                hasBlockUnder = World.hasBlockUnder(player, true, false);
                injump = player.velocity.x === 0 && player.jumping && hasBlockUnder;

                if(acceleration.y == 1) MOVE_VECTOR.y = MOVE_SPEED;
                else if(acceleration.y == -1) MOVE_VECTOR.y = -MOVE_SPEED;

                if(injump) {
                    FORCE_VECTOR.x = JUMP_SPEED;
                    injump = false;
                }
                else FORCE_VECTOR.x = -GRAVITY_SPEED;

                if(acceleration.y) player.velocity.y = (player.velocity.y + MOVE_VECTOR.y) * FRICTION;
                else player.velocity.y = (player.velocity.y + MOVE_VECTOR.y) * (FRICTION * NORMAL_DRAG);
                player.velocity.x = (player.velocity.x + FORCE_VECTOR.x) * FRICTION;
                break;
            case 16:
                hasBlockUnder = World.hasBlockUnder(player, false, false);
                injump = player.velocity.y === 0 && player.jumping && hasBlockUnder;

                if(acceleration.x == 1) MOVE_VECTOR.x = MOVE_SPEED;
                else if(acceleration.x == -1) MOVE_VECTOR.x = -MOVE_SPEED;

                if(injump) {
                    FORCE_VECTOR.y = JUMP_SPEED;
                    injump = false;
                }
                else FORCE_VECTOR.y = -GRAVITY_SPEED;

                if(acceleration.x) player.velocity.x = (player.velocity.x + MOVE_VECTOR.x) * FRICTION;
                else player.velocity.x = (player.velocity.x + MOVE_VECTOR.x) * (FRICTION * NORMAL_DRAG);
                player.velocity.y = (player.velocity.y + FORCE_VECTOR.y) * FRICTION;
                break;
            case 17:
                hasBlockUnder = World.hasBlockUnder(player, true, true);
                injump = player.velocity.x === 0 && player.jumping && hasBlockUnder;

                if(acceleration.y == 1) MOVE_VECTOR.y = MOVE_SPEED;
                else if(acceleration.y == -1) MOVE_VECTOR.y = -MOVE_SPEED;

                if(injump) {
                    FORCE_VECTOR.x = -JUMP_SPEED;
                    injump = false;
                }
                else FORCE_VECTOR.x = GRAVITY_SPEED;

                if(acceleration.y) player.velocity.y = (player.velocity.y + MOVE_VECTOR.y) * FRICTION;
                else player.velocity.y = (player.velocity.y + MOVE_VECTOR.y) * (FRICTION * NORMAL_DRAG);
                player.velocity.x = (player.velocity.x + FORCE_VECTOR.x) * FRICTION;
                break;
            case 18:
                injump = false;
                if(acceleration.x == 1) MOVE_VECTOR.x = MOVE_SPEED
                else if(acceleration.x == -1) MOVE_VECTOR.x = -MOVE_SPEED

                if(acceleration.y == 1) MOVE_VECTOR.y = MOVE_SPEED
                else if(acceleration.y == -1) MOVE_VECTOR.y = -MOVE_SPEED

                player.velocity = player.velocity.add(MOVE_VECTOR).scalarMul(FRICTION);
                break;
            default:
                hasBlockUnder = World.hasBlockUnder(player, false, true);
                injump = player.velocity.y === 0 && player.jumping && hasBlockUnder;

                if(acceleration.x == 1) MOVE_VECTOR.x = MOVE_SPEED;
                else if(acceleration.x == -1) MOVE_VECTOR.x = -MOVE_SPEED;

                if(injump) {
                    FORCE_VECTOR.y = -JUMP_SPEED;
                    injump = false;
                }
                else FORCE_VECTOR.y = GRAVITY_SPEED;

                if(acceleration.x) player.velocity.x = (player.velocity.x + MOVE_VECTOR.x) * FRICTION;
                else player.velocity.x = (player.velocity.x + MOVE_VECTOR.x) * (FRICTION * NORMAL_DRAG);
                player.velocity.y = (player.velocity.y + FORCE_VECTOR.y) * FRICTION;
        }

        switch(blockOnPlayer) {
            case 21:
                Game.socket.emit("key", "r", Math.round(player.position.x / 16), Math.round(player.position.y / 16));
                break;
            case 22:
                Game.socket.emit("key", "g", Math.round(player.position.x / 16), Math.round(player.position.y / 16));
                break;
            case 23:
                Game.socket.emit("key", "b", Math.round(player.position.x / 16), Math.round(player.position.y / 16));
                break;
        }
    }
    player.movevelocity = new Config.Vector2D(player.velocity).scalarMul(0.12);

    normaliseVelocity(player.velocity)
    player.position.reminder = new Config.Vector2D(
        player.position.x - Math.floor(player.position.x),
        player.position.y - Math.floor(player.position.y),
    )

    player.modifier = new Config.Vector2D(player.movevelocity)

    player.doneXStep = false
    player.doneYStep = false

    
    player.prevblock.x = player.position.x;
    player.prevblock.y = player.position.y;


    while (player.modifier.x != 0 && !player.doneXStep || player.modifier.y != 0 && !player.doneYStep) {
        player.position.old = new Config.Vector2D(player.position)
        player.modifier.old = new Config.Vector2D(player.modifier)
        stepX(player)
        stepY(player)
    }
}


function stepX(player) {
    if (player.modifier.x > 0) {
        if (player.modifier.x + player.position.reminder.x >= 1) {
            player.position.x += 1 - player.position.reminder.x
            player.modifier.x -= 1 - player.position.reminder.x
            player.position.reminder.x = 0
        } else {
            player.position.x += player.modifier.x
            player.modifier.x = 0
        }
    } else if (player.modifier.x < 0) {
        if (player.position.reminder.x != 0 && player.position.reminder.x + player.modifier.x < 0) {
            player.modifier.x += player.position.reminder.x
            player.position.x -= player.position.reminder.x
            player.position.reminder.x = 1
        } else {
            player.position.x += player.modifier.x
            player.modifier.x = 0
        }
    }

    if (World.collidesWorld(player)) {
        player.position.x = player.position.old.x
        player.velocity.x = 0
        player.movevelocity.x = 0
        player.modifier.x = player.modifier.old.x
        player.doneXStep = true
    }
}

function stepY(player) {
    if (player.modifier.y > 0) {
        if (player.modifier.y + player.position.reminder.y >= 1) {
            player.position.y += 1 - player.position.reminder.y
            player.modifier.y -= 1 - player.position.reminder.y
            player.position.reminder.y = 0
        } else {
            player.position.y += player.modifier.y
            player.modifier.y = 0
        }
    } else if (player.modifier.y < 0) {
        if (player.position.reminder.y != 0 && player.position.reminder.y + player.modifier.y < 0) {
            player.modifier.y += player.position.reminder.y
            player.position.y -= player.position.reminder.y
            player.position.reminder.y = 1
        } else {
            player.position.y += player.modifier.y
            player.modifier.y = 0
        }
    }

    if (World.collidesWorld(player)) {
        player.position.y = player.position.old.y
        player.velocity.y = 0
        player.movevelocity.y = 0
        player.modifier.y = player.modifier.old.y
        player.doneYStep = true
    }
}