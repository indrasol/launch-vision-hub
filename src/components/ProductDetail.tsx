
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Edit, Trash2, Share2, Download } from "lucide-react";
import SearchVolumeChart from "./SearchVolumeChart";

interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    tagline: string;
    description: string;
    opportunityScore: number;
    problemScore: number;
    feasibilityScore: number;
    whyNowScore: number;
    searchVolume: {
      keyword: string;
      monthlyVolume: number;
      growthPercentage: number;
      chartData: Array<{ month: string; volume: number }>;
    };
    businessFit: {
      revenueScore: number;
      executionScore: number;
      marketScore: number;
      founderScore: number;
    };
    communitySignals: Array<{
      platform: string;
      score: number;
      members: string;
      engagement: string;
    }>;
    category: {
      type: string;
      market: string;
      target: string;
      competitor: string;
    };
    offerings: Array<{
      tier: string;
      name: string;
      price: string;
      description: string;
    }>;
    marketAnalysis: string;
    whyNowExplanation: string;
  };
  onBack: () => void;
}

const ProductDetail = ({ product, onBack }: ProductDetailProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50";
    if (score >= 6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getRevenueIndicator = (score: number) => {
    const dollarCount = Math.max(1, Math.ceil(score / 2.5));
    return "$".repeat(dollarCount);
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      Reddit: "bg-orange-100 text-orange-800",
      Facebook: "bg-blue-100 text-blue-800", 
      YouTube: "bg-red-100 text-red-800",
      Other: "bg-gray-100 text-gray-800"
    };
    return colors[platform as keyof typeof colors] || colors.Other;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{product.tagline}</p>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Opportunity", score: product.opportunityScore, description: "Exceptional" },
              { label: "Problem", score: product.problemScore, description: "Severe Pain" },
              { label: "Feasibility", score: product.feasibilityScore, description: "Challenging" },
              { label: "Why Now", score: product.whyNowScore, description: "Perfect Timing" }
            ].map((metric) => (
              <Card key={metric.label}>
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-bold mb-1 ${getScoreColor(metric.score).split(' ')[0]}`}>
                    {metric.score}
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">{metric.label}</div>
                  <div className="text-xs text-gray-500">{metric.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Core Description */}
            <Card>
              <CardHeader>
                <CardTitle>Product Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>

            {/* Search Volume Chart */}
            <SearchVolumeChart 
              data={product.searchVolume.chartData}
              keyword={product.searchVolume.keyword}
              monthlyVolume={product.searchVolume.monthlyVolume}
              growthPercentage={product.searchVolume.growthPercentage}
            />

            {/* Business Fit */}
            <Card>
              <CardHeader>
                <CardTitle>Business Fit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Revenue Potential</span>
                      <span className="text-lg font-bold text-green-600">
                        {getRevenueIndicator(product.businessFit.revenueScore)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">$10M-$100M ARR potential</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Execution Difficulty</span>
                      <span className="font-bold">{product.businessFit.executionScore}/10</span>
                    </div>
                    <Progress value={product.businessFit.executionScore * 10} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Go-To-Market</span>
                      <span className="font-bold">{product.businessFit.marketScore}/10</span>
                    </div>
                    <Progress value={product.businessFit.marketScore * 10} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Founder Fit</span>
                      <span className="font-bold">{product.businessFit.founderScore}/10</span>
                    </div>
                    <Progress value={product.businessFit.founderScore * 10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Now Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Why Now?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{product.whyNowExplanation}</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Market Analysis</h4>
                  <p className="text-blue-800 text-sm">{product.marketAnalysis}</p>
                </div>
              </CardContent>
            </Card>

            {/* Offering Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Offering Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {product.offerings.map((offer, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{offer.tier}</Badge>
                        <span className="font-bold text-lg">{offer.price}</span>
                      </div>
                      <h4 className="font-semibold mb-2">{offer.name}</h4>
                      <p className="text-sm text-gray-600">{offer.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categorization */}
            <Card>
              <CardHeader>
                <CardTitle>Categorization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Type</span>
                  <p className="font-semibold">{product.category.type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Market</span>
                  <p className="font-semibold">{product.category.market}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Target</span>
                  <p className="font-semibold">{product.category.target}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Main Competitor</span>
                  <p className="font-semibold">{product.category.competitor}</p>
                </div>
              </CardContent>
            </Card>

            {/* Community Signals */}
            <Card>
              <CardHeader>
                <CardTitle>Community Signals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.communitySignals.map((signal, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getPlatformColor(signal.platform)}>{signal.platform}</Badge>
                      <div>
                        <div className="text-sm font-medium">{signal.members}</div>
                        <div className="text-xs text-gray-500">{signal.engagement}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{signal.score}/10</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
