var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    email: String,
    username: String,
    admin: Boolean,
    banned: Boolean,
    ip: String,
    password: String,
    joined: {type: Date, default: Date.now},
    worlds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "World"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);