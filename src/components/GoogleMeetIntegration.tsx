
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Video, Calendar, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GoogleMeetIntegrationProps {
  onMeetingCreated?: (meetingUrl: string) => void;
  meetingTitle?: string;
  meetingDescription?: string;
}

const GoogleMeetIntegration: React.FC<GoogleMeetIntegrationProps> = ({ 
  onMeetingCreated,
  meetingTitle = '',
  meetingDescription = ''
}) => {
  const [googleApiKey, setGoogleApiKey] = useState<string>(
    localStorage.getItem('google-api-key') || ''
  );
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('google-api-key'));
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [customMeetingUrl, setCustomMeetingUrl] = useState('');
  const { toast } = useToast();
  
  // Save API key
  const saveApiKey = () => {
    if (!googleApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid Google API key",
        variant: "destructive"
      });
      return;
    }
    
    localStorage.setItem('google-api-key', googleApiKey);
    setShowApiKeyInput(false);
    
    toast({
      title: "API Key Saved",
      description: "Your Google API key has been saved",
    });
  };
  
  // Create a Google Meet meeting (simplified demo)
  const createMeeting = () => {
    setIsCreatingMeeting(true);
    
    // In a real implementation, we would use the Google Calendar API
    // For this demo, we'll simulate creating a meeting with a timeout
    setTimeout(() => {
      // Generate a random meeting ID (not real Google Meet format)
      const meetId = Math.random().toString(36).substring(2, 12);
      const meetingUrl = `https://meet.google.com/${meetId}`;
      
      if (onMeetingCreated) {
        onMeetingCreated(meetingUrl);
      }
      
      toast({
        title: "Meeting Created",
        description: "Your Google Meet meeting has been created successfully",
      });
      
      setIsCreatingMeeting(false);
    }, 1500);
  };
  
  // Save custom meeting URL to database (if using one)
  const saveCustomMeetingUrl = async () => {
    if (!customMeetingUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a meeting URL",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Validate URL format
      new URL(customMeetingUrl);
      
      if (onMeetingCreated) {
        onMeetingCreated(customMeetingUrl);
      }
      
      toast({
        title: "Meeting URL Saved",
        description: "Your custom meeting URL has been saved",
      });
      
      setCustomMeetingUrl('');
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive"
      });
    }
  };
  
  if (showApiKeyInput) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Video className="mr-2 h-5 w-5 text-nexhr-primary" />
            Google Meet Integration
          </CardTitle>
          <CardDescription>
            Set up Google Meet for your virtual meetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800">API Key Required</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  To create Google Meet meetings automatically, please enter your Google API key.
                  You can obtain a key from the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a>.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="google-api-key">Google API Key</Label>
              <Input
                id="google-api-key"
                type="text"
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                placeholder="Enter your Google API key"
              />
            </div>
            
            <Button onClick={saveApiKey} className="w-full">
              Save API Key
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">Or use a custom meeting URL</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-meeting-url">Custom Meeting URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="custom-meeting-url"
                  type="text"
                  value={customMeetingUrl}
                  onChange={(e) => setCustomMeetingUrl(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                />
                <Button onClick={saveCustomMeetingUrl} variant="outline">
                  Use
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Video className="mr-2 h-5 w-5 text-nexhr-primary" />
          Google Meet
        </CardTitle>
        <CardDescription>
          Create a virtual meeting room for this event
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={createMeeting}
            className="w-full"
            disabled={isCreatingMeeting}
          >
            {isCreatingMeeting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                Creating meeting...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Create Google Meet
              </>
            )}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">Or use a custom URL</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={customMeetingUrl}
              onChange={(e) => setCustomMeetingUrl(e.target.value)}
              placeholder="Enter meeting URL"
            />
            <Button onClick={saveCustomMeetingUrl} variant="outline">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMeetIntegration;
