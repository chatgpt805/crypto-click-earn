
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { Bitcoin, Wallet, ArrowRight } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border px-4 py-3">
        <div className="container flex items-center justify-between">
          <Logo />
          <Button onClick={() => navigate("/login")}>
            Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        <section className="py-20 px-4">
          <div className="container max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Earn <span className="crypto-gradient">Cryptocurrency</span> for Simple Tasks
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Complete PTC tasks, earn crypto, and withdraw directly to your FaucetPay account.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/login")} className="px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="px-8">
                Learn More
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-cryptoDarkLight">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 border border-border rounded-lg flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                  <Bitcoin className="h-8 w-8 text-cryptoGreen" />
                </div>
                <h3 className="text-xl font-bold mb-2">Complete PTC Tasks</h3>
                <p className="text-muted-foreground">
                  Browse our available PTC tasks and complete them to earn crypto rewards
                </p>
              </div>
              
              <div className="p-6 border border-border rounded-lg flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                  <Wallet className="h-8 w-8 text-cryptoGreen" />
                </div>
                <h3 className="text-xl font-bold mb-2">Earn Crypto</h3>
                <p className="text-muted-foreground">
                  Watch your balance grow as you complete more tasks in PEPE, DASH, and LTC
                </p>
              </div>
              
              <div className="p-6 border border-border rounded-lg flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                  <ArrowRight className="h-8 w-8 text-cryptoGreen" />
                </div>
                <h3 className="text-xl font-bold mb-2">Withdraw to FaucetPay</h3>
                <p className="text-muted-foreground">
                  Request withdrawals directly to your FaucetPay account anytime
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 px-4">
          <div className="container max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Start Earning Today</h2>
            <Button size="lg" onClick={() => navigate("/login")} className="px-8">
              Create Your Account
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border py-6 px-4">
        <div className="container max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CryptoClick. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
