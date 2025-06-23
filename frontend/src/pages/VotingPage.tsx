import { useState, useEffect } from "react";
import IdeaVotingCard from "../components/IdeaVotingCard";
import ProductDetail from "../components/ProductDetail";
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabaseClient";

export default function VotingPage() {
  const [ideas, setIdeas] = useState([]);
  const [votes, setVotes] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch ideas and votes from Supabase
  useEffect(() => {
    const fetchIdeasAndVotes = async () => {
      setLoading(true);
      // Fetch ideas
      const { data: ideasData } = await supabase.from("ideas").select("*");
      setIdeas(ideasData || []);
      // Fetch votes
      const { data: votesData } = await supabase.from("idea_votes").select("*");
      // Group votes by idea_id
      const votesByIdea = {};
      (votesData || []).forEach(vote => {
        if (!votesByIdea[vote.idea_id]) votesByIdea[vote.idea_id] = [];
        votesByIdea[vote.idea_id].push(vote);
      });
      setVotes(votesByIdea);
      setLoading(false);
    };
    fetchIdeasAndVotes();
  }, []);

  // Upvote handler
  const handleUpvote = async (ideaId, name) => {
    // Prevent duplicate name for this idea
    const currentVoters = votes[ideaId] || [];
    if (currentVoters.some(v => v.voter_name.toLowerCase() === name.toLowerCase())) {
      return { error: "This name has already voted on this idea." };
    }
    // Insert vote in Supabase
    const { data, error } = await supabase
      .from("idea_votes")
      .insert([{ idea_id: ideaId, voter_name: name }])
      .select()
      .single();
    if (error) return { error: error.message };
    // Update local state
    setVotes(prev => ({
      ...prev,
      [ideaId]: [{ ...data, voted_at: new Date() }, ...(prev[ideaId] || [])]
    }));
    return { success: true };
  };

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
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaVotingCard
                key={idea.id}
                idea={idea}
                voteCount={(votes[idea.id] || []).length}
                voters={votes[idea.id] || []}
                onUpvote={handleUpvote}
                onViewDetails={setSelectedProductId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 