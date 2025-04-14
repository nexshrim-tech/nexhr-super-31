import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SidebarNav from "@/components/SidebarNav";
import UserHeader from "@/components/UserHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Plus, Trash2, RefreshCw, MessageSquare, Sparkles } from "lucide-react";
import { getPosts, getUserPosts, createPost, updatePost, deletePost, Post } from "@/services/postsService";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
});

type PostFormValues = z.infer<typeof formSchema>;

const PostForm = ({ onSubmit, initialData, buttonText }: { 
  onSubmit: (data: PostFormValues) => void; 
  initialData?: Post;
  buttonText: string;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestionTopic, setSuggestionTopic] = useState<string>("technology");
  const { toast } = useToast();
  
  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
    },
  });

  const generateSuggestion = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-post-suggestion', {
        body: { topic: suggestionTopic },
      });
      
      if (error) throw error;
      
      if (data && data.suggestion) {
        form.setValue('title', data.suggestion.title);
        form.setValue('content', data.suggestion.content);
        toast({
          title: "Suggestion generated",
          description: "Post content has been filled with a suggestion",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error generating suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to generate suggestion",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-between items-center">
          <FormLabel>Title</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                disabled={isGenerating}
              >
                <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : 'text-yellow-500'}`} />
                Get Suggestions
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Generate post suggestion</h4>
                <div className="space-y-2">
                  <FormLabel>Topic</FormLabel>
                  <Select
                    value={suggestionTopic}
                    onValueChange={setSuggestionTopic}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="work-life">Work-Life Balance</SelectItem>
                      <SelectItem value="productivity">Productivity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="button" 
                  className="w-full"
                  onClick={generateSuggestion}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your post content here..." 
                  className="min-h-[150px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {buttonText}
        </Button>
      </form>
    </Form>
  );
};

interface PostItemProps {
  post: Post;
  onUpdate: (postId: number, updatedPost: Post) => void;
  onDelete: (postId: number) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onUpdate, onDelete }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async (data: PostFormValues) => {
    try {
      await updatePost(post.postid!, data.title, data.content);
      onUpdate(post.postid!, { ...post, title: data.title, content: data.content });
      toast({
        title: "Post updated",
        description: "The post has been updated successfully",
      });
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Update failed",
        description: "Failed to update the post",
        variant: "destructive",
      });
    } finally {
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.postid!);
      onDelete(post.postid!);
      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the post",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>Created at: {new Date(post.created_at!).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button size="sm" onClick={() => setIsEditDialogOpen(true)} variant="secondary">
          <Edit2 className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your post from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>

      {/* Edit Dialog */}
      <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Post</AlertDialogTitle>
            <AlertDialogDescription>
              Edit your post details here. Click save when you're done.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <PostForm
            onSubmit={handleUpdate}
            initialData={post}
            buttonText="Update Post"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsEditDialogOpen(false)}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchPosts();
  }, [user, activeTab]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let fetchedPosts: Post[];
      if (activeTab === "mine" && user) {
        fetchedPosts = await getUserPosts(user.id);
      } else {
        fetchedPosts = await getPosts();
      }
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error fetching posts",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: PostFormValues) => {
    try {
      if (!user) throw new Error("User not authenticated");
      const newPost = await createPost(data.title, data.content, user.id);
      setPosts([newPost, ...posts]);
      toast({
        title: "Post created",
        description: "Your post has been created successfully",
      });
    } catch (error) {
      console.error("Create error:", error);
      toast({
        title: "Creation failed",
        description: "Failed to create the post",
        variant: "destructive",
      });
    } finally {
      setIsCreateDialogOpen(false);
    }
  };

  const handleUpdate = (postId: number, updatedPost: Post) => {
    setPosts(posts.map(post => (post.postid === postId ? updatedPost : post)));
  };

  const handleDelete = (postId: number) => {
    setPosts(posts.filter(post => post.postid !== postId));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader title="Posts" />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Posts</h1>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="mine">My Posts</TabsTrigger>
              </TabsList>
              <Separator className="my-4" />
              <TabsContent value="all">
                {loading ? (
                  <p>Loading posts...</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {posts.map(post => (
                      <PostItem
                        key={post.postid}
                        post={post}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="mine">
                {loading ? (
                  <p>Loading posts...</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {posts.map(post => (
                      <PostItem
                        key={post.postid}
                        post={post}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Create Post Dialog */}
            <AlertDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Create New Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter the title and content for your new post.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <PostForm
                  onSubmit={handleCreate}
                  buttonText="Create Post"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsCreateDialogOpen(false)}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Posts;
