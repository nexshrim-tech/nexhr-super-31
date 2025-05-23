
import React, { useState, useEffect } from 'react';
import SidebarNav from '@/components/SidebarNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, Paperclip, Phone, Video } from 'lucide-react';
import FeatureLock from '@/components/FeatureLock';
import { useSubscription } from '@/context/SubscriptionContext';

const Messenger = () => {
  const { features } = useSubscription();
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<any[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    setChats([
      {
        id: 1,
        name: 'Team General',
        lastMessage: 'Hey everyone! How are the projects going?',
        timestamp: '10:30 AM',
        unread: 2
      },
      {
        id: 2,
        name: 'John Doe',
        lastMessage: 'Can we schedule a meeting for tomorrow?',
        timestamp: '9:15 AM',
        unread: 0
      }
    ]);
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-hidden">
        <FeatureLock featureName="employeeManagement">
          <div className="h-full flex">
            {/* Chat List */}
            <div className="w-80 border-r bg-white">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Messages</h2>
              </div>
              <div className="overflow-y-auto">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium">{chat.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {chat.timestamp}
                        {chat.unread > 0 && (
                          <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-white flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{selectedChat.name}</h3>
                      <p className="text-sm text-gray-500">Online</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {/* Sample messages */}
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                          Hello! How are you doing today?
                        </div>
                      </div>
                      <div className="flex">
                        <div className="bg-white p-3 rounded-lg max-w-xs">
                          I'm doing great! Working on the new project.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 bg-white border-t">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
                    <p className="text-gray-500">Choose a chat from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FeatureLock>
      </div>
    </div>
  );
};

export default Messenger;
