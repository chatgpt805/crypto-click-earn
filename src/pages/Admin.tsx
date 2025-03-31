
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { addTask, getUsers, getTasks, getWithdrawals, updateWithdrawalStatus } from "@/lib/api";
import { User, PTCTask, WithdrawalRequest } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<PTCTask[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  
  const [taskLink, setTaskLink] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPrice, setTaskPrice] = useState('');
  const [taskCrypto, setTaskCrypto] = useState<'pepe' | 'dash' | 'ltc'>('pepe');
  
  const fetchData = async () => {
    const [usersData, tasksData, withdrawalsData] = await Promise.all([
      getUsers(),
      getTasks(),
      getWithdrawals(),
    ]);
    
    setUsers(usersData);
    setTasks(tasksData);
    setWithdrawals(withdrawalsData);
  };
  
  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }
    
    fetchData();
  }, [isAdmin, navigate]);
  
  const handleAddTask = async () => {
    if (!taskLink || !taskDescription || !taskPrice) return;
    
    const newTask = {
      task_link: taskLink,
      description: taskDescription,
      price: parseFloat(taskPrice),
      status: 'pending',
      crypto_type: taskCrypto,
    } as Omit<PTCTask, 'id'>;
    
    const success = await addTask(newTask);
    if (success) {
      setTaskLink('');
      setTaskDescription('');
      setTaskPrice('');
      fetchData();
    }
  };
  
  const handleWithdrawalStatus = async (id: string, status: 'approved' | 'rejected') => {
    const success = await updateWithdrawalStatus(id, status);
    if (success) {
      fetchData();
    }
  };
  
  if (!isAdmin) return null;
  
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        
        <Tabs defaultValue="tasks">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="tasks">PTC Tasks</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Tasks Management</h2>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add New Task</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New PTC Task</DialogTitle>
                    <DialogDescription>
                      Add a new task for users to complete
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="task-link">Task Link</Label>
                      <Input
                        id="task-link"
                        placeholder="https://example.com/task"
                        value={taskLink}
                        onChange={(e) => setTaskLink(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="task-description">Description</Label>
                      <Textarea
                        id="task-description"
                        placeholder="Describe what the user needs to do"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="task-price">Reward Amount</Label>
                        <Input
                          id="task-price"
                          type="number"
                          placeholder="0.000000"
                          step="0.000001"
                          min="0"
                          value={taskPrice}
                          onChange={(e) => setTaskPrice(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="task-crypto">Crypto Type</Label>
                        <Select 
                          value={taskCrypto} 
                          onValueChange={(value) => setTaskCrypto(value as 'pepe' | 'dash' | 'ltc')}
                        >
                          <SelectTrigger id="task-crypto">
                            <SelectValue placeholder="Select crypto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pepe">PEPE</SelectItem>
                            <SelectItem value="dash">DASH</SelectItem>
                            <SelectItem value="ltc">LTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      onClick={handleAddTask}
                      disabled={!taskLink || !taskDescription || !taskPrice}
                    >
                      Create Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{task.description}</CardTitle>
                      <Badge>{task.crypto_type.toUpperCase()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground break-all">
                        <span className="font-semibold">Link:</span> {task.task_link}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Reward:</span>{' '}
                        <span className="font-bold">{task.price.toFixed(6)} {task.crypto_type.toUpperCase()}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="withdrawals" className="space-y-6">
            <h2 className="text-2xl font-semibold">Withdrawal Requests</h2>
            
            <div className="grid grid-cols-1 gap-4">
              {withdrawals.length > 0 ? (
                withdrawals.map((withdrawal) => (
                  <Card key={withdrawal.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {withdrawal.amount.toFixed(6)} {withdrawal.crypto_type.toUpperCase()}
                        </CardTitle>
                        <Badge 
                          variant={
                            withdrawal.status === 'approved' 
                              ? 'default' 
                              : withdrawal.status === 'rejected'
                              ? 'destructive'
                              : 'outline'
                          }
                        >
                          {withdrawal.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid gap-1">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">User ID:</span> {withdrawal.user_id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">FaucetPay Email:</span> {withdrawal.faucetpay_email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">Date:</span> {new Date(withdrawal.created_at).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="border rounded p-3">
                          <p className="text-sm font-semibold mb-1">Proof:</p>
                          <p className="text-sm break-words">{withdrawal.task_proof}</p>
                        </div>
                        
                        {withdrawal.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              variant="default" 
                              className="flex-1"
                              onClick={() => handleWithdrawalStatus(withdrawal.id, 'approved')}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              className="flex-1"
                              onClick={() => handleWithdrawalStatus(withdrawal.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-6">
                    <p className="text-center text-muted-foreground">No withdrawal requests yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-semibold">User Management</h2>
            
            <div className="grid grid-cols-1 gap-4">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{user.email}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-1">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">User ID:</span> {user.id}
                        </p>
                        {user.faucetpay_email && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">FaucetPay Email:</span> {user.faucetpay_email}
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 border rounded">
                          <p className="text-sm font-semibold">PEPE Balance</p>
                          <p className="text-pepe font-bold">{user.crypto_balance_pepe.toFixed(6)}</p>
                        </div>
                        <div className="p-3 border rounded">
                          <p className="text-sm font-semibold">DASH Balance</p>
                          <p className="text-dash font-bold">{user.crypto_balance_dash.toFixed(6)}</p>
                        </div>
                        <div className="p-3 border rounded">
                          <p className="text-sm font-semibold">LTC Balance</p>
                          <p className="text-ltc font-bold">{user.crypto_balance_ltc.toFixed(6)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
