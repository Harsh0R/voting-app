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
  token: string;
  transferAmount: number;
}

const CandidateList = () => {
  const context = useContext(ContractContext);
  const { getCandidates, vote, registerVoter } = context || {};
  const { addToast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        if (getCandidates) {
          const fetchedCandidates = await getCandidates();
          setCandidates(fetchedCandidates);
        }
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
      if (vote) {
        await vote(candidateId);
        addToast({
          title: "Vote Cast",
          description: `You have voted for candidate ID ${candidateId}`,
          status: "success",
        });
      }
      if (getCandidates) {
        const updatedCandidates = await getCandidates();
        setCandidates(updatedCandidates);
      }
    } catch (error) {
      console.error("Error voting for candidate:", error);
      addToast({
        title: "Error",
        description: "Failed to cast your vote.",
        status: "error",
      });
    }
  };

  const handleRegisterVoter = async () => {
    setRegisterLoading(true);
    try {
      if (registerVoter) {
        await registerVoter();
        addToast({
          title: "Registration Successful",
          description: "You have successfully registered as a voter!",
          status: "success",
        });
      }
    } catch (error) {
      console.error("Error registering as voter:", error);
      addToast({
        title: "Error",
        description: "Failed to register as a voter.",
        status: "error",
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        addToast({
          title: "Copied!",
          description: "Address copied to clipboard.",
          status: "success",
        });
      })
      .catch((error) => {
        console.error("Error copying address:", error);
        addToast({
          title: "Error",
          description: "Failed to copy address.",
          status: "error",
        });
      });
  };

  if (loading) {
    return <div>Loading candidates...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-xl mb-6">
        <CardHeader>
          <CardTitle>Register as a Voter</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleRegisterVoter}
            className="w-full"
            disabled={registerLoading}
          >
            {registerLoading ? "Registering..." : "Register as Voter"}
          </Button>
        </CardContent>
      </Card>
      <Card className="w-full max-w-xl">
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
                <p className="flex items-center">
                  Candidate Address: {formatAddress(candidate.candidateAddress)}
                  <div
                    className="ml-2 cursor-pointer w-5 h-5" // Adjust size as needed
                    onClick={() => copyToClipboard(candidate.candidateAddress)}
                  >
                    📝
                  </div>
                </p>
                <p className="flex items-center">
                  Token Address: {formatAddress(candidate.token)}
                  <div
                    className="ml-2 cursor-pointer w-5 h-5" // Adjust size as needed
                    onClick={() => copyToClipboard(candidate.token)}
                  >
                    📝
                  </div>
                </p>
                <p>Votes: {candidate.voteCount}</p>
                <p>Reward Amount: {candidate.transferAmount}</p>
                <Button
                  onClick={() => handleVote(candidate.id)}
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
