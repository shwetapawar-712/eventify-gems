import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, CheckCircle, Eye } from 'lucide-react';
import { Session } from '@/contexts/Web3Context';

interface EventCardProps {
  session: Session;
  role: 'organizer' | 'participant';
  hasAttended?: boolean;
  onMarkAttendance?: (sessionId: number) => void;
  onViewDetails?: (sessionId: number) => void;
  loading?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  session,
  role,
  hasAttended,
  onMarkAttendance,
  onViewDetails,
  loading
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = () => {
    const now = Date.now() / 1000;
    const eventTime = session.createdAt;
    
    // For simplicity, consider events as "running" for 24 hours after creation
    if (now - eventTime < 86400) return 'running';
    return 'past';
  };

  const status = getEventStatus();
  const statusConfig = {
    running: { label: 'Running', className: 'status-running' },
    upcoming: { label: 'Upcoming', className: 'status-upcoming' },
    past: { label: 'Past', className: 'status-past' }
  };

  return (
    <Card className="card-glow transition-all duration-300 hover:scale-[1.02]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold">{session.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(session.createdAt)}
            </CardDescription>
          </div>
          <Badge className={statusConfig[status].className}>
            {status === 'running' && <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse" />}
            {statusConfig[status].label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>ID: {session.id}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{status}</span>
          </div>
        </div>

        {hasAttended && (
          <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg border border-success/20">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="text-sm font-medium text-success-foreground">
              Attendance Marked
            </span>
          </div>
        )}

        <div className="flex gap-2">
          {role === 'participant' && status === 'running' && !hasAttended && (
            <Button
              onClick={() => onMarkAttendance?.(session.id)}
              disabled={loading}
              className="flex-1 btn-gradient"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Attendance
            </Button>
          )}
          
          <Button
            onClick={() => onViewDetails?.(session.id)}
            variant="outline"
            className={role === 'participant' && status === 'running' && !hasAttended ? "" : "flex-1"}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};