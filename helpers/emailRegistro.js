// import nodemailer from 'nodemailer';
import { Resend } from "resend";

const resend = new Resend("re_idS1AEoK_HkTocS426H4ZGJE8XjzSBAtr");

const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: "gerbric14@gmail.com",
    subject: "Verificar Cuenta De APV",
    html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV.</p>
        <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>

        <p>Si tu no creaste esta cuenta puedes ignorar este mensaje.</p>
        
        `,
  });

  console.log("Mensaje Enviado: %s", info.messageId);

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
};



// const emailRegistroBien = async (datos) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         }
//       });

//       const {email, nombre, token}= datos;

//       //ENVIAR EL EMAIL
//       const info = await transporter.sendMail({
//         from: "APV - Administrador de Pacientes de Veterinaria",
//         to: email,
//         subject: "Comprueba tu cuenta en APV",
//         text: "Comprueba tu cuenta en APV",
//         html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV.</p>
//         <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
//         <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>

//         <p>Si tu no creaste esta cuenta puedes ignorar este mensaje.</p>
        
//         `
//       });

//       console.log("Mensaje Enviado: %s", info.messageId);
// };

export default emailRegistro;