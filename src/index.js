const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const updateQuery = require('./utils/update-query')

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
   WHERE U.email = ?`;

    db.query(sql, [email], (err, result) => {
      let resp = result[0];
      if (!resp) {
        return res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado!" });
      }
      console.log(resp.rol !== "Estudiante");
      if (resp.password !== password) {
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
    const sql = `SELECT
    Empresas.*, Tipo_Oferta.idtipo_oferta AS idTipo_Oferta, 
    Carreras.nombre AS tipo_oferta
    FROM Empresas
    LEFT JOIN Tipo_Oferta ON Empresas.id = Empresas_id
    LEFT JOIN Carreras ON Tipo_Oferta.Carreras_idCarrera = Carreras.idCarrera;
  `
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

app.post("/companies", async(req,res) => {
  try {
    let { nombre, nit, descripcion, correo, telefono, direccion, tipo_empresa, tipo_oferta} = req.body
    let sql = `INSERT INTO Empresas (nombre, nit, descripcion, correo, telefono, direccion, tipo_empresa) VALUES (?, ?, ?, ?, ?, ?, ?)`

    db.query(sql, [nombre, nit, descripcion, correo, telefono, direccion, tipo_empresa], (err, result) => {
      if(err) {
        res.status(404).json({ message: err.message });
      }
      let sqlTipoOferta = `INSERT INTO Tipo_Oferta (estado, Carreras_idCarrera, Empresas_id) VALUES (?,?,?)`
      db.query(sqlTipoOferta, ['Disponible', tipo_oferta, result.insertId], (err, result) => {
        if(err) {
          res.status(404).json({ message: err.message });
        }
        res.status(200).json({ succes: true, message: 'Registro Exitoso!'});
      })
    }) 
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
})


app.put("/companies/:id", async(req,res) => {
  try {
  let id = req.params.id;
  const query = `UPDATE Empresas ${updateQuery(id, req.body)}`
  const colVals = Object.values(req.body)
    db.query(query, [...colVals], (err, result) => {
      if(err) {
        res.status(404).json({ message: err.message });
      }
      res.status(200).json({ succes: true, message: 'Empresa Actualizada'});
    }) 
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
})


app.put("/oferta/:id", async(req,res) => {
  try {
  let id = req.params.id;
  let { estado , tipo_oferta} = req.body
  const query = `UPDATE Tipo_Oferta SET estado = ?, Carreras_idCarrera = ? WHERE idtipo_oferta = ?`
    db.query(query, [estado, tipo_oferta, id], (err, result) => {
      if(err) {
        res.status(404).json({ message: err.message });
      }
      res.status(200).json({ succes: true, message: 'Oferta Actualizada!'});
    }) 
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
})

app.delete("/companies/:id", async(req,res) => {
  try {
  let id = req.params.id;
  const query = `DELETE FROM Empresas WHERE id = ?`
    db.query(query, [id], (err, result) => {
      if(err) {
        res.status(404).json({ message: err.message });
      }
      res.status(200).json({ succes: true, message: 'Empresa Eliminada'});
    }) 
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
})


