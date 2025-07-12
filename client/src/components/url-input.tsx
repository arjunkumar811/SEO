import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UrlInputProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (data: any) => void;
}

export default function UrlInput({ onAnalysisStart, onAnalysisComplete }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze-seo", { url });
      return response.json();
    },
    onSuccess: (data) => {
      onAnalysisComplete(data);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${data.url}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze website",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    onAnalysisStart();
    analyzeMutation.mutate(url);
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Analyze Website SEO Meta Tags
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="Enter website URL (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seo-blue focus:border-transparent"
              />
              <div className="mt-2 text-sm text-gray-500 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Enter a valid URL to analyze its SEO meta tags and get optimization recommendations
              </div>
            </div>
            <Button
              type="submit"
              disabled={analyzeMutation.isPending || !url.trim()}
              className="bg-seo-blue hover:bg-blue-600 px-6 py-3"
            >
              <Search className="h-4 w-4 mr-2" />
              {analyzeMutation.isPending ? "Analyzing..." : "Analyze SEO"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
