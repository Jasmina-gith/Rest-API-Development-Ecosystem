import { supabase } from '../supabaseClient';

// Global activity logging utility
export const logAction = async (type, description) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // No user, skip logging

    const { error } = await supabase.from('activity_logs').insert({
      user_id: user.id,
      action_type: type,
      description: description,
    });

    if (error) {
      console.error('Failed to log activity:', error);
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
