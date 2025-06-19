
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    opportunityScore: number;
    problemScore: number;
    feasibilityScore: number;
    whyNowScore: number;
    category: {
      type: string;
      market: string;
      target: string;
    };
    searchVolume: {
      monthlyVolume: number;
      growthPercentage: number;
    };
    businessFit: {
      revenueScore: number;
    };
  };
  onViewDetails: (id: string) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const [tallyCount, setTallyCount] = useState(0);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRevenueIndicator = (score: number) => {
    return "$$$$".slice(0, Math.max(1, Math.ceil(score / 2.5)));
  };

  const incrementTally = () => {
    setTallyCount(prev => prev + 1);
  };

  const decrementTally = () => {
    setTallyCount(prev => Math.max(0, prev - 1));
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category.type}
          </Badge>
          <div className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${getScoreColor(product.opportunityScore)}`}></div>
            <span className="text-sm font-semibold">{product.opportunityScore}/10</span>
          </div>
        </div>
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
        
        {/* Tally Counter */}
        <div className="flex items-center justify-center gap-3 py-2 border rounded-lg bg-gray-50">
          <Button
            variant="outline"
            size="sm"
            onClick={decrementTally}
            className="h-8 w-8 p-0"
            disabled={tallyCount === 0}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <div className="text-lg font-bold">{tallyCount}</div>
            <div className="text-xs text-gray-500">Tally</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={incrementTally}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium">Volume</span>
            </div>
            <p className="text-sm font-bold">{(product.searchVolume.monthlyVolume / 1000).toFixed(1)}K</p>
            <p className="text-xs text-green-600">+{product.searchVolume.growthPercentage}%</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-medium">Problem</span>
            </div>
            <p className="text-sm font-bold">{product.problemScore}/10</p>
            <div className={`w-full h-1 rounded ${getScoreColor(product.problemScore)}`}></div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium">Revenue</span>
            </div>
            <p className="text-sm font-bold">{getRevenueIndicator(product.businessFit.revenueScore)}</p>
            <p className="text-xs text-gray-500">Potential</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-gray-500">{product.category.market} • {product.category.target}</span>
          <Button 
            size="sm" 
            onClick={() => onViewDetails(product.id)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
