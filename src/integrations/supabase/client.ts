// src/integrations/supabase/client.ts

import { createClient } from '@supabase/supabase-js';
// A única coisa que importa: a conexão com os tipos corretos que consertam o DataContext.
import type { Database } from '../../types/supabase';

const supabaseUrl = "https://szpkqmejukrjeablpwjn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cGtxbWVqdWtyamVhYmxwd2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjAxNTIsImV4cCI6MjA2NTU5NjE1Mn0.ut0nqTX85FA7R4wLssOOiiBpPgwPT91vI0UatYy719o";

// Criando o cliente com a tipagem correta.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);