import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { EventCard } from '@/components/ui/event-card';
import { BadgeCard } from '@/components/ui/badge-card';
import { 
  Calendar, 
  Award, 
  Wallet, 
  Trophy, 
  Target,
  Loader2,
  RefreshCw,
  LogOut,
  TrendingUp
} from 'lucide-react';
import { useWeb3, Session } from '@/contexts/Web3Context';

export const ParticipantDashboard: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [attendedSessions, setAttendedSessions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [markingAttendance, setMarkingAttendance] = useState<number | null>(null);
  
  const { 
    account, 
    disconnectWallet, 
    getSessions, 
    markAttendance, 
    checkAttendance 
  } = useWeb3();

  const loadSessions = async () => {
    setLoading(true);
    try {
      const allSessions = await getSessions();
      setSessions(allSessions);
      
      // Check attendance for each session
      const attended = new Set<number>();
      for (const session of allSessions) {
        if (account) {
          const hasAttended = await checkAttendance(session.id, account);
          if (hasAttended) {
            attended.add(session.id);
          }
        }
      }
      setAttendedSessions(attended);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      loadSessions();
    }
  }, [account]);

  const handleMarkAttendance = async (sessionId: number) => {
    setMarkingAttendance(sessionId);
    try {
      const success = await markAttendance(sessionId);
      if (success) {
        setAttendedSessions(prev => new Set([...prev, sessionId]));
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    } finally {
      setMarkingAttendance(null);
    }
  };

  const getEventsByStatus = () => {
    const now = Date.now() / 1000;
    
    const running = sessions.filter(s => now - s.createdAt < 86400);
    const upcoming = sessions.filter(s => s.createdAt > now);
    const past = sessions.filter(s => now - s.createdAt >= 86400);
    
    return { running, upcoming, past };
  };

  const { running, upcoming, past } = getEventsByStatus();
  const totalAttended = attendedSessions.size;
  const attendanceRate = sessions.length > 0 ? (totalAttended / sessions.length) * 100 : 0;

  // Mock badge data - in a real app, this would come from the blockchain
  const mockBadges = [
    {
      tokenId: 1,
      title: 'First Attendance',
      description: 'Marked your first event attendance',
      rarity: 'bronze' as const,
      earnedAt: new Date('2024-01-15'),
    },
    {
      tokenId: 2,
      title: 'Frequent Attendee',
      description: 'Attended 5 events',
      rarity: 'silver' as const,
      earnedAt: new Date('2024-02-01'),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Participant Dashboard</h1>
              <p className="text-muted-foreground">Join events and collect NFT badges</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {account && (
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Wallet className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Connected</p>
                  <p className="text-sm font-mono">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">Shardeum</Badge>
              </div>
            )}
            
            <Button onClick={() => window.location.href = '/'} variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Home
            </Button>
            
            <Button onClick={disconnectWallet} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalAttended}</div>
              <p className="text-xs text-muted-foreground">Total events</p>
            </CardContent>
          </Card>
          
          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{attendanceRate.toFixed(1)}%</div>
              <Progress value={attendanceRate} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              <Trophy className="h-4 w-4 text-badge-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-badge-gold">{mockBadges.length}</div>
              <p className="text-xs text-muted-foreground">NFT achievements</p>
            </CardContent>
          </Card>
          
          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Badge</CardTitle>
              <Target className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">3</div>
              <p className="text-xs text-muted-foreground">events remaining</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              My Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Available Events</h2>
              <Button onClick={loadSessions} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>

            {/* Running Events */}
            {running.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-success flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  Running Events
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {running.map((session) => (
                    <EventCard
                      key={session.id}
                      session={session}
                      role="participant"
                      hasAttended={attendedSessions.has(session.id)}
                      onMarkAttendance={handleMarkAttendance}
                      onViewDetails={(id) => console.log('View details for event', id)}
                      loading={markingAttendance === session.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {upcoming.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-info">Upcoming Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcoming.map((session) => (
                    <EventCard
                      key={session.id}
                      session={session}
                      role="participant"
                      onViewDetails={(id) => console.log('View details for event', id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {past.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-muted-foreground">Past Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {past.map((session) => (
                    <EventCard
                      key={session.id}
                      session={session}
                      role="participant"
                      hasAttended={attendedSessions.has(session.id)}
                      onViewDetails={(id) => console.log('View details for event', id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {sessions.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events available</h3>
                  <p className="text-muted-foreground">Check back later for new events</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Badge Collection</h2>
              <Badge variant="outline" className="text-sm">
                {mockBadges.length} Badges Earned
              </Badge>
            </div>

            {mockBadges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBadges.map((badge) => (
                  <BadgeCard key={badge.tokenId} {...badge} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No badges earned yet</h3>
                  <p className="text-muted-foreground mb-4">Attend events to earn NFT badges</p>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Browse Events
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Progress to next badge */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Progress to Next Badge
                </CardTitle>
                <CardDescription>
                  Attend 3 more events to unlock the "Regular Attendee" gold badge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{totalAttended}/5 events</span>
                  </div>
                  <Progress value={(totalAttended / 5) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};