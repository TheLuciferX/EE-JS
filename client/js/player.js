import * as Config from './config.js';
import * as Physics from './physics.js';
import * as Items from './items.js';

export default class Player {
    constructor(id, world) {
        this.id = id;
        this.world = world;

        this.smieyId = 0;

        this.god = false;

        this.position = new Config.Vector2D(16, 16);
        this.velocity = new Config.Vector2D(0, 0);
        this.movevelocity = new Config.Vector2D(0, 0);
        this.movement = new Config.Vector2D(0, 0);
        this.prevblock = new Config.Vector2D(16, 16);

        this.doneXStep = false;
        this.doneYStep = false;

        this.jumping = false;

        this.blocks = [];
        this.showingred = false;
        this.showinggreen = false;
        this.showingblue = false;
    }

    initialize(fgs) {
        for(var i = 0; i < fgs.length; i++) {
            if(Items.fgs[fgs[i]].type === Items.TYPE.decoration || Items.fgs[fgs[i]].type === Items.TYPE.above) this.blocks[i] = false;
            else this.blocks[i] = true;
        }
    }

    update(dt) {
        for(; dt > 0; -- dt) {
            Physics.update(this)
        }
    }

    render(ctx) {
        if(this.god) {
            ctx.drawImage(
                Config.GODAURA,
                0, 0, 
                64, 64,
                Math.round(this.position.x) - 24, Math.round(this.position.y) - 24, 
                64, 64,
            )
        }
        ctx.drawImage(
            Config.SMILEY,
            0, 0, 
            Config.BLOCK_SIZE, Config.BLOCK_SIZE,
            Math.round(this.position.x), Math.round(this.position.y),
            Config.BLOCK_SIZE, Config.BLOCK_SIZE,
        )
    }
}