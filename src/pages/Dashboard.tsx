
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import CryptoBalanceCard from "@/components/CryptoBalanceCard";
import WithdrawalForm from "@/components/WithdrawalForm";
import { useAuth } from "@/contexts/AuthContext";
import { getWithdrawals } from "@/lib/api";
import { WithdrawalRequest } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  
  const fetchWithdrawals = async () => {
    const data = await getWithdrawals();
    setWithdrawals(data);
  };
  
  useEffect(() => {
    fetchWithdrawals();
  }, []);
  
  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CryptoBalanceCard type="pepe" balance={user.crypto_balance_pepe} />
          <CryptoBalanceCard type="dash" balance={user.crypto_balance_dash} />
          <CryptoBalanceCard type="ltc" balance={user.crypto_balance_ltc} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Withdrawal Requests</h2>
            {withdrawals.length > 0 ? (
              <div className="space-y-4">
                {withdrawals.map((withdrawal) => (
                  <Card key={withdrawal.id}>
                    <CardHeader className="pb-2">
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
                      <CardDescription>
                        {new Date(withdrawal.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        To: {withdrawal.faucetpay_email}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-4">
                  <p className="text-center text-muted-foreground">
                    No withdrawal requests yet
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Request Withdrawal</h2>
            <WithdrawalForm user={user} onWithdraw={fetchWithdrawals} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
