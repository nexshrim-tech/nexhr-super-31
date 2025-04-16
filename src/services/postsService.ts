
import { supabase } from '@/integrations/supabase/client';

export interface Post {
  id: string;
  user_id?: string;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

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

export const createPost = async (title: string, content: string): Promise<Post> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw userError;
    }
    
    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, content, user_id: userData.user.id }])
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

export const updatePost = async (id: string, post: Partial<Omit<Post, 'id' | 'user_id'>>): Promise<Post> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update(post)
      .eq('id', id)
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

export const deletePost = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deletePost:', error);
    throw error;
  }
};
