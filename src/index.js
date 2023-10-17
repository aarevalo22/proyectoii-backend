import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import bodyParser from 'body-parser'
import nodemailer from 'nodemailer'

const app = express()
const port = 3000;
app.use(cors())
app.use(bodyParser.json());

const db = mysql.createConnection({
   host: '159.223.134.9',
   user: 'ayarevalog',
   password: '2019*AFvBFu1a',
   database: 'employmentManagement',
   insecureAuth: true
 });


const transport = nodemailer.createTransport({
   host: '31.170.160.75', // Dirección IP del servidor SMTP
   port: 587,
   secure: false,
   auth: {
     user: 'aarevalo@danielapps.co',
     pass: 'Danielapps.7'
   },
   timeout: 10000, 
 });
 
 db.connect(err => {
     if (err) {
         console.error("Error de conexión:", err);
         return;
     }
     console.log("Conexión a la base de datos establecida");
 });

app.post('/login', (req, res) => {
   let {email, password} = req.body

   console.log(req.body)
   
   let sql = `SELECT * FROM students WHERE email = ?` 
   db.query(sql,[email],(err, result) => {
      if (err) {
         console.error("Error en la consulta:", err);
         return;
     }
     console.log('result', result.length)
     if (result.length == 0) {
       res.json({ message : 'Email Incorrecto.'}) 
     }else if(result[0].password !== password){
      res.json({ message: 'Password Incorrecta.'}) 
     }else{
      delete result[0].password
      res.json(result)
     }
   })
})

app.put('/students/:id',(req,res) => {
   try {
      let userId = req.params.id
      let body = req.body
      let sql = `UPDATE students SET ? WHERE id = ?`
      db.query(sql, [body, userId], (error, result) => {
         if (error) {
            console.error("Error en la consulta:", error);
            return;
        }
         res.status(200).json({ message: 'Registro actualizado exitosamente' });
      })
   } catch (error) {
      console.log("Error students update ", error) 
   }
})


app.post('/companies/send-email/:id', (req, res) => {
   
   let companieId = req.params.id
   let studentId = req.body.id
   let body = req.body

   const htmlBody = `
  <html>
    <head>
      <style>
        /* Estilos CSS personalizados para el correo */
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
        }
        h1 {
          color: #333;
        }
        p {
          font-size: 16px;
          line-height: 1.5;
          color: #555;
        }
      </style>
    </head>
    <body>
      <h1>Correo Electrónico Bonito</h1>
      <p>Hola</p>
      <p>${body.firstname} ${body.lastname}.</p>
      <p>${body.phone}.</p>
      <p>${body.email}.</p>
      <p>${body.profession}.</p>
      <p>${body.level}.</p>
    </body>
  </html>
`;

   const mailOptions = {
     from: 'aarevalo@danielapps.co',
     to: 'aarevalo@danielapps.co',
     subject: 'Solicitud de vacante para Practicas (Universidad CUL)',
     text: htmlBody
   };
   transport.sendMail(mailOptions, (error, info) => {
     if (error) {
       console.error('Error al enviar el correo:', error);
       res.status(500).json({ error: 'Error al enviar el correo' });
     } else {
       console.log('Correo enviado con éxito:', info.response);
       let sql = `UPDATE applications SET application_status = Enviado WHERE student_id = ? AND companie_id = ?`
       db.query(sql, [studentId, companieId], (error, result) => {
         res.status(200).json({ message: 'Correo enviado con éxito' });
       })
     }
   });
 });



app.get('/companies', (req, res) => {
   try {
      let sql = `SELECT * FROM companies`
      db.query(sql,(error, result) => {
         if (error) {
            console.error("Error Companies:", err);
            return;
         }
         res.json(result)
      })
   } catch (error) {
     console.log("Error Companies ", error) 
   }
})
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
