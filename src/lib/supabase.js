import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getDailyActivity = async (userId, date) => {
  const { data, error } = await supabase
    .from('daily_activity')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export const upsertDailyActivity = async (activity) => {
  const { data, error } = await supabase
    .from('daily_activity')
    .upsert(activity, { onConflict: 'user_id,date' })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getFriends = async (userId) => {
  const { data, error } = await supabase
    .from('friends')
    .select(`
      friend_user_id,
      users:friend_user_id (id, username, total_points, streak, level)
    `)
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}

export const addFriend = async (userId, friendCode) => {
  const { data: friend, error: friendError } = await supabase
    .from('users')
    .select('id')
    .eq('invite_code', friendCode)
    .single()
  
  if (friendError) throw new Error('Invalid invite code')
  
  const { data, error } = await supabase
    .from('friends')
    .insert([
      { user_id: userId, friend_user_id: friend.id },
      { user_id: friend.id, friend_user_id: userId }
    ])
    .select()
  
  if (error) throw error
  return data
}

export const getLeaderboard = async (userId) => {
  const { data: friends, error: friendsError } = await supabase
    .from('friends')
    .select('friend_user_id')
    .eq('user_id', userId)
  
  if (friendsError) throw friendsError
  
  const friendIds = friends.map(f => f.friend_user_id)
  friendIds.push(userId)
  
  const { data, error } = await supabase
    .from('users')
    .select('id, username, total_points, streak, level')
    .in('id', friendIds)
    .order('total_points', { ascending: false })
  
  if (error) throw error
  return data
}