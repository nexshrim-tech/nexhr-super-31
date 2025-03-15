
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DocumentUpdateDialogProps {
  type: 'aadhar' | 'pan' | null;
  isOpen: boolean;
  onClose: () => void;
  onUpload: (type: 'aadhar' | 'pan') => void;
}

const DocumentUpdateDialog: React.FC<DocumentUpdateDialogProps> = ({
  type,
  isOpen,
  onClose,
  onUpload,
}) => {
  if (!type) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {type === 'aadhar' ? 'Aadhar' : 'PAN'} Card</DialogTitle>
          <DialogDescription>
            Upload a new document to update the existing one
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onUpload(type)}>
              Upload
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUpdateDialog;
