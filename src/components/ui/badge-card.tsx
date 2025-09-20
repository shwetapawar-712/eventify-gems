import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Award, Star, Crown, Diamond } from 'lucide-react';

interface BadgeCardProps {
  tokenId: number;
  title: string;
  description: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond';
  earnedAt: Date;
  transactionHash?: string;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  tokenId,
  title,
  description,
  rarity,
  earnedAt,
  transactionHash
}) => {
  const rarityConfig = {
    bronze: { 
      color: 'text-badge-bronze', 
      bg: 'bg-badge-bronze/10',
      border: 'border-badge-bronze/30',
      icon: Award 
    },
    silver: { 
      color: 'text-badge-silver', 
      bg: 'bg-badge-silver/10',
      border: 'border-badge-silver/30',
      icon: Star 
    },
    gold: { 
      color: 'text-badge-gold', 
      bg: 'bg-badge-gold/10',
      border: 'border-badge-gold/30',
      icon: Crown 
    },
    diamond: { 
      color: 'text-badge-diamond', 
      bg: 'bg-badge-diamond/10',
      border: 'border-badge-diamond/30',
      icon: Diamond 
    }
  };

  const config = rarityConfig[rarity];
  const Icon = config.icon;

  const openOnOpenSea = () => {
    // This would open the NFT on OpenSea
    window.open(`https://opensea.io/assets/shardeum/${tokenId}`, '_blank');
  };

  return (
    <Card className={`badge-shine card-glow transition-all duration-300 hover:scale-105 ${config.bg} ${config.border} border-2`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-full ${config.bg}`}>
            <Icon className={`h-6 w-6 ${config.color}`} />
          </div>
          <Badge variant="outline" className={`${config.color} border-current`}>
            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <CardTitle className="text-lg font-bold mb-2">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>Earned: {earnedAt.toLocaleDateString()}</p>
          <p>Token ID: #{tokenId}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={openOnOpenSea}
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on OpenSea
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};