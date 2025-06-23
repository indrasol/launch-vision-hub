/*

import { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export default function IdeaSidebarForm({ open, onOpenChange, onIdeaAdded, existingIdeas }) {
  const [idea, setIdea] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idea || !username) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("ideas")
      .insert([{ idea, username, num_votes: 0 }])
      .select()
      .single();
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Idea submitted!", description: "Your idea was added.", variant: "default" });
    onOpenChange(false);
    setIdea("");
    setUsername("");
    if (data) onIdeaAdded(data);
  };

  // ESC to close
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && open) onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[360px] p-6" aria-labelledby="sidebar-header">
        <motion.div
          initial={{ x: 360 }}
          animate={{ x: 0 }}
          exit={{ x: 360 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-full flex flex-col"
        >
          <h2 id="sidebar-header" className="text-xl font-semibold mb-6" style={{ color: '#1F2328' }}>
            Share a new idea
          </h2>
          <form className="flex flex-col gap-4 flex-1" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="idea" className="block text-sm font-medium mb-1">💡 Idea</label>
              <Select value={idea} onValueChange={setIdea} required>
                <SelectTrigger id="idea" className="rounded-md border-[#E5E7EB] focus:ring-2 focus:ring-[#6366F1]">
                  <SelectValue placeholder="Select or type an idea" />
                </SelectTrigger>
                <SelectContent>
                  {existingIdeas.map((i) => (
                    <SelectItem key={i.id} value={i.idea}>{i.idea}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">👤 Your name</label>
              <Input
                id="username"
                ref={inputRef}
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="rounded-md border-[#E5E7EB] focus:ring-2 focus:ring-[#6366F1]"
                placeholder="Enter your name"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#6366F1] text-white shadow-sm hover:shadow-md rounded-md mt-4"
              disabled={loading || !idea || !username}
            >
              {loading ? "Submitting..." : "Submit Idea"}
            </Button>
          </form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
} 