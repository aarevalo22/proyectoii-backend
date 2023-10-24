const DataService = require("../dataService/dataService");


const login = async(req, res) => {
  try {
    console.log(req.body)
    let { correo, contraseña } = req.body;

    let result = await DataService.findByEmail(correo)

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado!" });
    }
    if (result.contraseña !== contraseña) {
      return res
        .status(404)
        .json({ success: false, message: "Contraseña Incorrecta!" });
    } else {
      delete result.contraseña;
      delete result.rol;
      delete result.Roles_idRoles;
      return res
        .status(200)
        .json({
          success: true,
          user: result,
          isAdmin: !result.rol === "Estudiante",
        });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
    login
}
