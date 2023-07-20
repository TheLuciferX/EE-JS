function a() {
    class Vector {
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
    class Player {
        constructor() {
            this.smieyId = 0;

            this.god = false;

            this.previousBlockOn = 0;

            this.position = new Vector(16, 16);
            this.velocity = new Vector(0, 0);
            this.movevelocity = new Vector(0, 0);
            this.movement = new Vector(0, 0);

            this.doneXStep = false;
            this.doneYStep = false;

            this.jumping = false;
        }
    }
    const Tab = {
        NONE: 0,
        BLOCKS: 1,
        ACTION: 2,
        DECORATIVE: 3,
        BACKGROUND: 4
    }

    const config = {
        type: Phaser.AUTO,
        width: 1090,
        height: 640,
        disableContextMenu: true,
        parent: 'canvas',
        plugins: {
            global: [ NineSlice.Plugin.DefaultCfg ],
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        dom: {
            createContainer: true
        },
        render: {
            pixelArt: true
        },
    };

    const worldWidth = 100;
    const worldHeight = 100;
    const BLOCK_SIZE = 16;

    const game = new Phaser.Game(config);

    window.addEventListener("resize", () => {
        game.scale.updateBounds();
    });

    const MOVE_SPEED = 1.5;
    const GRAVITY_SPEED = 3.5;
    const GOD_SPEED = 1.5;
    const JUMP_SPEED = 66;

    const DRAG = 0.98;
    const NORMAL_DRAG = 0.906;

    let scene;

    let UI;
    let quickSelect;
    let categories;
    let hexCustomizer;
    let title;
    let owner;
    let plays;
    let players;
    let chat;
    let smileyEditor;

    let allBlocks;
    let cat_blocks;
    let cat_action;
    let cat_deco;
    let cat_bg;
    let place = true;

    let selected1;
    let selected2;
    let cat = "blocks";

    let bgs;
    let fgs;
    let player;
    let decos;
    let doors;
    let god;
    const me = new Player();
    let bId = 0;

    let keys = [];

    let pointer = null;
    let draw = false;
    let deleting = -1;

    let settingOpen = false;

    const SHAPES = 6;
    const EYES = 18;
    const MOUTHS = 25;
    const ADDONS = 7;
    const WINGS = 6;
    const ABOVES = 18;
    const BELOWS = 6;
    const COLOURS = 12;

    let myShape = 0;
    let myColour = 0;
    let currentFrame = 0;

    const flippable = [208];
    const rotatable = [13, 14, 10, 20, 21, 25, 26, 27, 28, 201, 202];
    const rot_oneway = [10, 14, 20];
    const rot_slab = [13, 21];
    const stat_oneway = [/*10, 20*/];

    let lastPlaced = Date.now();
    let lastPlacedX = -1;
    let lastPlacedY = -1;

    let prevTick = window.performance.now();
    let nowTick = window.performance.now();

    const switchedDoors = [];
    const doorTimerIds = {};
    const doorsArr = [];


    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };

    function preload() {
        scene = this;
        scene.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);
        this.load.html('textbox', 'client/webgl/assets/texts/textbox.html');
        this.load.html('seconds', 'client/webgl/assets/texts/seconds.html');
        this.load.image('box', 'client/webgl/assets/box.png');
        this.load.image('box2', 'client/webgl/assets/box2.png');
        this.load.image('menu', 'client/webgl/assets/menu.png');
        this.load.image('picker', 'client/webgl/assets/picker.png');
        this.load.image('selected', 'client/webgl/assets/selected.png');
        this.load.image('savebtn', 'client/webgl/assets/savebutton.png');
        this.load.image('x', 'client/webgl/assets/x.png');
        this.load.spritesheet('smileycats', 'client/webgl/assets/smileycats.png', {frameWidth: 150, frameHeight: 40});
        this.load.spritesheet('smileywings', 'client/webgl/assets/smileywings.png', {frameWidth: 26, frameHeight: 26});
        this.load.spritesheet('smileyshapes', 'client/webgl/assets/smileyshapes.png', {frameWidth: 26, frameHeight: 26});
        this.load.spritesheet('smileyfaceaddons', 'client/webgl/assets/smileyfaceaddons.png', {frameWidth: 26, frameHeight: 26});
        this.load.spritesheet('smileyeyes', 'client/webgl/assets/smileyeyes.png', {frameWidth: 26, frameHeight: 26});
        this.load.spritesheet('smileymouths', 'client/webgl/assets/smileymouths.png', {frameWidth: 26, frameHeight: 26});
        this.load.spritesheet('smileyaboves', 'client/webgl/assets/smileyaboves.png', {frameWidth: 26, frameHeight: 26});
        this.load.spritesheet('smileybelows', 'client/webgl/assets/smileybelows.png', {frameWidth: 26, frameHeight: 26});
        this.load.image('god', 'client/webgl/assets/god.png');
        this.load.spritesheet('blocks', 'client/webgl/assets/blocks.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('decos', 'client/webgl/assets/decos.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('fgbases', 'client/webgl/assets/fgbases.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('fgoverlays', 'client/webgl/assets/fgoverlays.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('decobases', 'client/webgl/assets/decobases.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('decooverlays', 'client/webgl/assets/decooverlays.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('bgoverlays', 'client/webgl/assets/bgoverlays.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('category', 'client/webgl/assets/categories.png', { frameWidth: 160, frameHeight: 30 });
    }

    function create() {
        bgs = this.add.group();
        fgs = this.add.group();
        player = this.add.group();
        decos = this.add.group();
        doors = this.add.group();
        UI = this.add.group();
        quickSelect = this.add.group();
        cat_blocks = this.add.group();
        cat_action = this.add.group();
        cat_deco = this.add.group();
        cat_bg = this.add.group();
        categories = this.add.group();
        hexCustomizer = this.add.group();
        players = this.add.group();
        chat = this.add.group();
        smileyEditor = this.add.group();

        for(let y = 0; y < worldHeight; y++) {
            for(let x = 0; x < worldWidth; x++) {
                bgs.create(x*16, y*16, 'blocks', 0).bId = 0;
                decos.create(x*16, y*16, 'blocks', 0).setVisible(false).bId = 0;
                const door = doors.create(x*16, y*16, 'blocks', 0).setVisible(false);
                door.bId = 0;
                door.canPass = true;
                if(x === 0 || y === 0 || x === 99 || y=== 99) {
                    const container = scene.add.container(x*16, y*16);
                    const base = scene.add.sprite(0, 0, 'fgbases', 0).setTint(0x707070);
                    const overlay = scene.add.sprite(0, 0, 'fgoverlays', 0);
                    container.add(base);
                    container.add(overlay);
                    container.bId = 1;
                    container.hex = 0x707070;
                    fgs.add(container);
                } else {
                    const empty = fgs.create(x*16, y*16, 'blocks', 0);
                    empty.setVisible(false);
                    empty.bId = 0;
                }
            }
        }

        god = this.add.sprite(16, 16, 'god');
        god.setVisible(false);

        player.create(16, 16, 'smileyshapes', 0);
        player.create(16, 16, 'smileywings', 0).setVisible(false);
        player.create(16, 16, 'smileyfaceaddons', 0).setVisible(false);
        player.create(16, 16, 'smileyeyes', 0);
        player.create(16, 16, 'smileyaboves', 0).setVisible(false);
        player.create(16, 16, 'smileybelows', 0).setVisible(false);
        player.create(16, 16, 'smileymouths', 0);

        this.cameras.main.startFollow(player.children.entries[0], true, 0.05, 0.05, -16, -16);
        this.cameras.main.setFollowOffset(-125, -20);

        bgs.setDepth(-3);
        fgs.setDepth(-1);
        player.setDepth(1);
        decos.setDepth(2);
        god.setDepth(3);
        UI.setDepth(10);
        quickSelect.setDepth(11);
        cat_blocks.setDepth(11);
        cat_action.setDepth(11);
        cat_deco.setDepth(11);
        cat_bg.setDepth(11);
        categories.setDepth(11);
        hexCustomizer.setDepth(12);
        players.setDepth(12);
        chat.setDepth(12);
        smileyEditor.setDepth(100);

        addUI();
        addPacksToBlockPicker();

        this.input.keyboard.on('keydown', event => {
            if(settingOpen || $("#textbox").is(":focus") || $("#seconds").is(":focus"))
                return;
            else
                event.preventDefault();
            switch(event.key) {
                case "a":
                case "ArrowLeft":
                    if(!keys.includes("a"))
                        keys.push("a");
                    break;
                case "d":
                case "ArrowRight":
                    if(!keys.includes("d"))
                        keys.push("d");
                    break;
                case "w":
                case "ArrowUp":
                    if(!keys.includes("w"))
                        keys.push("w");
                    break;
                case "s":
                case "ArrowDown":
                    if(!keys.includes("s"))
                        keys.push("s");
                    break;
                case "g":
                    me.god = !me.god;
                    god.setVisible(me.god);
                    player.setDepth(me.god ? 4 : 1);
                    break;
                case " ":
                    if(!keys.includes(" "))
                        keys.push(" ");
                    break;
                case "`":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "0":
                case "-":
                case "=":
                    if(!isNaN(event.key)) {
                        const keyN = Number(event.key);
                        if(keyN === 0) {
                            changeBlock(quickSelect.children.entries[10].bId);
                        } else {
                            changeBlock(quickSelect.children.entries[keyN].bId);
                        }
                    } else {
                        if(event.key === "`") {
                            changeBlock(quickSelect.children.entries[0].bId);
                        } else if(event.key === "-") {
                            changeBlock(quickSelect.children.entries[11].bId);
                        } else {
                            changeBlock(quickSelect.children.entries[12].bId);
                        }
                    }
                    break;
            }
        });
        this.input.keyboard.on('keyup', event => {
            switch(event.key) {
                case "a":
                case "ArrowLeft":
                    if(keys.includes("a"))
                        keys = keys.filter(item => item !== "a");
                    break;
                case "d":
                case "ArrowRight":
                    if(keys.includes("d"))
                        keys = keys.filter(item => item !== "d");
                    break;
                case "w":
                case "ArrowUp":
                    if(keys.includes("w"))
                        keys = keys.filter(item => item !== "w");
                    break;
                case "s":
                case "ArrowDown":
                    if(keys.includes("s"))
                        keys = keys.filter(item => item !== "s");
                    break;
                case " ":
                    if(keys.includes(" "))
                        keys = keys.filter(item => item !== " ");
                    break;
            }
        });
    }

    function update(time, delta) {
        let hor = 0;
        let ver = 0;
        let jumping = false;

        if(keys.includes("a"))
            hor -= 1;
        if(keys.includes("d"))
            hor += 1;
        if(keys.includes("w"))
            ver -= 1;
        if(keys.includes("s"))
            ver += 1;
        if(keys.includes(" ")) {
            jumping = true;
        }
        
        me.movement.x = hor;
        me.movement.y = ver;
        me.jumping = jumping;

        if(me.god) {
            let MOVE_VECTOR = new Vector(0, 0);
            if(me.movement.x == 1) MOVE_VECTOR.x = GOD_SPEED
            else if(me.movement.x == -1) MOVE_VECTOR.x = -GOD_SPEED

            if(me.movement.y == 1) MOVE_VECTOR.y = GOD_SPEED
            else if(me.movement.y == -1) MOVE_VECTOR.y = -GOD_SPEED

            me.velocity = me.velocity.add(MOVE_VECTOR).scalarMul(DRAG);
        } else {
            let MOVE_VECTOR = new Vector(0, 0);
            let FORCE_VECTOR = new Vector(0, 0);

            const blockOnMe = getBlockOnPlayer();

            switch (blockOnMe.bId) {
                case 30: {
                    if(blockOnMe.bId === me.previousBlockOn) break;
                    changeKeyDoorsTextures(blockOnMe.hex, blockOnMe.secs);
                } break;
            }

            switch(me.previousBlockOn) {
                case 15: {
                    let injump = me.velocity.x === 0 && me.jumping;
            
                    if(me.movement.y == 1) MOVE_VECTOR.y = MOVE_SPEED;
                    else if(me.movement.y == -1) MOVE_VECTOR.y = -MOVE_SPEED;
                    if(injump) {
                        FORCE_VECTOR.x = JUMP_SPEED;
                        injump = false;
                    }
                    else FORCE_VECTOR.x = -GRAVITY_SPEED;
            
                    if((me.movement.y > 0 && me.velocity.y > 0) || (me.movement.y < 0 && me.velocity.y < 0)) me.velocity.y = (me.velocity.y + MOVE_VECTOR.y) * DRAG;
                    else me.velocity.y = (me.velocity.y + MOVE_VECTOR.y) * (DRAG * NORMAL_DRAG);
                    me.velocity.x = (me.velocity.x + FORCE_VECTOR.x) * DRAG;
                    } break;
                case 16: {
                    let injump = me.velocity.y === 0 && me.jumping;

                    if(me.movement.x == 1) MOVE_VECTOR.x = MOVE_SPEED;
                    else if(me.movement.x == -1) MOVE_VECTOR.x = -MOVE_SPEED;
                    if(injump) {
                        FORCE_VECTOR.y = JUMP_SPEED;
                        injump = false;
                    }
                    else FORCE_VECTOR.y = -GRAVITY_SPEED;

                    if((me.movement.x > 0 && me.velocity.x > 0) || (me.movement.x < 0 && me.velocity.x < 0)) me.velocity.x = (me.velocity.x + MOVE_VECTOR.x) * DRAG;
                    else me.velocity.x = (me.velocity.x + MOVE_VECTOR.x) * (DRAG * NORMAL_DRAG);
                    me.velocity.y = (me.velocity.y + FORCE_VECTOR.y) * DRAG;
                    } break;
                case 17: {
                    let injump = me.velocity.x === 0 && me.jumping;
            
                    if(me.movement.y == 1) MOVE_VECTOR.y = MOVE_SPEED;
                    else if(me.movement.y == -1) MOVE_VECTOR.y = -MOVE_SPEED;
                    if(injump) {
                        FORCE_VECTOR.x = -JUMP_SPEED;
                        injump = false;
                    }
                    else FORCE_VECTOR.x = GRAVITY_SPEED;
            
                    if((me.movement.y > 0 && me.velocity.y > 0) || (me.movement.y < 0 && me.velocity.y < 0)) me.velocity.y = (me.velocity.y + MOVE_VECTOR.y) * DRAG;
                    else me.velocity.y = (me.velocity.y + MOVE_VECTOR.y) * (DRAG * NORMAL_DRAG);
                    me.velocity.x = (me.velocity.x + FORCE_VECTOR.x) * DRAG;
                    } break;
                case 18: {
                    if(me.movement.x == 1) MOVE_VECTOR.x = GOD_SPEED
                    else if(me.movement.x == -1) MOVE_VECTOR.x = -GOD_SPEED

                    if(me.movement.y == 1) MOVE_VECTOR.y = GOD_SPEED
                    else if(me.movement.y == -1) MOVE_VECTOR.y = -GOD_SPEED

                    me.velocity = me.velocity.add(MOVE_VECTOR).scalarMul(DRAG);
                    } break;
                default: {
                    let injump = me.velocity.y === 0 && me.jumping;

                    if(me.movement.x == 1) MOVE_VECTOR.x = MOVE_SPEED;
                    else if(me.movement.x == -1) MOVE_VECTOR.x = -MOVE_SPEED;
                    if(injump) {
                        FORCE_VECTOR.y = -JUMP_SPEED;
                        injump = false;
                    }
                    else FORCE_VECTOR.y = GRAVITY_SPEED;

                    if((me.movement.x > 0 && me.velocity.x > 0) || (me.movement.x < 0 && me.velocity.x < 0)) me.velocity.x = (me.velocity.x + MOVE_VECTOR.x) * DRAG;
                    else me.velocity.x = (me.velocity.x + MOVE_VECTOR.x) * (DRAG * NORMAL_DRAG);
                    me.velocity.y = (me.velocity.y + FORCE_VECTOR.y) * DRAG;
                    } break;
            }
            me.previousBlockOn = blockOnMe.bId;
        }

        me.movevelocity = new Vector(me.velocity).scalarMul(0.12);
        normaliseVelocity(me.velocity);

        me.position.reminder = new Vector(
            me.position.x - Math.floor(me.position.x),
            me.position.y - Math.floor(me.position.y),
        );

        me.modifier = new Vector(me.movevelocity);

        me.doneXStep = false;
        me.doneYStep = false;

        while (me.modifier.x != 0 && !me.doneXStep || me.modifier.y != 0 && !me.doneYStep) {
            me.position.old = new Vector(me.position)
            me.modifier.old = new Vector(me.modifier)
            stepX();
            stepY();
        }

        god.x = player.children.entries[0].x;
        god.y = player.children.entries[0].y;
        this.input.on('pointerdown', function(e) {
            if(settingOpen) return;
            draw = true;
            pointer = e;
        });
        this.input.on('pointerup', function(e) {
            if(settingOpen) return;
            draw = false;
            deleting = -1;
            lastPlacedX = -1;
            lastPlacedY = -1;
            pointer = e;
            lastPlaced = Date.now() - 1000;
        });
        if(draw) {
            handleClickCanvas(pointer);
        }

        nowTick = window.performance.now();
        const fps = 1000/(nowTick-prevTick);
        //console.log(fps);
        prevTick = window.performance.now();
    }
    function placeBlock(pointer) {
        const x = Math.round((scene.cameras.main.worldView.x + pointer.position.x) / 16.0);
        const y = Math.round((scene.cameras.main.worldView.y + pointer.position.y) / 16.0);
        if(x < 0 || x > worldWidth || y < 0 || y > worldWidth) return;
        const graphics = getGraphics(bId);
        const currentBlock = graphics.isDoor || graphics.isGate ? getChildAt(doors, x, y) : graphics.tab === Tab.BLOCKS || graphics.tab === Tab.ACTION ? getChildAt(fgs, x, y) : graphics.tab === Tab.DECORATIVE ? getChildAt(decos, x, y) : graphics.tab === Tab.BACKGROUND ? getChildAt(bgs, x, y) : undefined;
        if(!currentBlock) return;
        if(graphics.bitmap && currentBlock.bId === bId) return;
        const hex = isHex("#" + $("#textbox").val()) ? parseInt("0x" + $("#textbox").val(), 16) : 0xffffff;
        if(currentBlock.bId === bId && currentBlock.hex === hex && (rotatable.includes(bId) || flippable.includes(bId))) {
            const now = Date.now();
            const difference = now-lastPlaced;
            if(difference >= 500) {
                if(rotatable.includes(bId)) {
                    currentBlock.list[0].setAngle(currentBlock.list[0].angle + 90);
                    currentBlock.list[1].setAngle(currentBlock.list[1].angle + 90);
                    currentBlock.rot = currentBlock.rot === 3 ? 0 : currentBlock.rot + 1;
                } else {
                    currentBlock.list[0].flipX = !currentBlock.list[0].flipX;
                    currentBlock.list[1].flipX = !currentBlock.list[1].flipX;
                    currentBlock.rot = Math.abs(currentBlock.rot - 1);
                }
                lastPlaced = Date.now();
            }
            return;
        }
        if(currentBlock.bId === bId && currentBlock.hex === hex) return;

        lastPlaced = Date.now();
        const position = y*worldWidth + x;
        if(graphics.isDoor || graphics.isGate) {
            doors.remove(currentBlock, true, true);
            const newBlock = scene.add.sprite(x*16, y*16, graphics.basebit, graphics.baseId).setTint(hex);
            //const newBlock = scene.add.sprite(x*16, y*16, switchedDoor ? graphics.switchBaseBit : graphics.basebit, switchedDoor ? graphics.switchBaseId : graphics.baseId).setTint(hex);
            if(graphics.overlaybit) {
                const container = scene.add.container(x*16, y*16);
                newBlock.setX(0).setY(0);
                container.add(newBlock);
                const overlay = scene.add.sprite(0, 0, graphics.overlaybit, graphics.overlayId);
                container.add(overlay);
                container.bId = bId;
                container.hex = hex;
                container.setDepth(graphics.isDoor ? 0 : -2);
                container.canPass = graphics.isGate;
                doors.add(container);
                doorsArr.push(container);
                Phaser.Utils.Array.MoveTo(doors.children.entries, container, position);
            } else {
                newBlock.bId = bId;
                newBlock.hex = hex;
                newBlock.setDepth(graphics.isDoor ? 0 : -2);
                newBlock.canPass = graphics.isGate;
                doors.add(newBlock);
                doorsArr.push(newBlock);
                Phaser.Utils.Array.MoveTo(doors.children.entries, newBlock, position);
            }
        }
        else if(graphics.tab === Tab.BLOCKS || graphics.tab === Tab.ACTION) {
            fgs.remove(currentBlock, true, true);

            if(graphics.bitmap) {
                const newBlock = fgs.create(x*16, y*16, graphics.bitmap, graphics.bitId);
                newBlock.bId = bId;
                if(rotatable.includes(bId))
                    newBlock.rot = 0;
                newBlock.setDepth(-1);
                Phaser.Utils.Array.MoveTo(fgs.children.entries, newBlock, position);
            } else {
                const newBlock = scene.add.sprite(x*16, y*16, graphics.basebit, graphics.baseId).setTint(hex);
                if(graphics.overlaybit) {
                    const container = scene.add.container(x*16, y*16);
                    newBlock.setX(0).setY(0);
                    container.add(newBlock);
                    const overlay = scene.add.sprite(0, 0, graphics.overlaybit, graphics.overlayId);
                    container.add(overlay);
                    container.bId = bId;
                    container.hex = hex;
                    if(rotatable.includes(bId) || flippable.includes(bId))
                        container.rot = 0;
                    container.setDepth(-1);
                    fgs.add(container);
                    Phaser.Utils.Array.MoveTo(fgs.children.entries, container, position);
                } else {
                    newBlock.bId = bId;
                    newBlock.hex = hex;
                    if(bId === 30)
                        newBlock.secs = Number($("#seconds").val());
                    if(rotatable.includes(bId))
                        newBlock.rot = 0;
                    newBlock.setDepth(-1);
                    fgs.add(newBlock);
                    Phaser.Utils.Array.MoveTo(fgs.children.entries, newBlock, position);
                }
            }
        } else if(graphics.tab === Tab.DECORATIVE) {
            decos.remove(currentBlock, true, true);

            if(graphics.bitmap) {
                const newBlock = decos.create(x*16, y*16, graphics.bitmap, graphics.bitId);
                newBlock.bId = bId;
                if(rotatable.includes(bId))
                    newBlock.rot = 0;
                newBlock.setDepth(2);
                Phaser.Utils.Array.MoveTo(decos.children.entries, newBlock, position);
            } else {
                const newBlock = scene.add.sprite(x*16, y*16, graphics.basebit, graphics.baseId).setTint(hex);
                if(graphics.overlaybit) {
                    const container = scene.add.container(x*16, y*16);
                    newBlock.setX(0).setY(0);
                    container.add(newBlock);
                    const overlay = scene.add.sprite(0, 0, graphics.overlaybit, graphics.overlayId);
                    container.add(overlay);
                    container.bId = bId;
                    container.hex = hex;
                    if(rotatable.includes(bId))
                        container.rot = 0;
                    container.setDepth(2);
                    decos.add(container);
                    Phaser.Utils.Array.MoveTo(decos.children.entries, container, position);
                } else {
                    newBlock.bId = bId;
                    newBlock.hex = hex;
                    if(rotatable.includes(bId))
                        newBlock.rot = 0;
                    newBlock.setDepth(2);
                    decos.add(newBlock);
                    Phaser.Utils.Array.MoveTo(decos.children.entries, newBlock, position);
                }
            }
        } else if(graphics.tab === Tab.BACKGROUND) {
            bgs.remove(currentBlock, true, true);
            if(graphics.bitmap) {
                const newBlock = bgs.create(x*16, y*16, graphics.bitmap, graphics.bitId);
                newBlock.bId = bId;
                newBlock.setDepth(-3);
                Phaser.Utils.Array.MoveTo(bgs.children.entries, newBlock, position);
            } else {
                const newBlock = scene.add.sprite(x*16, y*16, graphics.basebit, graphics.baseId).setTint(hex);
                if(graphics.overlaybit) {
                    const container = scene.add.container(x*16, y*16);
                    newBlock.setX(0).setY(0);
                    container.add(newBlock);
                    const overlay = scene.add.sprite(0, 0, graphics.overlaybit, graphics.overlayId);
                    container.add(overlay);
                    container.bId = bId;
                    container.hex = hex;
                    container.setDepth(-3);
                    bgs.add(container);
                    Phaser.Utils.Array.MoveTo(bgs.children.entries, container, position);
                } else {
                    newBlock.bId = bId;
                    newBlock.hex = hex;
                    newBlock.setDepth(-3);
                    bgs.add(newBlock);
                    Phaser.Utils.Array.MoveTo(bgs.children.entries, newBlock, position);
                }
            }
        }
    }
    function deleteBlock(pointer) {
        const x = Math.round((scene.cameras.main.worldView.x + pointer.position.x) / 16.0);
        const y = Math.round((scene.cameras.main.worldView.y + pointer.position.y) / 16.0);
        if(x < 0 || x > worldWidth || y < 0 || y > worldWidth) return;
        const currentDeco = getChildAt(decos, x, y);
        const currentFg = getChildAt(fgs, x, y);
        const currentBg = getChildAt(bgs, x, y);
        const currentDoor = getChildAt(doors, x, y);
        if(!currentFg || !currentBg || !currentDeco || !currentDoor) return;
        const position = y*worldWidth + x;
        if(currentDoor.bId !== 0 && (deleting === -1 || deleting === 3)) {
            deleting = 3;
            doorsArr.remove(currentDoor);
            doors.remove(currentDoor, true, true);
            const newBlock = doors.create(x*16, y*16, "blocks", 0).setVisible(false);
            newBlock.bId = 0;
            newBlock.canPass = true;
            Phaser.Utils.Array.MoveTo(doors.children.entries, newBlock, position);
        } else if(currentDeco.bId !== 0 && (deleting === -1 || deleting === 2)) {
            deleting = 2;
            decos.remove(currentDeco, true, true);
            const newBlock = decos.create(x*16, y*16, "blocks", 0).setVisible(false);
            newBlock.setDepth(2);
            newBlock.bId = 0;
            Phaser.Utils.Array.MoveTo(decos.children.entries, newBlock, position);
        } else if(currentFg.bId !== 0 && (deleting === -1 || deleting === 1)) {
            deleting = 1;
            fgs.remove(currentFg, true, true);
            const newBlock = fgs.create(x*16, y*16, "blocks", 0).setVisible(false);
            newBlock.setDepth(-1);
            newBlock.bId = 0;
            Phaser.Utils.Array.MoveTo(fgs.children.entries, newBlock, position);
        } else if(deleting === -1 || deleting === 0) {
            deleting = 0;
            if(currentBg.bId !== 0) {
                bgs.remove(currentBg, true, true);
                const newBlock = bgs.create(x*16, y*16, "blocks", 0);
                newBlock.setDepth(-3);
                newBlock.bId = 0;
                Phaser.Utils.Array.MoveTo(bgs.children.entries, newBlock, position);
            }
        }
    }
    function getChildAt(group, locX, locY) {
        return group.children.entries[locY*worldWidth + locX];
    }
    function normaliseVelocity(vel) {
        if(!me.god)
            if (vel.y > 96) vel.y = 96;
    }
    function stepX() {
        if (me.modifier.x > 0) {
            if (me.modifier.x + me.position.reminder.x >= 1) {
                me.position.x += 1 - me.position.reminder.x;
                for(let i = 0; i < player.children.entries.length; i++)
                    player.children.entries[i].x += 1 - me.position.reminder.x;
                me.modifier.x -= 1 - me.position.reminder.x;
                me.position.reminder.x = 0;
            } else {
                me.position.x += me.modifier.x;
                for(let i = 0; i < player.children.entries.length; i++)
                    player.children.entries[i].x += me.modifier.x;;
                me.modifier.x = 0;
            }
        } else if (me.modifier.x < 0) {
            if (me.position.reminder.x != 0 && me.position.reminder.x + me.modifier.x < 0) {
                me.modifier.x += me.position.reminder.x
                me.position.x -= me.position.reminder.x
                for(let i = 0; i < player.children.entries.length; i++)
                    player.children.entries[i].x -= me.position.reminder.x;
                me.position.reminder.x = 1
            } else {
                me.position.x += me.modifier.x
                for(let i = 0; i < player.children.entries.length; i++)
                    player.children.entries[i].x += me.modifier.x;
                me.modifier.x = 0
            }
        }

        if (collidesWorld()) {
            me.position.x = me.position.old.x
            for(let i = 0; i < player.children.entries.length; i++)
                player.children.entries[i].x = me.position.old.x
            switch(me.previousBlockOn) {
                case 15:
                    if(me.modifier.old.x > 0) {
                        me.velocity.x = -0.001;
                        me.movevelocity.y = -0.001;
                    } else {
                        me.velocity.x = 0
                        me.movevelocity.x = 0
                    }
                    break;
                case 16:
                    me.velocity.x = 0
                    me.movevelocity.x = 0
                    break;
                case 17:
                    if(me.modifier.old.x < 0) {
                        me.velocity.x = 0.001;
                        me.movevelocity.x = 0.001;
                    } else {
                        me.velocity.x = 0
                        me.movevelocity.x = 0
                    }
                    break;
                default:
                    me.velocity.x = 0
                    me.movevelocity.x = 0
                    break;
            }
            me.modifier.x = me.modifier.old.x
            me.doneXStep = true
        }
    }

    function stepY() {
        if (me.modifier.y > 0) {
            if (me.modifier.y + me.position.reminder.y >= 1) {
                me.position.y += 1 - me.position.reminder.y
                for(let i = 0; i < player.children.entries.length; i++)
                    player.children.entries[i].y += 1 - me.position.reminder.y;
                me.modifier.y -= 1 - me.position.reminder.y
                me.position.reminder.y = 0
            } else {
                me.position.y += me.modifier.y
                for(let i = 0; i < player.children.entries.length; i++)
                    player.children.entries[i].y += me.modifier.y;
                me.modifier.y = 0
            }
        } else if (me.modifier.y < 0) {
            if (me.position.reminder.y != 0 && me.position.reminder.y + me.modifier.y < 0) {
                me.modifier.y += me.position.reminder.y
                me.position.y -= me.position.reminder.y
                for(let i = 0; i < player.children.entries.length; i++)
                    player.children.entries[i].y -= me.position.reminder.y;
                me.position.reminder.y = 1
            } else {
                me.position.y += me.modifier.y
                for(let i = 0; i < player.children.entries.length; i++)
                    player.children.entries[i].y += me.modifier.y;
                me.modifier.y = 0
            }
        }

        if (collidesWorld()) {
            me.position.y = me.position.old.y
            for(let i = 0; i < player.children.entries.length; i++)
                player.children.entries[i].y = me.position.old.y;
            switch(me.previousBlockOn) {
                case 15:
                    me.velocity.y = 0
                    me.movevelocity.y = 0
                    break;
                case 16:
                    if(me.modifier.old.y > 0) {
                        me.velocity.y = -0.001;
                        me.movevelocity.y = -0.001;
                    } else {
                        me.velocity.y = 0
                        me.movevelocity.y = 0
                    }
                    break;
                case 17:
                    me.velocity.y = 0
                    me.movevelocity.y = 0
                    break;
                default:
                    if(me.modifier.old.y < 0) {
                        me.velocity.y = 0.001;
                        me.movevelocity.y = 0.001;
                    } else {
                        me.velocity.y = 0
                        me.movevelocity.y = 0
                    }
                    break;
            }
            me.modifier.y = me.modifier.old.y
            me.doneYStep = true
        }
    }

    /**
     * dir:
     * 0 = left
     * 1 = up
     * 2 = right
     * 3 = down
     */
    function collidesWorld() {
        if (me.position.x < 0 || me.position.y < 0 ||
            me.position.x/16 > worldWidth - 1 ||
            me.position.y/16 > worldHeight - 1) return true
        
        if(!me.god) {
            const skip = [0, 15, 16, 17, 18, 30];
            const x1 = Math.floor(me.position.x/16);
            const x2 = Math.ceil(me.position.x/16);
            const y1 = Math.floor(me.position.y/16);
            const y2 = Math.ceil(me.position.y/16);

            const ox1 = Math.floor(me.position.old.x/16);
            const ox2 = Math.ceil(me.position.old.x/16);
            const oy1 = Math.floor(me.position.old.y/16);
            const oy2 = Math.ceil(me.position.old.y/16);

            if(isInBlock() && x1 === ox1 && x2 === ox2 &&
                                y1 === oy1 && y2 === oy2) return false;

            const blocksOnPlayer = isInBlock(true);

            const c1 = getChildAt(doors, x1, y1).canPass ? getChildAt(fgs, x1, y1) : getChildAt(doors, x1, y1);
            const c2 = getChildAt(doors, x1, y2).canPass ? getChildAt(fgs, x1, y2) : getChildAt(doors, x1, y2);
            const c3 = getChildAt(doors, x2, y1).canPass ? getChildAt(fgs, x2, y1) : getChildAt(doors, x2, y1);
            const c4 = getChildAt(doors, x2, y2).canPass ? getChildAt(fgs, x2, y2) : getChildAt(doors, x2, y2);

            const b1 = skip.includes(c1.bId) || (rot_slab.includes(c1.bId) && c1.rot === 0 && me.position.y <= c1.y-8) || (rot_slab.includes(c1.bId) && c1.rot === 1 && me.position.x >= c1.x+8) || (rot_slab.includes(c1.bId) && c1.rot === 2 && me.position.y >= c1.y+8) || (rot_slab.includes(c1.bId) && c1.rot === 3 && me.position.x <= c1.x-8) || (stat_oneway.includes(c1.bId) && me.velocity.y < 0) || (rot_oneway.includes(c1.bId) && c1.rot === 0 && me.velocity.y < 0) || (rot_oneway.includes(c1.bId) && c1.rot === 1 && me.velocity.x > 0) || (rot_oneway.includes(c1.bId) && c1.rot === 2 && me.velocity.y > 0) || (rot_oneway.includes(c1.bId) && c1.rot === 3 && me.velocity.x < 0) || blocksOnPlayer.includes(c1);
            const b2 = skip.includes(c2.bId) || (rot_slab.includes(c2.bId) && c2.rot === 0 && me.position.y <= c2.y-8) || (rot_slab.includes(c2.bId) && c2.rot === 1 && me.position.x >= c2.x+8) || (rot_slab.includes(c2.bId) && c2.rot === 2 && me.position.y >= c2.y+8) || (rot_slab.includes(c2.bId) && c2.rot === 3 && me.position.x <= c2.x-8) || (stat_oneway.includes(c2.bId) && me.velocity.y < 0) || (rot_oneway.includes(c2.bId) && c2.rot === 0 && me.velocity.y < 0) || (rot_oneway.includes(c2.bId) && c2.rot === 1 && me.velocity.x > 0) || (rot_oneway.includes(c2.bId) && c2.rot === 2 && me.velocity.y > 0) || (rot_oneway.includes(c2.bId) && c2.rot === 3 && me.velocity.x < 0) || blocksOnPlayer.includes(c2);
            const b3 = skip.includes(c3.bId) || (rot_slab.includes(c3.bId) && c3.rot === 0 && me.position.y <= c3.y-8) || (rot_slab.includes(c3.bId) && c3.rot === 1 && me.position.x >= c3.x+8) || (rot_slab.includes(c3.bId) && c3.rot === 2 && me.position.y >= c3.y+8) || (rot_slab.includes(c3.bId) && c3.rot === 3 && me.position.x <= c3.x-8) || (stat_oneway.includes(c3.bId) && me.velocity.y < 0) || (rot_oneway.includes(c3.bId) && c3.rot === 0 && me.velocity.y < 0) || (rot_oneway.includes(c3.bId) && c3.rot === 1 && me.velocity.x > 0) || (rot_oneway.includes(c3.bId) && c3.rot === 2 && me.velocity.y > 0) || (rot_oneway.includes(c3.bId) && c3.rot === 3 && me.velocity.x < 0) || blocksOnPlayer.includes(c3);
            const b4 = skip.includes(c4.bId) || (rot_slab.includes(c4.bId) && c4.rot === 0 && me.position.y <= c4.y-8) || (rot_slab.includes(c4.bId) && c4.rot === 1 && me.position.x >= c4.x+8) || (rot_slab.includes(c4.bId) && c4.rot === 2 && me.position.y >= c4.y+8) || (rot_slab.includes(c4.bId) && c4.rot === 3 && me.position.x <= c4.x-8) || (stat_oneway.includes(c4.bId) && me.velocity.y < 0) || (rot_oneway.includes(c4.bId) && c4.rot === 0 && me.velocity.y < 0) || (rot_oneway.includes(c4.bId) && c4.rot === 1 && me.velocity.x > 0) || (rot_oneway.includes(c4.bId) && c4.rot === 2 && me.velocity.y > 0) || (rot_oneway.includes(c4.bId) && c4.rot === 3 && me.velocity.x < 0) || blocksOnPlayer.includes(c4);

            if(!b1 || !b2 || !b3 || !b4) return true;
            return false;
        }
                
        return false
    }
    function isInBlock(bo) {
        const skip = [0, 15, 16, 17, 18, 30];
        const x1 = Math.floor(me.position.old.x/16);
        const x2 = Math.ceil(me.position.old.x/16);
        const y1 = Math.floor(me.position.old.y/16);
        const y2 = Math.ceil(me.position.old.y/16);

        const c1 = getChildAt(doors, x1, y1).canPass ? getChildAt(fgs, x1, y1) : getChildAt(doors, x1, y1);
        const c2 = getChildAt(doors, x1, y2).canPass ? getChildAt(fgs, x1, y2) : getChildAt(doors, x1, y2);
        const c3 = getChildAt(doors, x2, y1).canPass ? getChildAt(fgs, x2, y1) : getChildAt(doors, x2, y1);
        const c4 = getChildAt(doors, x2, y2).canPass ? getChildAt(fgs, x2, y2) : getChildAt(doors, x2, y2);

        const b1 = skip.includes(c1.bId) || (rot_slab.includes(c1.bId) && c1.rot === 0 && me.position.old.y <= c1.y-8) || (rot_slab.includes(c1.bId) && c1.rot === 1 && me.position.old.x >= c1.x+8) || (rot_slab.includes(c1.bId) && c1.rot === 2 && me.position.old.y >= c1.y+8) || (rot_slab.includes(c1.bId) && c1.rot === 3 && me.position.old.x <= c1.x-8);
        const b2 = skip.includes(c2.bId) || (rot_slab.includes(c2.bId) && c2.rot === 0 && me.position.old.y <= c2.y-8) || (rot_slab.includes(c2.bId) && c2.rot === 1 && me.position.old.x >= c2.x+8) || (rot_slab.includes(c2.bId) && c2.rot === 2 && me.position.old.y >= c2.y+8) || (rot_slab.includes(c2.bId) && c2.rot === 3 && me.position.old.x <= c2.x-8);
        const b3 = skip.includes(c3.bId) || (rot_slab.includes(c3.bId) && c3.rot === 0 && me.position.old.y <= c3.y-8) || (rot_slab.includes(c3.bId) && c3.rot === 1 && me.position.old.x >= c3.x+8) || (rot_slab.includes(c3.bId) && c3.rot === 2 && me.position.old.y >= c3.y+8) || (rot_slab.includes(c3.bId) && c3.rot === 3 && me.position.old.x <= c3.x-8);
        const b4 = skip.includes(c4.bId) || (rot_slab.includes(c4.bId) && c4.rot === 0 && me.position.old.y <= c4.y-8) || (rot_slab.includes(c4.bId) && c4.rot === 1 && me.position.old.x >= c4.x+8) || (rot_slab.includes(c4.bId) && c4.rot === 2 && me.position.old.y >= c4.y+8) || (rot_slab.includes(c4.bId) && c4.rot === 3 && me.position.old.x <= c4.x-8);

        const d1 = rot_slab.includes(c1.bId) && b1 ? undefined : c1;
        const d2 = rot_slab.includes(c2.bId) && b2 ? undefined : c2;
        const d3 = rot_slab.includes(c3.bId) && b3 ? undefined : c3;
        const d4 = rot_slab.includes(c4.bId) && b4 ? undefined : c4;

        if(bo) return [d1, d2, d3, d4];
        return(!b1 || !b2 || !b3 || !b4);
    }
    function getBlockOnPlayer() {
        const x = Math.round(me.position.x/16.0);
        const y = Math.round(me.position.y/16.0);
        const block = getChildAt(fgs, x, y);
        return block;
    }
    function addPacksToBlockPicker() {
        let bx = 10, by = 10;
        let ax = 10, ay = 10;
        let dx = 10, dy = 10;
        let bgx = 10, bgy = 10;

        const packs = getPacks();
        for(let i in packs) {
            const pack = packs[i];
            const blocks = [];
            const action = [];
            const decorative = [];
            const background = [];
            for(let j = 0; j < pack.items.length; j++) {
                if(pack.items[j].tab === Tab.BLOCKS) blocks.push(pack.items[j]);
                else if(pack.items[j].tab === Tab.ACTION) action.push(pack.items[j]);
                else if(pack.items[j].tab === Tab.DECORATIVE) decorative.push(pack.items[j]);
                else if(pack.items[j].tab === Tab.BACKGROUND) background.push(pack.items[j]);
            }

            if(blocks.length > 0) {
                let movement = 0;
                const text = scene.add.text(bx, by, pack.name, {/*style object*/});
                if(bx + text.displayWidth > 830 || bx + blocks.length*16 > 830) {
                    bx = 10;
                    by += 38;
                    text.setX(bx);
                    text.setY(by);
                }
                text.setScrollFactor(0);
                text.setVisible(false);
                cat_blocks.add(text);
                text.setDepth(11);
                by+=18;
                for(let j = 0; j < blocks.length; j++) {
                    const b = cat_blocks.create(bx+8, by+8, "blocks", 0).setScrollFactor(0).setVisible(false).setDepth(11).setInteractive();
                    b.bId = blocks[j].id;
                    b.on("pointerdown", function(pointer) {
                        if(settingOpen) return;
                        place = false;
                        changeBlock(b.bId);
                    });
                    if(blocks[j].bitmap)
                        cat_blocks.create(bx+8, by+8, blocks[j].bitmap, blocks[j].bitId).setScrollFactor(0).setVisible(false).setDepth(11);
                    if(blocks[j].basebit)
                        cat_blocks.create(bx+8, by+8, blocks[j].basebit, blocks[j].baseId).setScrollFactor(0).setVisible(false).setDepth(11);
                    if(blocks[j].overlaybit)
                        cat_blocks.create(bx+8, by+8, blocks[j].overlaybit, blocks[j].overlayId).setScrollFactor(0).setVisible(false).setDepth(11);
                    bx += 16;
                    movement += 16;
                }
                if(movement < text.displayWidth) {
                    bx -= movement;
                    bx += text.displayWidth;
                    bx += 10;
                }
                else
                    bx += 10;
                by-=18;
            }
            if(action.length > 0) {
                let movement = 0;
                const text = scene.add.text(ax, ay, pack.name, {/*style object*/});
                if(ax + text.displayWidth > 830 || ax + action.length*16 > 830) {
                    ax = 10;
                    ay += 38;
                    text.setX(ax);
                    text.setY(ay);
                }
                text.setScrollFactor(0);
                text.setVisible(false);
                cat_action.add(text);
                text.setDepth(11);
                ay+=18;
                for(let j = 0; j < action.length; j++) {
                    const b = cat_action.create(ax + 8, ay+8, "blocks", 0).setScrollFactor(0).setVisible(false).setDepth(11).setInteractive();
                    b.bId = action[j].id;
                    b.on("pointerdown", function(pointer) {
                        if(settingOpen) return;
                        place = false;
                        changeBlock(b.bId);
                    });
                    if(action[j].bitmap) {
                        cat_action.create(ax+8, ay+8, action[j].bitmap, action[j].bitId).setScrollFactor(0).setVisible(false).setDepth(11);
                    }
                    if(action[j].basebit) {
                        cat_action.create(ax+8, ay+8, action[j].basebit, action[j].baseId).setScrollFactor(0).setVisible(false).setDepth(11);
                    }
                    if(action[j].overlaybit) {
                        cat_action.create(ax+8, ay+8, action[j].overlaybit, action[j].overlayId).setScrollFactor(0).setVisible(false).setDepth(11);
                    }
                    if(b.bId === 0) {
                        selected2 = UI.create(ax+8, ay+8, 'selected');
                        selected2.setScrollFactor(0);
                        selected2.setDepth(12)
                        selected2.setVisible(false);
                    }
                    ax += 16;
                    movement += 16;
                }
                if(movement < text.displayWidth) {
                    ax -= movement;
                    ax += text.displayWidth;
                    ax += 10;
                } else
                    ax += 10;
                ay-=18;
            }
            if(decorative.length > 0) {
                let movement = 0;
                const text = scene.add.text(dx, dy, pack.name, {/*style object*/});
                if(dx + text.displayWidth > 830 || dx + decorative.length*16 > 830) {
                    dx = 10;
                    dy += 38;
                    text.setX(dx);
                    text.setY(dy);
                }
                text.setScrollFactor(0);
                text.setVisible(false);
                cat_deco.add(text);
                text.setDepth(11);
                dy+=18;
                for(let j = 0; j < decorative.length; j++) {
                    const b = cat_deco.create(dx + 8, dy+8, "blocks", 0).setScrollFactor(0).setVisible(false).setDepth(11).setInteractive();
                    b.bId = decorative[j].id;
                    b.on("pointerdown", function(pointer) {
                        if(settingOpen) return;
                        place = false;
                        changeBlock(b.bId);
                    });

                    if(decorative[j].bitmap) {
                        cat_deco.create(dx+8, dy+8, decorative[j].bitmap, decorative[j].bitId).setScrollFactor(0).setVisible(false).setDepth(11);
                    }
                    if(decorative[j].basebit) {
                        cat_deco.create(dx+8, dy+8, decorative[j].basebit, decorative[j].baseId).setScrollFactor(0).setVisible(false).setDepth(11);
                    }
                    if(decorative[j].overlaybit) {
                        cat_deco.create(dx+8, dy+8, decorative[j].overlaybit, decorative[j].overlayId).setScrollFactor(0).setVisible(false).setDepth(11);
                    }
                    
                    dx += 16;
                    movement += 16;
                }
                if(movement < text.displayWidth) {
                    dx -= movement;
                    dx += text.displayWidth;
                    dx += 10;
                } else
                    dx += 10;
                dy-=18;
            }
            if(background.length > 0) {
                let movement = 0;
                const text = scene.add.text(bgx, bgy, pack.name, {/*style object*/});
                if(bgx + text.displayWidth > 830 || bgx + background.length*16 > 830) {
                    bgx = 10;
                    bgy += 38;
                    text.setX(bgx);
                    text.setY(bgy);
                }
                text.setScrollFactor(0);
                text.setVisible(false);
                cat_bg.add(text);
                text.setDepth(11);
                bgy+=18;
                for(let j = 0; j < background.length; j++) {
                    const b = cat_bg.create(bgx + 8, bgy+8, "blocks", 0).setScrollFactor(0).setVisible(false).setDepth(11).setInteractive();
                    b.bId = background[j].id;
                    b.on("pointerdown", function(pointer) {
                        if(settingOpen) return;
                        place = false;
                        changeBlock(b.bId);
                    });

                    if(background[j].bitmap) {
                        cat_bg.create(bgx+8, bgy+8, background[j].bitmap, background[j].bitId).setScrollFactor(0).setVisible(false).setDepth(11);
                    }
                    if(background[j].basebit) {
                        cat_bg.create(bgx+8, bgy+8, background[j].basebit, background[j].baseId).setScrollFactor(0).setVisible(false).setDepth(11);
                    }
                    if(background[j].overlaybit) {
                        cat_bg.create(bgx+8, bgy+8, background[j].overlaybit, background[j].overlayId).setScrollFactor(0).setVisible(false).setDepth(11);
                    }

                    bgx += 16;
                    movement += 16;
                }
                if(movement < text.displayWidth) {
                    bgx -= movement;
                    bgx += text.displayWidth;
                    bgx += 10;
                } else
                    bgx += 10;
                bgy-=18;
            }
        }
        adjustHeight(by, ay, dy, bgy);
    }
    function getCat(id) {
        const packs = getPacks();
        for(let i in packs) {
            const pack = packs[i];
            const item = pack.getById(id);
            if(item) {
                return item.tab === Tab.BLOCKS ? "blocks" : item.tab === Tab.ACTION ? "action" : item.tab === Tab.DECORATIVE ? "deco" : item.tab === Tab.BACKGROUND ? "bgs" : "none";
            }
        }
        return "none";
    }
    function getGraphics(id) {
        const packs = getPacks();
        for(let i in packs) {
            const pack = packs[i];
            const item = pack.getById(id);
            if(item) {
                return {
                    bitmap: item.bitmap,
                    bitId: item.bitId,
                    basebit: item.basebit,
                    baseId: item.baseId,
                    overlaybit: item.overlaybit,
                    overlayId: item.overlayId,
                    tab: item.tab,
                    isDoor: item.isDoor,
                    isGate: item.isGate,
                    switchBaseBit: item.switchBaseBit,
                    switchBaseId: item.switchBaseId,
                    switchOverlayBit: item.switchOverlayBit,
                    switchOverlayId: item.switchOverlayId
                };
            }
        }
        return {
            bitmap: "blocks",
            bitId: 0,
            basebit: undefined,
            baseId: undefined,
            overlaybit: undefined,
            overlayId: undefined,
            tab: Tab.NONE,
            isDoor: false,
            isGate: false,
            switchBaseBit: undefined,
            switchBaseId: undefined,
            switchOverlayBit: undefined,
            switchOverlayId: undefined
        }
    }
    function getPacks() {
        const packs = {};
        packs.basic = new Pack("basic", 0, "Basic blocks to get you started", [
            new Item(1, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 0),
            new Item(13, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 3, "fgoverlays", 8),
            new Item(100, Tab.BACKGROUND, "", [], false, undefined, undefined, "fgbases", 0, "bgoverlays", 0),
        ]);
        packs.beta = new Pack("beta", 0, "Beta blocks", [
            new Item(2, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 1),
            new Item(101, Tab.BACKGROUND, "", [], false, undefined, undefined, "fgbases", 0, "bgoverlays", 1),
        ]);
        packs.brick = new Pack("brick", 0, "Bricks", [
            new Item(3, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 2),
            new Item(102, Tab.BACKGROUND, "", [], false, undefined, undefined, "fgbases", 0, "bgoverlays", 2),
        ]);
        packs.checkers = new Pack("checkers", 0, "Checkers blocks", [
            new Item(4, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 2, "fgoverlays", 3),
            new Item(103, Tab.BACKGROUND, "", [], false, undefined, undefined, "fgbases", 0, "bgoverlays", 3),
        ]);
        packs.glass = new Pack("glass", 0, "Glass blocks", [
            new Item(5, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 4),
        ]);
        packs.plastic = new Pack("plastic", 0, "Plastic blocks", [
            new Item(6, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 1, "fgoverlays", 5),
        ]);
        packs.carpet = new Pack("carpet", 0, "Carpet blocks", [
            new Item(7, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 7),
        ]);
        packs.mineral = new Pack("mineral", 0, "Mineral blocks", [
            new Item(8, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 9),
        ]);
        packs.scifi = new Pack("sci-fi", 0, "SCI-FI blocks", [
            new Item(9, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 11),
            new Item(10, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 5, "fgoverlays", 12),
            new Item(201, Tab.DECORATIVE, "-1", [], false, undefined, undefined, "decobases", 1, "decooverlays", 1),
            new Item(202, Tab.DECORATIVE, "-1", [], false, undefined, undefined, "decobases", 2, "decooverlays", 2),
        ]);
        packs.tile = new Pack("tile", 0, "Tile blocks", [
            new Item(11, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 13),
            new Item(106, Tab.BACKGROUND, "", [], false, undefined, undefined, "fgbases", 0, "bgoverlays", 6),
        ]);
        packs.xmas = new Pack("xmas", 0, "XMAS blocks", [
            new Item(12, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 6),
            new Item(21, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 3, "fgoverlays", 16),
            new Item(207, Tab.DECORATIVE, "-1", [], false, undefined, undefined, "decobases", 7, "decooverlays", 7),
        ]);
        packs.oneway = new Pack("one-way", 0, "One way blocks", [
            new Item(14, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 4, "fgoverlays", 10),
        ]);
        packs.candy = new Pack("candy", 0, "Candy blocks", [
            new Item(19, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 14),
            new Item(20, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 6, "fgoverlays", 15),
            new Item(204, Tab.DECORATIVE, "-1", [], false, undefined, undefined, "decobases", 4, "decooverlays", 4),
        ]);
        packs.marble = new Pack("marble", 0, "Marble blocks", [
            new Item(22, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 17),
        ]);
        packs.space = new Pack("space", 0, "Space blocks", [
            new Item(23, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 18),
            new Item(205, Tab.DECORATIVE, "-1", [], false, undefined, undefined, "decobases", 5, "decooverlays", 5),
        ]);
        packs.stone = new Pack("stone", 0, "Stone blocks", [
            new Item(24, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 19),
        ]);
        packs.pipes = new Pack("pipes", 0, "Pipes blocks", [
            new Item(25, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 20),
            new Item(26, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 21),
            new Item(27, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 22),
            new Item(28, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 23),
            new Item(29, Tab.BLOCKS, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 24),
        ]);
        packs.canvas = new Pack("canvas", 0, "Canvas backgrounds", [
            new Item(104, Tab.BACKGROUND, "", [], false, undefined, undefined, "fgbases", 0, "bgoverlays", 4),
        ]);
        packs.cave = new Pack("cave", 0, "Cave backgrounds", [
            new Item(105, Tab.BACKGROUND, "", [], false, undefined, undefined, "fgbases", 0, "bgoverlays", 5),
        ]);
        packs.gravity = new Pack("gravity", 0, "Gravity blocks which changes the direction of your movement", [
            new Item(0, Tab.ACTION, "-1", ["normal", "clear", "nothing", "empty", "gravity", "default", "regular"], false, "blocks", 0),
            new Item(15, Tab.ACTION, "-1", ["left", "arrow", "gravity"], false, "blocks", 15),
            new Item(16, Tab.ACTION, "-1", ["up", "arrow", "gravity"], false, "blocks", 16),
            new Item(17, Tab.ACTION, "-1", ["right", "arrow", "gravity"], false, "blocks", 17),
            new Item(18, Tab.ACTION, "-1", ["dot", "no gravity", "gravity"], false, "blocks", 18)
        ]);
        packs.windows = new Pack("windows", 0, "Window blocks", [
            new Item(200, Tab.DECORATIVE, "-1", [], false, undefined, undefined, "decobases", 0, "decooverlays", 0),
        ]);
        packs.newyears = new Pack("new years", 0, "New years blocks", [
            new Item(203, Tab.DECORATIVE, "-1", [], false, undefined, undefined, "decobases", 3, "decooverlays", 3),
        ]);
        packs.valentines = new Pack("valentines", 0, "Valentines blocks", [
            new Item(206, Tab.DECORATIVE, "-1", [], false, undefined, undefined, "decobases", 6, "decooverlays", 6),
        ]);
        packs.dojo = new Pack("dojo", 0, "DoJo blocks", [
            new Item(208, Tab.DECORATIVE, "-1", [], false, undefined, undefined, "decobases", 8, "decooverlays", 8),
        ]);
        packs.plain = new Pack("plain", 0, "Plain blocks", [
            new Item(107, Tab.BACKGROUND, "-1", [], false, undefined, undefined, "fgbases", 0),
        ]);
        // packs.grass = new Pack("grass", 0, "Grass blocks", [
        //     new Item(209, Tab.DECORATIVE, "-1", [], false, "decos", 0),
        //     new Item(210, Tab.DECORATIVE, "-1", [], false, "decos", 1),
        //     new Item(211, Tab.DECORATIVE, "-1", [], false, "decos", 2),
        // ]);
        packs.keydoors = new Pack("key doors", 0, "Keys, doors and gates", [
            new Item(30, Tab.ACTION, "", [], false, undefined, undefined, "fgbases", 7),
            new Item(31, Tab.ACTION, "", [], false, undefined, undefined, "fgbases", 0, "fgoverlays", 25, true, false, "fgbases", 8),
            new Item(32, Tab.ACTION, "", [], false, undefined, undefined, "fgbases", 9, "fgoverlays", 26, false, true, "fgbases", 0, "fgoverlays", 27),
        ]);
        return packs;
    }
    function Pack(name, shopId, desc, items) {
        this.name = name;
        this.shopId = shopId;
        this.description = desc;
        this.items = items;
        this.getById = function(id) {
            for(let i = 0; i < this.items.length; i++) {
                if(this.items[i].id === id) return this.items[i];
            }
            return null;
        }
    }
    function Item(id, tab, mapcol, tags, owneronly, bitmap, bitId, basebit, baseId, overlaybit, overlayId, isDoor, isGate, switchBaseBit, switchBaseId, switchOverlayBit, switchOverlayId) {
        this.id = id;
        this.tab = tab;
        this.mapColour = mapcol;
        this.tags = tags;
        this.ownerOnly = owneronly;
        this.bitmap = bitmap;
        this.bitId = bitId;
        this.basebit = basebit;
        this.baseId = baseId;
        this.overlaybit = overlaybit;
        this.overlayId = overlayId;
        this.isDoor = isDoor;
        this.isGate = isGate;
        this.switchBaseBit = switchBaseBit;
        this.switchBaseId = switchBaseId;
        this.switchOverlayBit = switchOverlayBit;
        this.switchOverlayId = switchOverlayId;
    }
    $("body").on("click", "canvas", function() {
        $("#textbox").trigger('blur');
        $("#seconds").trigger("blur")
    });
    
    function adjustHeight(by, ay, dy, bgy) {
        const max = Math.max(Math.max(by, ay), Math.max(dy, bgy));
        allBlocks = scene.add.graphics({ fillStyle: { color: 0x444444 } });
        const rect = new Phaser.Geom.Rectangle(0, 600-max-46, 840, max + 46);
        allBlocks.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
        allBlocks.on("pointerdown", function(pointer) {
            if(settingOpen) return;
            place = false;
        });

        allBlocks.fillRectShape(rect);
        allBlocks.setScrollFactor(0);
        allBlocks.setVisible(false);
        allBlocks.setDepth(10);
        UI.add(allBlocks)

        selected2.setY(selected2.y + 600 - max - 46);

        for(let i = 0; i < cat_blocks.children.entries.length; i++) {
            cat_blocks.children.entries[i].setY(cat_blocks.children.entries[i].y + 600 - max - 46);
        }
        for(let i = 0; i < cat_action.children.entries.length; i++) {
            cat_action.children.entries[i].setY(cat_action.children.entries[i].y + 600 - max - 46);
        }
        for(let i = 0; i < cat_deco.children.entries.length; i++) {
            cat_deco.children.entries[i].setY(cat_deco.children.entries[i].y + 600 - max - 46);
        }
        for(let i = 0; i < cat_bg.children.entries.length; i++) {
            cat_bg.children.entries[i].setY(cat_bg.children.entries[i].y + 600 - max - 46);
        }

        const cat_blocks_btn = categories.create(80, 600-max-46-15, "category", 1).setInteractive();
        cat_blocks_btn.setScrollFactor(0);

        const cat_action_btn = categories.create(240, 600-max-46-15, "category", 2).setInteractive();
        cat_action_btn.setScrollFactor(0);

        const cat_deco_btn = categories.create(400, 600-max-46-15, "category", 4).setInteractive();
        cat_deco_btn.setScrollFactor(0);

        const cat_bg_btn = categories.create(560, 600-max-46-15, "category", 6).setInteractive();
        cat_bg_btn.setScrollFactor(0);

        categories.setVisible(false);
        categories.setDepth(11);

        cat_blocks_btn.on("pointerdown", function(pointer) {
            if(settingOpen) return;
            openCat("blocks");
        });
        cat_action_btn.on("pointerdown", function(pointer) {
            if(settingOpen) return;
            openCat("action");
        });
        cat_deco_btn.on("pointerdown", function(pointer) {
            if(settingOpen) return;
            openCat("deco");
        });
        cat_bg_btn.on("pointerdown", function(pointer) {
            if(settingOpen) return;
            openCat("bgs");
        });
    }

    function handleClickCanvas(e) {
        if(!place) {
            place = true;
            draw = false;
            deleting = -1;
            lastPlacedX = -1;
            lastPlacedY = -1;
            return;
        }
        if(e.position.x < 0 || e.position.x > 840 || e.position.y < 0 || e.position.y > 600) {
            draw = false;
            deleting = -1;
            lastPlacedX = -1;
            lastPlacedY = -1;
            return;
        }
        if(e.worldX < -8 || e.worldX > (worldWidth-1)*16+8 || e.worldY < -8 || e.worldY > (worldHeight-1)*16+8) return;
        if(e.button === 2) {
            deleteBlock(e);
        } else if(e.button === 0) {
            if(bId === 0)
                deleteBlock(e)
            else
                placeBlock(e);
        } else if(e.button === 1) {
            const x = Math.round((scene.cameras.main.worldView.x + e.position.x) / 16.0);
            const y = Math.round((scene.cameras.main.worldView.y + e.position.y) / 16.0);
            const currentDeco = getChildAt(decos, x, y);
            const currentDoor = getChildAt(doors, x, y);
            const currentFg = getChildAt(fgs, x, y);
            const currentBg = getChildAt(bgs, x, y);
            if(!currentDeco || !currentFg || !currentBg || !currentDoor) return;
            const cbId = currentDeco.bId !== 0 ? currentDeco.bId : currentDoor.bId !== 0 ? currentDoor.bId : currentFg.bId !== 0 ? currentFg.bId : currentBg.bId;
            bId = cbId;
            changeBlock(bId);
        }
    }

    function isHex(h) {
        const re = /^#[0-9A-F]{6}$/i;
        return h.length === 7 && re.test(h);
    }

    function addUI() {
        const menu = UI.create(420, 620, 'menu');
        const picker = UI.create(466, 620, 'picker');
        const box = UI.create(165, 620, 'box').setInteractive();
        const godI = UI.create(165, 620, "god");

        UI.create(165, 620, 'smileyshapes', 0).setScrollFactor(0);
        UI.create(165, 620, 'smileywings', 0).setScrollFactor(0).setVisible(false);
        UI.create(165, 620, 'smileyfaceaddons', 0).setScrollFactor(0).setVisible(false);
        UI.create(165, 620, 'smileyeyes', 0).setScrollFactor(0);
        UI.create(165, 620, 'smileyaboves', 0).setScrollFactor(0).setVisible(false);
        UI.create(165, 620, 'smileybelows', 0).setScrollFactor(0).setVisible(false);
        UI.create(165, 620, 'smileymouths', 0).setScrollFactor(0);

        selected1 = UI.create(364, 620, 'selected');
        menu.setScrollFactor(0);
        picker.setScrollFactor(0);
        selected1.setScrollFactor(0);
        box.setScrollFactor(0);
        godI.setScrollFactor(0);

        box.on("pointerdown", function(pointer) {
            if(settingOpen) return;
            toggleSmileyEditor();
            settingOpen = true;
        });

        const chatBar = scene.add.graphics({ fillStyle: { color: 0x000000}, lineStyle: {width: 1, color: 0xffffff} });
        let rect = new Phaser.Geom.Rectangle(840, 0, 250, 640);
        chatBar.fillRectShape(rect);
        chatBar.strokeRectShape(rect);
        rect = new Phaser.Geom.Rectangle(840, 0, 250, 90);
        chatBar.strokeRectShape(rect);
        rect = new Phaser.Geom.Rectangle(840, 90, 250, 150);
        chatBar.strokeRectShape(rect);
        chatBar.setScrollFactor(0);
        UI.add(chatBar);
        title = scene.add.text(844, 4, "Untitled World", {fontSize: 20, color: '#ffffff'});
        title.setDepth(12);
        title.setScrollFactor(0);
        owner = scene.add.text(844, 8 + title.displayHeight, "By LuciferX", {fontSize: 12, color: '#ffffff'});
        owner.setDepth(12);
        owner.setScrollFactor(0);
        plays = scene.add.text(844, 12 + title.displayHeight + owner.displayHeight, "Plays: 46", {fontSize: 12, color: '#ffffff'});
        plays.setDepth(12);
        plays.setScrollFactor(0);

        const playerMe = scene.add.text(844, 94, "LuciferX", {fontSize: 12, color: '#ffffff'});
        playerMe.setDepth(12);
        playerMe.setScrollFactor(0);
        players.add(playerMe);

        const chat1 = scene.add.rexBBCodeText(844, 244, "[color=#dddddd]* SYSTEM: [/color][color=#888888]Welcome to the alpha version of this game. Please be sure to report any bugs to LuciferX. Discord: LuciferX#9235[/color]", {fontSize: 13, fixedWidth: 242, wrap: { mode: 'word', width: 242}});
        const chat2 = scene.add.rexBBCodeText(844, 248 + chat1.displayHeight, "[color=#dddddd]* SYSTEM: [/color][color=#888888]What's new:\n + Added keys, doors and gates\n + Added a new layer for doors and gate\n + Added plain background\n + Added even more smiley parts and colours\n # Fixed slabs phyisics even more\n # Fixed blurriness on movement\n # Fixed some smiley hats\n # Fixed dojo's pack decoration rotation[/color]", {fontSize: 13, fixedWidth: 242, wrap: { mode: 'word', width: 242}});
        const chat3 = scene.add.rexBBCodeText(844, 252 + chat1.displayHeight + chat2.displayHeight, "[color=#dddddd]* SYSTEM: [/color][color=#888888]Known bugs:\n - Still can't drag blocks from picker to quick select[/color]", {fontSize: 13, fixedWidth: 242, wrap: { mode: 'word', width: 242}});
        chat1.setDepth(12);
        chat1.setScrollFactor(0);
        chat2.setDepth(12);
        chat2.setScrollFactor(0);
        chat3.setDepth(12);
        chat3.setScrollFactor(0);
        chat.add(chat1);
        chat.add(chat2);
        chat.add(chat3);

        const moreLess = scene.add.text(585, 613, "more").setInteractive();
        moreLess.setScrollFactor(0);
        UI.add(moreLess);
        moreLess.on("pointerdown", function(pointer) {
            if(settingOpen) return;
            hexCustomizer.setVisible(false);
            const category = getCat(bId);
            moreLess.setText(moreLess.text === "more" ? "less" : "more");
            allBlocks.setVisible(moreLess.text === "more" ? false : true);
            categories.setVisible(moreLess.text === "more" ? false : true);
            if(selected2) selected2.setVisible(moreLess.text === "more" ? false : ((cat === "blocks" && category === "blocks") || (cat === "action" && category === "action") || (cat === "deco" && category === "deco") || (cat === "bg" && category === "bg")) ? true : false);
            if(cat === "blocks") {
                cat_blocks.setVisible(moreLess.text === "more" ? false : true);
            } else if(cat === "action") {
                cat_action.setVisible(moreLess.text === "more" ? false : true);
            } else if(cat === "deco") {
                cat_deco.setVisible(moreLess.text === "more" ? false : true);
            } else {
                cat_bg.setVisible(moreLess.text === "more" ? false : true);
            }
        });

        for(let i = 0; i < 13; i++) {
            let qs;
            if(i === 0) {
                qs = quickSelect.create(364 + (17*i), 620, 'blocks', i)
                qs.setInteractive();
            }
            else {
                const graphics = getGraphics(i);
                qs = scene.add.container(364 + (17*i), 620);
                const back = scene.add.sprite(0, 0, 'blocks', 0);
                const base = scene.add.sprite(0, 0, graphics.basebit, graphics.baseId);
                qs.add(back);
                qs.add(base);
                if(graphics.overlaybit) {
                    const overlay = scene.add.sprite(0, 0, graphics.overlaybit, graphics.overlayId);
                    qs.add(overlay);
                }
                qs.setInteractive(new Phaser.Geom.Rectangle(-8, -8, 16, 16), Phaser.Geom.Rectangle.Contains);
                quickSelect.add(qs);
            }
            qs.setScrollFactor(0);
            qs.bId = i;
            qs.on("pointerdown", function(pointer) {
                if(settingOpen) return;
                changeBlock(qs.bId);
            })
            qs.setDepth(11);
        }


        const hexBG = scene.add.nineslice(0, 0, 200, 60, "box", 5);
        hexBG.setInteractive();
        hexBG.on("pointerdown", function(pointer) {
            if(settingOpen) return;
            place = false;
        });
        hexBG.setScrollFactor(0);
        hexCustomizer.add(hexBG);
        hexBG.setDepth(12);
        const textbox = scene.add.dom(130, 30).createFromCache('textbox');
        textbox.setDepth(12);
        textbox.setScrollFactor(0);
        hexCustomizer.add(textbox);
        const base = hexCustomizer.create(40, 30, "fgbases", 0);
        base.setDepth(12);
        base.setScrollFactor(0);
        const ghostblock = hexCustomizer.create(40, 30, "fgoverlays", 0);
        ghostblock.setDepth(12);
        ghostblock.setScrollFactor(0);
        const textbox2 = scene.add.dom(130, 70).createFromCache('seconds');
        textbox2.setDepth(12);
        textbox2.setScrollFactor(0);
        hexCustomizer.add(textbox2);

        hexCustomizer.setVisible(false);

        $("body").on("input", "input#textbox", function() {
            if(isHex("#" + $(this).val())) {
                const hex = "0x" + $(this).val();
                const colour = parseInt(hex, 16);
                base.setTint(colour);
            } else {
                base.clearTint();
            }
        });
        $("body").on("focusout", "input#seconds", function() {
            if(Number($("#seconds").val() < 3)) $("#seconds").val("3");
            if(Number($("#seconds").val() > 999)) $("#seconds").val("999");
        });
        UI.setDepth(10);

        //smiley boxes
        const box1 = scene.add.nineslice(50, 50, 990, 540, "box2", 20, 10);
        box1.setScrollFactor(0);
        box1.setDepth(100);
        smileyEditor.add(box1);
        const xBtn = smileyEditor.create(1035, 55, "x");
        xBtn.setScrollFactor(0).setDepth(100).setInteractive();
        const box2 = scene.add.nineslice(75, 100, 150, 440, "box2", 20, 10);
        box2.setScrollFactor(0);
        box2.setDepth(100);
        smileyEditor.add(box2);

        xBtn.on("pointerdown", function(pointer) {
            settingOpen = false;

            currentFrame = player.children.entries[0].frame.name;
            myShape = currentFrame%SHAPES;
            myColour = (currentFrame-myShape)/SHAPES;
            for(let j = 1; j < colours.list.length; j+=2) {
                colours.list[j].setTexture("smileyshapes", (j-1)/2*SHAPES+myShape);
            }
            for(let j = 1; j < shapes.list.length; j+=2) {
                shapes.list[j].setTexture("smileyshapes", (j-1)/2 + myColour*SHAPES)
            }
            changeFrames();

            const cropPX = player.children.entries[0]._crop.x;
            const cropPY = player.children.entries[0]._crop.y;
            for(let i = 11; i < 18; i++) {
                const texture = player.children.entries[i-11].texture.key;
                const frame = player.children.entries[i-11].frame.name;
                const visible = player.children.entries[i-11].visible;
                smileyEditor.children.entries[i].setTexture(texture, frame);
                smileyEditor.children.entries[i].setVisible(visible);
            }
            smileyEditor.children.entries[11].setCrop(cropPX, cropPY, 26, 26);

            smileyEditor.setVisible(false);
        });

        //smiley categories
        const shapes = scene.add.container(0, 0);
        const eyes = scene.add.container(0, 0);
        const mouths = scene.add.container(0, 0);
        const addons = scene.add.container(0, 0);
        const wings = scene.add.container(0, 0);
        const above = scene.add.container(0, 0);
        const below = scene.add.container(0, 0);
        const colours = scene.add.container(0, 0);

        const cat1 = smileyEditor.create(150, 150, "smileycats", 0);
        cat1.setScrollFactor(0).setDepth(100).setInteractive().setTint(0xaaaaaa);
        const cat2 = smileyEditor.create(150, 189, "smileycats", 1);
        cat2.setScrollFactor(0).setDepth(100).setInteractive();
        const cat3 = smileyEditor.create(150, 228, "smileycats", 2);
        cat3.setScrollFactor(0).setDepth(100).setInteractive();
        const cat4 = smileyEditor.create(150, 267, "smileycats", 3);
        cat4.setScrollFactor(0).setDepth(100).setInteractive();
        const cat5 = smileyEditor.create(150, 306, "smileycats", 4);
        cat5.setScrollFactor(0).setDepth(100).setInteractive();
        const cat6 = smileyEditor.create(150, 345, "smileycats", 5);
        cat6.setScrollFactor(0).setDepth(100).setInteractive();
        const cat7 = smileyEditor.create(150, 384, "smileycats", 6);
        cat7.setScrollFactor(0).setDepth(100).setInteractive();
        const cat8 = smileyEditor.create(150, 423, "smileycats", 7);
        cat8.setScrollFactor(0).setDepth(100).setInteractive();

        cat1.on("pointerdown", function(pointer) {
            switchCats(cat1, shapes);
        });
        cat2.on("pointerdown", function(pointer) {
            switchCats(cat2, colours);
        });
        cat3.on("pointerdown", function(pointer) {
            switchCats(cat3, eyes);
        });
        cat4.on("pointerdown", function(pointer) {
            switchCats(cat4, mouths);
        });
        cat5.on("pointerdown", function(pointer) {
            switchCats(cat5, addons);
        });
        cat6.on("pointerdown", function(pointer) {
            switchCats(cat6, above);
        });
        cat7.on("pointerdown", function(pointer) {
            switchCats(cat7, below);
        });
        cat8.on("pointerdown", function(pointer) {
            switchCats(cat8, wings);
        });

        function switchCats(cat, group) {
            shapes.setVisible(false);
            eyes.setVisible(false);
            mouths.setVisible(false);
            addons.setVisible(false);
            wings.setVisible(false);
            above.setVisible(false);
            below.setVisible(false);
            colours.setVisible(false);
            for(let i = 3; i < 11; i++)
                smileyEditor.children.entries[i].clearTint();
            cat.setTint(0xaaaaaa);
            if(group)
                group.setVisible(true);
        }

        //smiley in editor
        for(let i = 0; i < player.children.entries.length; i++) {
            const texture = player.children.entries[i].texture.key;
            const frame = player.children.entries[i].frame.name;
            const visible = player.children.entries[i].visible;
            const part = smileyEditor.create(840, 320, texture, frame);
            part.setScrollFactor(0);
            part.setDepth(100);
            part.setVisible(visible);
            part.scaleX = 10;
            part.scaleY = 10;
        }

        const save = smileyEditor.create(150, 500, "savebtn");
        save.setScrollFactor(0);
        save.setDepth(100);
        save.setInteractive();
        save.on("pointerdown", function(pointer) {
            const cropPX = smileyEditor.children.entries[11]._crop.x;
            const cropPY = smileyEditor.children.entries[11]._crop.y;
            for(let i = 11; i < 18; i++) {
                const texture = smileyEditor.children.entries[i].texture.key;
                const frame = smileyEditor.children.entries[i].frame.name;
                const visible = smileyEditor.children.entries[i].visible;
                player.children.entries[i-11].setTexture(texture, frame);
                player.children.entries[i-11].setVisible(visible);
                UI.children.entries[i-7].setTexture(texture, frame);
                UI.children.entries[i-7].setVisible(visible);
            }
            player.children.entries[0].setCrop(cropPX, cropPY, 26, 26);
            UI.children.entries[4].setCrop(cropPX, cropPY, 26, 26);
            smileyEditor.setVisible(false);
            settingOpen = false;
            place = false;
        })

        //parts in editor
        {
            let x = 275;
            let y = 130;
            for(let i = 0; i < SHAPES; i++) {
                const partBox = scene.add.nineslice(x, y, 40, 40, "box2", 20, 10);
                partBox.setScrollFactor(0);
                partBox.setDepth(100);
                partBox.setInteractive();
                shapes.add(partBox);
                partBox.on("pointerdown", function(pointer) {
                    myShape = i;
                    currentFrame = i+(SHAPES*myColour);
                    smileyEditor.children.entries[11].setTexture("smileyshapes", currentFrame);
                    for(let j = 1; j < colours.list.length; j+=2) {
                        colours.list[j].setTexture("smileyshapes", (j-1)/2*SHAPES+i);
                    }
                    changeFrames();
                });

                const part = scene.add.sprite(x+20, y+20, "smileyshapes", i);

                part.setScrollFactor(0);
                part.setDepth(100);
                shapes.add(part);

                shapes.setScrollFactor(0);
                shapes.setDepth(100);

                x += 60;
                if((i+1)%7 === 0) {
                    x = 275;
                    y+= 60;
                }
            }
            smileyEditor.add(shapes);
        }
        {
            let x = 275;
            let y = 130;
            for(let i = 0; i < COLOURS; i++) {
                const partBox = scene.add.nineslice(x, y, 40, 40, "box2", 20, 10);
                partBox.setScrollFactor(0);
                partBox.setDepth(100);
                partBox.setInteractive();
                colours.add(partBox);
                partBox.on("pointerdown", function(pointer) {
                    myColour = i;
                    currentFrame = myShape + SHAPES*i;
                    smileyEditor.children.entries[11].setTexture("smileyshapes", currentFrame);
                    for(let j = 1; j < shapes.list.length; j+=2) {
                        shapes.list[j].setTexture("smileyshapes", (j-1)/2 + i*SHAPES)
                    }
                    changeFrames();
                });

                const part = scene.add.sprite(x+20, y+20, "smileyshapes", i*SHAPES);

                part.setScrollFactor(0);
                part.setDepth(100);
                colours.add(part);

                colours.setScrollFactor(0);
                colours.setDepth(100);

                x += 60;
                if((i+1)%7 === 0) {
                    x = 275;
                    y+= 60;
                }
            }
            smileyEditor.add(colours);
        }
        {
            let x = 275;
            let y = 130;
            for(let i = 0; i < EYES+1; i++) {
                const partBox = scene.add.nineslice(x, y, 40, 40, "box2", 20, 10);
                partBox.setScrollFactor(0);
                partBox.setDepth(100);
                partBox.setInteractive();
                eyes.add(partBox);
                partBox.on("pointerdown", function(pointer) {
                    if(i === 0) smileyEditor.children.entries[14].setVisible(false);
                    else {
                        smileyEditor.children.entries[14].setVisible(true);
                        smileyEditor.children.entries[14].setTexture("smileyeyes", i-1);
                    }
                });

                const face = scene.add.sprite(x+20, y+20, "smileyshapes", currentFrame);
                face.setScrollFactor(0);
                face.setDepth(100);
                eyes.add(face);
                if(i > 0) {
                    const part = scene.add.sprite(x+20, y+20, "smileyeyes", i-1);
                    part.setScrollFactor(0);
                    part.setDepth(100);
                    eyes.add(part);
                    eyes.setScrollFactor(0);
                    eyes.setDepth(100);
                }

                x += 60;
                if((i+1)%7 === 0) {
                    x = 275;
                    y+= 60;
                }
            }
            smileyEditor.add(eyes);
            eyes.setVisible(false);
        }
        {
            let x = 275;
            let y = 130;
            for(let i = 0; i < MOUTHS+1; i++) {
                const partBox = scene.add.nineslice(x, y, 40, 40, "box2", 20, 10);
                partBox.setScrollFactor(0);
                partBox.setDepth(100);
                partBox.setInteractive();
                mouths.add(partBox);
                partBox.on("pointerdown", function(pointer) {
                    if(i === 0) smileyEditor.children.entries[17].setVisible(false);
                    else {
                        smileyEditor.children.entries[17].setVisible(true);
                        smileyEditor.children.entries[17].setTexture("smileymouths", i-1);
                    }
                });
                const face = scene.add.sprite(x+20, y+20, "smileyshapes", currentFrame);
                face.setScrollFactor(0);
                face.setDepth(100);
                mouths.add(face);
                if(i > 0) {
                    const part = scene.add.sprite(x+20, y+20, "smileymouths", i-1);
                    part.setScrollFactor(0);
                    part.setDepth(100);
                    mouths.add(part);
                    mouths.setScrollFactor(0);
                    mouths.setDepth(100);
                }

                x += 60;
                if((i+1)%7 === 0) {
                    x = 275;
                    y+= 60;
                }
            }
            smileyEditor.add(mouths);
            mouths.setVisible(false);
        }
        {
            let x = 275;
            let y = 130;
            for(let i = 0; i < ADDONS+1; i++) {
                const partBox = scene.add.nineslice(x, y, 40, 40, "box2", 20, 10);
                partBox.setScrollFactor(0);
                partBox.setDepth(100);
                partBox.setInteractive();
                addons.add(partBox);
                partBox.on("pointerdown", function(pointer) {
                    if(i === 0)
                        smileyEditor.children.entries[13].setVisible(false);
                    else {
                        smileyEditor.children.entries[13].setTexture("smileyfaceaddons", i-1);
                        smileyEditor.children.entries[13].setVisible(true);
                    }
                });
                const face = scene.add.sprite(x+20, y+20, "smileyshapes", currentFrame);
                face.setScrollFactor(0);
                face.setDepth(100);
                addons.add(face);
                if(i > 0) {
                    const part = scene.add.sprite(x+20, y+20, "smileyfaceaddons", i-1);
                    part.setScrollFactor(0);
                    part.setDepth(100);
                    addons.add(part);
                    addons.setScrollFactor(0);
                    addons.setDepth(100);
                }

                x += 60;
                if((i+1)%7 === 0) {
                    x = 275;
                    y+= 60;
                }
            }
            smileyEditor.add(addons);
            addons.setVisible(false);
        }
        {
            let x = 275;
            let y = 130;
            for(let i = 0; i < WINGS+1; i++) {
                const partBox = scene.add.nineslice(x, y, 40, 40, "box2", 20, 10);
                partBox.setScrollFactor(0);
                partBox.setDepth(100);
                partBox.setInteractive();
                wings.add(partBox);
                partBox.on("pointerdown", function(pointer) {
                    if(i === 0)
                        smileyEditor.children.entries[12].setVisible(false);
                    else {
                        smileyEditor.children.entries[12].setTexture("smileywings", i-1);
                        smileyEditor.children.entries[12].setVisible(true);
                    }
                });
                const face = scene.add.sprite(x+20, y+20, "smileyshapes", currentFrame);
                face.setScrollFactor(0);
                face.setDepth(100);
                wings.add(face);
                if(i > 0) {
                    const part = scene.add.sprite(x+20, y+20, "smileywings", i-1);
                    part.setScrollFactor(0);
                    part.setDepth(100);
                    wings.add(part);
                    wings.setScrollFactor(0);
                    wings.setDepth(100);
                }

                x += 60;
                if((i+1)%7 === 0) {
                    x = 275;
                    y+= 60;
                }
            }
            smileyEditor.add(wings);
            wings.setVisible(false);
        }
        {
            let x = 275;
            let y = 130;
            for(let i = 0; i < ABOVES+1; i++) {
                const partBox = scene.add.nineslice(x, y, 40, 40, "box2", 20, 10);
                partBox.setScrollFactor(0);
                partBox.setDepth(100);
                partBox.setInteractive();
                above.add(partBox);
                partBox.on("pointerdown", function(pointer) {
                    if(i === 0)
                        smileyEditor.children.entries[15].setVisible(false);
                    else {
                        smileyEditor.children.entries[15].setTexture("smileyaboves", i-1);
                        smileyEditor.children.entries[15].setVisible(true);
                    }
                    if(i === 2 || i === 3) {
                        smileyEditor.children.entries[11].setCrop(0, 11, 26, 26);
                    } else if(i === 4 || i === 17) {
                        smileyEditor.children.entries[11].setCrop(0, 7, 26, 26);
                    } else if(i === 5 || i === 14 || i === 15 || i === 16) {
                        smileyEditor.children.entries[11].setCrop(0, 10, 26, 26);
                    } else {
                        smileyEditor.children.entries[11].setCrop(0, 0, 26, 26);
                    }
                });
                const face = scene.add.sprite(x+20, y+20, "smileyshapes", currentFrame);
                face.setScrollFactor(0);
                face.setDepth(100);
                above.add(face);
                if(i === 2 || i === 3) {
                    face.setCrop(0, 11, 26, 26);
                } else if(i === 4) {
                    face.setCrop(0, 7, 26, 26);
                } else if(i === 5 || i === 14 || i === 15 || i === 16) {
                    face.setCrop(0, 10, 26, 26);
                }
                if(i > 0) {
                    const part = scene.add.sprite(x+20, y+20, "smileyaboves", i-1);
                    part.setScrollFactor(0);
                    part.setDepth(100);
                    above.add(part);
                    above.setScrollFactor(0);
                    above.setDepth(100);
                }

                x += 60;
                if((i+1)%7 === 0) {
                    x = 275;
                    y+= 60;
                }
            }
            smileyEditor.add(above);
            above.setVisible(false);
        }
        {
            let x = 275;
            let y = 130;
            for(let i = 0; i < BELOWS+1; i++) {
                const partBox = scene.add.nineslice(x, y, 40, 40, "box2", 20, 10);
                partBox.setScrollFactor(0);
                partBox.setDepth(100);
                partBox.setInteractive();
                below.add(partBox);
                partBox.on("pointerdown", function(pointer) {
                    if(i === 0)
                        smileyEditor.children.entries[16].setVisible(false);
                    else {
                        smileyEditor.children.entries[16].setTexture("smileybelows", i-1);
                        smileyEditor.children.entries[16].setVisible(true);
                    }
                });
                const face = scene.add.sprite(x+20, y+20, "smileyshapes", currentFrame);
                face.setScrollFactor(0);
                face.setDepth(100);
                below.add(face);
                if(i > 0) {
                    const part = scene.add.sprite(x+20, y+20, "smileybelows", i-1);
                    part.setScrollFactor(0);
                    part.setDepth(100);
                    below.add(part);
                    below.setScrollFactor(0);
                    below.setDepth(100);
                }

                x += 60;
                if((i+1)%7 === 0) {
                    x = 275;
                    y+= 60;
                }
            }
            smileyEditor.add(below);
            below.setVisible(false);
        }

        function changeFrames() {
            for(let i = 1; i < wings.list.length; i += 3) {
                wings.list[i].setTexture("smileyshapes", currentFrame);
                if(i === 1) i--;
            }
            for(let i = 1; i < eyes.list.length; i += 3) {
                eyes.list[i].setTexture("smileyshapes", currentFrame);
                if(i === 1) i--;
            }
            for(let i = 1; i < mouths.list.length; i += 3) {
                mouths.list[i].setTexture("smileyshapes", currentFrame);
                if(i === 1) i--;
            }
            for(let i = 1; i < above.list.length; i += 3) {
                above.list[i].setTexture("smileyshapes", currentFrame);
                if(i === 1) i--;
            }
            for(let i = 1; i < below.list.length; i += 3) {
                below.list[i].setTexture("smileyshapes", currentFrame);
                if(i === 1) i--;
            }
            for(let i = 1; i < addons.list.length; i += 3) {
                addons.list[i].setTexture("smileyshapes", currentFrame);
                if(i === 1) i--;
            }
        }

        smileyEditor.setVisible(false);
    }

    function toggleSmileyEditor() {
        hexCustomizer.setVisible(false);
        for(let i = 0; i < smileyEditor.children.entries.length; i++) {
            if(i < 3) smileyEditor.children.entries[i].setVisible(true);
            else if(i === 3) {
                smileyEditor.children.entries[i].setVisible(true);
                smileyEditor.children.entries[i].setTint(0xaaaaaa);
            } else if(i < 11) {
                smileyEditor.children.entries[i].setVisible(true);
                smileyEditor.children.entries[i].clearTint();
            } else if(i >= 11 && i <= 17) {
                smileyEditor.children.entries[i].setVisible(player.children.entries[i-11].visible);
            } else if(i === 18) smileyEditor.children.entries[i].setVisible(true);
            else if(i === 19) {
                smileyEditor.children.entries[i].setVisible(true);
                return;
            }
        }
    }

    function openCat(category) {
        place = false;
        const selCat = getCat(bId);
        selected2.setVisible(false);
        hexCustomizer.setVisible(false);
        if(selCat === category) selected2.setVisible(true);
        if(cat === "blocks") {
            categories.children.entries[0].setTexture("category", 0);
            cat_blocks.setVisible(false);
        } else if(cat === "action") {
            categories.children.entries[1].setTexture("category", 2);
            cat_action.setVisible(false);
        } else if(cat === "deco") {
            categories.children.entries[2].setTexture("category", 4);
            cat_deco.setVisible(false);
        } else {
            categories.children.entries[3].setTexture("category", 6);
            cat_bg.setVisible(false);
        }

        if(category === "blocks") {
            categories.children.entries[0].setTexture("category", 1);
            cat_blocks.setVisible(true);
        } else if(category === "action") {
            categories.children.entries[1].setTexture("category", 3);
            cat_action.setVisible(true);
        } else if(category === "deco") {
            categories.children.entries[2].setTexture("category", 5);
            cat_deco.setVisible(true);
        } else {
            categories.children.entries[3].setTexture("category", 7);
            cat_bg.setVisible(true);
        }

        cat = category;
    }
    function changeKeyDoorsTextures(hex, seconds) {
        if(!switchedDoors.includes(hex)) {
            switchedDoors.push(hex);
            const graphicsDoor = getGraphics(31);
            const graphicsGate = getGraphics(32);
            for(let i = 0; i < doorsArr.length; i++) {
                if(doorsArr[i].bId === 31 && doorsArr[i].hex === hex) {
                    doorsArr[i].canPass = true;
                    doorsArr[i].setDepth(-2);
                    doorsArr[i].list[0].setTexture(graphicsDoor.switchBaseBit, graphicsDoor.switchBaseId);
                    doorsArr[i].list[1].setVisible(false);
                } else if(doorsArr[i].bId === 32 && doorsArr[i].hex === hex) {
                    doorsArr[i].canPass = false;
                    doorsArr[i].setDepth(0);
                    doorsArr[i].list[0].setTexture(graphicsGate.switchBaseBit, graphicsGate.switchBaseId);
                    doorsArr[i].list[1].setTexture(graphicsGate.switchOverlayBit, graphicsGate.switchOverlayId);
                }
            }
        }
        if(doorTimerIds["" + hex]) clearTimeout(doorTimerIds["" + hex]);
        doorTimerIds["" + hex] = setTimeout(() => {revertKeyDoorsTextures(hex)}, seconds * 1000);
    }
    function revertKeyDoorsTextures(hex) {
        delete doorTimerIds["" + hex];
        if(switchedDoors.includes(hex)) {
            switchedDoors.remove(hex);
            const graphicsDoor = getGraphics(31);
            const graphicsGate = getGraphics(32);
            for(let i = 0; i < doorsArr.length; i++) {
                if(doorsArr[i].bId === 31 && doorsArr[i].hex === hex) {
                    doorsArr[i].canPass = false;
                    doorsArr[i].setDepth(0);
                    doorsArr[i].list[0].setTexture(graphicsDoor.basebit, graphicsDoor.baseId);
                    doorsArr[i].list[1].setVisible(true);
                } else if(doorsArr[i].bId === 32 && doorsArr[i].hex === hex) {
                    doorsArr[i].canPass = true;
                    doorsArr[i].setDepth(-2);
                    doorsArr[i].list[0].setTexture(graphicsGate.basebit, graphicsGate.baseId);
                    doorsArr[i].list[1].setTexture(graphicsGate.overlaybit, graphicsGate.overlayId);
                }
            }
        }
    }
    function changeBlock(blockId) {
        const category = getCat(blockId);
        let x = 0;
        let y = 0;
        if(category === "blocks") {
            for(let i = 0; i < cat_blocks.children.entries.length; i++) {
                if(cat_blocks.children.entries[i].bId === blockId) {
                    selected2.setX(cat_blocks.children.entries[i].x);
                    selected2.setY(cat_blocks.children.entries[i].y);
                    x = cat_blocks.children.entries[i].x;
                    y = cat_blocks.children.entries[i].y;
                }
            }
        } else if(category === "action") {
            for(let i = 0; i < cat_action.children.entries.length; i++) {
                if(cat_action.children.entries[i].bId === blockId) {
                    selected2.setX(cat_action.children.entries[i].x);
                    selected2.setY(cat_action.children.entries[i].y);
                    x = cat_action.children.entries[i].x;
                    y = cat_action.children.entries[i].y;
                }
            }
        } else if(category === "deco") {
            for(let i = 0; i < cat_deco.children.entries.length; i++) {
                if(cat_deco.children.entries[i].bId === blockId) {
                    selected2.setX(cat_deco.children.entries[i].x);
                    selected2.setY(cat_deco.children.entries[i].y);
                    x = cat_deco.children.entries[i].x;
                    y = cat_deco.children.entries[i].y;
                }
            }
        } else if(category === "bgs") {
            for(let i = 0; i < cat_bg.children.entries.length; i++) {
                if(cat_bg.children.entries[i].bId === blockId) {
                    selected2.setX(cat_bg.children.entries[i].x);
                    selected2.setY(cat_bg.children.entries[i].y);
                    x = cat_bg.children.entries[i].x;
                    y = cat_bg.children.entries[i].y;
                }
            }
        }
        selected2.setVisible(allBlocks.visible && category === cat)

        let found = false;
        for(let i = 0; i < quickSelect.children.entries.length; i++) {
            if(quickSelect.children.entries[i].bId === blockId) {
                found = true;
                selected1.setX(quickSelect.children.entries[i].x);
                selected1.setY(quickSelect.children.entries[i].y);
            }
        }
        selected1.setVisible(found);

        bId = blockId;
        hexCustomizer.setVisible(false);
        if(allBlocks.visible && category === cat) {
            if(bId >= 1 && bId <= 14 || bId >= 19 && bId <= 32 || bId >= 100 && bId <= 107 || bId >= 200 && bId <= 208) {
                hexCustomizer.children.entries[0].resize(200, 60);
                const graphics = getGraphics(bId);
                hexCustomizer.children.entries[2].setTexture(graphics.basebit, graphics.baseId);
                hexCustomizer.children.entries[3].setTexture(graphics.overlaybit, graphics.overlayId);

                hexCustomizer.children.entries[0].setX(x - 100);
                hexCustomizer.children.entries[1].setX(x - 100 + 130);
                hexCustomizer.children.entries[2].setX(x - 100 + 40);
                hexCustomizer.children.entries[3].setX(x - 100 + 40);

                hexCustomizer.setVisible(true);

                if(bId === 30) {
                    hexCustomizer.children.entries[0].resize(200, 100);
                    hexCustomizer.children.entries[0].setY(y - 120);
                    hexCustomizer.children.entries[1].setY(y - 120 + 30);
                    hexCustomizer.children.entries[2].setY(y - 70);
                    hexCustomizer.children.entries[3].setY(y - 70);
                    hexCustomizer.children.entries[4].setX(x - 100 + 130);
                    hexCustomizer.children.entries[4].setY(y - 120 + 70);
                } else {
                    hexCustomizer.children.entries[0].setY(y - 80);
                    hexCustomizer.children.entries[1].setY(y - 80 + 30);
                    hexCustomizer.children.entries[2].setY(y - 80 + 30);
                    hexCustomizer.children.entries[3].setY(y - 80 + 30);
                    hexCustomizer.children.entries[4].setVisible(false);
                }

                while(hexCustomizer.children.entries[0].x < 5) {
                    for(let i = 0; i < hexCustomizer.children.entries.length; i++)
                        hexCustomizer.children.entries[i].setX(hexCustomizer.children.entries[i].x + 5);
                }
                while(hexCustomizer.children.entries[0].x > 835) {
                    for(let i = 0; i < hexCustomizer.children.entries.length; i++)
                        hexCustomizer.children.entries[i].setX(hexCustomizer.children.entries[i].x - 5);
                }
            }
        }
    }
}
a();