const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote.controllers');
const userController = require('../controllers/user.controllers')
const authController = require('../controllers/auth.controllers')

// Endpoints públicos
router.post('/create/user', userController.createUser);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: juan123
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/auth/login', authController.loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión de usuario
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Logout exitoso
 */
router.post('/auth/logout', authController.logoutUser);


//Endpoints para usuarios
/**
 * @swagger
 * /api/create/user:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: juan123
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/create/user', userController.createUser);

/**
 * @swagger
 * /api/get-all/user:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/get-all/user', userController.getUsers);

/**
 * @swagger
 * /api/get/user/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/get/user/:id', userController.getUserById);

/**
 * @swagger
 * /api/update/user/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: juan_modificado
 *               password:
 *                 type: string
 *                 example: nuevoPassword123
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Error en la solicitud
 */
router.put('/update/user/:id', userController.updateUser);

/**
 * @swagger
 * /api/delete/user/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/delete/user/:id', userController.deleteUser);


//Endpoints para los votos
/**
 * @swagger
 * /api/create/vote:
 *   post:
 *     summary: Crear un voto
 *     tags: [Votos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - candidate
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64f123abc456
 *               candidate:
 *                 type: string
 *                 example: "Candidato A"
 *     responses:
 *       201:
 *         description: Voto registrado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/create/vote', voteController.createVote);

/**
 * @swagger
 * /api/get-all/vote:
 *   get:
 *     summary: Obtener todos los votos
 *     tags: [Votos]
 *     responses:
 *       200:
 *         description: Lista de votos
 */
router.get('/get-all/vote', voteController.getVotes);

/**
 * @swagger
 * /api/get/vote/{id}:
 *   get:
 *     summary: Obtener un voto por ID
 *     tags: [Votos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del voto
 *     responses:
 *       200:
 *         description: Voto encontrado
 *       404:
 *         description: Voto no encontrado
 */
router.get('/get/vote/:id', voteController.getVoteById);

/**
 * @swagger
 * /api/get/statistics:
 *   get:
 *     summary: Obtener estadísticas de votación
 *     tags: [Votos]
 *     responses:
 *       200:
 *         description: Estadísticas de votos
 */
router.get('/get/statistics', voteController.getVoteStatistics);

/**
 * @swagger
 * /api/delete/vote/{id}:
 *   delete:
 *     summary: Eliminar un voto por ID
 *     tags: [Votos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del voto
 *     responses:
 *       200:
 *         description: Voto eliminado correctamente
 *       404:
 *         description: Voto no encontrado
 */
router.delete('/delete/vote/:id', voteController.deleteVote);


module.exports = router;