import React, { useState } from "react";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddUser = (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("Please enter both name and email.");
      return;
    }

    if (editingIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editingIndex] = { id: editingIndex + 1, name, email };
      setUsers(updatedUsers);
      setEditingIndex(null);
    } else {
      const newUser = {
        id: users.length + 1,
        name,
        email,
      };
      setUsers([...users, newUser]);
    }

    setName("");
    setEmail("");
  };

  const handleEdit = (index) => {
    const user = users[index];
    setName(user.name);
    setEmail(user.email);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  return (
    <div className="w-full min-h-screen bg-primary text-white p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        User Dashboard
      </h1>

      {/* Form */}
      <form
        onSubmit={handleAddUser}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
      >
        <input
          type="text"
          placeholder="Name"
          className="p-2 rounded bg-gray-800 text-white placeholder-gray-400 w-full sm:w-64"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded bg-gray-800 text-white placeholder-gray-400 w-full sm:w-64"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded font-bold w-full sm:w-auto"
        >
          {editingIndex !== null ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-gray-800 text-left text-sm sm:text-base">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  No users yet. Add one above.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
