
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sampleProducts } from "@/data/sampleProducts";
import { TrendingUp, Users, Calendar, Vote } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [tallyCounts, setTallyCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  const incrementTally = (productId: string) => {
    setTallyCounts(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Product Validation Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Discover and validate the next big product ideas
              </p>
            </div>
            <Button 
              onClick={() => navigate('/voting')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Vote className="w-4 h-4" />
              Go to Voting
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sampleProducts.length}</div>
              <p className="text-xs text-muted-foreground">
                Active product ideas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Validation Score</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.2</div>
              <p className="text-xs text-muted-foreground">
                Out of 10 points
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                New validations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {product.description}
                    </CardDescription>
                  </div>
                  <Badge variant={product.category === 'SaaS' ? 'default' : 'secondary'}>
                    {product.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Market Size:</span>
                    <span className="font-medium">{product.marketSize}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Competition:</span>
                    <span className="font-medium">{product.competition}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Validation Score:</span>
                    <span className="font-medium">{product.validationScore}/10</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-gray-600">Interest Tally:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{tallyCounts[product.id] || 0}</span>
                      <Button 
                        size="sm" 
                        onClick={() => incrementTally(product.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        +1
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
