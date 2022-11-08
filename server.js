const express = require("express");
const mongoose = require('mongoose');

const {body , validationResult} = require('express-validator');
mongoose.connect('mongodb://localhost/Cita', {useNewUrlParser: true});

const esquemaCita = new mongoose.Schema({
    nombre: {type:String,required:[true,'campo requerido'],maxlength:20},
    mensaje: {type:String,required:[true,'campo requerido'],maxlength:100}
    },{timestamps:true})

const Cita = mongoose.model('db_cita', esquemaCita);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs');
app.set('views',__dirname + '/views');
app.use( express.static(__dirname + "/static"));
app.use("/recursos", express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    res.rencendder("index")
})

app.post('/citas', [
    body('nombre','Ingrese Nombre')
        .exists()
        .isLength({min:1}),
    body('mensaje','Ingrese Comentarios')
        .exists()
        .isLength({min:1}),
    ], (req, res) => {
    
    const errores = validationResult(req)
    if (!errores.isEmpty())
    {
        let arrErr = errores.array();
        let Mensaje ="Errores::<br>"
        for (let i=0 ; i<arrErr.length ; i++){
            Mensaje += arrErr[i].msg + "<br>"
        }
        Mensaje += "<br><a href='/'>Volver!</a>"
        res.send(Mensaje)
    }
    else {
    
        Cita.create(req.body)
        .then(newUserData => {
            res.redirect("/citas")
        })
        .catch(err => {
            console.log(err);
            res.send(err + "<br><a href='/'>Volver!</a>")
        });
    }
})

app.get('/citas', (req, res) => {
    Cita.find({})
    .then(data => {
        res.render("cita",{Citas:data})
    })
    .catch(err => {
        res.send(err + "<br><a href='/'>Volver!</a>")
    });
   
})

app.listen(8000, ()=>{
    console.log("Servidor escuchando el puerto 8000");
});