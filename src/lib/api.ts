
import { supabase, mockData, PTCTask, WithdrawalRequest, User } from './supabase';
import { toast } from '@/hooks/use-toast';

// Tasks API
export const getTasks = async (): Promise<PTCTask[]> => {
  // In production, this would fetch from Supabase
  // const { data, error } = await supabase.from('ptc_tasks').select('*');
  return mockData.tasks;
};

export const completeTask = async (taskId: string, proof: string): Promise<boolean> => {
  try {
    // In production, this would update Supabase and create a record
    console.log(`Task ${taskId} completed with proof: ${proof}`);
    toast({
      title: "Task completed",
      description: "Your task has been submitted for review",
    });
    return true;
  } catch (error) {
    console.error("Error completing task:", error);
    toast({
      title: "Error",
      description: "Failed to complete task",
      variant: "destructive",
    });
    return false;
  }
};

// Withdrawals API
export const requestWithdrawal = async (
  amount: number, 
  cryptoType: 'pepe' | 'dash' | 'ltc', 
  faucetpayEmail: string, 
  proof: string
): Promise<boolean> => {
  try {
    // In production, this would insert into Supabase
    console.log(`Withdrawal request: ${amount} ${cryptoType} to ${faucetpayEmail}`);
    
    // Add to mock data for demo
    mockData.withdrawals.push({
      id: Math.random().toString(36).substring(7),
      user_id: mockData.user.id,
      faucetpay_email: faucetpayEmail,
      task_proof: proof,
      status: 'pending',
      amount: amount,
      created_at: new Date().toISOString(),
      crypto_type: cryptoType,
    });
    
    toast({
      title: "Withdrawal requested",
      description: "Your withdrawal request has been submitted",
    });
    return true;
  } catch (error) {
    console.error("Error requesting withdrawal:", error);
    toast({
      title: "Error",
      description: "Failed to request withdrawal",
      variant: "destructive",
    });
    return false;
  }
};

export const getWithdrawals = async (): Promise<WithdrawalRequest[]> => {
  // In production, this would fetch from Supabase
  return mockData.withdrawals;
};

// Admin API
export const addTask = async (task: Omit<PTCTask, 'id'>): Promise<boolean> => {
  try {
    // In production, this would insert into Supabase
    const newTask = {
      ...task,
      id: Math.random().toString(36).substring(7),
    };
    mockData.tasks.push(newTask as PTCTask);
    toast({
      title: "Task added",
      description: "New task has been added successfully",
    });
    return true;
  } catch (error) {
    console.error("Error adding task:", error);
    toast({
      title: "Error",
      description: "Failed to add task",
      variant: "destructive",
    });
    return false;
  }
};

export const updateWithdrawalStatus = async (
  withdrawalId: string, 
  status: 'approved' | 'rejected'
): Promise<boolean> => {
  try {
    // In production, this would update Supabase
    const withdrawal = mockData.withdrawals.find(w => w.id === withdrawalId);
    if (withdrawal) {
      withdrawal.status = status;
      
      if (status === 'approved') {
        // Update user balance
        const cryptoField = `crypto_balance_${withdrawal.crypto_type}` as keyof User;
        if (typeof mockData.user[cryptoField] === 'number') {
          (mockData.user[cryptoField] as number) -= withdrawal.amount;
        }
      }
    }
    
    toast({
      title: `Withdrawal ${status}`,
      description: `The withdrawal request has been ${status}`,
    });
    return true;
  } catch (error) {
    console.error("Error updating withdrawal status:", error);
    toast({
      title: "Error",
      description: "Failed to update withdrawal status",
      variant: "destructive",
    });
    return false;
  }
};

export const getUsers = async (): Promise<User[]> => {
  // In production, this would fetch from Supabase
  return [mockData.user];
};
