
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Post, getPosts, getUserPosts, createPost, updatePost, deletePost } from '@/services/postsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash, Plus } from 'lucide-react';
import SidebarNav from '@/components/SidebarNav';
import UserHeader from '@/components/UserHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Posts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Edit states
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Delete states
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let fetchedPosts: Post[] = [];
      
      if (user) {
        // Get posts for the logged-in user
        fetchedPosts = await getUserPosts(user.id);
      } else {
        // Get all posts if no user is logged in
        fetchedPosts = await getPosts();
      }
      
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      if (!title.trim() || !content.trim()) {
        toast({
          title: 'Error',
          description: 'Title and content cannot be empty',
          variant: 'destructive',
        });
        return;
      }
      
      await createPost({ title, content });
      toast({
        title: 'Success',
        description: 'Post created successfully',
      });
      
      setTitle('');
      setContent('');
      setShowCreateDialog(false);
      
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content || '');
    setShowEditDialog(true);
  };

  const handleUpdatePost = async () => {
    try {
      if (!editingPost || !editingPost.id) return;
      
      if (!editTitle.trim() || !editContent.trim()) {
        toast({
          title: 'Error',
          description: 'Title and content cannot be empty',
          variant: 'destructive',
        });
        return;
      }
      
      await updatePost(editingPost.id, { title: editTitle, content: editContent });
      toast({
        title: 'Success',
        description: 'Post updated successfully',
      });
      
      setShowEditDialog(false);
      setEditingPost(null);
      
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to update post',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClick = (post: Post) => {
    setDeletingPost(post);
    setShowDeleteDialog(true);
  };

  const handleDeletePost = async () => {
    try {
      if (!deletingPost || !deletingPost.id) return;
      
      await deletePost(deletingPost.id);
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
      
      setShowDeleteDialog(false);
      setDeletingPost(null);
      
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  const renderPosts = () => {
    if (loading) {
      return <p>Loading posts...</p>;
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No posts yet</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create a Post
          </Button>
        </div>
      );
    }

    return posts.map((post) => (
      <Card key={post.id} className="mb-4">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            {post.created_at && new Date(post.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{post.content}</p>
        </CardContent>
        {user && user.id === post.user_id && (
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEditClick(post)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleDeleteClick(post)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        )}
      </Card>
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <UserHeader title="Posts" />
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Posts</h1>
            {user && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            )}
          </div>
          
          {renderPosts()}
          
          {/* Create Post Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Post</DialogTitle>
                <DialogDescription>
                  Share your thoughts with the world
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">Content</label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={5}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost}>
                  Create Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Edit Post Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Post</DialogTitle>
                <DialogDescription>
                  Make changes to your post
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="edit-title" className="text-sm font-medium">Title</label>
                  <Input
                    id="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-content" className="text-sm font-medium">Content</label>
                  <Textarea
                    id="edit-content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdatePost}>
                  Update Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Delete Post Dialog */}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeletePost} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default Posts;
