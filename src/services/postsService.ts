
import { supabase } from '@/integrations/supabase/client';
import { Post } from '@/types/post';

export const getPosts = async (): Promise<Post[]> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }

    return data as Post[] || [];
  } catch (error) {
    console.error('Error in getPosts:', error);
    throw error;
  }
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }

    return data as Post[] || [];
  } catch (error) {
    console.error('Error in getUserPosts:', error);
    throw error;
  }
};

export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post by ID:', error);
      throw error;
    }

    return data as Post;
  } catch (error) {
    console.error('Error in getPostById:', error);
    throw error;
  }
};

export const createPost = async (title: string, content: string, userId: string): Promise<Post> => {
  try {
    const post = { title, content, user_id: userId };
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select();

    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }

    return data[0] as Post;
  } catch (error) {
    console.error('Error in createPost:', error);
    throw error;
  }
};

export const updatePost = async (postId: number, title: string, content: string): Promise<Post> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update({ title, content })
      .eq('postid', postId)
      .select();

    if (error) {
      console.error('Error updating post:', error);
      throw error;
    }

    return data[0] as Post;
  } catch (error) {
    console.error('Error in updatePost:', error);
    throw error;
  }
};

export const deletePost = async (postId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('postid', postId);

    if (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deletePost:', error);
    throw error;
  }
};
