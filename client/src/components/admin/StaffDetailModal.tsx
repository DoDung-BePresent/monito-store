import React from 'react';
import { User, Mail, Calendar, Clock, Shield, Activity } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Staff } from '@/services/staffService';

interface StaffDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
}

export const StaffDetailModal: React.FC<StaffDetailModalProps> = ({
  isOpen,
  onClose,
  staff,
}) => {
  if (!staff) return null;

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Staff Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarImage src={staff.avatarUrl || ''} alt={staff.name} />
              <AvatarFallback className="text-lg">
                {staff.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{staff.name}</h3>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <Mail className="h-4 w-4" />
                {staff.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(staff.isActive)}>
                  <Activity className="h-3 w-3 mr-1" />
                  {staff.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="outline">
                  <Shield className="h-3 w-3 mr-1" />
                  {staff.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">
                Basic Information
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Full Name</p>
                    <p className="text-sm text-gray-600">{staff.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Address</p>
                    <p className="text-sm text-gray-600">{staff.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Role</p>
                    <p className="text-sm text-gray-600 capitalize">{staff.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Status</p>
                    <p className="text-sm text-gray-600">
                      {staff.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">
                Account Information
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(staff.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(staff.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Login</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(staff.lastLogin)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ID Information */}
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500 mb-1">Staff ID</p>
            <code className="text-sm font-mono text-gray-700">{staff._id}</code>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
