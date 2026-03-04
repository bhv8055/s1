"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleSkinAnalysis, type SkinAnalysisState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnalysisResult from "./analysis-result";
import { fileToBase64 } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Label } from "./ui/label";

const initialState: SkinAnalysisState = {
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
        "Analyze Skin Condition"
      )}
    </Button>
  );
}

export default function SkinAnalyzer() {
  const [state, formAction] = useFormState(handleSkinAnalysis, initialState);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(PlaceHolderImages.find(p => p.id === 'skin-placeholder')?.imageUrl ?? null);
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
    setImagePreview(PlaceHolderImages.find(p => p.id === 'skin-placeholder')?.imageUrl ?? null);
    setPhotoDataUri("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
        formAction(formData);
    });
  }

  if (state.result) {
    return (
      <AnalysisResult
        result={state.result}
        onReset={() => {
          formRef.current?.reset();
          handleRemoveImage();
          // A bit of a hack to reset the form state
          window.location.reload(); 
        }}
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>AI Skin Disease Analyzer</CardTitle>
        <CardDescription>
          Upload a clear photo of the affected skin area and provide a brief description for an AI-powered analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="skin-image">Skin Image</Label>
            <div className="relative group w-full aspect-[3/2] rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <>
                  <Image src={imagePreview} alt="Skin condition preview" layout="fill" objectFit="cover" data-ai-hint="skin analysis"/>
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
            <Label htmlFor="description">Optional Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="e.g., 'Itchy red patch on my arm for 3 days, getting slightly bigger.'"
              rows={3}
            />
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
