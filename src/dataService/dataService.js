const db = require('../dataService/dataService')

const findByEmail = async (email) => {

    try {
        const res = await db.query(
            `SELECT U.*, R.tipo_rol AS rol
            FROM Usuarios U
            LEFT JOIN Roles R ON U.Roles_idRoles = R.idRoles
            WHERE U.correo = ?`,
            [email]
        )
        return res[0]
    } catch (error) {
        console.log('Error api Login')
    }
   
}

module.exports = {
    findByEmail
}