var mongoose = require("mongoose");

var WorldSchema = new mongoose.Schema({
    title: String,
    fgs: [],
    bgs: [],
    width: Number,
    height: Number,
    created: {type: Date, default: Date.now},
    plays: Number,
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("World", WorldSchema);