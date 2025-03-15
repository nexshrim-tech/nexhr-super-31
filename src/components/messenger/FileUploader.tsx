import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X, Image, Mic, FileText, Upload, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onVoiceRecord?: (blob: Blob) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, onVoiceRecord }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSendFile = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
      clearSelectedFile();
      toast({
        title: "File sent",
        description: `${selectedFile.name} has been sent successfully.`
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecordedAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds += 1;
        setRecordingTime(seconds);
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Permission Denied",
        description: "Please allow microphone access to record voice messages.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Clear recorded data
      chunksRef.current = [];
      setRecordedAudio(null);
      setAudioUrl(null);
    }
    
    setIsRecording(false);
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setRecordingTime(0);
    }
  };

  const sendVoiceMessage = () => {
    if (recordedAudio && onVoiceRecord) {
      onVoiceRecord(recordedAudio);
      setRecordedAudio(null);
      setAudioUrl(null);
      toast({
        title: "Voice message sent",
        description: "Your voice message has been sent successfully."
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
      
      {!selectedFile && !isRecording && !recordedAudio && (
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleButtonClick}
            title="Upload file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={startRecording}
            title="Record voice message"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {selectedFile && (
        <div className="mt-2 p-3 border rounded-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {selectedFile.type.startsWith('image/') ? (
                <Image className="h-5 w-5 mr-2 text-blue-500" />
              ) : (
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
              )}
              <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSelectedFile}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {previewUrl && (
            <div className="mb-2">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-40 rounded-md object-contain mx-auto"
              />
            </div>
          )}
          
          <Button 
            variant="default" 
            className="w-full"
            onClick={handleSendFile}
          >
            <Send className="h-4 w-4 mr-2" />
            Send File
          </Button>
        </div>
      )}
      
      {isRecording && (
        <div className="mt-2 p-3 border rounded-md bg-red-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
              <span className="text-sm font-medium">Recording... {formatTime(recordingTime)}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="destructive" 
              className="w-1/2"
              onClick={cancelRecording}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              variant="default" 
              className="w-1/2"
              onClick={stopRecording}
            >
              <Send className="h-4 w-4 mr-2" />
              Stop & Send
            </Button>
          </div>
        </div>
      )}
      
      {recordedAudio && audioUrl && (
        <div className="mt-2 p-3 border rounded-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Mic className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-sm">Voice Message</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setRecordedAudio(null);
                setAudioUrl(null);
              }}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <audio controls className="w-full mb-2">
            <source src={audioUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
          
          <Button 
            variant="default" 
            className="w-full"
            onClick={sendVoiceMessage}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Voice Message
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
