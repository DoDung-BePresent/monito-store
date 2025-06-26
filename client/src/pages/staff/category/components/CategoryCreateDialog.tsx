import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CategoryCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; description?: string }) => void;
}

export default function CategoryCreateDialog({ open, onClose, onCreate }: CategoryCreateDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name) return;
    onCreate({ name, description });
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Add New Category</DialogTitle>
        <Input
          placeholder="Category name"
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
        <div className="flex gap-2 justify-end mt-4">
          <Button onClick={handleSubmit} disabled={!name}>Add</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 