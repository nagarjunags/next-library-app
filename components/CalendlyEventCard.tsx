import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, X, RefreshCw, Video } from 'lucide-react';

interface Location {
  join_url: string;
  status: string;
  type: string;
}

interface CalendlyEvent {
  cancel_url: string;
  created_at: string;
  email: string;
  event: string;
  name: string;
  reschedule_url: string;
  status: string;
  timezone: string;
  uri: string;
  location: Location;
}

interface CalendlyEventCardProps {
  event: CalendlyEvent;
  onCancel: () => void;
  onReschedule: () => void;
}

export default function CalendlyEventCard({ event, onCancel, onReschedule }: CalendlyEventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const googleMeetLocation = event.location?.type === 'google_conference' ? event.location : null;

  return (
    <Card className="w-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">Scheduled Event</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-700">{formatDate(event.created_at)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-700">{event.timezone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-700">{event.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-700">Status:</span>
          <span className={`text-sm font-medium capitalize ${
            event.status === 'active' ? 'text-green-600' : 'text-red-600'
          }`}>
            {event.status}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 pb-3 bg-gray-50">
        <Button 
          variant="destructive" 
          size="sm"
          className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white"
          onClick={onCancel}
        >
          <X className="h-3 w-3" />
          <span>Cancel</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-1 border-blue-500 text-blue-500 hover:bg-blue-50"
          onClick={onReschedule}
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reschedule</span>
        </Button>
        <Button
          variant="default"
          size="sm"
          className={`flex items-center space-x-1 ${
            googleMeetLocation 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={() => googleMeetLocation && window.open(googleMeetLocation.join_url, '_blank')}
          disabled={!googleMeetLocation}
        >
          <Video className="h-3 w-3" />
          <span>Join Meet</span>
        </Button>
      </CardFooter>
    </Card>
  );
}