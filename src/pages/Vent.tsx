import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mic, MicOff, Send, Volume2, Loader2, MessageCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Vent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording...",
        description: "Speak your mind. I'm listening 💜",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Couldn't access microphone",
        description: "Try typing instead",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: { audio: base64Audio }
        });

        if (error) throw error;
        
        if (data?.text) {
          setInput(data.text);
          await sendMessage(data.text);
        }
      };
    } catch (error) {
      console.error("Error transcribing:", error);
      toast({
        title: "Couldn't understand that",
        description: "Try speaking again or type instead",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('vent-chat', {
        body: { 
          message: text,
          conversationHistory: messages 
        }
      });

      if (error) throw error;

      if (data?.reply) {
        const assistantMessage: Message = { role: "assistant", content: data.reply };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Auto-play response
        await speakText(data.reply);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Connection issue",
        description: "Couldn't send message. Try again?",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text: string) => {
    setIsSpeaking(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text }
      });

      if (error) throw error;

      if (data?.audioContent) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mp3' }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error("Error with text-to-speech:", error);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col animate-fade-in">
      <Card className="flex-1 flex flex-col border-primary/30 shadow-lg">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Vent Space</CardTitle>
              <CardDescription>
                Let it out. I'm here to listen, not judge 💜
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <div className="text-6xl mb-4">💜</div>
                <p className="text-muted-foreground">
                  This is your safe space to vent.
                </p>
                <p className="text-sm text-muted-foreground">
                  Type or speak what's on your mind. I'll listen and offer support.
                </p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Listening...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-card">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type what's on your mind..."
                className="min-h-[60px] resize-none"
                disabled={isLoading || isRecording}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  disabled={isLoading}
                  className="h-[60px] w-[60px]"
                >
                  {isRecording ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
                {input && (
                  <Button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="h-[60px] w-[60px]"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
            
            {isSpeaking && (
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span>Speaking...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
