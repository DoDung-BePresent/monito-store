import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface BreedCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; description?: string; isActive?: boolean }) => void;
}

export default function BreedCreateDialog({ open, onClose, onCreate }: BreedCreateDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = () => {
    if (!name) return;
    onCreate({ name, description, isActive });
    setName('');
    setDescription('');
    setIsActive(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Add New Breed</DialogTitle>
        <Input
          placeholder="Breed name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="mb-2"
        />
        <div className="flex items-center gap-2 mb-2">
          <Checkbox id="isActive" checked={isActive} onCheckedChange={v => setIsActive(!!v)} />
          <label htmlFor="isActive" className="text-sm">Active</label>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Button onClick={handleSubmit} disabled={!name}>Add</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 