import { supabase } from './supabase';
import { StoreSettings, InstagramPost } from '../types';
import { DEFAULT_STORE_SETTINGS } from '../utils/adminAuthentication';

export async function getSupabaseStoreSettings(): Promise<StoreSettings> {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching store settings:', error);
    }
    
    if (data) {
      return { ...DEFAULT_STORE_SETTINGS, ...data.settings } as StoreSettings;
    }
  } catch (error) {
    console.error('Error fetching store settings:', error);
  }
  return DEFAULT_STORE_SETTINGS;
}

export async function saveSupabaseStoreSettings(settings: StoreSettings): Promise<void> {
  try {
    const { error } = await supabase
      .from('store_settings')
      .upsert({ id: 'main', settings, updated_at: new Date().toISOString() });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('NoSuchBucket') || error.message?.includes('Bucket not found')) {
        throw new Error('SUPABASE_NOT_CONFIGURED');
      }
      throw error;
    }
  } catch (error) {
    console.error('Error saving store settings:', error);
    throw error;
  }
}

export async function getSupabasePosts(): Promise<InstagramPost[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('NoSuchBucket') || error.message?.includes('Bucket not found')) {
        throw new Error('SUPABASE_NOT_CONFIGURED');
      }
      throw error;
    }
    
    if (data) {
      return data.map(d => ({ ...d.post_data, id: d.id } as InstagramPost));
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
  return [];
}

export async function saveSupabasePost(post: InstagramPost): Promise<void> {
  try {
    const { error } = await supabase
      .from('posts')
      .upsert({ id: post.id, post_data: post, created_at: post.createdAt || new Date().toISOString() });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('NoSuchBucket') || error.message?.includes('Bucket not found')) {
        throw new Error('SUPABASE_NOT_CONFIGURED');
      }
      throw error;
    }
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  }
}

export async function deleteSupabasePost(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('NoSuchBucket') || error.message?.includes('Bucket not found')) {
        throw new Error('SUPABASE_NOT_CONFIGURED');
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

export async function uploadMediaToSupabase(postId: string, file: File): Promise<string> {
  try {
    const ext = file.name ? file.name.split('.').pop() : (file.type === 'video/mp4' ? 'mp4' : 'jpg');
    const filePath = `${postId}_${Date.now()}.${ext}`;
    
    const { error } = await supabase.storage
      .from('media')
      .upload(filePath, file, { upsert: true });
      
    if (error && (error.message?.includes('Bucket not found') || error.name === 'StorageApiError')) {
       throw new Error('SUPABASE_NOT_CONFIGURED');
    }

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('NoSuchBucket') || error.message?.includes('Bucket not found')) {
        throw new Error('SUPABASE_NOT_CONFIGURED');
      }
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
}
