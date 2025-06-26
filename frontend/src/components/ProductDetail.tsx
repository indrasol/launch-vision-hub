import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Edit, Trash2, Share2, Download } from "lucide-react";
import SearchVolumeChart from "./SearchVolumeChart";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { supabase } from "../lib/supabaseClient";

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
    marketSize: number;
    penetrationRate: number;
    arpu: number;
    usersNeeded: number;
    projectedRevenue: number;
    keyGaps: string | {
      overview: string;
      points: Array<{
        main: string;
        sub: string[];
      }>;
    };
    solution: string | {
      overview: string;
      tagline: string;
      points: Array<{
        main: string;
        sub: string[];
      }>;
    };
    userJourney: string[] | Array<{
      phase: string;
      userAction: string;
      zipReachAction: string | string[];
      output: string;
    }>;
    realWorldScenario: string | string[];
    uniqueValuePropositions: string[] | Array<{
      main: string;
      description: string;
    }>;
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

  // Load data from Supabase on component mount
  useEffect(() => {
    loadCompetitorData();
  }, [product.id]);

  const loadCompetitorData = async () => {
    try {
      // Load competitor findings
      const { data: findings, error: findingsError } = await supabase
        .from('competitor_findings')
        .select('*')
        .eq('product_id', product.id)
        .order('order_index');

      if (findingsError) {
        console.error('Error loading competitor findings:', findingsError);
      } else if (findings && findings.length > 0) {
        const mappedFindings = findings.map(finding => ({
          competitor: finding.competitor,
          revenue: finding.revenue,
          marketSize: finding.market_size
        }));
        setCompetitorFindings(mappedFindings);
      }

      // Load competitor analysis  
      const { data: analysis, error: analysisError } = await supabase
        .from('competitor_analysis')
        .select('*')
        .eq('product_id', product.id)
        .order('order_index');

      if (analysisError) {
        console.error('Error loading competitor analysis:', analysisError);
      } else if (analysis && analysis.length > 0) {
        const mappedAnalysis = analysis.map(item => ({
          competitor: item.competitor,
          keyGaps: item.key_gaps,
          ourSolution: item.our_solution
        }));
        setCompetitorAnalysis(mappedAnalysis);
      }
    } catch (error) {
      console.error('Error loading competitor data:', error);
    }
  };

  const saveCompetitorFindings = async (findings) => {
    try {
      // Delete existing findings for this product
      await supabase
        .from('competitor_findings')
        .delete()
        .eq('product_id', product.id);

      // Insert new findings
      const dataToInsert = findings.map((finding, index) => ({
        product_id: product.id,
        competitor: finding.competitor,
        revenue: finding.revenue,
        market_size: finding.marketSize,
        order_index: index
      }));

      const { error } = await supabase
        .from('competitor_findings')
        .insert(dataToInsert);

      if (error) {
        console.error('Error saving competitor findings:', error);
      }
    } catch (error) {
      console.error('Error saving competitor findings:', error);
    }
  };

  const saveCompetitorAnalysis = async (analysis) => {
    try {
      // Delete existing analysis for this product
      await supabase
        .from('competitor_analysis')
        .delete()
        .eq('product_id', product.id);

      // Insert new analysis
      const dataToInsert = analysis.map((item, index) => ({
        product_id: product.id,
        competitor: item.competitor,
        key_gaps: item.keyGaps,
        our_solution: item.ourSolution,
        order_index: index
      }));

      const { error } = await supabase
        .from('competitor_analysis')
        .insert(dataToInsert);

      if (error) {
        console.error('Error saving competitor analysis:', error);
      }
    } catch (error) {
      console.error('Error saving competitor analysis:', error);
    }
  };

  // Add row handlers
  const addCompetitorFinding = () => {
    const newFindings = [...competitorFindings, { competitor: '', revenue: '', marketSize: '' }];
    setCompetitorFindings(newFindings);
    saveCompetitorFindings(newFindings);
  };
  
  const addCompetitorAnalysis = () => {
    const newAnalysis = [...competitorAnalysis, { competitor: '', keyGaps: '', ourSolution: '' }];
    setCompetitorAnalysis(newAnalysis);
    saveCompetitorAnalysis(newAnalysis);
  };

  // Edit cell handlers
  const editCompetitorFinding = (idx, field, value) => {
    const updatedFindings = competitorFindings.map((row, i) => 
      i === idx ? { ...row, [field]: value } : row
    );
    setCompetitorFindings(updatedFindings);
    saveCompetitorFindings(updatedFindings);
  };
  
  const editCompetitorAnalysis = (idx, field, value) => {
    const updatedAnalysis = competitorAnalysis.map((row, i) => 
      i === idx ? { ...row, [field]: value } : row
    );
    setCompetitorAnalysis(updatedAnalysis);
    saveCompetitorAnalysis(updatedAnalysis);
  };

  // Delete row handlers
  const deleteCompetitorFinding = (idx) => {
    const updatedFindings = competitorFindings.filter((_, i) => i !== idx);
    setCompetitorFindings(updatedFindings);
    saveCompetitorFindings(updatedFindings);
  };
  
  const deleteCompetitorAnalysis = (idx) => {
    const updatedAnalysis = competitorAnalysis.filter((_, i) => i !== idx);
    setCompetitorAnalysis(updatedAnalysis);
    saveCompetitorAnalysis(updatedAnalysis);
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
          <p className="text-lg text-gray-600 mb-4 font-semibold">{product.tagline}</p>

          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold mb-2 text-blue-600">
                  {product.marketSize >= 1000000000 
                    ? `${(product.marketSize / 1000000000).toFixed(0)}B` 
                    : `${(product.marketSize / 1000000).toFixed(0)}M`}
                </div>
                <div className="text-sm font-bold text-gray-600">Market Size</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold mb-2 text-green-600">{product.penetrationRate}%</div>
                <div className="text-sm font-bold text-gray-600">Penetration Percentage</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold mb-2 text-purple-600">${product.arpu.toLocaleString()}</div>
                <div className="text-sm font-bold text-gray-600">ARPU (Average Revenue per User)/Year Needed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold mb-2 text-orange-600">
                  {product.usersNeeded >= 1000000000 
                    ? `${(product.usersNeeded / 1000000000).toFixed(1)}B` 
                    : product.usersNeeded >= 1000000
                    ? `${(product.usersNeeded / 1000000).toFixed(1)}M`
                    : product.usersNeeded.toLocaleString()}
                </div>
                <div className="text-sm font-bold text-gray-600">Number of Users Needed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold mb-2 text-red-600">
                  ${product.projectedRevenue >= 1000000000 
                    ? `${(product.projectedRevenue / 1000000000).toFixed(1)}B` 
                    : product.projectedRevenue >= 1000000 
                    ? `${(product.projectedRevenue / 1000000).toFixed(0)}M` 
                    : `${(product.projectedRevenue / 1000).toFixed(0)}K`}
                </div>
                <div className="text-sm font-bold text-gray-600">Projected Annual Revenue</div>
              </CardContent>
            </Card>
          </div>

          {/* Constructed Sentence Card */}
          <Card className="mb-8">
            <CardContent className="p-4 text-center">
              <span className="text-lg md:text-xl">
                Assuming a conservative <b className="text-green-600">{product.penetrationRate}% Penetration Rate</b> in a <b className="text-blue-600">Market Size</b> of <b className="text-blue-600">
                {product.marketSize >= 1000000000 
                  ? `${(product.marketSize / 1000000000).toFixed(0)}B` 
                  : `${(product.marketSize / 1000000).toFixed(0)}M`}
                </b> with an <b className="text-purple-600">Average Revenue</b> of <b className="text-purple-600">${product.arpu.toLocaleString()}</b> per users, we would need <b className="text-orange-600">
                {product.usersNeeded >= 1000000000 
                  ? `${(product.usersNeeded / 1000000000).toFixed(1)}B` 
                  : product.usersNeeded >= 1000000
                  ? `${(product.usersNeeded / 1000000).toFixed(1)}M`
                  : product.usersNeeded.toLocaleString()} Users</b> to achieve an <b className="text-red-600">Annual Revenue $
                {product.projectedRevenue >= 1000000000 
                  ? `${(product.projectedRevenue / 1000000000).toFixed(1)}B` 
                  : product.projectedRevenue >= 1000000 
                  ? `${(product.projectedRevenue / 1000000).toFixed(0)}M` 
                  : `${(product.projectedRevenue / 1000).toFixed(0)}K`}</b>.
              </span>
              <div className="mt-2 text-lg">
                With market penetration, the revenue potential is <span className="text-blue-600">
                {product.marketSize >= 1000000000 
                  ? `${(product.marketSize / 1000000000).toFixed(0)}B` 
                  : `${(product.marketSize / 1000000).toFixed(0)}M`}
                </span> × <span className="text-green-600">{product.penetrationRate}%</span> = <span className="text-red-600">$
                {product.projectedRevenue >= 1000000000 
                  ? `${(product.projectedRevenue / 1000000000).toFixed(1)}B` 
                  : product.projectedRevenue >= 1000000 
                  ? `${(product.projectedRevenue / 1000000).toFixed(0)}M` 
                  : `${(product.projectedRevenue / 1000).toFixed(0)}K`}</span>.
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
                {typeof product.keyGaps === 'object' && product.keyGaps && product.keyGaps.overview && product.keyGaps.points ? (
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-6">{product.keyGaps.overview}</p>
                    <ol className="list-decimal pl-5 text-gray-700 space-y-3">
                      {product.keyGaps.points.map((gap, index) => (
                        <li key={index} className="mb-3">
                          <span className="font-semibold">{gap.main}</span>
                          {gap.sub && gap.sub.length > 0 && (
                            <ol className="list-[lower-alpha] pl-6 mt-2 space-y-1">
                              {gap.sub.map((subPoint, subIndex) => (
                                <li key={subIndex} className="text-gray-600">{subPoint}</li>
                              ))}
                            </ol>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : Array.isArray(product.keyGaps) && product.keyGaps.length > 0 && typeof product.keyGaps[0] === 'object' ? (
                  <ol className="list-decimal pl-5 text-gray-700 space-y-3">
                    {product.keyGaps.map((gap, index) => (
                      <li key={index} className="mb-3">
                        <span className="font-semibold">{gap.main}</span>
                        {gap.sub && gap.sub.length > 0 && (
                          <ol className="list-[lower-alpha] pl-6 mt-2 space-y-1">
                            {gap.sub.map((subPoint, subIndex) => (
                              <li key={subIndex} className="text-gray-600">{subPoint}</li>
                            ))}
                          </ol>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ul className="list-disc pl-5 text-gray-700">
                    {(typeof product.keyGaps === 'string' 
                      ? product.keyGaps.split('.').filter(gap => gap.trim().length > 0)
                      : Array.isArray(product.keyGaps) 
                      ? product.keyGaps 
                      : [product.keyGaps]
                    ).map((gap, index) => (
                      <li key={index} className="mb-2">{typeof gap === 'string' ? gap.trim() : gap}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            {/* Solution */}
            <Card>
              <CardHeader>
                <CardTitle>Solution</CardTitle>
              </CardHeader>
              <CardContent>
                {typeof product.solution === 'object' && product.solution && product.solution.overview ? (
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-4">{product.solution.overview}</p>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                      <p className="text-blue-800 font-medium text-lg">{product.solution.tagline}</p>
                    </div>
                    <ol className="list-decimal pl-5 text-gray-700 space-y-3">
                      {product.solution.points.map((point, index) => (
                        <li key={index} className="mb-3">
                          <span className="font-semibold">{point.main}</span>
                          {point.sub && point.sub.length > 0 && (
                            <div className="ml-4 mt-2">
                              {point.sub.map((subPoint, subIndex) => (
                                <p key={subIndex} className="text-gray-600">{subPoint}</p>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{typeof product.solution === 'string' ? product.solution : ''}</p>
                )}
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
                {Array.isArray(product.userJourney) && product.userJourney.length > 0 && typeof product.userJourney[0] === 'object' ? (
                  <div className="space-y-6">
                    {product.userJourney.map((step, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-6 pb-4">
                        <h4 className="font-bold text-lg text-blue-800 mb-3">{step.phase}</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="font-semibold text-gray-800">User Action:</span>
                            <p className="text-gray-700 mt-1" dangerouslySetInnerHTML={{ __html: step.userAction.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">ZipReach Action:</span>
                            {Array.isArray(step.zipReachAction) ? (
                              <ul className="list-disc ml-5 mt-1 text-gray-700">
                                {step.zipReachAction.map((action, actionIndex) => (
                                  <li key={actionIndex} className="mb-1">{action}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-700 mt-1">{step.zipReachAction}</p>
                            )}
                          </div>
                          <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r">
                            <span className="font-semibold text-green-800">Output:</span>
                            <p className="text-green-700 mt-1" dangerouslySetInnerHTML={{ __html: step.output.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ol className="list-decimal pl-5 text-gray-700">
                    {Array.isArray(product.userJourney) && product.userJourney.map((step, index) => (
                      <li key={index} className="mb-2">{typeof step === 'string' ? step : ''}</li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
            {/* Real World Scenario Card */}
            <Card>
              <CardHeader>
                <CardTitle>Real World Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(product.realWorldScenario) ? (
                  <ol className="list-decimal pl-5 text-gray-700">
                    {product.realWorldScenario.map((step, index) => (
                      <li key={index} className="mb-2">{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{product.realWorldScenario}</p>
                )}
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
                          <button className="text-red-500 font-bold" onClick={() => deleteCompetitorFinding(idx)}>✕</button>
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
                          <button className="text-red-500 font-bold" onClick={() => deleteCompetitorAnalysis(idx)}>✕</button>
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
              {Array.isArray(product.uniqueValuePropositions) && product.uniqueValuePropositions.length > 0 && typeof product.uniqueValuePropositions[0] === 'object' ? (
                <ul className="list-disc pl-5 text-gray-700 space-y-3">
                  {product.uniqueValuePropositions.map((uvp, index) => (
                    <li key={index} className="mb-3">
                      <span className="font-semibold">{uvp.main}</span>
                      <span className="ml-2">— {uvp.description}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="list-disc pl-5 text-gray-700">
                  {Array.isArray(product.uniqueValuePropositions) && product.uniqueValuePropositions.map((uvp, index) => (
                    <li key={index} className="mb-2">{typeof uvp === 'string' ? uvp : ''}</li>
                  ))}
                </ul>
              )}
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
                  { share: '0.5%', revenue: (product.marketSize * 0.005) },
                  { share: '1%', revenue: (product.marketSize * 0.01) },
                  { share: `${product.penetrationRate}%`, revenue: product.projectedRevenue },
                  { share: '5%', revenue: (product.marketSize * 0.05) },
                  { share: '10%', revenue: (product.marketSize * 0.10) },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="share" />
                  <YAxis tickFormatter={v => v >= 1000000000 ? `$${(v/1000000000).toFixed(1)}B` : `$${(v/1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value) => Number(value) >= 1000000000 ? `$${(Number(value)/1000000000).toFixed(1)}B` : `$${(Number(value)/1000000).toFixed(0)}M`} />
                  <Bar dataKey="revenue" fill="#d1d5db">
                    <LabelList dataKey="revenue" position="top" formatter={(value) => Number(value) >= 1000000000 ? `$${(Number(value)/1000000000).toFixed(1)}B` : `$${(Number(value)/1000000).toFixed(0)}M`} />
                    <Cell fill="#d1d5db" />
                    <Cell fill="#d1d5db" />
                    <Cell fill="#EF4444" />
                    <Cell fill="#d1d5db" />
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
                  { share: '0.5%', users: Math.round((product.marketSize * 0.005) / product.arpu) },
                  { share: '1%', users: Math.round((product.marketSize * 0.01) / product.arpu) },
                  { share: `${product.penetrationRate}%`, users: product.usersNeeded },
                  { share: '5%', users: Math.round((product.marketSize * 0.05) / product.arpu) },
                  { share: '10%', users: Math.round((product.marketSize * 0.10) / product.arpu) },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="share" />
                  <YAxis tickFormatter={v => v >= 1000000000 ? `${(v/1000000000).toFixed(1)}B` : v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v.toLocaleString()} />
                  <Tooltip formatter={(value) => Number(value) >= 1000000000 ? `${(Number(value)/1000000000).toFixed(1)}B` : Number(value) >= 1000000 ? `${(Number(value)/1000000).toFixed(1)}M` : Number(value).toLocaleString()} />
                  <Bar dataKey="users" fill="#d1d5db">
                    <LabelList dataKey="users" position="top" formatter={(value) => Number(value) >= 1000000000 ? `${(Number(value)/1000000000).toFixed(1)}B` : Number(value) >= 1000000 ? `${(Number(value)/1000000).toFixed(1)}M` : Number(value).toLocaleString()} />
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
          {/* Paying Users Needed vs ARPU (Current Market Share) */}
          <Card>
            <CardHeader>
              <CardTitle>Paying Users Needed vs ARPU ({product.penetrationRate}% Market Share)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  { arpu: Math.round(product.arpu * 0.5), users: Math.round(product.projectedRevenue / (product.arpu * 0.5)) },
                  { arpu: Math.round(product.arpu * 0.75), users: Math.round(product.projectedRevenue / (product.arpu * 0.75)) },
                  { arpu: product.arpu, users: product.usersNeeded },
                  { arpu: Math.round(product.arpu * 1.5), users: Math.round(product.projectedRevenue / (product.arpu * 1.5)) },
                  { arpu: Math.round(product.arpu * 2), users: Math.round(product.projectedRevenue / (product.arpu * 2)) },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="arpu" tickFormatter={v => `$${v}`}/>
                  <YAxis tickFormatter={v => v >= 1000000000 ? `${(v/1000000000).toFixed(1)}B` : v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v.toLocaleString()} />
                  <Tooltip 
                    labelFormatter={(label) => `ARPU: $${label}`}
                    formatter={(value) => [Number(value) >= 1000000000 ? `${(Number(value)/1000000000).toFixed(1)}B` : Number(value) >= 1000000 ? `${(Number(value)/1000000).toFixed(1)}M` : Number(value).toLocaleString(), 'Users Needed']} 
                  />
                  <Bar dataKey="users" fill="#d1d5db">
                    <LabelList dataKey="users" position="top" formatter={(value) => Number(value) >= 1000000000 ? `${(Number(value)/1000000000).toFixed(1)}B` : Number(value) >= 1000000 ? `${(Number(value)/1000000).toFixed(1)}M` : Number(value).toLocaleString()} />
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
          {/* Market Share vs Total Revenue Potential */}
          <Card>
            <CardHeader>
              <CardTitle>Market Share vs Total Revenue Potential</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  { share: '0.1%', potential: (product.marketSize * 0.001) },
                  { share: '0.5%', potential: (product.marketSize * 0.005) },
                  { share: '1%', potential: (product.marketSize * 0.01) },
                  { share: `${product.penetrationRate}%`, potential: product.projectedRevenue },
                  { share: '5%', potential: (product.marketSize * 0.05) },
                  { share: '10%', potential: (product.marketSize * 0.10) },
                  { share: '20%', potential: (product.marketSize * 0.20) },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="share" />
                  <YAxis tickFormatter={v => v >= 1000000000 ? `$${(v/1000000000).toFixed(1)}B` : `$${(v/1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value) => Number(value) >= 1000000000 ? `$${(Number(value)/1000000000).toFixed(1)}B` : `$${(Number(value)/1000000).toFixed(0)}M`} />
                  <Bar dataKey="potential" fill="#d1d5db">
                    <LabelList dataKey="potential" position="top" formatter={(value) => Number(value) >= 1000000000 ? `$${(Number(value)/1000000000).toFixed(1)}B` : `$${(Number(value)/1000000).toFixed(0)}M`} />
                    <Cell fill="#d1d5db" />
                    <Cell fill="#d1d5db" />
                    <Cell fill="#d1d5db" />
                    <Cell fill="#EF4444" />
                    <Cell fill="#d1d5db" />
                    <Cell fill="#d1d5db" />
                    <Cell fill="#10B981" />
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
