import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface SeoOverviewProps {
  data: {
    score: number;
    analysis: {
      titleAnalysis: { status: string };
      descriptionAnalysis: { status: string };
      ogAnalysis: { status: string };
      twitterAnalysis: { status: string };
    };
  };
}

export default function SeoOverview({ data }: SeoOverviewProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="text-seo-success text-xl" />;
      case 'warning':
        return <AlertTriangle className="text-seo-warning text-xl" />;
      case 'error':
        return <XCircle className="text-seo-error text-xl" />;
      default:
        return <XCircle className="text-seo-error text-xl" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good':
        return 'Good';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Missing';
      default:
        return 'Missing';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-seo-success';
    if (score >= 60) return 'text-seo-warning';
    return 'text-seo-error';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-seo-success/10';
    if (score >= 60) return 'bg-seo-warning/10';
    return 'bg-seo-error/10';
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">SEO Overview</h2>
          <div className={`flex items-center ${getScoreBg(data.score)} px-3 py-1 rounded-full`}>
            <div className={`w-2 h-2 ${getScoreColor(data.score).replace('text-', 'bg-')} rounded-full mr-2`}></div>
            <span className={`${getScoreColor(data.score)} text-sm font-medium`}>
              {data.score}/100
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Title Tag</p>
                <p className={`text-lg font-semibold ${
                  data.analysis.titleAnalysis.status === 'good' ? 'text-seo-success' :
                  data.analysis.titleAnalysis.status === 'warning' ? 'text-seo-warning' :
                  'text-seo-error'
                }`}>
                  {getStatusText(data.analysis.titleAnalysis.status)}
                </p>
              </div>
              {getStatusIcon(data.analysis.titleAnalysis.status)}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Meta Description</p>
                <p className={`text-lg font-semibold ${
                  data.analysis.descriptionAnalysis.status === 'good' ? 'text-seo-success' :
                  data.analysis.descriptionAnalysis.status === 'warning' ? 'text-seo-warning' :
                  'text-seo-error'
                }`}>
                  {getStatusText(data.analysis.descriptionAnalysis.status)}
                </p>
              </div>
              {getStatusIcon(data.analysis.descriptionAnalysis.status)}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Graph</p>
                <p className={`text-lg font-semibold ${
                  data.analysis.ogAnalysis.status === 'good' ? 'text-seo-success' :
                  data.analysis.ogAnalysis.status === 'warning' ? 'text-seo-warning' :
                  'text-seo-error'
                }`}>
                  {getStatusText(data.analysis.ogAnalysis.status)}
                </p>
              </div>
              {getStatusIcon(data.analysis.ogAnalysis.status)}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Twitter Cards</p>
                <p className={`text-lg font-semibold ${
                  data.analysis.twitterAnalysis.status === 'good' ? 'text-seo-success' :
                  data.analysis.twitterAnalysis.status === 'warning' ? 'text-seo-warning' :
                  'text-seo-error'
                }`}>
                  {getStatusText(data.analysis.twitterAnalysis.status)}
                </p>
              </div>
              {getStatusIcon(data.analysis.twitterAnalysis.status)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
