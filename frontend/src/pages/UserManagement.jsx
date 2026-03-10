import React, { useEffect, useState } from "react";
import api from "../utils/api";

const UserManagement = () => {

    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        department: "",
        role: "Change Requester"
    });

    const fetchUsers = async () => {
        const res = await api.get("/users");
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();

        await api.post("/users/create", form);

        alert("User created successfully");

        setForm({
            username: "",
            email: "",
            password: "",
            department: "",
            role: "Change Requester"
        });

        fetchUsers();
    };

    return (
        <div className="space-y-8">

            <h1 className="text-2xl font-bold">User Management</h1>

            <form
                onSubmit={handleCreateUser}
                className="bg-white p-6 rounded-xl shadow space-y-3"
            >

                <input
                    className="border p-2 w-full"
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                />

                <input
                    className="border p-2 w-full"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                    type="password"
                    className="border p-2 w-full"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <input
                    className="border p-2 w-full"
                    placeholder="Department"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                />

                <select
                    className="border p-2 w-full"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                    <option>Change Requester</option>
                    <option>Change Reviewer</option>
                    <option>InfoSec</option>
                    <option>Change Approver</option>
                    <option>Implementation Team</option>
                    <option>Admin</option>
                </select>

                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create User
                </button>

            </form>

            <div className="bg-white p-6 rounded-xl shadow">

                <h2 className="font-semibold mb-4">Existing Users</h2>

                <table className="w-full">

                    <thead>

                        <tr className="border-b">
                            <th className="text-left">Username</th>
                            <th className="text-left">Email</th>
                            <th className="text-left">Role</th>
                        </tr>

                    </thead>

                    <tbody>

                        {users.map((u) => (
                            <tr key={u.id} className="border-b">

                                <td>{u.username}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default UserManagement;