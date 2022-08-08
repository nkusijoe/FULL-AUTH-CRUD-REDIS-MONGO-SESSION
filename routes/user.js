const express = require('express')

const {createUser, login, getAllUsers, getOneUser, updateUser, deleteUser} = require('../controllers/user')
const {authenticate, authorize} = require('../middlewares/auth')
const { validateCreateUser, validateUpdateUser } = require('../middlewares/validate')

const routes = express.Router()


routes.route('/register').post(validateCreateUser, createUser)
routes.route('/available_users').get(authenticate, authorize('r'), getAllUsers)
routes.route('/login').post(login)
routes.route('/:id').get(getOneUser).patch(validateUpdateUser, updateUser).delete(deleteUser)


module.exports = routes