import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeartAnalyzer from '@/components/heart-analyzer';
import SkinAnalyzer from '@/components/skin-analyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeartPulse, ScanSearch } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-headline tracking-tight">
              Advanced AI Health Analysis
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant insights into your health. Our AI-powered tools provide preliminary analysis of skin and heart-related symptoms.
            </p>
          </div>

          <Tabs defaultValue="skin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto rounded-lg">
              <TabsTrigger value="skin" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ScanSearch className="mr-2 size-5" />
                Skin Analyzer
              </TabsTrigger>
              <TabsTrigger value="heart" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <HeartPulse className="mr-2 size-5" />
                Heart Analyzer
              </TabsTrigger>
            </TabsList>
            <TabsContent value="skin" className="mt-6">
              <SkinAnalyzer />
            </TabsContent>
            <TabsContent value="heart" className="mt-6">
              <HeartAnalyzer />
            </TabsContent>
          </Tabs>
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p><strong>Disclaimer:</strong> SwastyaScan is an AI-powered tool for preliminary analysis and is not a substitute for professional medical advice. Please consult a qualified healthcare provider for any health concerns.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
