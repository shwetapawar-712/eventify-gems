import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Loader2 } from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';

interface WalletConnectorProps {
  onConnected: () => void;
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({ onConnected }) => {
  const { connectWallet, isConnecting, isConnected, account } = useWeb3();

  React.useEffect(() => {
    if (isConnected && account) {
      onConnected();
    }
  }, [isConnected, account, onConnected]);

  return (
    <Card className="card-glow max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center wallet-pulse">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Connect Your Wallet</CardTitle>
        <CardDescription>
          Connect your MetaMask wallet to interact with the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>Make sure you're connected to the</p>
          <p className="font-semibold text-primary">Shardeum Unstablenet</p>
        </div>
        
        <Button 
          onClick={connectWallet}
          disabled={isConnecting || isConnected}
          className="w-full btn-gradient"
          size="lg"
        >
          {isConnecting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {isConnected ? 'Wallet Connected' : 'Connect MetaMask'}
        </Button>
        
        {isConnected && account && (
          <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
            <p className="text-sm font-medium text-success-foreground">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground text-center">
          <p>Don't have MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Download here</a></p>
        </div>
      </CardContent>
    </Card>
  );
};