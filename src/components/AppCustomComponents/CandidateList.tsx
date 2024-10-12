"use client";
import React, { useContext, useEffect, useState } from "react";
import { ContractContext } from "@/Context/contractContect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "../ui/toast1";

interface Candidate {
  id: number;
  name: string;
  candidateAddress: string;
  voteCount: number;
  token: string; // Assuming token is represented as a string (e.g., token address)
  transferAmount: number;
}

const CandidateList = () => {
  const { getCandidates, vote } = useContext(ContractContext);
  const { addToast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const fetchedCandidates = await getCandidates();
        setCandidates(fetchedCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        addToast({
          title: "Error",
          description: "Failed to fetch candidates.",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [getCandidates, addToast]);

  const handleVote = async (candidateId: number) => {
    try {
      await vote(candidateId); // Assume this method uses candidate ID
      addToast({
        title: "Vote Cast",
        description: `You have voted for candidate ID ${candidateId}`,
        status: "success",
      });
      // Refresh the candidate list after voting
      const updatedCandidates = await getCandidates();
      setCandidates(updatedCandidates);
    } catch (error) {
      console.error("Error voting for candidate:", error);
      addToast({
        title: "Error",
        description: "Failed to cast your vote.",
        status: "error",
      });
    }
  };

  if (loading) {
    return <div>Loading candidates...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-3xl p-4">
        <CardHeader>
          <CardTitle>Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          {candidates.length === 0 ? (
            <p>No candidates available.</p>
          ) : (
            candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex flex-col border-b py-4 last:border-b-0"
              >
                <h3 className="text-lg font-semibold">
                  Candidate ID: {candidate.id}
                </h3>
                <p>Name: {candidate.name}</p>
                <p>Candidate Address: {candidate.candidateAddress}</p>
                <p>Votes: {candidate.voteCount}</p>
                <p>Token Address: {candidate.token}</p>
                <p>Transfer Amount: {candidate.transferAmount}</p>
                <Button
                  onClick={() => handleVote(candidate.id)} // Pass the candidate ID for voting
                  className="mt-2"
                >
                  Vote
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateList;
