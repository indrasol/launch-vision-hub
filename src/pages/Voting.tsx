
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Idea {
  id: string;
  username: string;
  idea: string;
  num_votes: number;
  created_at: string;
}

interface VoteResponse {
  success: boolean;
  new_total: number;
  user_vote: number | null;
}

const Voting = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [username, setUsername] = useState("");
  const [ideaText, setIdeaText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  // Generate a simple user ID for tracking votes (in a real app, use proper auth)
  const userId = localStorage.getItem('voting_user_id') || (() => {
    const id = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('voting_user_id', id);
    return id;
  })();

  useEffect(() => {
    fetchIdeas();
    fetchUserVotes();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('ideas_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, () => {
        fetchIdeas();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast({
        title: "Error",
        description: "Failed to load ideas. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchUserVotes = async () => {
    try {
      const { data, error } = await supabase
        .from('idea_votes')
        .select('idea_id, value')
        .eq('user_id', userId);

      if (error) throw error;
      
      const votesMap: Record<string, number> = {};
      data?.forEach(vote => {
        votesMap[vote.idea_id] = vote.value;
      });
      setUserVotes(votesMap);
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !ideaText.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both username and idea fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('ideas')
        .insert([{
          username: username.trim(),
          idea: ideaText.trim(),
        }]);

      if (error) throw error;

      setUsername("");
      setIdeaText("");
      setIsSheetOpen(false);
      
      toast({
        title: "Success",
        description: "Your idea has been submitted!",
      });
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast({
        title: "Error",
        description: "Failed to submit idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (ideaId: string, value: 1 | -1) => {
    try {
      const { data, error } = await supabase.rpc('handle_vote', {
        p_idea_id: ideaId,
        p_user_id: userId,
        p_value: value
      });

      if (error) throw error;

      // Safely parse the response data
      const response = data as unknown as VoteResponse;
      
      if (response && typeof response === 'object' && 'success' in response) {
        if (response.success) {
          // Update local state
          setUserVotes(prev => ({
            ...prev,
            [ideaId]: response.user_vote
          }));
          
          // Update the idea's vote count in local state
          setIdeas(prev => prev.map(idea => 
            idea.id === ideaId 
              ? { ...idea, num_votes: response.new_total }
              : idea
          ));
        }
      } else {
        throw new Error('Invalid response format from vote handler');
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to record vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Idea Voting Platform
              </h1>
              <p className="mt-2 text-gray-600">
                Share your ideas and vote on others
              </p>
            </div>
            
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Submit New Idea
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Submit a New Idea</SheetTitle>
                  <SheetDescription>
                    Share your idea with the community and let others vote on it.
                  </SheetDescription>
                </SheetHeader>
                
                <form onSubmit={handleSubmitIdea} className="space-y-4 mt-6">
                  <div>
                    <Input
                      placeholder="Your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isSubmitting}
                      className="border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      placeholder="Describe your idea..."
                      value={ideaText}
                      onChange={(e) => setIdeaText(e.target.value)}
                      disabled={isSubmitting}
                      rows={6}
                      className="border-gray-300 resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Idea"}
                  </Button>
                </form>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {ideas.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No ideas yet
            </h3>
            <p className="text-gray-600">
              Be the first to submit an idea!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => {
              const userVote = userVotes[idea.id];
              
              return (
                <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">
                        {idea.idea}
                      </CardTitle>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-gray-900">
                          {idea.num_votes}
                        </div>
                        <div className="text-sm text-gray-500">votes</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        by <span className="font-medium">{idea.username}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant={userVote === 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVote(idea.id, 1)}
                          className={userVote === 1 ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={userVote === -1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVote(idea.id, -1)}
                          className={userVote === -1 ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Voting;
