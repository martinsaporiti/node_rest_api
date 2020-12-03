const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {type: String, unique: true, required: [true, 'field name is required']},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    status: {
        type: Boolean,
        default: true
    },
});

categorySchema.plugin(uniqueValidator, { message: 'Duplicated {PATH}, must be unique!...'});
module.exports = mongoose.model('Category', categorySchema);