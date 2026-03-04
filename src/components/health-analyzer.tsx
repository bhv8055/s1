"use client";

import { useState, useTransition, useRef } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Upload, X, Loader2, User, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleHealthAnalysis, type AnalysisState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AnalysisResult from "./analysis-result";
import { fileToBase64 } from "@/lib/utils";
import { Label } from "./ui/label";
import type { HealthAnalysisOutput } from "@/ai/flows/health-analyzer-flow";

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        // 4MB limit for some models
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

    // Using the imagePreview from state for the user message.
    const userMessage: Message = {
      role: "user",
      prompt: prompt || "Please analyze the image.",
      imagePreview: imagePreview ?? undefined,
    };

    setMessages((prev) => [...prev, userMessage]);

    startTransition(async () => {
      // The action expects prevState as first argument, we can pass an empty object.
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
        // Remove the user's message if the analysis fails to avoid clutter
        setMessages((prev) => prev.slice(0, -1));
      }

      if (resultState.result) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", result: resultState.result! },
        ]);
        // Reset form for next message
        formRef.current?.reset();
        handleRemoveImage();
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
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
        {isPending &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "user" && (
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
      </div>

      <div className="sticky bottom-4 z-10">
        <Card className="overflow-hidden shadow-2xl">
          <CardHeader>
            <CardTitle>What are your symptoms?</CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="skin-image">Upload Image (Optional)</Label>
                <div className="relative group w-full aspect-[3/2] rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/20">
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="Symptom photo preview"
                        layout="fill"
                        objectFit="contain"
                        data-ai-hint="health symptom"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Upload className="mx-auto h-12 w-12" />
                      <p>Click to upload or drag and drop</p>
                      <p className="text-xs">PNG, JPG, or WEBP (Max 4MB)</p>
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
              <div className="space-y-2">
                <Label htmlFor="prompt">Describe Symptoms (Optional)</Label>
                <Textarea
                  id="prompt"
                  name="prompt"
                  placeholder="e.g., 'I have an itchy red patch on my arm...' or 'I've been experiencing chest pain and shortness of breath...'"
                  rows={4}
                />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
