import { useState } from 'react';
import { Search, Eye, CheckCircle, Ban, AlertTriangle } from 'lucide-react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'Customer',
      status: 'Active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20',
      orders: 12,
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      role: 'Customer',
      status: 'Active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-19',
      orders: 8,
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      role: 'Staff',
      status: 'Active',
      joinDate: '2023-12-01',
      lastLogin: '2024-01-20',
      orders: 0,
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 4,
      name: 'Emily Brown',
      email: 'emily.brown@email.com',
      role: 'Customer',
      status: 'Suspended',
      joinDate: '2024-01-05',
      lastLogin: '2024-01-18',
      orders: 3,
      avatar: '/api/placeholder/40/40',
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || user.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Suspended':
        return <Ban className="h-4 w-4 text-red-600" />;
      case 'Inactive':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage all user accounts in the system</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-2 text-sm font-medium text-gray-600">
            Total Users
          </h3>
          <div className="text-2xl font-bold">2,847</div>
          <p className="text-xs text-green-600">+12% from last month</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-2 text-sm font-medium text-gray-600">
            Active Users
          </h3>
          <div className="text-2xl font-bold">2,456</div>
          <p className="text-xs text-green-600">+8% from last month</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-2 text-sm font-medium text-gray-600">Suspended</h3>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-red-600">+2 this week</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-2 text-sm font-medium text-gray-600">
            New This Month
          </h3>
          <div className="text-2xl font-bold">368</div>
          <p className="text-xs text-green-600">+15% from last month</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Search Users</h3>
          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Filter by Status</h3>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* User List */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">User Accounts</h3>
          <p className="text-gray-600">{filteredUsers.length} users found</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Join Date</th>
                <th className="p-4 text-left">Last Login</th>
                <th className="p-4 text-left">Orders</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        user.role === 'Staff'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(user.status)}
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">{user.joinDate}</td>
                  <td className="p-4">{user.lastLogin}</td>
                  <td className="p-4">{user.orders}</td>
                  <td className="p-4">
                    <button className="rounded border border-gray-300 p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
