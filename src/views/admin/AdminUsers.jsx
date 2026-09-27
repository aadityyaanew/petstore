import { useState, useEffect } from 'react';
import { Users, Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUserAdmin(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
          <Users size={24} />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">Manage Users</h1>
      </div>
      
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Phone Number</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{user._id}</td>
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'admin' ? 'pink' : 'outline'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(user._id)}
                      disabled={user.role === 'admin'}
                      className="p-2 text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:hover:bg-transparent rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
