import { Card, CardContent } from "@/components/ui/card";
import { Globe, Info, AlertTriangle } from "lucide-react";
import { getDomainFromUrl } from "@/lib/seo-utils";

interface PreviewSectionProps {
  data: {
    url: string;
    title: string;
    description: string;
    ogTags: Record<string, string>;
    twitterTags: Record<string, string>;
    analysis: {
      twitterAnalysis: { status: string };
    };
  };
}

export default function PreviewSection({ data }: PreviewSectionProps) {
  const domain = getDomainFromUrl(data.url);
  const previewTitle = data.title || data.ogTags['og:title'] || 'No title';
  const previewDescription = data.description || data.ogTags['og:description'] || 'No description';
  const previewImage = data.ogTags['og:image'] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';

  return (
    <div className="space-y-6">
      {/* Google Search Preview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Google Search Preview</h3>

          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="h-4 w-4 mr-2" />
                <span>{data.url}</span>
              </div>
              <h4 className="text-lg text-blue-600 hover:underline cursor-pointer">
                {previewTitle}
              </h4>
              <p className="text-sm text-gray-700">
                {previewDescription}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              This is how your page will appear in Google search results
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Facebook Preview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Facebook Preview</h3>

          <div className="border rounded-lg overflow-hidden">
            <img
              src={previewImage}
              alt="Facebook preview"
              className="w-full h-48 object-cover"
            />
            <div className="p-4 bg-gray-50">
              <p className="text-xs text-gray-500 uppercase mb-1">{domain}</p>
              <h4 className="font-semibold text-gray-900 mb-1">
                {previewTitle}
              </h4>
              <p className="text-sm text-gray-600">
                {previewDescription}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              This is how your page will appear when shared on Facebook
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Twitter Preview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Twitter Preview</h3>

          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="font-semibold text-gray-900">Your Company</p>
                <p className="text-sm text-gray-500">@yourcompany</p>
              </div>
            </div>

            <p className="text-gray-900 mb-3">
              Check out our latest content and resources!
            </p>

            <div className="border rounded-lg overflow-hidden">
              <img
                src={previewImage}
                alt="Twitter preview"
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <p className="text-sm text-gray-500 mb-1">{domain}</p>
                <h4 className="font-semibold text-gray-900 text-sm">
                  {previewTitle}
                </h4>
              </div>
            </div>
          </div>

          <div className={`mt-4 p-3 rounded-lg ${
            data.analysis.twitterAnalysis.status === 'error' 
              ? 'bg-yellow-50 border border-yellow-200' 
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className={`text-sm flex items-center ${
              data.analysis.twitterAnalysis.status === 'error' 
                ? 'text-yellow-800' 
                : 'text-blue-800'
            }`}>
              {data.analysis.twitterAnalysis.status === 'error' ? (
                <AlertTriangle className="h-4 w-4 mr-2" />
              ) : (
                <Info className="h-4 w-4 mr-2" />
              )}
              {data.analysis.twitterAnalysis.status === 'error' 
                ? 'Twitter Card tags are missing. This preview shows fallback behavior.'
                : 'This is how your page will appear when shared on Twitter'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
