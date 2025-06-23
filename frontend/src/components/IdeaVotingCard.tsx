import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ArrowUp, Users } from "lucide-react";
import { motion } from "framer-motion";

const ACCENT = "#6366F1";

export default function IdeaVotingCard({ idea, voteCount, voters, onUpvote, onViewDetails }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleUpvote = () => {
    setModalOpen(true);
    setError("");
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const name = username.trim();
    if (!name) return;
    setError("");
    const result = await onUpvote(idea.id, name);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setModalOpen(false);
    setUsername("");
  };

  return (
    <Card className="rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center relative">
      <motion.div
        key={voteCount}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="text-3xl font-bold mb-2 text-center"
        style={{ color: ACCENT }}
      >
        {voteCount}
      </motion.div>
      <div className="flex gap-2 mb-4">
        <Button
          size="icon"
          className={`w-10 h-10 rounded-full border-2 border-[#6366F1] text-[#6366F1] bg-white shadow-sm transition-transform`}
          onClick={handleUpvote}
          aria-label="Upvote"
        >
          <ArrowUp />
        </Button>
      </div>
      <div className="w-full mb-2">
        <p className="text-base font-medium text-gray-900 dark:text-white line-clamp-3 mb-2 text-center">
          {idea.title}
        </p>
      </div>
      <Button className="w-full bg-[#6366F1] text-white shadow-sm hover:shadow-md rounded-md mt-2 mb-2" onClick={() => onViewDetails?.(idea.id)}>
        View Idea Detail
      </Button>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="mt-2 text-xs flex items-center gap-1 text-[#6366F1]">
            <Users className="w-4 h-4" /> View voters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="text-sm font-semibold mb-2">Latest voters</div>
          <ul>
            {voters.length === 0 && <li className="text-xs text-gray-400">No votes yet</li>}
            {voters.map((v, i) => (
              <li key={v.voter_name + v.voted_at} className="flex items-center gap-2 py-1">
                <span className="w-2 h-2 rounded-full bg-[#6366F1]"></span>
                <span className="text-xs text-gray-700">{v.voter_name}</span>
                <span className="ml-auto text-[10px] text-gray-400">{new Date(v.voted_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
      {/* Modal for username input */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleModalSubmit} className="bg-white rounded-lg p-6 shadow-lg flex flex-col gap-4 w-80">
            <h3 className="text-lg font-semibold mb-2">Enter your name to vote</h3>
            <input
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#6366F1]"
              placeholder="Your name"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
            {error && <div className="text-red-500 text-xs">{error}</div>}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => { setModalOpen(false); setError(""); }}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#6366F1] text-white">
                Submit
              </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
} 