import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { WebMetricsForm } from "@/components/web-tools/WebMetricsForm";
import { ConsoleOutput } from "@/components/web-tools/ConsoleOutput";
import { MetricsDisplay } from "@/components/web-tools/MetricsDisplay";
import { AppSidebar } from "@/components/AppSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export default function WebTools() {
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<Array<{ metric: string; value: string }>>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const analyzeWebsite = async (url: string) => {
    setIsLoading(true);
    setLogs([]);
    try {
      // Simulate analysis with detailed checks
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const newMetrics = [
        // Performance Metrics
        { metric: "Load Time", value: "1.2s" },
        { metric: "First Paint", value: "0.8s" },
        { metric: "First Contentful Paint", value: "1.0s" },
        { metric: "Largest Contentful Paint", value: "2.1s" },
        { metric: "Time to Interactive", value: "2.5s" },
        { metric: "Cumulative Layout Shift", value: "0.12" },
        
        // SEO Metrics
        { metric: "Meta Description", value: "Present" },
        { metric: "Title Tag", value: "Present" },
        { metric: "Canonical URL", value: "Present" },
        { metric: "robots.txt", value: "Present" },
        { metric: "XML Sitemap", value: "Missing" },
        { metric: "Schema Markup", value: "Present" },
        
        // Security Checks
        { metric: "HTTPS", value: "Yes" },
        { metric: "Content Security Policy", value: "Present" },
        { metric: "X-Frame-Options", value: "Present" },
        { metric: "HSTS", value: "Present" },
        { metric: "XSS Protection", value: "Missing" },
        
        // Accessibility
        { metric: "ARIA Labels", value: "Present" },
        { metric: "Alt Tags", value: "Present" },
        { metric: "Color Contrast", value: "Passed" },
        { metric: "Keyboard Navigation", value: "Supported" },
        { metric: "Skip Links", value: "Missing" },
        
        // Technical Stack
        { metric: "Framework Detection", value: "React" },
        { metric: "JavaScript Libraries", value: "15" },
        { metric: "CSS Framework", value: "Tailwind" },
        
        // Content Analysis
        { metric: "Word Count", value: "2500" },
        { metric: "Images", value: "12" },
        { metric: "Videos", value: "2" },
        { metric: "External Links", value: "8" },
        
        // Best Practices
        { metric: "Inline Styles", value: "None" },
        { metric: "Script Count", value: "5" },
        { metric: "Resource Hints", value: "Present" },
      ];

      setMetrics(newMetrics);
      setLogs((prev) => [...prev, `✅ Analysis completed for ${url}`]);
      toast({
        title: "Analysis Complete",
        description: "Website metrics have been successfully analyzed.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Web Development Tools</h1>
          
          <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border">
            <ResizablePanel defaultSize={70}>
              <div className="h-full p-6">
                <div className="space-y-6">
                  <WebMetricsForm onAnalyze={analyzeWebsite} isLoading={isLoading} />
                  {metrics.length > 0 && <MetricsDisplay metrics={metrics} />}
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={30}>
              <div className="h-full p-6">
                <ConsoleOutput logs={logs} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </main>
    </div>
  );
}