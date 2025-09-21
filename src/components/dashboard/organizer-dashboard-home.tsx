import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  Award, 
  TrendingUp, 
  Loader2,
  Plus,
  CheckCircle2,
  Clock,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { useWeb3, Session } from '@/contexts/Web3Context';

export const OrganizerDashboardHome: React.FC = () => {
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
    if (account) {
      loadSessions();
    }
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

  const getRecentSessions = () => {
    return sessions
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your events.
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
          <NavLink to="/organizer/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </NavLink>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : stats.total}</div>
            <p className="text-xs text-muted-foreground">All time events</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running Events</CardTitle>
            <Clock className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{loading ? '-' : stats.running}</div>
            <p className="text-xs text-muted-foreground">Active now</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Events</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : stats.past}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">100%</div>
            <p className="text-xs text-muted-foreground">Event completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Frequently used management tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <NavLink to="/organizer/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Event
                <ArrowRight className="ml-auto h-4 w-4" />
              </NavLink>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <NavLink to="/organizer/events">
                <Calendar className="mr-2 h-4 w-4" />
                View All Events
                <ArrowRight className="ml-auto h-4 w-4" />
              </NavLink>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <NavLink to="/organizer/badges">
                <Award className="mr-2 h-4 w-4" />
                Award NFT Badges
                <ArrowRight className="ml-auto h-4 w-4" />
              </NavLink>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Events
            </CardTitle>
            <CardDescription>
              Your latest created events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No events created yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getRecentSessions().map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{session.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(session.createdAt * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        Date.now() / 1000 - session.createdAt < 86400
                          ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                          : 'border-muted-foreground/20 text-muted-foreground'
                      }
                    >
                      {Date.now() / 1000 - session.createdAt < 86400 ? 'Running' : 'Past'}
                    </Badge>
                  </div>
                ))}
                {sessions.length > 3 && (
                  <Button asChild variant="ghost" size="sm" className="w-full mt-2">
                    <NavLink to="/organizer/events">
                      View all {sessions.length} events
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </NavLink>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};