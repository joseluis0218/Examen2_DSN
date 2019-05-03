let model = require('../models/agendaModel');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });

const BUCKET_NAME = '*';
const IAM_USER_KEY = '*';
const IAM_USER_SECRET = '*';

var s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME,
})
module.exports = {
    show: function (req, res) {
        model.find({}, function (err, result) {
            if (err) {
                res.sendStatus(500);
            } else {
                console.log('success');
                res.render('index', { datos: result});

            }
        });
    },
    create: function (req, res) {
        let obj = new model;
        console.log(req.body);
        obj.nombre = req.body.nombre;
        obj.apellidos = req.body.apellidos;
        obj.correo = req.body.correo;
        obj.fecha_nac = req.body.fecha_nac;
        obj.foto = req.files.foto.name;
        obj.save(function (err, newData) {
            if (err) {
                console.log(err);
                res.sendStatus(500);                
            } else {
                console.log(newData);
                var file = req.files.foto;
                s3bucket.createBucket(function () {
                    var params = {
                        Bucket: BUCKET_NAME,
                        Key: file.name,
                        Body: file.data
                    };
                    s3bucket.upload(params, function (err, data) {
                        if (err) {
                            console.log('error in callback');
                            console.log(err);
                        } else {
                            console.log('success');
                            console.log(data);
                            res.redirect("/")
                        }
                    });
                });
            }
        });
    },
    detail : function(req,res){
        var val_id = req.params.id;
        model.findOne({_id : val_id}, function(err,data){
            if(err){
                console.log(err);
                res.sendStatus(500);
            }else{
                console.log("succes");
                res.render('editar',{datos : data});
            }
        });
    },
    update : function(req,res){
        var val_id = req.body.id;
        console.log(req.files.foto.name);
        console.log(req.body);
        let datos = {
            nombre : req.body.nombre,
            apellidos : req.body.apellidos,
            correo : req.body.correo,
            fecha_nac : req.body.fecha_nac,
            foto : req.files.foto.name,
        };
        model.updateOne({_id : val_id},datos,function(err,newData){
            if(err){
                console.log(err);
                res.sendStatus(500);
            }else{
                console.log(newData);
                var file = req.files.foto;
                s3bucket.createBucket(function () {
                    var params = {
                        Bucket: BUCKET_NAME,
                        Key: file.name,
                        Body: file.data
                    };
                    s3bucket.upload(params, function (err, data) {
                        if (err) {
                            console.log('error in callback');
                            console.log(err);
                        } else {
                            console.log('success');
                            // console.log(data);
                            res.redirect("/")
                        }
                    });
                });
            }
        });
    },
    delete : function(req,res){
        console.log(req.body);
        var val_id = req.params.id;
        var file = req.params.foto;
        model.deleteOne({_id : val_id},function(err){
            if(err){
                console.log(err);
            }else{
                console.log("SE ELIMINOO");
                var params = {
                    Bucket: BUCKET_NAME, 
                    Key: file
                   };
                   s3bucket.deleteObject(params, function(err, data) {
                     if (err){
                        console.log(err, err.stack); // an error occurred
                     }else{
                        console.log(data);
                        console.log("Eliminado correctamente");                    
                        res.redirect('/');
                     }     
                   });
            }
        });
    }

};  