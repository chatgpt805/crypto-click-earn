
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { requestWithdrawal } from "@/lib/api";
import { User } from "@/lib/supabase";
import { useState } from "react";

interface WithdrawalFormProps {
  user: User;
  onWithdraw: () => void;
}

const WithdrawalForm = ({ user, onWithdraw }: WithdrawalFormProps) => {
  const [amount, setAmount] = useState('');
  const [cryptoType, setCryptoType] = useState<'pepe' | 'dash' | 'ltc'>('pepe');
  const [faucetpayEmail, setFaucetpayEmail] = useState(user.faucetpay_email || '');
  const [proof, setProof] = useState('');
  const [loading, setLoading] = useState(false);

  const getMaxBalance = () => {
    switch (cryptoType) {
      case 'pepe':
        return user.crypto_balance_pepe;
      case 'dash':
        return user.crypto_balance_dash;
      case 'ltc':
        return user.crypto_balance_ltc;
      default:
        return 0;
    }
  };

  const maxBalance = getMaxBalance();
  const isAmountValid = amount !== '' && Number(amount) > 0 && Number(amount) <= maxBalance;

  const handleSubmit = async () => {
    if (!isAmountValid || !faucetpayEmail || !proof) return;
    
    setLoading(true);
    try {
      await requestWithdrawal(Number(amount), cryptoType, faucetpayEmail, proof);
      setAmount('');
      setProof('');
      onWithdraw();
    } catch (error) {
      console.error("Error requesting withdrawal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Withdrawal</CardTitle>
        <CardDescription>
          Withdraw your earnings to FaucetPay
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Cryptocurrency</Label>
          <RadioGroup 
            value={cryptoType} 
            onValueChange={(value) => setCryptoType(value as 'pepe' | 'dash' | 'ltc')}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pepe" id="pepe" />
              <Label htmlFor="pepe" className="text-pepe">PEPE (Balance: {user.crypto_balance_pepe.toFixed(6)})</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dash" id="dash" />
              <Label htmlFor="dash" className="text-dash">DASH (Balance: {user.crypto_balance_dash.toFixed(6)})</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ltc" id="ltc" />
              <Label htmlFor="ltc" className="text-ltc">LTC (Balance: {user.crypto_balance_ltc.toFixed(6)})</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.000000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.000001"
            min="0"
            max={maxBalance}
          />
          {amount && !isAmountValid && (
            <p className="text-sm text-red-500">
              Amount must be greater than 0 and less than or equal to your balance
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="faucetpay">FaucetPay Email</Label>
          <Input
            id="faucetpay"
            type="email"
            placeholder="your-email@example.com"
            value={faucetpayEmail}
            onChange={(e) => setFaucetpayEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proof">Withdrawal Proof</Label>
          <Textarea
            id="proof"
            placeholder="Provide any additional information to verify your withdrawal"
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={!isAmountValid || !faucetpayEmail || !proof || loading}
          className="w-full"
        >
          {loading ? "Processing..." : "Request Withdrawal"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WithdrawalForm;
