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
      <CardHeader className="text-center">
        <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4">
          <Calendar className="h-10 w-10 text-primary mx-auto mt-1" />
        </div>
        <CardTitle className="text-2xl">Create New Event</CardTitle>
        <CardDescription>
          Set up a blockchain-based event for secure attendance tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="eventName" className="text-sm font-medium">
              Event Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="eventName"
              placeholder="Enter a descriptive event title..."
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              This will be stored permanently on the blockchain
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eventDate" className="text-sm font-medium">Event Date & Time</Label>
            <Input
              id="eventDate"
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Set when the event takes place
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eventDescription" className="text-sm font-medium">Description</Label>
            <Textarea
              id="eventDescription"
              placeholder="Provide details about your event..."
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Additional context for participants (optional)
            </p>
          </div>
          
          <div className="pt-4 border-t border-border">
            <Button 
              type="submit" 
              disabled={!eventName.trim() || isCreating}
              className="w-full h-11 btn-gradient text-base font-medium"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Event on Blockchain...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Create Event
                </>
              )}
            </Button>
            {!isCreating && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                This will create a transaction on the Shardeum network
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};