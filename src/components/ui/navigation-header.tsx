import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, User, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '@/contexts/Web3Context';

interface NavigationHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backPath?: string;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  description,
  showBackButton = false,
  backPath = '/'
}) => {
  const navigate = useNavigate();
  const { account, isConnected } = useWeb3();

  const handleBack = () => {
    navigate(backPath);
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button onClick={handleBack} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{title}</h1>
                {isConnected && (
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    Connected
                  </Badge>
                )}
              </div>
              {description && (
                <p className="text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {account && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm font-mono">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            )}
            
            <Button onClick={handleHome} variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};