
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Send, User, Users, Search, MessageSquare, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import FileUploader from "@/components/messenger/FileUploader";

// Sample employee data
const employees = [
  { id: 1, name: "Olivia Rhye", avatar: "OR", status: "online" },
  { id: 2, name: "Phoenix Baker", avatar: "PB", status: "offline" },
  { id: 3, name: "Lana Steiner", avatar: "LS", status: "online" },
  { id: 4, name: "Demi Wilkinson", avatar: "DW", status: "away" },
  { id: 5, name: "Candice Wu", avatar: "CW", status: "online" },
  { id: 6, name: "Natali Craig", avatar: "NC", status: "offline" },
  { id: 7, name: "Drew Cano", avatar: "DC", status: "online" },
];

// Sample group data
const groups = [
  { id: 1, name: "HR Team", members: ["Olivia Rhye", "Phoenix Baker", "Lana Steiner"] },
  { id: 2, name: "Engineering", members: ["Demi Wilkinson", "Candice Wu", "Drew Cano"] },
  { id: 3, name: "Marketing", members: ["Natali Craig", "Lana Steiner"] },
];

// Sample chat data
const sampleChats = [
  {
    id: 1,
    with: employees[2], // Lana Steiner
    messages: [
      { id: 1, sender: "user", text: "Hi Lana, do you have a minute?", time: "9:30 AM" },
      { id: 2, sender: "other", text: "Sure, what's up?", time: "9:32 AM" },
      { id: 3, sender: "user", text: "I wanted to discuss the new project timeline.", time: "9:33 AM" },
      { id: 4, sender: "other", text: "Of course, I'm free now if you want to talk.", time: "9:35 AM" },
    ]
  },
  {
    id: 2,
    with: groups[0], // HR Team
    messages: [
      { id: 1, sender: "user", text: "Team, any updates on the onboarding process?", time: "Yesterday" },
      { id: 2, sender: "Olivia Rhye", text: "We've updated the documentation.", time: "Yesterday" },
      { id: 3, sender: "Phoenix Baker", text: "I'll share the new template later today.", time: "Yesterday" },
    ]
  }
];

const Messenger = () => {
  const [chatTab, setChatTab] = useState("direct");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState<any>(sampleChats[0]);
  const [message, setMessage] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const filteredEmployees = employees.filter(
    emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = groups.filter(
    group => group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, this would send to the backend
    // Here we're just showing a toast notification
    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Update the selected chat with the new message
    // In a real app, this would be done through a state management system
    if (selectedChat) {
      if (!selectedChat.messages) {
        selectedChat.messages = [];
      }
      selectedChat.messages.push(newMessage);
      setSelectedChat({ ...selectedChat });
    }
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully"
    });
    
    setMessage("");
  };

  const handleCreateGroup = () => {
    if (!newGroupName || selectedMembers.length === 0) {
      toast({
        title: "Cannot create group",
        description: "Please provide a group name and select at least one member",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would create the group on the backend
    toast({
      title: "Group created",
      description: `${newGroupName} group has been created successfully`
    });
    
    // Add the new group to our local state
    const newGroup = {
      id: groups.length + 1,
      name: newGroupName,
      members: selectedMembers
    };
    
    groups.push(newGroup);
    setChatTab("groups");
    
    setIsCreateGroupOpen(false);
    setNewGroupName("");
    setSelectedMembers([]);
  };

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
  };

  const handleMemberSelection = (name: string) => {
    setSelectedMembers(prev => {
      if (prev.includes(name)) {
        return prev.filter(member => member !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const handleFileSelect = (file: File) => {
    if (!selectedChat) return;
    
    // Create a new message with file information
    const fileMessage = {
      id: Date.now(),
      sender: "user",
      text: `[File: ${file.name}]`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      file: {
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      }
    };
    
    // Add the file message to the chat
    if (!selectedChat.messages) {
      selectedChat.messages = [];
    }
    selectedChat.messages.push(fileMessage);
    setSelectedChat({ ...selectedChat });
    
    toast({
      title: "File sent",
      description: `${file.name} has been sent successfully`
    });
  };

  const handleVoiceRecord = (blob: Blob) => {
    if (!selectedChat) return;
    
    // Create a new message with voice recording information
    const voiceMessage = {
      id: Date.now(),
      sender: "user",
      text: "[Voice Message]",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      voice: {
        url: URL.createObjectURL(blob)
      }
    };
    
    // Add the voice message to the chat
    if (!selectedChat.messages) {
      selectedChat.messages = [];
    }
    selectedChat.messages.push(voiceMessage);
    setSelectedChat({ ...selectedChat });
    
    toast({
      title: "Voice message sent",
      description: "Your voice message has been sent successfully"
    });
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="bg-white border-b p-4">
            <h1 className="text-2xl font-semibold">Messenger</h1>
            <p className="text-gray-500">Communicate with your team</p>
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar - Hidden on mobile when chat is selected */}
            <div className={`${isMobile && selectedChat ? 'hidden' : 'block'} w-full md:w-80 border-r bg-white flex flex-col`}>
              <div className="p-4 border-b">
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="search" 
                    placeholder="Search chats..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Tabs defaultValue="direct" value={chatTab} onValueChange={setChatTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="direct" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Direct
                    </TabsTrigger>
                    <TabsTrigger value="groups" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Groups
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="direct" className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Direct Messages</h3>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="groups" className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Group Chats</h3>
                      <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 gap-1">
                            <Plus className="h-3.5 w-3.5" />
                            New Group
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Create New Group</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label htmlFor="group-name" className="text-sm font-medium">
                                Group Name
                              </label>
                              <Input
                                id="group-name"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                placeholder="Enter group name"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Select Members
                              </label>
                              <ScrollArea className="h-48 border rounded-md p-2">
                                <div className="space-y-2">
                                  {employees.map((emp) => (
                                    <div key={emp.id} className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`employee-${emp.id}`} 
                                        checked={selectedMembers.includes(emp.name)}
                                        onCheckedChange={() => handleMemberSelection(emp.name)}
                                      />
                                      <label 
                                        htmlFor={`employee-${emp.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {emp.name}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                              {selectedMembers.map((member) => (
                                <div 
                                  key={member} 
                                  className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                                >
                                  {member}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setIsCreateGroupOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleCreateGroup}>
                              Create Group
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <ScrollArea className="flex-1">
                {chatTab === "direct" ? (
                  <div className="divide-y">
                    {filteredEmployees.map((emp) => (
                      <div 
                        key={emp.id}
                        className={`p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer ${
                          selectedChat?.with?.id === emp.id ? "bg-gray-50" : ""
                        }`}
                        onClick={() => handleSelectChat({ id: emp.id, with: emp, messages: [] })}
                      >
                        <Avatar className="h-10 w-10 relative">
                          <AvatarImage src="" />
                          <AvatarFallback>{emp.avatar}</AvatarFallback>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            emp.status === "online" ? "bg-green-500" : 
                            emp.status === "away" ? "bg-yellow-500" : 
                            "bg-gray-400"
                          }`} />
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{emp.name}</div>
                          <div className="text-xs text-gray-500">
                            {emp.status === "online" ? "Online" : 
                             emp.status === "away" ? "Away" : "Offline"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredGroups.map((group) => (
                      <div 
                        key={group.id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer ${
                          selectedChat?.with?.id === group.id ? "bg-gray-50" : ""
                        }`}
                        onClick={() => handleSelectChat({ id: group.id, with: group, messages: [] })}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{group.name}</div>
                            <div className="text-xs text-gray-500">
                              {group.members.length} members
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            
            {/* Chat area - Hidden on mobile when no chat is selected */}
            <div className={`${isMobile && !selectedChat ? 'hidden' : 'block'} flex-1 flex flex-col bg-gray-50`}>
              {selectedChat ? (
                <>
                  <div className="bg-white p-4 border-b flex items-center justify-between">
                    {isMobile && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mr-2" 
                        onClick={() => setSelectedChat(null)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="m15 18-6-6 6-6"/>
                        </svg>
                      </Button>
                    )}
                    <div className="flex items-center gap-3">
                      {selectedChat.with.avatar ? (
                        <Avatar>
                          <AvatarFallback>{selectedChat.with.avatar}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">
                          {selectedChat.with.name}
                        </div>
                        {selectedChat.with.status && (
                          <div className="text-xs text-gray-500">
                            {selectedChat.with.status === "online" ? "Online" : 
                             selectedChat.with.status === "away" ? "Away" : "Offline"}
                          </div>
                        )}
                        {selectedChat.with.members && (
                          <div className="text-xs text-gray-500">
                            {selectedChat.with.members.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedChat.messages && selectedChat.messages.length > 0 ? (
                        selectedChat.messages.map((msg: any) => (
                          <div 
                            key={msg.id} 
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[70%] ${
                              msg.sender === "user" 
                                ? "bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg" 
                                : "bg-white border rounded-tl-lg rounded-tr-lg rounded-br-lg"
                            } px-4 py-3`}>
                              {msg.sender !== "user" && msg.sender !== "other" && (
                                <div className="text-xs font-medium mb-1 text-gray-500">
                                  {msg.sender}
                                </div>
                              )}
                              <p>{msg.text}</p>
                              
                              {/* Display file if present */}
                              {msg.file && msg.file.type.startsWith('image/') && (
                                <div className="mt-2">
                                  <img 
                                    src={msg.file.url} 
                                    alt={msg.file.name} 
                                    className="max-w-full rounded-md max-h-40 object-contain"
                                  />
                                </div>
                              )}
                              
                              {/* Display document link if present */}
                              {msg.file && !msg.file.type.startsWith('image/') && (
                                <div className="mt-2 flex items-center gap-2 py-2 px-3 bg-gray-100 rounded-md">
                                  <FileText className="h-4 w-4" />
                                  <a 
                                    href={msg.file.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 underline"
                                  >
                                    {msg.file.name}
                                  </a>
                                </div>
                              )}
                              
                              {/* Display voice message if present */}
                              {msg.voice && (
                                <div className="mt-2">
                                  <audio controls className="w-full max-w-[200px]">
                                    <source src={msg.voice.url} type="audio/webm" />
                                    Your browser does not support the audio element.
                                  </audio>
                                </div>
                              )}
                              
                              <div className={`text-xs mt-1 ${
                                msg.sender === "user" ? "text-blue-100" : "text-gray-400"
                              }`}>
                                {msg.time}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          No messages yet. Start a conversation!
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 bg-white border-t">
                    <div className="mb-2">
                      <FileUploader 
                        onFileSelect={handleFileSelect} 
                        onVoiceRecord={handleVoiceRecord}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 min-h-[80px] sm:min-h-[unset]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="sm:self-end"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <Card className="max-w-md mx-auto">
                    <CardContent className="py-10 text-center">
                      <div className="mx-auto my-4 bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-10 w-10 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No chat selected</h3>
                      <p className="text-gray-500 mb-4">
                        Select a conversation from the sidebar to start chatting
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
