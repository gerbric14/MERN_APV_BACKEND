import mongoose from "mongoose";

const pacientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    propietario: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    sintomas: {
        type: String,
        required: true,
    },
    veterinario: { //HACER RELACION DE LAS TABLAS
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinario",
    },

},
{
    //CREAR COLUMNAS DE EDITADOR Y CREADOR
    timestamps: true,
}
);

const Paciente = mongoose.model("Paciente", pacientesSchema);

export default Paciente;