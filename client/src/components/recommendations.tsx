import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

interface RecommendationsProps {
  data: {
    recommendations: string[];
    analysis: {
      titleAnalysis: { status: string };
      descriptionAnalysis: { status: string };
      ogAnalysis: { status: string };
      twitterAnalysis: { status: string };
    };
  };
}

export default function Recommendations({ data }: RecommendationsProps) {
  const getPriorityLevel = (recommendation: string) => {
    const lowerRec = recommendation.toLowerCase();
    if (lowerRec.includes('twitter') || lowerRec.includes('title tag is missing')) {
      return 'high';
    }
    if (lowerRec.includes('meta description') || lowerRec.includes('open graph')) {
      return 'medium';
    }
    return 'low';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-seo-error" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-seo-warning" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-seo-success" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-seo-warning" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-seo-error';
      case 'medium':
        return 'border-seo-warning';
      case 'low':
        return 'border-seo-success';
      default:
        return 'border-seo-warning';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Medium Priority';
    }
  };

  // Group recommendations by priority
  const groupedRecommendations = {
    high: data.recommendations.filter(rec => getPriorityLevel(rec) === 'high'),
    medium: data.recommendations.filter(rec => getPriorityLevel(rec) === 'medium'),
    low: data.recommendations.filter(rec => getPriorityLevel(rec) === 'low')
  };

  const allRecommendations = [
    ...groupedRecommendations.high.map(rec => ({ text: rec, priority: 'high' })),
    ...groupedRecommendations.medium.map(rec => ({ text: rec, priority: 'medium' })),
    ...groupedRecommendations.low.map(rec => ({ text: rec, priority: 'low' }))
  ];

  // Add some general recommendations based on analysis
  const generalRecommendations = [];
  if (data.analysis.titleAnalysis.status === 'good' && data.analysis.descriptionAnalysis.status === 'good') {
    generalRecommendations.push({ text: 'Consider adding structured data markup for rich snippets', priority: 'low' });
  }

  const finalRecommendations = [...allRecommendations, ...generalRecommendations];

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Recommendations</h3>

        {finalRecommendations.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-seo-success mx-auto mb-4" />
            <p className="text-gray-600">Great job! No major SEO issues found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {finalRecommendations.map((rec, index) => (
              <div key={index} className={`border-l-4 ${getPriorityColor(rec.priority)} pl-4 py-2`}>
                <div className="flex items-start">
                  {getPriorityIcon(rec.priority)}
                  <div className="ml-2">
                    <h4 className="font-medium text-gray-900">{getPriorityText(rec.priority)}</h4>
                    <p className="text-sm text-gray-600">{rec.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
