import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, ThumbsUp, Lightbulb, CircleAlert } from "lucide-react";

interface SeoAnalysisProps {
  data: {
    title: string;
    description: string;
    ogTags: Record<string, string>;
    twitterTags: Record<string, string>;
    analysis: {
      titleAnalysis: { length: number; status: string; message: string };
      descriptionAnalysis: { length: number; status: string; message: string };
      ogAnalysis: { present: number; total: number; status: string; message: string };
      twitterAnalysis: { present: number; total: number; status: string; message: string };
    };
  };
}

export default function SeoAnalysis({ data }: SeoAnalysisProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="text-seo-success ml-1" />;
      case 'warning':
        return <AlertTriangle className="text-seo-warning ml-1" />;
      case 'error':
        return <XCircle className="text-seo-error ml-1" />;
      default:
        return <XCircle className="text-seo-error ml-1" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "flex items-center px-2 py-1 rounded-full";
    switch (status) {
      case 'good':
        return `${baseClasses} bg-seo-success/10`;
      case 'warning':
        return `${baseClasses} bg-seo-warning/10`;
      case 'error':
        return `${baseClasses} bg-seo-error/10`;
      default:
        return `${baseClasses} bg-seo-error/10`;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-seo-success';
      case 'warning':
        return 'text-seo-warning';
      case 'error':
        return 'text-seo-error';
      default:
        return 'text-seo-error';
    }
  };

  const getAlertIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <ThumbsUp className="mr-2" />;
      case 'warning':
        return <Lightbulb className="mr-2" />;
      case 'error':
        return <CircleAlert className="mr-2" />;
      default:
        return <CircleAlert className="mr-2" />;
    }
  };

  const getAlertClasses = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const requiredOgTags = ['og:title', 'og:description', 'og:image', 'og:url'];
  const requiredTwitterTags = ['twitter:card', 'twitter:site', 'twitter:creator'];

  return (
    <div className="space-y-6">
      {/* Title Tag Analysis */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Title Tag Analysis</h3>
            <div className={getStatusBadge(data.analysis.titleAnalysis.status)}>
              <div className={`w-2 h-2 ${getStatusColor(data.analysis.titleAnalysis.status).replace('text-', 'bg-')} rounded-full mr-2`}></div>
              <span className={`${getStatusColor(data.analysis.titleAnalysis.status)} text-sm`}>
                {getStatusText(data.analysis.titleAnalysis.status)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="border rounded-lg p-3 bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">Current Title</p>
              <p className="text-gray-900 font-medium">
                {data.title || 'No title found'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Length:</span>
                <span className="ml-2 font-medium">{data.analysis.titleAnalysis.length} characters</span>
                {getStatusIcon(data.analysis.titleAnalysis.status)}
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-2 font-medium">{getStatusText(data.analysis.titleAnalysis.status)}</span>
                {getStatusIcon(data.analysis.titleAnalysis.status)}
              </div>
            </div>

            <div className={`border rounded-lg p-3 ${getAlertClasses(data.analysis.titleAnalysis.status)}`}>
              <p className="text-sm flex items-center">
                {getAlertIcon(data.analysis.titleAnalysis.status)}
                {data.analysis.titleAnalysis.message}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta Description Analysis */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Meta Description Analysis</h3>
            <div className={getStatusBadge(data.analysis.descriptionAnalysis.status)}>
              <div className={`w-2 h-2 ${getStatusColor(data.analysis.descriptionAnalysis.status).replace('text-', 'bg-')} rounded-full mr-2`}></div>
              <span className={`${getStatusColor(data.analysis.descriptionAnalysis.status)} text-sm`}>
                {getStatusText(data.analysis.descriptionAnalysis.status)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="border rounded-lg p-3 bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">Current Description</p>
              <p className="text-gray-900">
                {data.description || 'No description found'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Length:</span>
                <span className="ml-2 font-medium">{data.analysis.descriptionAnalysis.length} characters</span>
                {getStatusIcon(data.analysis.descriptionAnalysis.status)}
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-2 font-medium">{getStatusText(data.analysis.descriptionAnalysis.status)}</span>
                {getStatusIcon(data.analysis.descriptionAnalysis.status)}
              </div>
            </div>

            <div className={`border rounded-lg p-3 ${getAlertClasses(data.analysis.descriptionAnalysis.status)}`}>
              <p className="text-sm flex items-center">
                {getAlertIcon(data.analysis.descriptionAnalysis.status)}
                {data.analysis.descriptionAnalysis.message}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Graph Analysis */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Open Graph Tags</h3>
            <div className={getStatusBadge(data.analysis.ogAnalysis.status)}>
              <div className={`w-2 h-2 ${getStatusColor(data.analysis.ogAnalysis.status).replace('text-', 'bg-')} rounded-full mr-2`}></div>
              <span className={`${getStatusColor(data.analysis.ogAnalysis.status)} text-sm`}>
                {getStatusText(data.analysis.ogAnalysis.status)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              {requiredOgTags.map((tag) => (
                <div key={tag} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{tag}</span>
                  {data.ogTags[tag] ? (
                    <CheckCircle className="text-seo-success" />
                  ) : (
                    <XCircle className="text-seo-error" />
                  )}
                </div>
              ))}
            </div>

            <div className={`border rounded-lg p-3 ${getAlertClasses(data.analysis.ogAnalysis.status)}`}>
              <p className="text-sm flex items-center">
                {getAlertIcon(data.analysis.ogAnalysis.status)}
                {data.analysis.ogAnalysis.message}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Twitter Cards Analysis */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Twitter Cards</h3>
            <div className={getStatusBadge(data.analysis.twitterAnalysis.status)}>
              <div className={`w-2 h-2 ${getStatusColor(data.analysis.twitterAnalysis.status).replace('text-', 'bg-')} rounded-full mr-2`}></div>
              <span className={`${getStatusColor(data.analysis.twitterAnalysis.status)} text-sm`}>
                {getStatusText(data.analysis.twitterAnalysis.status)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              {requiredTwitterTags.map((tag) => (
                <div key={tag} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{tag}</span>
                  {data.twitterTags[tag] ? (
                    <CheckCircle className="text-seo-success" />
                  ) : (
                    <XCircle className="text-seo-error" />
                  )}
                </div>
              ))}
            </div>

            <div className={`border rounded-lg p-3 ${getAlertClasses(data.analysis.twitterAnalysis.status)}`}>
              <p className="text-sm flex items-center">
                {getAlertIcon(data.analysis.twitterAnalysis.status)}
                {data.analysis.twitterAnalysis.message}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
