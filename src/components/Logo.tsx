
import { Bitcoin } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Bitcoin className="h-6 w-6 text-cryptoGreen animate-pulse-green" />
      <span className="text-xl font-bold crypto-gradient">CryptoClick</span>
    </div>
  );
};

export default Logo;
