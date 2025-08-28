const userModels = require('../models/user.models')
const bcrypt = require("bcrypt");

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { name, email, password, role, party } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    if (password.length < 6) {
            return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres.' });
        }

    const existingUser = await userModels.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const newUser = {
      name,
      email,
      password,
      role: role || "voter",
    };

    if (role === "candidate"){
        newUser.party = party || "Falta Partido Politico";
        newUser.votes = 0;
    }
    const user = new userModels(newUser);
    await user.save();

    res.status(201).json({ message: "Usuario creado exitosamente", user: user });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
};

// Obtener todos los usuarios
userController.getUsers = async (req, res) => {
  try {
    const users = await userModels.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// Obtener un usuario por ID
userController.getUserById = async (req, res) => {
  try {
    const user = await userModels.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error: error.message });
  }
};

// Actualizar usuario
userController.updateUser = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const user = await userModels.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.nombre = nombre || user.nombre;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    userModels.rol = rol || userModels.rol;

    await user.save();
    res.json({ message: "Usuario actualizado exitosamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
  }
};

// Eliminar usuario
userController.deleteUser = async (req, res) => {
  try {
    const user = await userModels.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};



module.exports = userController;
