import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

interface UserEditDialogProps {
  open: boolean;
  onClose: () => void;
  user: { _id: string; name: string; email: string; role: string; isActive: boolean } | null;
  onUpdate: (params: { id: string; data: { name: string; email: string; role: string; isActive: boolean } }) => void;
}

export default function UserEditDialog({ open, onClose, user, onUpdate }: UserEditDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('customer');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setRole(user?.role || 'customer');
    setIsActive(user?.isActive ?? true);
  }, [user]);

  const handleSubmit = () => {
    if (!user || !name || !email) return;
    onUpdate({ id: user._id, data: { name, email, role, isActive } });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Edit User</DialogTitle>
        <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="mb-2" />
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="mb-2" />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="mb-2">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 mb-2">
          <Checkbox id="isActive-edit" checked={isActive} onCheckedChange={v => setIsActive(!!v)} />
          <label htmlFor="isActive-edit" className="text-sm">Active</label>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Button onClick={handleSubmit} disabled={!name || !email}>Save</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 