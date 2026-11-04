const express = require('express');
const controller = require('../controllers/user.controller');
const { requireApiKey } = require('../middleware/auth.middleware');

const router = express.Router();
router.get('/', controller.listUsers);
router.get('/:id', controller.getUser);
router.post('/', requireApiKey, controller.createUser);
router.delete('/:id', requireApiKey, controller.removeUser);

module.exports = router;
