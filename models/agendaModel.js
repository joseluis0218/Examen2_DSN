let mongoose = require('mongoose'),
Schema = mongoose.Schema;

let dataSchema = new Schema({
    nombre : {type : String, require : true},
    apellidos : {type : String, require : true},
    correo : {type : String, require : true},
    fecha_nac : {type : String, require : true},
    foto : {type : String},
});

let model = mongoose.model('agenda', dataSchema, 'agenda');

module.exports = model;