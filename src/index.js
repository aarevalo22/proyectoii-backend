const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(express.json());
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

app.post("/login", (req, res) => {
  try {
    let { email, password } = req.body;
    let sql = `SELECT U.*, R.tipo_rol AS rol
   FROM Usuarios U
   LEFT JOIN Roles R ON U.Roles_idRoles = R.idRoles
   WHERE U.correo = ?`;

    db.query(sql, [email], (err, result) => {
      let resp = result[0];
      if (!resp) {
        return res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado!" });
      }
      console.log(resp.rol !== "Estudiante");
      if (resp.contraseña !== password) {
        return res
          .status(404)
          .json({ success: false, message: "Contraseña Incorrecta!" });
      } else {
        let isAdmin = resp.rol !== "Estudiante"
        delete resp.contraseña;
        delete resp.rol;
        delete resp.Roles_idRoles;
        return res.status(200).json({
          success: true,
          user: resp,
          isAdmin: isAdmin,
        });
      }
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


app.get("/companies", async(req, res) => {
  try {
    const sql = `SELECT * FROM Empresas`
    db.query(sql, [], (err, result) => {
      if(err) {
        return res.status(404).json({ message: err.message });
      }
      res.status(200).json({ succes: true, data: result });
    })
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
})

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
