import { useEffect, useState } from 'react';
import {
  Users,
  Activity,
  Server,
  TrendingUp,
  TrendingDown,
  Database,
  ArrowUpRight,
  BarChart3,
  PieChart,
  type LucideIcon,
  DollarSign,
  Ban,
  Eye,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllSummary, getBussinessMetric, getUserStatistics } from '@/services/adminService';
import { SkeletonSection } from '../common/SkeletonSection';
import UserStatsChart from './components/UserStatsChart';
type SystemStat = {
  name: string;
  value: string;
  change: string;
  trend: "up" | "down";
  color: string;
  bgColor: string;
};
type BusinessMetric = {
  name: string;
  value: string;
  change: string;
  trend: "up" | "down";
}
type UserStat = {
  label: string;
  value: number;
  color: string;
};
const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [systemStats, setSystemStats] = useState<SystemStat[]>([]);
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetric[]>([]);
  const [userStats, setUserStats] = useState<UserStat[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const iconMap: Record<string, LucideIcon> = {
    "Total Users": Users,
    "Active Staff": Activity,
    "Total Revenue": DollarSign,
    "System Uptime": Server,
  };
  useEffect(() => {
    const daysMap: Record<string, number> = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const days = daysMap[timeRange];
        const [summary, metrics, userStats] = await Promise.all([
          getAllSummary(days),
          getBussinessMetric(days),
          getUserStatistics(),
        ]);
        setSystemStats(summary);
        setBusinessMetrics(metrics);
        setUserStats(userStats)
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'System Settings',
      description: 'Configure system parameters',
      icon: Server,
      href: '/admin/settings',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'View Reports',
      description: 'Generate and view reports',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Database Status',
      description: 'Monitor database health',
      icon: Database,
      href: '/admin/database',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            System overview and administrative controls
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
              <TabsTrigger value="90d">90d</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button>
            <Eye className="mr-2 h-4 w-4" />
            View All Reports
          </Button>
        </div>
      </div>

      {!isLoading ? (
        <>
          {/* Key System Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {systemStats.map((stat) => {
              const Icon = iconMap[stat.name] ?? Ban;
              return (
                <Card key={stat.name} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </CardTitle>
                    <div className={`rounded-full p-2 ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="mt-1 flex items-center text-xs text-gray-600">
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
                      from last period
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <UserStatsChart />
          {/* Business Metrics + User Statistics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Business Metrics */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Business Metrics
                  </CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {businessMetrics.map((metric, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                      >
                        <div>
                          <p className="font-medium">{metric.name}</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {metric.value}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`flex items-center text-sm font-medium ${metric.trend === 'up'
                              ? 'text-green-600'
                              : 'text-red-600'
                              }`}
                          >
                            {metric.trend === 'up' ? (
                              <TrendingUp className="mr-1 h-3 w-3" />
                            ) : (
                              <TrendingDown className="mr-1 h-3 w-3" />
                            )}
                            {metric.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Statistics
                </CardTitle>
                <CardDescription>Current user activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{stat.label}</span>
                        <span className="font-bold">
                          {stat.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${stat.color}`}
                          style={{ width: `${(stat.value / 1500) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto justify-start p-4 hover:border-red-200 hover:bg-red-50"
                      asChild
                    >
                      <a href={action.href}>
                        <div className={`rounded-lg p-2 ${action.bgColor} mr-3`}>
                          <Icon className={`h-5 w-5 ${action.color}`} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{action.title}</p>
                          <p className="text-sm text-gray-600">
                            {action.description}
                          </p>
                        </div>
                        <ArrowUpRight className="ml-auto h-4 w-4 text-gray-400" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <SkeletonSection />
      )}
    </div>
  );
};

export default AdminDashboard;
