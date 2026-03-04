"use client";

import {
  HeartPulse,
  FlaskConical,
  ClipboardList,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { AnalyzeHeartSymptomsOutput } from "@/ai/flows/analyze-heart-symptoms";
import type { AnalyzeSkinConditionOutput } from "@/ai/flows/analyze-skin-condition";

type AnalysisResultProps = {
  result: AnalyzeHeartSymptomsOutput | AnalyzeSkinConditionOutput;
  onReset: () => void;
};

export default function AnalysisResult({ result, onReset }: AnalysisResultProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl text-primary flex items-center gap-2">
          Analysis Complete
        </CardTitle>
        <CardDescription>
          Here is the AI-generated preliminary analysis based on the information provided.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Sparkles className="h-4 w-4 text-accent" />
          <AlertTitle className="text-xl font-bold">{result.diseaseName}</AlertTitle>
          <AlertDescription>
            This is a potential condition based on our AI's analysis.
          </AlertDescription>
        </Alert>

        <Accordion type="single" collapsible defaultValue="cause" className="w-full">
          <AccordionItem value="cause">
            <AccordionTrigger className="text-lg">
              <HeartPulse className="mr-2 text-primary" />
              Potential Cause
            </AccordionTrigger>
            <AccordionContent className="text-base">
              {result.cause}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="treatment">
            <AccordionTrigger className="text-lg">
              <FlaskConical className="mr-2 text-primary" />
              Suggested Treatment
            </AccordionTrigger>
            <AccordionContent className="text-base">
              {result.treatment}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="routine">
            <AccordionTrigger className="text-lg">
              <ClipboardList className="mr-2 text-primary" />
              Recommended Routine
            </AccordionTrigger>
            <AccordionContent className="text-base">
              {result.routine}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Alert variant="default" className="bg-primary/10 border-primary/20">
            <Sparkles className="h-4 w-4 !text-primary" />
            <AlertTitle className="font-semibold text-primary">A Word of Encouragement</AlertTitle>
            <AlertDescription className="text-primary/80">
              {result.encouragement}
            </AlertDescription>
        </Alert>

      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button onClick={onReset} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Start New Analysis
        </Button>
        <p className="text-xs text-muted-foreground text-center">
            <strong>Disclaimer:</strong> This is an AI-generated analysis and not a medical diagnosis. Consult with a qualified healthcare professional for accurate medical advice.
        </p>
      </CardFooter>
    </Card>
  );
}
