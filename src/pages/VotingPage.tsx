import { useState, useEffect } from "react";
import { sampleProducts } from "../data/sampleProducts";
import IdeaVotingCard from "../components/IdeaVotingCard";
import ProductDetail from "../components/ProductDetail";
import { Button } from "@/components/ui/button";

export default function VotingPage() {
  const [ideas, setIdeas] = useState(sampleProducts.slice(0, 6));
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    setIdeas(sampleProducts.slice(0, 6));
  }, [sampleProducts.length]);

  if (selectedProductId) {
    const product = ideas.find((i) => i.id === selectedProductId);
    return product ? (
      <ProductDetail product={product} onBack={() => setSelectedProductId(null)} />
    ) : null;
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#1F2328' }}>
            Idea Voting Board
          </h1>
          <Button
            className="bg-[#6366F1] text-white shadow-sm hover:shadow-md rounded-md"
            onClick={() => window.location.href = '/'}
          >
            View Dashboard
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaVotingCard key={idea.id} idea={idea} onViewDetails={setSelectedProductId} />
          ))}
        </div>
      </div>
    </div>
  );
} 