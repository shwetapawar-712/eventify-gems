import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { OrganizerSidebar } from '@/components/layout/organizer-sidebar';
import { CreateEventForm } from '@/components/forms/create-event-form';
import { EventCard } from '@/components/ui/event-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Users, 
  Award, 
  TrendingUp, 
  Loader2,
  RefreshCw,
  Clock,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { useWeb3, Session } from '@/contexts/Web3Context';

const OrganizerCreate = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const handleEventCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    // Navigate to events page after successful creation
    setTimeout(() => {
      navigate('/organizer/events');
    }, 1000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
        <p className="text-muted-foreground">Set up a new blockchain-based attendance event</p>
      </div>
      <CreateEventForm onEventCreated={handleEventCreated} />
    </div>
  );
};

const OrganizerEvents = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { getSessions, account } = useWeb3();

  const loadSessions = async () => {
    setLoading(true);
    try {
      const allSessions = await getSessions();
      // Filter sessions created by the current organizer
      const mySessions = allSessions.filter(session => 
        session.organizer.toLowerCase() === account?.toLowerCase()
      );
      setSessions(mySessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [account]);

  const getEventStats = () => {
    const total = sessions.length;
    const running = sessions.filter(s => {
      const now = Date.now() / 1000;
      return now - s.createdAt < 86400; // Running for 24 hours
    }).length;
    const past = total - running;

    return { total, running, past };
  };

  const stats = getEventStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-muted-foreground">Manage your created events</p>
        </div>
        <Button onClick={loadSessions} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running Events</CardTitle>
            <Clock className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.running}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Events</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.past}</div>
          </CardContent>
        </Card>
      </div>

        {sessions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events created yet</h3>
            <p className="text-muted-foreground mb-4">Create your first event to get started</p>
            <Button asChild>
              <NavLink to="/organizer/create">
                <Calendar className="mr-2 h-4 w-4" />
                Create Event
              </NavLink>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <EventCard
              key={session.id}
              session={session}
              role="organizer"
              onViewDetails={(id) => console.log('View details for event', id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const OrganizerAttendance = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Attendance Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>View and manage attendance for all your events</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Attendance management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

const OrganizerAnalytics = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
        <p className="text-muted-foreground">Track event performance and engagement metrics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Awarded</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>
            Detailed analytics and reporting features will be available soon
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Advanced analytics interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export const OrganizerDashboard: React.FC = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <OrganizerSidebar currentPath={location.pathname} />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/organizer/create" replace />} />
            <Route path="/create" element={<OrganizerCreate />} />
            <Route path="/events" element={<OrganizerEvents />} />
            <Route path="/badges" element={<OrganizerBadges />} />
            <Route path="/analytics" element={<OrganizerAnalytics />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

const OrganizerBadges = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Badge Management</h1>
        <p className="text-muted-foreground">Award NFT badges to event participants</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Award NFT Badges
          </CardTitle>
          <CardDescription>
            Reward participants with unique blockchain-based achievement badges
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Badge System Coming Soon</h3>
          <p className="text-muted-foreground mb-4">
            Advanced badge creation and awarding features will be available in the next update
          </p>
        </CardContent>
      </Card>
    </div>
  );
};