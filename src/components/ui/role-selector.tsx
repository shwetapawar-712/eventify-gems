import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Award, CheckCircle } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: 'organizer' | 'participant') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Card className="card-glow transition-all duration-300 hover:scale-105">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Event Organizer
          </CardTitle>
          <CardDescription className="text-lg">
            Create events, manage attendance, and award NFT badges
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Create blockchain events</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Track real-time attendance</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Award NFT badges to participants</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Manage event lifecycle</span>
            </div>
          </div>
          <Button 
            onClick={() => onRoleSelect('organizer')} 
            className="w-full btn-gradient"
            size="lg"
          >
            <Users className="mr-2 h-5 w-5" />
            Start as Organizer
          </Button>
        </CardContent>
      </Card>

      <Card className="card-glow transition-all duration-300 hover:scale-105">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center">
            <Award className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Participant
          </CardTitle>
          <CardDescription className="text-lg">
            Join events, mark attendance, and collect NFT badges
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Browse available events</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Mark attendance on blockchain</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Collect NFT achievement badges</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Track your progress</span>
            </div>
          </div>
          <Button 
            onClick={() => onRoleSelect('participant')} 
            className="w-full btn-gradient"
            size="lg"
            variant="secondary"
          >
            <Award className="mr-2 h-5 w-5" />
            Join as Participant
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};