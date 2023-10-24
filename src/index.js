const express =  require("express")
const mysql = require("mysql")
const cors = require("cors")
const router = require("./route/routes")


const app = express();
const port = 3000;
app.use(express.json());
app.use(router.use('/api', router))
app.use(cors());



const db = mysql.createConnection({
  host: "159.223.134.9",
  user: "ayarevalog",
  password: "2019*AFvBFu1a",
  database: "employmentManagement",
  insecureAuth: true,
});

db.connect((err) => {
  if (err) {
    console.error("Error de conexión:", err);
    return;
  }
  console.log("Conexión a la base de datos establecida");
});

// app.put("/students/:id", (req, res) => {
//   try {
//     let userId = req.params.id;
//     let body = req.body;
//     let sql = `UPDATE students SET ? WHERE id = ?`;
//     db.query(sql, [body, userId], (error, result) => {
//       if (error) {
//         console.error("Error en la consulta:", error);
//         return;
//       }
//       res.status(200).json({ message: "Registro actualizado exitosamente" });
//     });
//   } catch (error) {
//     console.log("Error students update ", error);
//   }
// });

// app.post("/companies/send-email/:id", (req, res) => {
//   let companieId = req.params.id;
//   let studentId = req.body.id;
//   let body = req.body;

//   const htmlBody = `
//   <html>
//     <head>
//       <style>
//         /* Estilos CSS personalizados para el correo */
//         body {
//           font-family: Arial, sans-serif;
//           background-color: #f0f0f0;
//         }
//         h1 {
//           color: #333;
//         }
//         p {
//           font-size: 16px;
//           line-height: 1.5;
//           color: #555;
//         }
//       </style>
//     </head>
//     <body>
//       <h1>Correo Electrónico Bonito</h1>
//       <p>Hola</p>
//       <p>${body.firstname} ${body.lastname}.</p>
//       <p>${body.phone}.</p>
//       <p>${body.email}.</p>
//       <p>${body.profession}.</p>
//       <p>${body.level}.</p>
//     </body>
//   </html>
// `;

//   const mailOptions = {
//     from: "aarevalo@danielapps.co",
//     to: "aarevalo@danielapps.co",
//     subject: "Solicitud de vacante para Practicas (Universidad CUL)",
//     text: htmlBody,
//   };
//   transport.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Error al enviar el correo:", error);
//       res.status(500).json({ error: "Error al enviar el correo" });
//     } else {
//       console.log("Correo enviado con éxito:", info.response);
//       let sql = `UPDATE applications SET application_status = Enviado WHERE student_id = ? AND companie_id = ?`;
//       db.query(sql, [studentId, companieId], (error, result) => {
//         res.status(200).json({ message: "Correo enviado con éxito" });
//       });
//     }
//   });
// });

// app.get("/companies", (req, res) => {
//   try {
//     let sql = `SELECT * FROM companies`;
//     db.query(sql, (error, result) => {
//       if (error) {
//         console.error("Error Companies:", err);
//         return;
//       }
//       res.json(result);
//     });
//   } catch (error) {
//     console.log("Error Companies ", error);
//   }
// });
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
