var World = require("./server/models/world");

var fgs = [];
var bgs = [];

for(var x = 0; x < 100; x++) {
    for(var y = 0; y < 100; y++) {
        if(x === 0 || y === 0 || x === 99 || y === 99) {
            fgs[y*100 + x] = 2;
        } else {
            fgs[y*100 + x] = 0;
        }
        bgs[y*100 + x] = 0;
    }
}


var data = [
    {
        title: "New world #2",
        fgs: fgs,
        bgs: bgs,
        width: 100,
        height: 100,
        plays: 0,
        owner: null
    }
];

function seedDB(){
    data.forEach(function(seed){
        World.create(seed, function(err, world){
            if(err){
                console.log(err)
            } else {
                console.log("added a world.");
                console.log(world.fgs);
            }
        });
    });
 }
  
 module.exports = seedDB;