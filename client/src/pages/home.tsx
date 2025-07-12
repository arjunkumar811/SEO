import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Download, HelpCircle, SearchCheck } from "lucide-react";
import UrlInput from "@/components/url-input";
import SeoOverview from "@/components/seo-overview";
import SeoAnalysis from "@/components/seo-analysis";
import PreviewSection from "@/components/preview-section";
import Recommendations from "@/components/recommendations";

export default function Home() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
    setIsLoading(false);
  };

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setAnalysisData(null);
  };

  const handleExport = () => {
    if (!analysisData) return;
    
    const exportData = {
      url: analysisData.url,
      score: analysisData.score,
      title: analysisData.title,
      description: analysisData.description,
      recommendations: analysisData.recommendations,
      analyzedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <SearchCheck className="text-seo-blue text-2xl mr-3" />
              <h1 className="text-xl font-bold text-gray-900">SEO Meta Analyzer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleExport}
                disabled={!analysisData}
                className="bg-seo-blue hover:bg-blue-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* URL Input */}
        <UrlInput 
          onAnalysisStart={handleAnalysisStart}
          onAnalysisComplete={handleAnalysisComplete}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-seo-blue mr-3"></div>
              <span className="text-gray-600">Analyzing website SEO tags...</span>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisData && !isLoading && (
          <>
            <SeoOverview data={analysisData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SeoAnalysis data={analysisData} />
              <PreviewSection data={analysisData} />
            </div>

            <Recommendations data={analysisData} />
          </>
        )}
      </main>
    </div>
  );
}
