"use client";

import {
  HeartPulse,
  FlaskConical,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
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
import type { HealthAnalysisOutput } from "@/ai/flows/health-analyzer-flow";

type AnalysisResultProps = {
  result: HealthAnalysisOutput;
};

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center gap-2">
          AI Preliminary Analysis
        </CardTitle>
        <CardDescription>
          Based on the information provided, here's a potential analysis.
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
    </Card>
  );
}
