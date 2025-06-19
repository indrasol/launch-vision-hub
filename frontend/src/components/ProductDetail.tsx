import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Edit, Trash2, Share2, Download } from "lucide-react";
import SearchVolumeChart from "./SearchVolumeChart";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

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

  // Editable state for Competitor Findings
  const [competitorFindings, setCompetitorFindings] = useState(
    product.category.competitor.split(',').map((comp, idx) => ({
      competitor: comp.trim(),
      revenue: '$XXM',
      marketSize: `${Math.round(product.searchVolume.monthlyVolume / 1000) + idx * 10}K`,
    }))
  );
  // Editable state for Competitor Analysis
  const [competitorAnalysis, setCompetitorAnalysis] = useState(
    product.category.competitor.split(',').map((comp) => ({
      competitor: comp.trim(),
      keyGaps: `Key gap for ${comp.trim()}`,
      ourSolution: `How our solution addresses ${comp.trim()}`,
    }))
  );

  // Add row handlers
  const addCompetitorFinding = () => setCompetitorFindings([...competitorFindings, { competitor: '', revenue: '', marketSize: '' }]);
  const addCompetitorAnalysis = () => setCompetitorAnalysis([...competitorAnalysis, { competitor: '', keyGaps: '', ourSolution: '' }]);

  // Edit cell handlers
  const editCompetitorFinding = (idx, field, value) => {
    setCompetitorFindings(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };
  const editCompetitorAnalysis = (idx, field, value) => {
    setCompetitorAnalysis(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
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
          <p className="text-lg text-gray-600 mb-4 font-semibold">Unlocking Growth with Disruptive Innovation for the Modern Market</p>

          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold mb-2 text-blue-600">1B</div>
                <div className="text-sm font-bold text-gray-600">Market Size</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold mb-2 text-green-600">3%</div>
                <div className="text-sm font-bold text-gray-600">Penetration Percentage</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold mb-2 text-purple-600">$1,000</div>
                <div className="text-sm font-bold text-gray-600">ARPU (Average Revenue per User)/Year Needed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold mb-2 text-orange-600">30,000</div>
                <div className="text-sm font-bold text-gray-600">Number of Users Needed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold mb-2 text-red-600">$30M</div>
                <div className="text-sm font-bold text-gray-600">Projected Annual Revenue</div>
              </CardContent>
            </Card>
          </div>

          {/* Constructed Sentence Card */}
          <Card className="mb-8">
            <CardContent className="p-4 text-center">
              <span className="text-lg md:text-xl">
                Assuming a conservative <b className="text-green-600">3% Penetration Rate</b> in a <b className="text-blue-600">Market Size</b> of <b className="text-blue-600">1B</b> with an <b className="text-purple-600">Average Revenue</b> of <b className="text-purple-600">$1,000</b> per users, we would need <b className="text-orange-600">30,000 Users</b> to achieve an <b className="text-red-600">Annual Revenue $30M</b>.
              </span>
              <div className="mt-2 text-lg">
                With market penetration, the revenue potential is <span className="text-blue-600">1B</span> × <span className="text-green-600">3%</span> = <span className="text-red-600">$30M</span>.
              </div>
            </CardContent>
          </Card>

          {/* Market/Area & Target Audience Side by Side (moved below sentence card) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Market/Area Card */}
            <Card>
              <CardHeader>
                <CardTitle>Market / Area</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{product.category.market}</p>
              </CardContent>
            </Card>
            {/* Target Audience Card */}
            <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{product.category.target}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="space-y-8">
          {/* Product Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Product Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>

          {/* Key Gaps & Solution Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Gaps */}
            <Card>
              <CardHeader>
                <CardTitle>Key Gaps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">This section describes the main pain points or challenges that this product addresses for its target users.</p>
              </CardContent>
            </Card>
            {/* Solution */}
            <Card>
              <CardHeader>
                <CardTitle>Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">This section explains how the product solves the problem and what makes the approach effective.</p>
              </CardContent>
            </Card>
          </div>

          {/* User Journey and Real World Scenario Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Journey */}
            <Card>
              <CardHeader>
                <CardTitle>User Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-5 text-gray-700">
                  <li>Step 1: User discovers the product.</li>
                  <li>Step 2: User signs up and sets up their account.</li>
                  <li>Step 3: User experiences the core value and features.</li>
                  <li>Step 4: User achieves their goal or solves their problem.</li>
                </ol>
              </CardContent>
            </Card>
            {/* Real World Scenario Card */}
            <Card>
              <CardHeader>
                <CardTitle>Real World Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">Imagine a user in your target market who faces the key gaps above. This card describes how they would interact with your product in a real-world context, from discovery to value realization.</p>
              </CardContent>
            </Card>
          </div>

          {/* Competitor Findings Table */}
          <Card>
            <CardHeader>
              <CardTitle>Competitor Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competitor</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Revenue</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Size</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {competitorFindings.map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 font-medium text-gray-900">
                          <input className="border rounded px-2 py-1 w-full" value={row.competitor} onChange={e => editCompetitorFinding(idx, 'competitor', e.target.value)} />
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          <input className="border rounded px-2 py-1 w-full" value={row.revenue} onChange={e => editCompetitorFinding(idx, 'revenue', e.target.value)} />
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          <input className="border rounded px-2 py-1 w-full" value={row.marketSize} onChange={e => editCompetitorFinding(idx, 'marketSize', e.target.value)} />
                        </td>
                        <td className="px-2 py-2">
                          <button className="text-red-500 font-bold" onClick={() => setCompetitorFindings(competitorFindings.filter((_, i) => i !== idx))}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={addCompetitorFinding}>Add Row</button>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Analysis Table */}
          <Card>
            <CardHeader>
              <CardTitle>Competitor Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competitor</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Gaps</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Our Solution</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {competitorAnalysis.map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 font-medium text-gray-900">
                          <input className="border rounded px-2 py-1 w-full" value={row.competitor} onChange={e => editCompetitorAnalysis(idx, 'competitor', e.target.value)} />
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          <input className="border rounded px-2 py-1 w-full" value={row.keyGaps} onChange={e => editCompetitorAnalysis(idx, 'keyGaps', e.target.value)} />
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          <input className="border rounded px-2 py-1 w-full" value={row.ourSolution} onChange={e => editCompetitorAnalysis(idx, 'ourSolution', e.target.value)} />
                        </td>
                        <td className="px-2 py-2">
                          <button className="text-red-500 font-bold" onClick={() => setCompetitorAnalysis(competitorAnalysis.filter((_, i) => i !== idx))}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={addCompetitorAnalysis}>Add Row</button>
              </div>
            </CardContent>
          </Card>

          {/* Unique Value Propositions */}
          <Card>
            <CardHeader>
              <CardTitle>Unique Value Propositions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-gray-700">
                <li>UVP 1: What makes this product stand out from competitors.</li>
                <li>UVP 2: Another unique benefit or differentiator.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
          </div>
        </div>

        {/* Revenue Projection Charts (Stacked) */}
        <div className="space-y-8 mt-12">
          {/* Projected Annual Revenue at Different Market Shares */}
          <Card>
            <CardHeader>
              <CardTitle>Projected Annual Revenue (by Market Share)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  { share: '1%', revenue: 10000000 },
                  { share: '3%', revenue: 30000000 },
                  { share: '5%', revenue: 50000000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="share" />
                  <YAxis tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value) => `$${(Number(value)/1000000).toFixed(0)}M`} />
                  <Bar dataKey="revenue" fill="#d1d5db">
                    <LabelList dataKey="revenue" position="top" formatter={(value) => `$${(Number(value)/1000000).toFixed(0)}M`} />
                    <Cell fill="#d1d5db" />
                    <Cell fill="#EF4444" />
                    <Cell fill="#d1d5db" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          {/* Paying Users Needed at Different Market Shares */}
          <Card>
            <CardHeader>
              <CardTitle>Paying Users Needed (by Market Share)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  { share: '1%', users: 10000 },
                  { share: '3%', users: 30000 },
                  { share: '5%', users: 50000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="share" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#d1d5db">
                    <LabelList dataKey="users" position="top" />
                    <Cell fill="#d1d5db" />
                    <Cell fill="#6366F1" />
                    <Cell fill="#d1d5db" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          {/* Paying Users Needed vs ARPU (3% Market Share) */}
          <Card>
            <CardHeader>
              <CardTitle>Paying Users Needed vs ARPU (3% Market Share)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  { arpu: 500, users: 60000 },
                  { arpu: 700, users: 42857 },
                  { arpu: 1000, users: 30000 },
                  { arpu: 1500, users: 20000 },
                  { arpu: 2000, users: 15000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="arpu" tickFormatter={v => `$${v}`}/>
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#d1d5db">
                    <LabelList dataKey="users" position="top" />
                    <Cell fill="#d1d5db" />
                    <Cell fill="#d1d5db" />
                    <Cell fill="#6366F1" />
                    <Cell fill="#d1d5db" />
                    <Cell fill="#d1d5db" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
