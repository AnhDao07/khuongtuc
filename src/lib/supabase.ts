import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Check your environment variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type EventStatus = 'active' | 'closed';

export interface StoryEvent {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  timestamp: string;
  status: EventStatus;
  created_at: string;
}

export interface StoryLegend {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  updated_at: string;
}

export interface StoryCharacter {
  id: string;
  name: string;
  bio: string;
  image_url?: string;
  role: string;
  is_traitor?: boolean;
  created_at: string;
}
