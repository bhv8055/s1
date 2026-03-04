"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Upload, X, Loader2, User, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleHealthAnalysis, type AnalysisState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import AnalysisResult from "./analysis-result";
import { fileToBase64 } from "@/lib/utils";
import { Label } from "./ui/label";
import type { HealthAnalysisOutput } from "@/ai/flows/health-analyzer-flow";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  prompt?: string;
  imagePreview?: string;
  result?: HealthAnalysisOutput;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        "Send for Analysis"
      )}
    </Button>
  );
}

export default function HealthAnalyzer() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: "Image too large",
          description: "Please upload an image smaller than 4MB.",
          variant: "destructive",
        });
        return;
      }
      setImagePreview(URL.createObjectURL(file));
      const base64 = await fileToBase64(file);
      setPhotoDataUri(base64);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setPhotoDataUri("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const prompt = formData.get("prompt") as string;
    
    const userMessage: Message = {
      role: "user",
      prompt: prompt || "Please analyze the image.",
      imagePreview: imagePreview ?? undefined,
    };

    setMessages((prev) => [...prev, userMessage]);

    startTransition(async () => {
      const resultState: AnalysisState = await handleHealthAnalysis(
        {} as AnalysisState,
        formData
      );

      if (resultState.error) {
        toast({
          title: "Analysis Failed",
          description: resultState.error,
          variant: "destructive",
        });
        const errorMessage: Message = {
            role: 'assistant',
            result: {
                diseaseName: "Error",
                cause: "Analysis failed.",
                treatment: resultState.error || "An unknown error occurred.",
                routine: "Please try again.",
                encouragement: "If the problem persists, please contact support."
            }
        }
        setMessages(prev => [...prev, errorMessage]);
      }

      if (resultState.result) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", result: resultState.result! },
        ]);
      }
    });

    formRef.current?.reset();
    handleRemoveImage();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center p-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 font-headline tracking-tight">
          Advanced AI Health Analyzer
        </h1>
        <p className="text-md text-muted-foreground max-w-2xl mx-auto">
          Get instant, preliminary insights into your health via text or images.
        </p>
      </div>

      <ScrollArea className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div key={index} className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                {message.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="flex-1">
                {message.role === "user" && (
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      {message.prompt && (
                        <p className="mb-4">{message.prompt}</p>
                      )}
                      {message.imagePreview && (
                        <Image
                          src={message.imagePreview}
                          alt="User submission"
                          width={200}
                          height={150}
                          className="rounded-lg"
                          data-ai-hint="user submission"
                        />
                      )}
                    </CardContent>
                  </Card>
                )}
                {message.role === "assistant" && message.result && (
                  <AnalysisResult result={message.result} />
                )}
              </div>
            </div>
          ))}
          {isPending && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-accent text-accent-foreground">
                <Bot size={20} />
              </div>
              <div className="flex-1">
                <Card className="bg-card/50">
                  <CardContent className="pt-6 flex items-center gap-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                      SwastyaScan is analyzing...
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
           <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 md:p-6 border-t bg-card">
        <div className="max-w-4xl mx-auto">
            <form ref={formRef} action={handleSubmit} className="space-y-4">
             <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                <Label htmlFor="skin-image" className="sr-only">Upload Image</Label>
                 <div className="relative group w-full md:w-48 aspect-video rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/20">
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="Symptom photo preview"
                        fill
                        objectFit="cover"
                        data-ai-hint="health symptom"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground p-2">
                      <Upload className="mx-auto h-8 w-8" />
                      <p className="text-xs mt-1">Upload Image</p>
                    </div>
                  )}
                  <input
                    id="skin-image"
                    ref={fileInputRef}
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageChange}
                  />
                </div>
                <input
                  type="hidden"
                  name="photoDataUri"
                  value={photoDataUri}
                />
              </div>

                <div className="flex-1">
                    <Label htmlFor="prompt" className="sr-only">Describe Symptoms</Label>
                    <Textarea
                    id="prompt"
                    name="prompt"
                    placeholder="e.g., 'I have an itchy red patch on my arm...' or 'I've been experiencing chest pain...'"
                    rows={3}
                    className="h-full resize-none"
                    />
                </div>
              </div>

              <SubmitButton />
            </form>
            <div className="mt-4 text-center text-xs text-muted-foreground">
                <p><strong>Disclaimer:</strong> SwastyaScan is not a substitute for professional medical advice.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
