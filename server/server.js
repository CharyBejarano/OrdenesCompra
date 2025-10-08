require('dotenv').config();
const express = require ('express');
const cors = require('cors');
const bobyParse = require ('body-parser');
const sql = require ('mssql');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(bobyParse.json());

//configuracion del servidor
const dbCongig={
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, //para Azure
        trustServerCertificate: true //para desarrollo local
    }
}
//conexion a la base de datos
sql.connect(dbCongig, err=> {
    console.log('Conectado a la base de datos');
    return pool;
}).catch(err =>{
    console.error('Error de conexion a la base de datos: ', err);
});
//conexion con el api
app.get('/',(req,res)=>{
    res.send('APIde autenticacion y autorizacion')
});
//conexion con el puerto
const PORT = process.env.PORT|| 5000;
app.listen(PORT,()=>{
    console.log(`servidor corriendo en el puerto ${PORT}`);
});