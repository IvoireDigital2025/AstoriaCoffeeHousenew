import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: "Hi! I'm your AI-powered coffee assistant for Coffee Pro. I use artificial intelligence to help answer questions about our authentic Middle Eastern coffee heritage, menu items, and provide personalized recommendations. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      // Local AI simulation with disclosure
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
      const responses = [
        "Thank you for your question! I'm an AI assistant representing Coffee Pro's heritage. For specific menu details or orders, please visit our location at 23-33 Astoria Blvd, Astoria, NY or call us directly.",
        "As your AI assistant, I can share that Coffee Pro celebrates 32+ years of Moroccan and Saudi Arabian coffee traditions. Our authentic Middle Eastern flavors are crafted with traditional methods.",
        "I'm powered by AI to help with general information about Coffee Pro. For personalized service and to experience our authentic hospitality, I recommend visiting our café in person.",
        "Using AI technology, I can tell you about our heritage menu featuring Arabic coffee, Turkish delights, and authentic Middle Eastern pastries. Each item represents our cultural traditions.",
        "As an AI representative of Coffee Pro, I encourage you to explore our mood-based recommendations or visit our Astoria location for the full authentic experience."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return { response: `[AI Response] ${randomResponse}` };
    },
    onSuccess: (data, message) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: data.response,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (error: Error) => {
      toast({
        title: "Chat Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-coffee-primary text-white hover:bg-coffee-medium rounded-full p-4 shadow-lg"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-2 -right-2 bg-coffee-accent text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            <Bot className="w-3 h-3" />
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 h-96 flex flex-col shadow-2xl">
        <CardHeader className="bg-coffee-primary text-white p-4 rounded-t-lg flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span className="font-semibold">Coffee Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-coffee-cream h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 p-0 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.isUser ? "justify-end" : ""
                }`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 bg-coffee-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 max-w-xs ${
                    message.isUser
                      ? "bg-coffee-primary text-white"
                      : "bg-coffee-cream text-coffee-dark"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                </div>
                {message.isUser && (
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-coffee-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-coffee-cream rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-coffee-dark">Typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 focus:border-coffee-primary focus:ring-coffee-primary"
                disabled={chatMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || chatMutation.isPending}
                className="bg-coffee-primary hover:bg-coffee-medium text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by AI - Available 24/7
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
