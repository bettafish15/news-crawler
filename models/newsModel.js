const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let newsSchema = new Schema({
    link: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    title: {
        type: String,
        unique: false,
        required: false
    },
    category: {
        type: String,
        unique: false,
        required: false
    },
    date: { type: Date, default: Date.now, index: true },
}, {
    timestamps: true
});

let newsModel = mongoose.model('news', newsSchema);
module.exports = newsModel;


