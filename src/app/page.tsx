import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HealthAnalyzer from '@/components/health-analyzer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-headline tracking-tight">
              Advanced AI Health Analyzer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant, preliminary insights into your health. Our AI-powered tool analyzes your symptoms and/or photos to provide a helpful analysis.
            </p>
          </div>

          <HealthAnalyzer />
          
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p><strong>Disclaimer:</strong> SwastyaScan is an AI-powered tool for preliminary analysis and is not a substitute for professional medical advice. Please consult a qualified healthcare provider for any health concerns.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
