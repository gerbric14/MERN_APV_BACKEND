import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js"
import pacienteRoutes from "./routes/pacienteRoutes.js"

const app = express();
app.use(express.json());
dotenv.config(); //ESCANEA Y BUSCA EL ARCHIVO.ENV DEBE IR ANTES DE CONECTAR DB

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];
//CONFIGURACION DE CORS
const corsOptions = {
    origin: function (origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //EL ORIGEN DEL REQUEST ESTA PERMITIDO
            callback(null, true);
        }else{
            callback(new Error('No permitido por CORS'));
        }
    }
}

app.use(cors(corsOptions));

//INTERNO DE EXPRESS - ENVIAR REQ Y RES
app.use("/api/veterinarios", veterinarioRoutes);
app.use("/api/pacientes", pacienteRoutes);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});