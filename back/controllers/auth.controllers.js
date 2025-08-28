const userModel = require('../models/user.models');
const bcrypt = require('bcrypt');

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
    }

    try {
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        user.ultima_sesion = new Date();
        await user.save();
        
        // Enviar toda la info útil del usuario al frontend
        res.json({
            mensaje: "Login exitoso",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                has_voted: user.has_voted,
                party: user.party,
                votes: user.votes,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        res.json({ mensaje: 'Sesión cerrada exitosamente (token inválido en cliente)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
