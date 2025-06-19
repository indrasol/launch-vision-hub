import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Moon, Sun } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ProductDetail from "../components/ProductDetail";
import { sampleProducts } from "../data/sampleProducts";

const Index = () => {
  const [products] = useState(sampleProducts);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterScore, setFilterScore] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || product.category.type.toLowerCase() === filterCategory.toLowerCase();
    
    const matchesScore = filterScore === "all" || 
                        (filterScore === "high" && product.opportunityScore >= 8) ||
                        (filterScore === "medium" && product.opportunityScore >= 6 && product.opportunityScore < 8) ||
                        (filterScore === "low" && product.opportunityScore < 6);
    
    return matchesSearch && matchesCategory && matchesScore;
  });

  const selectedProduct = selectedProductId ? products.find(p => p.id === selectedProductId) : null;

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSelectedProductId(null)} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Product Validation Dashboard
              </h1>
              <p className={`mt-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Discover and analyze promising product opportunities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center gap-2"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDarkMode ? 'Light' : 'Dark'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.location.href = '/voting'}
              >
                Go to Voting
              </Button>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                New Product Idea
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className={`mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search product ideas..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={`pl-10 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                  />
                </div>
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className={`w-full sm:w-48 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="fintech saas">FinTech</SelectItem>
                  <SelectItem value="saas + hardware">Hardware + SaaS</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterScore} onValueChange={setFilterScore}>
                <SelectTrigger className={`w-full sm:w-48 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
                  <SelectValue placeholder="Opportunity Score" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High (8-10)</SelectItem>
                  <SelectItem value="medium">Medium (6-7)</SelectItem>
                  <SelectItem value="low">Low (1-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6 text-center">
              <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {filteredProducts.length}
              </div>
              <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Product Ideas
              </div>
            </CardContent>
          </Card>
          
          <Card className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6 text-center">
              <div className={`text-3xl font-bold mb-2 text-green-600`}>
                {Math.round(filteredProducts.reduce((acc, p) => acc + p.opportunityScore, 0) / filteredProducts.length || 0)}
              </div>
              <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Avg Opportunity
              </div>
            </CardContent>
          </Card>
          
          <Card className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6 text-center">
              <div className={`text-3xl font-bold mb-2 text-blue-600`}>
                {filteredProducts.filter(p => p.opportunityScore >= 8).length}
              </div>
              <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                High Potential
              </div>
            </CardContent>
          </Card>
          
          <Card className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6 text-center">
              <div className={`text-3xl font-bold mb-2 text-purple-600`}>
                {Math.round(filteredProducts.reduce((acc, p) => acc + p.searchVolume.monthlyVolume, 0) / 1000)}K
              </div>
              <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Search Volume
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <Card className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-12 text-center">
              <div className={`text-lg font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                No products found
              </div>
              <div className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Try adjusting your search terms or filters
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProductId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
