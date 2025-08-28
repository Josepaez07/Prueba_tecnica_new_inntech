const mongoose = require('../config/connections');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor ingresa un email válido'
        ]
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['voter', 'candidate', 'admin'],
        default: 'voter'
    },
    has_voted: {
        type: Boolean,
        default: false
    },
    party: {
        type: String,
        trim: true,
        maxlength: [50, 'El partido no puede exceder 50 caracteres'],
        default: 'Independiente'
    },
    votes: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

// Hash automático de contraseñas
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10); // genera el salt
        this.password = await bcrypt.hash(this.password, salt); // encripta el password
    }
    next();
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModels = mongoose.model('User', userSchema);
module.exports = userModels;
