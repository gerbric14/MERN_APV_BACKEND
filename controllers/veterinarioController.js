import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarID from '../helpers/generarId.js';
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';

const registrar = async (req, res) => {
    const {email, nombre} = req.body;

    //COMPROBAR USUARIO REGISTRADO
    const existeUsuario = await Veterinario.findOne({email});

    if(existeUsuario){
        const error = new Error("Usuario ya registrado!");
        return res.status(400).json({msg: error.message});
    }

    try {
        //GUARDAR NUEVO VETERINARIO
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //ENVIAR EL EMAIL
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });


        res.json(veterinarioGuardado);

    } catch (error) {
        console.log(error);
    }

};

const perfil = (req, res) => {
    const {veterinario} = req;
    res.json(veterinario);
};

const confirmar = async (req, res) => {
    const {token} = req.params
    const usuarioConfirmar = await Veterinario.findOne({token});

    if(!usuarioConfirmar) {
        const error = new Error("Token no valido");
        return res.status(404).json({msg: error.message});
    }

    try {
        usuarioConfirmar.token = null; //MODIFICO EL TOKEN 
        usuarioConfirmar.confirmado = true; //MODIFICO EL CONFIRMADO 
        await usuarioConfirmar.save(); //GUARDO DATOS
        
        res.json({msg: "Usuario confirmado correctamente"});

    } catch (error) {
        console.log(error)
    }

};

const autenticar = async (req, res) => {
    const {email, password} = req.body;

    //COMPROBAR SI EL USUARIO EXISTE
    const usuario = await Veterinario.findOne({email});

    if(!usuario){
        const error = new Error("El usuario no existe!");
        return res.status(401).json({msg: error.message});
    }

    //COMPROBAR SI EL USUARIO ESTA CONFIRMADO
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message});
    }

    //VALIDAR SI COINCIDE EL PASSWORD
    if(await usuario.comprobarPassword(password)){
        //AUTENTICAR AL USUARIO

        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });

    }else{
        const error = new Error("El password es incorrecto");
        return res.status(403).json({msg: error.message});
    }
};

const olvidePassword = async (req, res) => {
    const {email} = req.body;

    const existeVeterinario = await Veterinario .findOne({email});
    if(!existeVeterinario){
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message});
    }

    try {
        existeVeterinario.token = generarID();
        await existeVeterinario.save();

        //ENVIAR EMAIL CON INSTRUCCIONES
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });

        res.json({msg: 'Hemos enviado un email con las instrucciones'});
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const {token} = req.params;

    const tokenValido = await Veterinario.findOne({token});
    if(tokenValido){
        //EL TOKEN ES VALIDO EL USUARIO EXISTE
        res.json({msg: "token valido y el usuario existe"});
    }else{
        const error = new Error("Token no valido");
        return res.status(400).json({msg: error.message});
    }

};

const nuevoPassword = async(req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: "Password modificado correctamente"});
        
    } catch (error) {
        console.log(error);
    }
};

    const actualizarPerfil = async (req, res) => {
        const veterinario = await Veterinario.findById(req.params.id);
        if(!veterinario){
            const error = new Error('Hubo un error');
            return res.status(400).json({msg: error.message});
        }

        const {email} = req.body;
        if(veterinario.email !== req.body.email){
            const existeEmail = await Veterinario.findOne({email});
            if(existeEmail){
                const error = new Error('Ese Email ya esta en uso');
                return res.status(400).json({msg: error.message});
            }
        }

        try {
            veterinario.nombre = req.body.nombre;
            veterinario.email = req.body.email;
            veterinario.web = req.body.web;
            veterinario.telefono = req.body.telefono;

            const veterinarioActualizado = await veterinario.save();
            res.json(veterinarioActualizado);
        } catch (error) {
            console.log(error)
        }
    }

    const actualizarPassword = async (req, res) => {
        //LEER LOS DATOS
        const {id} = req.veterinario;
        const  {psw_actual, psw_nuevo} = req.body;

        //COMPROBAR QUE EL VETERINARIO EXISTE
        const veterinario = await Veterinario.findById(id);
        if(!veterinario){
            const error = new Error('Hubo un error');
            return res.status(400).json({msg: error.message});
        }

        //COMPROBAR PASSWORD
        if(await veterinario.comprobarPassword(psw_actual)){
            //ALMACENAR EL NUEVO PASSWORD
            veterinario.password = psw_nuevo;
            await veterinario.save();
            res.json({msg: 'Password Actualizado Correctamente'})
        }else{
            const error = new Error('El Password Actual es Incorrecto');
            return res.status(400).json({msg: error.message});
        }
    }

export {
    registrar, 
    perfil, 
    confirmar,
    autenticar, 
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    emailOlvidePassword,
    actualizarPerfil,
    actualizarPassword
}