import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

interface UserCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; email: string; password: string; role: string; isActive: boolean }) => void;
}

export default function UserCreateDialog({ open, onClose, onCreate }: UserCreateDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = () => {
    if (!name || !email || !password) return;
    onCreate({ name, email, password, role, isActive });
    setName(''); setEmail(''); setPassword(''); setRole('customer'); setIsActive(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Add New User</DialogTitle>
        <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="mb-2" />
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="mb-2" />
        <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="mb-2" />
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
          <Checkbox id="isActive" checked={isActive} onCheckedChange={v => setIsActive(!!v)} />
          <label htmlFor="isActive" className="text-sm">Active</label>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Button onClick={handleSubmit} disabled={!name || !email || !password}>Add</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 