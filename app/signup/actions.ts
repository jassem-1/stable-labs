"use server" ;
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signup(email: string, password: string, username: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    redirect('/error')
  } else {
    // Optionally handle user details like username
    await supabase.from('users').insert([{ username, email }]);
    redirect('/')
  }
}
