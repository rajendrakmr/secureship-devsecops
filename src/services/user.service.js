const users = [
  { id: 1, name: 'Asha Sharma', email: 'asha@example.com' },
  { id: 2, name: 'Rahul Das', email: 'rahul@example.com' },
];
let nextId = 3;

function getAllUsers() {
  return users;
}

function getUserById(id) {
  return users.find((user) => user.id === Number(id)) || null;
}

function createUser({ name, email }) {
  const user = { id: nextId++, name: name.trim(), email: email.trim().toLowerCase() };
  users.push(user);
  return user;
}

function deleteUser(id) {
  const index = users.findIndex((user) => user.id === Number(id));
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
}

function resetUsersForTests() {
  users.splice(0, users.length,
    { id: 1, name: 'Asha Sharma', email: 'asha@example.com' },
    { id: 2, name: 'Rahul Das', email: 'rahul@example.com' }
  );
  nextId = 3;
}

module.exports = { getAllUsers, getUserById, createUser, deleteUser, resetUsersForTests };
