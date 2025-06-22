import {
  Users,
  Activity,
  DollarSign,
  Server,
  TrendingUp,
  TrendingDown,
  Database
} from 'lucide-react';

const AdminDashboard = () => {
  const systemStats = [
    {
      name: 'Total Users',
      value: '2,847',
      icon: Users,
      change: '+12%',
      trend: 'up',
    },
    {
      name: 'Active Staff',
      value: '23',
      icon: Activity,
      change: '+2',
      trend: 'up',
    },
    {
      name: 'Total Revenue',
      value: '$45,231',
      icon: DollarSign,
      change: '+18%',
      trend: 'up',
    },
    {
      name: 'System Uptime',
      value: '99.9%',
      icon: Server,
      change: '0.1%',
      trend: 'down',
    },
  ];

  const businessMetrics = [
    { name: 'Products', value: '1,234', change: '+5.2%' },
    { name: 'Pets Registered', value: '567', change: '+8.1%' },
    { name: 'Orders Today', value: '89', change: '-2.3%' },
    { name: 'Customer Satisfaction', value: '4.8/5', change: '+0.2' },
  ];

  const recentActivity = [
    {
      action: 'New staff member added',
      user: 'John Admin',
      time: '2 minutes ago',
      type: 'staff',
    },
    {
      action: 'User account suspended',
      user: 'Sarah Admin',
      time: '15 minutes ago',
      type: 'user',
    },
    {
      action: 'System backup completed',
      user: 'System',
      time: '1 hour ago',
      type: 'system',
    },
    {
      action: 'Database optimization',
      user: 'System',
      time: '3 hours ago',
      type: 'system',
    },
  ];

  const systemHealth = [
    {
      component: 'Database',
      status: 'Healthy',
      uptime: '99.9%',
      color: 'green',
    },
    {
      component: 'API Server',
      status: 'Healthy',
      uptime: '99.8%',
      color: 'green',
    },
    {
      component: 'File Storage',
      status: 'Warning',
      uptime: '98.5%',
      color: 'yellow',
    },
    {
      component: 'Email Service',
      status: 'Healthy',
      uptime: '99.7%',
      color: 'green',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          System overview and administrative controls
        </p>
      </div>

      {/* Key System Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">
                  {stat.name}
                </h3>
                <Icon className="h-4 w-4 text-gray-400" />
              </div>
              <div className="mb-2 text-2xl font-bold">{stat.value}</div>
              <p className="flex items-center text-xs text-gray-600">
                {stat.trend === 'up' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span
                  className={
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {stat.change}
                </span>{' '}
                from last month
              </p>
            </div>
          );
        })}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Business Metrics */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b p-6">
            <h3 className="text-lg font-semibold">Business Metrics</h3>
            <p className="text-gray-600">Key performance indicators</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {businessMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium">{metric.name}</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {metric.value}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium ${
                        metric.change.startsWith('+')
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b p-6">
            <h3 className="text-lg font-semibold">System Health</h3>
            <p className="text-gray-600">Infrastructure status monitoring</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {systemHealth.map((system, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{system.component}</p>
                      <p className="text-sm text-gray-600">
                        Uptime: {system.uptime}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      system.color === 'green'
                        ? 'bg-green-100 text-green-800'
                        : system.color === 'yellow'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {system.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="text-gray-600">
            Latest administrative actions and system events
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 rounded-lg p-3 hover:bg-gray-50"
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    activity.type === 'staff'
                      ? 'bg-blue-500'
                      : activity.type === 'user'
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">by {activity.user}</p>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
