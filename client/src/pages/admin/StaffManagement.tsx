import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Eye,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  staffService, 
  type Staff, 
  type StaffListResponse, 
  type CreateStaffPayload, 
  type UpdateStaffPayload 
} from '@/services/staffService';
import { AddStaffModal } from '@/components/admin/AddStaffModal';
import { EditStaffModal } from '@/components/admin/EditStaffModal';
import { StaffDetailModal } from '@/components/admin/StaffDetailModal';

const StaffManagement = () => {
  // State management
  const [staffData, setStaffData] = useState<StaffListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch staff data
  const fetchStaffData = async (page = 1, search = '', isActive?: boolean) => {
    try {
      setLoading(true);
      const query = {
        page,
        limit: 10,
        search: search || undefined,
        isActive: isActive,
      };
      
      const response = await staffService.getStaffs(query);
      setStaffData(response);
    } catch (error) {
      toast.error('Failed to fetch staff data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStaffData();
  }, []);

  // Handle search and filter changes
  useEffect(() => {
    const delayedFetch = setTimeout(() => {
      const isActiveFilter = statusFilter === 'active' ? true 
        : statusFilter === 'inactive' ? false 
        : undefined;
      
      fetchStaffData(1, searchTerm, isActiveFilter);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(delayedFetch);
  }, [searchTerm, statusFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const isActiveFilter = statusFilter === 'active' ? true 
      : statusFilter === 'inactive' ? false 
      : undefined;
    fetchStaffData(page, searchTerm, isActiveFilter);
  };

  // Handle create staff
  const handleCreateStaff = async (data: CreateStaffPayload) => {
    try {
      setActionLoading(true);
      await staffService.createStaff(data);
      toast.success('Staff member created successfully');
      setAddModalOpen(false);
      fetchStaffData(currentPage, searchTerm);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create staff member');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle update staff
  const handleUpdateStaff = async (data: UpdateStaffPayload) => {
    if (!selectedStaff) return;
    
    try {
      setActionLoading(true);
      await staffService.updateStaff(selectedStaff._id, data);
      toast.success('Staff member updated successfully');
      setEditModalOpen(false);
      setSelectedStaff(null);
      fetchStaffData(currentPage, searchTerm);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update staff member');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete staff
  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;

    try {
      setActionLoading(true);
      await staffService.deleteStaff(selectedStaff._id);
      toast.success('Staff member deactivated successfully');
      setDeleteDialogOpen(false);
      setSelectedStaff(null);
      fetchStaffData(currentPage, searchTerm);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to deactivate staff member');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle activate staff
  const handleActivateStaff = async (staff: Staff) => {
    try {
      setActionLoading(true);
      await staffService.activateStaff(staff._id);
      toast.success('Staff member activated successfully');
      fetchStaffData(currentPage, searchTerm);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to activate staff member');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: Date | string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate stats
  const totalStaff = staffData?.pagination.totalItems || 0;
  const activeStaff = staffData?.staffs.filter(staff => staff.isActive).length || 0;
  const inactiveStaff = totalStaff - activeStaff;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage staff accounts and permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Staff
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-gray-600">Total staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Staff
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStaff}</div>
            <p className="text-xs text-green-600">
              {totalStaff > 0 ? Math.round((activeStaff / totalStaff) * 100) : 0}% active rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Inactive Staff
            </CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveStaff}</div>
            <p className="text-xs text-red-600">Inactive accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Current Page
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPage}</div>
            <p className="text-xs text-gray-600">
              of {staffData?.pagination.totalPages || 0} pages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Staff</CardTitle>
          <CardDescription>
            Find and filter staff members by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>
                {staffData?.staffs.length || 0} staff members found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading staff data...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffData?.staffs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-8 w-8 text-gray-400" />
                          <p className="text-gray-500">No staff members found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    staffData?.staffs.map((staff) => (
                      <TableRow key={staff._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={staff.avatarUrl || ''} alt={staff.name} />
                              <AvatarFallback>
                                {staff.name.split(' ').map((n) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{staff.name}</p>
                              <p className="text-sm text-gray-600">{staff.email}</p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {staff.role}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge className={getStatusColor(staff.isActive)}>
                            {staff.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">{formatDate(staff.createdAt)}</div>
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">{formatDateTime(staff.lastLogin)}</div>
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  setDetailModalOpen(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  setEditModalOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Staff
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {staff.isActive ? (
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedStaff(staff);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  className="text-green-600"
                                  onClick={() => handleActivateStaff(staff)}
                                  disabled={actionLoading}
                                >
                                  <RotateCcw className="mr-2 h-4 w-4" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {staffData && staffData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * staffData.pagination.itemsPerPage) + 1} to{' '}
                    {Math.min(currentPage * staffData.pagination.itemsPerPage, staffData.pagination.totalItems)} of{' '}
                    {staffData.pagination.totalItems} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {staffData.pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === staffData.pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddStaffModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleCreateStaff}
        isLoading={actionLoading}
      />

      <EditStaffModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedStaff(null);
        }}
        onSubmit={handleUpdateStaff}
        staff={selectedStaff}
        isLoading={actionLoading}
      />

      <StaffDetailModal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {selectedStaff?.name}? 
              This will prevent them from accessing the system, but their account data will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteStaff}
              className="bg-red-600 hover:bg-red-700"
              disabled={actionLoading}
            >
              {actionLoading ? 'Deactivating...' : 'Deactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffManagement;
