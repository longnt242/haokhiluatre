import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ContentActionsMenuProps {
  fileName: string;
  bucket: string;
  currentTitle?: string;
  currentDescription?: string;
  onUpdate?: () => void;
}
const API_URL = import.meta.env.VITE_API_URL;

export default function ContentActionsMenu({
  fileName,
  bucket,
  currentTitle = '',
  currentDescription = '',
  onUpdate
}: ContentActionsMenuProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; password: string }) => {
      const response = await fetch(`${API_URL}/api/content/${bucket}/${encodeURIComponent(fileName)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Cập nhật thất bại');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Cập nhật thành công!",
        description: `Đã cập nhật thông tin cho "${fileName}"`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/content', bucket] });
      setEditDialogOpen(false);
      onUpdate?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi cập nhật",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await fetch(`${API_URL}/api/content/${bucket}/${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Xóa thất bại');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Xóa thành công!",
        description: `Đã xóa "${fileName}"`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/content', bucket] });
      setDeleteDialogOpen(false);
      onUpdate?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi xóa file",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    const password = prompt('Nhập mật khẩu để chỉnh sửa:');
    if (!password) {
      toast({
        title: "Lỗi",
        description: "Cần mật khẩu để chỉnh sửa!",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate({ title, description, password });
  };

  const handleDelete = () => {
    const password = prompt('Nhập mật khẩu để xóa:');
    if (!password) {
      toast({
        title: "Lỗi",
        description: "Cần mật khẩu để xóa!",
        variant: "destructive",
      });
      return;
    }

    deleteMutation.mutate(password);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 text-white hover:bg-black/70"
            data-testid="content-actions-menu"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)} data-testid="menu-edit">
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
            data-testid="menu-delete"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Tiêu đề</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề..."
                data-testid="input-edit-title"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả..."
                rows={3}
                data-testid="input-edit-description"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                data-testid="button-cancel-edit"
              >
                Hủy
              </Button>
              <Button
                onClick={handleEdit}
                disabled={updateMutation.isPending}
                data-testid="button-save-edit"
              >
                {updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa "{fileName}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}