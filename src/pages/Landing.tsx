import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleSelector } from '@/components/ui/role-selector';
import { WalletConnector } from '@/components/ui/wallet-connector';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Shield, Zap } from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';
import heroImage from '@/assets/hero-blockchain.jpg';

export const Landing: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'organizer' | 'participant' | null>(null);
  const { isConnected } = useWeb3();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'organizer' | 'participant') => {
    setSelectedRole(role);
  };

  const handleWalletConnected = () => {
    if (selectedRole) {
      // Add a small delay for better UX
      setTimeout(() => {
        navigate(`/${selectedRole}`);
      }, 500);
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Blockchain network visualization" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/80 to-accent/30" />
        </div>
        <div className="relative">
          <header className="p-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    BlockAttend
                  </h1>
                  <p className="text-sm text-muted-foreground">Blockchain Event Attendance</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Shardeum Network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-success" />
                    <span>Secure & Transparent</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="px-6 pb-20">
            <div className="max-w-7xl mx-auto">
              {!selectedRole ? (
                <div className="text-center mb-12 animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
                    <Sparkles className="h-4 w-4" />
                    <span>Powered by Blockchain Technology</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-slide-up">
                    Decentralized Event
                    <br />
                    Attendance System
                  </h1>
                  
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
                    Create events, track attendance, and reward participants with NFT badges on the blockchain.
                    Transparent, secure, and gamified.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                    <Card className="card-glow animate-scale-in">
                      <CardContent className="p-6 text-center">
                        <div className="p-3 bg-primary/10 rounded-full w-12 h-12 mx-auto mb-4">
                          <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Blockchain Security</h3>
                        <p className="text-sm text-muted-foreground">
                          Immutable attendance records stored on Shardeum blockchain
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="card-glow animate-scale-in" style={{ animationDelay: '0.1s' }}>
                      <CardContent className="p-6 text-center">
                        <div className="p-3 bg-accent/10 rounded-full w-12 h-12 mx-auto mb-4">
                          <Sparkles className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="font-semibold mb-2">NFT Rewards</h3>
                        <p className="text-sm text-muted-foreground">
                          Earn unique NFT badges for event participation
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="card-glow animate-scale-in" style={{ animationDelay: '0.2s' }}>
                      <CardContent className="p-6 text-center">
                        <div className="p-3 bg-success/10 rounded-full w-12 h-12 mx-auto mb-4">
                          <Zap className="h-6 w-6 text-success" />
                        </div>
                        <h3 className="font-semibold mb-2">Real-time Tracking</h3>
                        <p className="text-sm text-muted-foreground">
                          Instant attendance verification and reporting
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="animate-slide-up">
                    <h2 className="text-2xl font-bold mb-6">Choose Your Role</h2>
                    <RoleSelector onRoleSelect={handleRoleSelect} />
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto animate-fade-in">
                  <div className="flex items-center gap-4 mb-8">
                    <Button onClick={handleBack} variant="ghost">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Role Selection
                    </Button>
                  </div>
                  
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4">
                      Connect Your Wallet
                    </h2>
                    <p className="text-muted-foreground">
                      You've selected <span className="font-semibold text-primary capitalize">{selectedRole}</span> role.
                      Now connect your MetaMask wallet to continue.
                    </p>
                  </div>
                  
                  <WalletConnector onConnected={handleWalletConnected} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border p-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>
            Powered by <span className="font-semibold text-primary">Shardeum Blockchain</span> • 
            Built with <span className="font-semibold">React</span> & <span className="font-semibold">ethers.js</span>
          </p>
        </div>
      </footer>
    </div>
  );
};