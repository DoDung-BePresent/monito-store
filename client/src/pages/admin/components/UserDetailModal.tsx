import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Calendar } from 'lucide-react';
import type { UserResponse } from '@/services/userService';

type Props = {
  open: boolean;
  onClose: () => void;
  user: UserResponse | null;
};

const UserDetailModal = ({ open, onClose, user }: Props) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Detailed information about this user</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              {user.name?.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            {user.email}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            {user.phone || 'N/A'}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            Joined: {user.joinDate ? new Date(user.joinDate).toLocaleDateString('vi-VN') : 'N/A'}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            Last Login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN') : 'N/A'}
          </div>
          <div>
            Role: <span className="capitalize font-medium">{user.role}</span>
          </div>
          <div>
            Status:{' '}
            <span className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {user.isActive ? 'Active' : 'Suspended'}
            </span>
          </div>
          <div>Orders: {user.orders ?? 0}</div>
          <div>Total Spent: ${user.totalSpent?.toFixed(2) ?? '0.00'}</div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
