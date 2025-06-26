import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface BreedEditDialogProps {
  open: boolean;
  onClose: () => void;
  breed: { _id: string; name: string; description?: string; isActive?: boolean } | null;
  onUpdate: (params: { id: string; data: { name: string; description?: string; isActive?: boolean } }) => void;
}

export default function BreedEditDialog({ open, onClose, breed, onUpdate }: BreedEditDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setName(breed?.name || '');
    setDescription(breed?.description || '');
    setIsActive(breed?.isActive ?? true);
  }, [breed]);

  const handleSubmit = () => {
    if (!breed || !name) return;
    onUpdate({ id: breed._id, data: { name, description, isActive } });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Edit Breed</DialogTitle>
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
          <Checkbox id="isActive-edit" checked={isActive} onCheckedChange={v => setIsActive(!!v)} />
          <label htmlFor="isActive-edit" className="text-sm">Active</label>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Button onClick={handleSubmit} disabled={!name}>Save</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 