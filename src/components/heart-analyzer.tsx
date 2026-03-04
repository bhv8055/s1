"use client";

import { useEffect, useRef, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleHeartAnalysis, type HeartAnalysisState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnalysisResult from "./analysis-result";
import { Label } from "./ui/label";

const initialState: HeartAnalysisState = {
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
        "Analyze Heart Symptoms"
      )}
    </Button>
  );
}

export default function HeartAnalyzer() {
  const [state, formAction] = useFormState(handleHeartAnalysis, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.error) {
      toast({
        title: "Analysis Failed",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state.error, toast]);

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
          // A bit of a hack to reset the form state
          window.location.reload();
        }}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Heart Symptom Analyzer</CardTitle>
        <CardDescription>
          Describe your symptoms in detail. The more information you provide, the more accurate the AI analysis will be.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symptoms">Describe your symptoms</Label>
            <Textarea
              id="symptoms"
              name="symptoms"
              placeholder="e.g., 'I've been experiencing chest pain and shortness of breath, especially during light physical activity. Sometimes my heart feels like it's racing.'"
              rows={6}
              required
              minLength={10}
            />
            {state.fieldErrors?.symptoms && (
              <p className="text-sm font-medium text-destructive">{state.fieldErrors.symptoms[0]}</p>
            )}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
