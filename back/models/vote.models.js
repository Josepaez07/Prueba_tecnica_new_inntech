const mongoose = require('../config/connections');

const voteSchema = new mongoose.Schema({
    voter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El votante es obligatorio'] // quitamos unique: true
    },
    candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El candidato es obligatorio']
    }
}, {
    timestamps: true
});

const voteModel = mongoose.model('Vote', voteSchema);
module.exports = voteModel;
