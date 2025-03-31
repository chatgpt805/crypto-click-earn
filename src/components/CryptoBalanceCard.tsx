
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CryptoBalanceCardProps {
  type: 'pepe' | 'dash' | 'ltc';
  balance: number;
}

const CryptoBalanceCard = ({ type, balance }: CryptoBalanceCardProps) => {
  const getCryptoDetails = () => {
    switch (type) {
      case 'pepe':
        return {
          name: 'PEPE',
          color: 'bg-pepe',
          textColor: 'text-pepe',
        };
      case 'dash':
        return {
          name: 'DASH',
          color: 'bg-dash',
          textColor: 'text-dash',
        };
      case 'ltc':
        return {
          name: 'LTC',
          color: 'bg-ltc',
          textColor: 'text-ltc',
        };
      default:
        return {
          name: '',
          color: '',
          textColor: '',
        };
    }
  };

  const { name, color, textColor } = getCryptoDetails();

  return (
    <Card className="balance-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <div className={`h-3 w-3 rounded-full ${color}`}></div>
        </div>
        <CardDescription>Current Balance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${textColor}`}>
          {balance.toFixed(6)}
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoBalanceCard;
