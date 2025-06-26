import React, { useState, useEffect } from 'react';
import { User, Mail, Image } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Staff, UpdateStaffPayload } from '@/services/staffService';

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateStaffPayload) => Promise<void>;
  staff: Staff | null;
  isLoading?: boolean;
}

export const EditStaffModal: React.FC<EditStaffModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  staff,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UpdateStaffPayload>({
    name: '',
    email: '',
    avatarUrl: null,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        avatarUrl: staff.avatarUrl,
        isActive: staff.isActive,
      });
    }
  }, [staff]);

  const handleInputChange = (field: keyof UpdateStaffPayload, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as string]) {
      setErrors({ ...errors, [field as string]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      setErrors({});
    } catch (error) {
      console.error('Failed to update staff:', error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!staff) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Staff Member
          </DialogTitle>
          <DialogDescription>
            Update staff member information and account status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="edit-name"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Avatar URL Field */}
            <div className="space-y-2">
              <Label htmlFor="edit-avatarUrl">Avatar URL (Optional)</Label>
              <div className="relative">
                <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="edit-avatarUrl"
                  type="url"
                  placeholder="Enter avatar image URL"
                  value={formData.avatarUrl || ''}
                  onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="space-y-2">
              <Label htmlFor="edit-isActive">Account Status</Label>
              <Select
                value={formData.isActive ? 'active' : 'inactive'}
                onValueChange={(value) => handleInputChange('isActive', value === 'active')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Staff'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
