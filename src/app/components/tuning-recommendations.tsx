"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { endpoints } from "../api/config";

interface TuningRecommendationsProps {
  id: number;
  setError: (error: string | null) => void;
}

export default function TuningRecommendations({ id, setError }: TuningRecommendationsProps) {
  const [tuningRecommendations, setTuningRecommendations] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getTuningRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${endpoints.tuningRecommendations}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text(); // Expect plain text response
      setTuningRecommendations(data); // Set plain text response
    } catch (e) {
      console.error("Failed to get tuning recommendations:", e);
      setError("Failed to load tuning recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={getTuningRecommendations}>
          Tune
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tuning Recommendations for SQL ID: {id}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : tuningRecommendations ? (
          <pre className="whitespace-pre-wrap">{tuningRecommendations}</pre> 
        ) : (
          <p>No recommendations available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
