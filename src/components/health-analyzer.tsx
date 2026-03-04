"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleHealthAnalysis, type AnalysisState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnalysisResult from "./analysis-result";
import { fileToBase64 } from "@/lib/utils";
import { Label } from "./ui/label";

const initialState: AnalysisState = {
  message: null,
  result: null,
  error: null,
  fieldErrors: {},
};

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
        "Analyze"
      )}
    </Button>
  );
}

export default function HealthAnalyzer() {
  const [state, formAction] = useFormState(handleHealthAnalysis, initialState);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string>("");

  useEffect(() => {
    if (state.error) {
      toast({
        title: "Analysis Failed",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
  
  const handleReset = () => {
    formRef.current?.reset();
    handleRemoveImage();
    // A bit of a hack to reset the form state
    window.location.reload(); 
  }

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
        formAction(formData);
    });
  }

  if (state.result) {
    return (
      <AnalysisResult
        result={state.result}
        onReset={handleReset}
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>AI Health Analyzer</CardTitle>
        <CardDescription>
          Upload a photo of a visible condition or describe your internal symptoms for an AI-powered analysis. You can provide both for a more accurate result.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="skin-image">Upload Image (Optional)</Label>
            <div className="relative group w-full aspect-[3/2] rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/20">
              {imagePreview ? (
                <>
                  <Image src={imagePreview} alt="Symptom photo preview" layout="fill" objectFit="contain" data-ai-hint="health analysis"/>
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
                  <p className="text-xs">PNG, JPG, or WEBP</p>
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
            <input type="hidden" name="photoDataUri" value={photoDataUri} />
            {state.fieldErrors?.photoDataUri && (
                <p className="text-sm font-medium text-destructive">{state.fieldErrors.photoDataUri[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe Symptoms (Optional)</Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="e.g., 'I have an itchy red patch on my arm...' or 'I've been experiencing chest pain and shortness of breath...'"
              rows={4}
            />
            {state.fieldErrors?.prompt && (
              <p className="text-sm font-medium text-destructive">{state.fieldErrors.prompt[0]}</p>
            )}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
