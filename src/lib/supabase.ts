
import { createClient } from '@supabase/supabase-js';

// Public keys are safe to be in the client
const supabaseUrl = 'https://project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our Supabase tables
export type User = {
  id: string;
  email: string;
  crypto_balance_pepe: number;
  crypto_balance_dash: number;
  crypto_balance_ltc: number;
  faucetpay_email: string | null;
  is_admin: boolean;
};

export type PTCTask = {
  id: string;
  task_link: string;
  description: string;
  price: number;
  status: 'pending' | 'completed';
  crypto_type: 'pepe' | 'dash' | 'ltc';
};

export type WithdrawalRequest = {
  id: string;
  user_id: string;
  faucetpay_email: string;
  task_proof: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  created_at: string;
  crypto_type: 'pepe' | 'dash' | 'ltc';
};

// When the actual Supabase is connected, we'll remove this placeholder
export const mockData = {
  tasks: [
    {
      id: '1',
      task_link: 'https://example.com/task1',
      description: 'Visit this site and click on the ad banner',
      price: 0.001,
      status: 'pending',
      crypto_type: 'pepe',
    },
    {
      id: '2',
      task_link: 'https://example.com/task2',
      description: 'Watch a 30-second video and take a screenshot',
      price: 0.0005,
      status: 'pending',
      crypto_type: 'dash',
    },
    {
      id: '3',
      task_link: 'https://example.com/task3',
      description: 'Fill out a short survey about cryptocurrency',
      price: 0.0002,
      status: 'pending',
      crypto_type: 'ltc',
    },
  ] as PTCTask[],
  withdrawals: [] as WithdrawalRequest[],
  user: {
    id: '1',
    email: 'user@example.com',
    crypto_balance_pepe: 0.0025,
    crypto_balance_dash: 0.0015,
    crypto_balance_ltc: 0.0010,
    faucetpay_email: 'user@faucetpay.io',
    is_admin: false,
  } as User,
};
