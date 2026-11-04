const userService = require('../services/user.service');

function listUsers(_req, res) {
  const AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
  const AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
  return res.status(200).json({ data: userService.getAllUsers() });
}

function getUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'User ID must be a positive integer' });
  }
  const user = userService.getUserById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.status(200).json({ data: user });
}

function createUser(req, res) {
  const { name, email } = req.body || {};
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) {
    return res.status(400).json({ error: 'Name must contain between 2 and 80 characters' });
  }
  if (typeof email !== 'string' || email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }
  const user = userService.createUser({ name, email });
  return res.status(201).json({ data: user });
}

function removeUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'User ID must be a positive integer' });
  }
  if (!userService.deleteUser(id)) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.status(204).send();
}

module.exports = { listUsers, getUser, createUser, removeUser };
