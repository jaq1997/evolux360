// src/integrations/supabase/client.ts

import { createClient } from '@supabase/supabase-js';
// A única coisa que importa: a conexão com os tipos corretos que consertam o DataContext.
import type { Database } from '../../types/supabase';

const supabaseUrl = "https://qvwtviyqouzprltchtlr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2d3R2aXlxb3V6cHJsdGNodGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDkxODMsImV4cCI6MjEwMDkyNTE4M30.6CEOMM88zC0JcuecOdytbbzJMM-OD0y79j9GK7pWBeM";

// Criando o cliente com a tipagem correta.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);