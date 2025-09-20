import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Loader2, Plus } from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';

interface CreateEventFormProps {
  onEventCreated: () => void;
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({ onEventCreated }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const { createSession } = useWeb3();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    setIsCreating(true);
    try {
      const sessionId = await createSession(eventName);
      if (sessionId !== null) {
        setEventName('');
        setEventDate('');
        setEventDescription('');
        onEventCreated();
      }
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Create New Event
        </CardTitle>
        <CardDescription>
          Create a blockchain-based event for attendance tracking
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Title *</Label>
            <Input
              id="eventName"
              placeholder="Enter event title..."
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eventDate">Event Date</Label>
            <Input
              id="eventDate"
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eventDescription">Description</Label>
            <Textarea
              id="eventDescription"
              placeholder="Event description (optional)..."
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={!eventName.trim() || isCreating}
            className="w-full btn-gradient"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Event...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};