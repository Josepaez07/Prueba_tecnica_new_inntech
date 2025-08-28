const Vote = require('../models/vote.models');
const User = require('../models/user.models');

const voteController = {};

// Registrar un voto
voteController.createVote = async (req, res) => {
    try {
        const { voter_id, candidate_id } = req.body;

        // Validar campos obligatorios
        if (!voter_id || !candidate_id) {
            return res.status(400).json({ message: "El votante y el candidato son obligatorios" });
        }

        // Verificar si el votante existe
        const voter = await User.findById(voter_id);
        if (!voter) {
            return res.status(404).json({ message: "Votante no encontrado" });
        }

        // Verificar si el candidato existe
        const candidate = await User.findById(candidate_id);
        if (!candidate) {
            return res.status(404).json({ message: "Candidato no encontrado" });
        }

        // Verificar que el votante tenga rol de 'voter'
        if (voter.role === 'candidate') {
            return res.status(400).json({ message: "Solo los votantes pueden emitir votos" });
        }

        // Verificar que el candidato tenga rol de 'candidate'
        if (candidate.role !== 'candidate') {
            return res.status(400).json({ message: "Solo se puede votar por candidatos" });
        }

        // Verificar si el votante ya ha votado
        if (voter.has_voted) {
            return res.status(400).json({ message: "Este votante ya ha emitido su voto" });
        }

        // Verificar si ya existe un voto de este votante (aunque has_voted sea false)
        const existingVote = await Vote.findOne({ voter_id });
        if (existingVote) {
            return res.status(400).json({ message: "Este votante ya tiene un voto registrado" });
        }

        // Crear el voto
        const newVote = new Vote({
            voter_id,
            candidate_id
        });

        await newVote.save();

        // Actualizar el estado del votante (marcar como que ya votó)
        voter.has_voted = true;
        await voter.save();

        // Incrementar el contador de votos del candidato
        candidate.votes += 1;
        await candidate.save();

        res.status(201).json({ 
            message: "Voto registrado exitosamente", 
            vote: newVote 
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Error al registrar el voto", 
            error: error.message 
        });
    }
};

// Obtener todos los votos
voteController.getVotes = async (req, res) => {
    try {
        const votes = await Vote.find()
            .populate('voter_id', 'name email')
            .populate('candidate_id', 'name party votes');
        
        res.json(votes);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener los votos", 
            error: error.message 
        });
    }
};

// Obtener un voto por ID
voteController.getVoteById = async (req, res) => {
    try {
        const vote = await Vote.findById(req.params.id)
            .populate('voter_id', 'name email')
            .populate('candidate_id', 'name party votes');
        
        if (!vote) {
            return res.status(404).json({ message: "Voto no encontrado" });
        }
        
        res.json(vote);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener el voto", 
            error: error.message 
        });
    }
};

// Obtener votos por candidato
// voteController.getVotesByCandidate = async (req, res) => {
//     try {
//         const { candidate_id } = req.params;
        
//         const votes = await Vote.find({ candidate_id })
//             .populate('voter_id', 'name email')
//             .populate('candidate_id', 'name party votes');
        
//         res.json({
//             candidate: votes.length > 0 ? votes[0].candidate_id : await User.findById(candidate_id),
//             total_votes: votes.length,
//             votes: votes
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             message: "Error al obtener los votos del candidato", 
//             error: error.message 
//         });
//     }
// };

// Eliminar un voto (solo para administración)
voteController.deleteVote = async (req, res) => {
    try {
        const vote = await Vote.findById(req.params.id);
        
        if (!vote) {
            return res.status(404).json({ message: "Voto no encontrado" });
        }

        // Revertir los cambios en los usuarios
        const voter = await User.findById(vote.voter_id);
        const candidate = await User.findById(vote.candidate_id);

        if (voter) {
            voter.has_voted = false;
            await voter.save();
        }

        if (candidate && candidate.votes > 0) {
            candidate.votes -= 1;
            await candidate.save();
        }

        await Vote.findByIdAndDelete(req.params.id);
        
        res.json({ message: "Voto eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ 
            message: "Error al eliminar el voto", 
            error: error.message 
        });
    }
};

// Obtener estadísticas de votación
voteController.getVoteStatistics = async (req, res) => {
    try {
        const totalVotes = await Vote.countDocuments();
        const totalVoters = await User.countDocuments({ role: 'voter' });
        const totalCandidates = await User.countDocuments({ role: 'candidate' });
        
        const votesPerCandidate = await Vote.aggregate([
            {
                $group: {
                    _id: '$candidate_id',
                    voteCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'candidate'
                }
            },
            {
                $unwind: '$candidate'
            },
            {
                $project: {
                    candidateName: '$candidate.name',
                    candidateParty: '$candidate.party',
                    voteCount: 1
                }
            },
            {
                $sort: { voteCount: -1 }
            }
        ]);

        res.json({
            total_votes: totalVotes,
            total_voters: totalVoters,
            total_candidates: totalCandidates,
            participation_rate: totalVoters > 0 ? ((totalVotes / totalVoters) * 100).toFixed(2) + '%' : '0%',
            votes_per_candidate: votesPerCandidate
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener estadísticas", 
            error: error.message 
        });
    }
};

module.exports = voteController;