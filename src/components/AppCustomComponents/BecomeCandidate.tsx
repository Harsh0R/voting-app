"use client";
import React, { useContext, useState, useEffect } from "react";
import { ContractContext } from "@/Context/contractContect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/toast1";

const BecomeCandidate = () => {
  const {
    becomeCandidate,
    createToken,
    getTokenAddress,
    approveTokens,
    loading,
    transactionStatus,
    getCandidateIdByAddress,
    sendTokenToVoteContract,
  } = useContext(ContractContext);

  const [name, setName] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [initialSupply, setInitialSupply] = useState<number>(0);
  const [decimals, setDecimals] = useState<number>(18);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [voteContractAddress, setVoteContractAddress] = useState<string>("");
  const [rewardAmount, setRewardAmount] = useState<number>(0); // Reward Amount State
  const [candidateId, setCandidateId] = useState<number>(0); // Added for candidate ID in transfer
  const { addToast } = useToast();

  useEffect(() => {
    // Fetch token address from the contract if available
    const fetchTokenAddress = async () => {
      try {
        const addr = await getTokenAddress();
        console.log("Token Address in BecomeCandidate => ", addr);
        setTokenAddress(addr);
      } catch (error) {
        console.error("Error fetching token address: ", error);
      }
    };

    fetchTokenAddress();
  }, [getTokenAddress]);

  // Handle Token Creation
  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenName || !tokenSymbol || initialSupply <= 0) {
      addToast({
        title: "Invalid Input",
        description: "Please fill in all the fields to create a token.",
        status: "error",
      });
      return;
    }

    try {
      const tokenAddr = await createToken(
        tokenName,
        tokenSymbol,
        initialSupply,
        decimals
      );
      setTokenAddress(tokenAddr); // Store the created token address
      addToast({
        title: "Token Created",
        description: `Token created successfully at address: ${tokenAddr}`,
        status: "success",
      });
    } catch (error) {
      console.error("Error while creating token:", error);
      addToast({
        title: "Error",
        description: "Something went wrong while creating the token.",
        status: "error",
      });
    }
  };

  // Handle Candidate Submission with Reward Amount
  const handleBecomeCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tokenAddress || transferAmount <= 0 || rewardAmount <= 0) {
      addToast({
        title: "Invalid Input",
        description:
          "Please fill in all the fields, including reward amount, to become a candidate.",
        status: "error",
      });
      return;
    }

    try {
      addToast({
        title: "Success",
        description: "You have successfully become a candidate!",
        status: "success",
      });
    } catch (error) {
      console.error("Error while becoming a candidate:", error);
      addToast({
        title: "Error",
        description: "Something went wrong.",
        status: "error",
      });
    }
  };

  // Handle Approve Tokens
  const handleApproveTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transferAmount <= 0 || !voteContractAddress) {
      addToast({
        title: "Invalid Input",
        description: "Please enter a valid amount and voting contract address.",
        status: "error",
      });
      return;
    }

    try {
      await approveTokens(voteContractAddress, transferAmount);
      addToast({
        title: "Tokens Approved",
        description: `${transferAmount} tokens approved for voting contract!`,
        status: "success",
      });
    } catch (error) {
      console.error("Error while approving tokens:", error);
      addToast({
        title: "Error",
        description: "Failed to approve tokens.",
        status: "error",
      });
    }
  };

  const handleTransferTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transferAmount <= 0 || candidateId <= 0) {
      addToast({
        title: "Invalid Input",
        description: "Please enter a valid amount and candidate ID.",
        status: "error",
      });
      return;
    }

    try {
      const candidateId = await getCandidateIdByAddress();
      console.log("Candidate ID => ", candidateId);

      setCandidateId(candidateId); 
      await sendTokenToVoteContract(transferAmount, candidateId); 
      addToast({
        title: "Tokens Transferred",
        description: `${transferAmount} tokens transferred to voting contract!`,
        status: "success",
      });
    } catch (error) {
      console.error("Error while transferring tokens:", error);
      addToast({
        title: "Error",
        description: "Failed to transfer tokens.",
        status: "error",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenAddress);
    addToast({
      title: "Copied!",
      description: "Token address copied to clipboard.",
      status: "success",
    });
  };

  return (
    <div className="flex space-x-10 items-center justify-center mt-10">
      <Card className="w-full max-w-md p-4 ">
        <CardHeader>
          <CardTitle>Create Token</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateToken}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tokenName">Token Name</Label>
                <Input
                  id="tokenName"
                  type="text"
                  placeholder="Enter token name"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tokenSymbol">Token Symbol</Label>
                <Input
                  id="tokenSymbol"
                  type="text"
                  placeholder="Enter token symbol"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="initialSupply">Initial Supply</Label>
                <Input
                  id="initialSupply"
                  type="number"
                  placeholder="Enter initial supply"
                  value={initialSupply}
                  onChange={(e) => setInitialSupply(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="decimals">Decimals</Label>
                <Input
                  id="decimals"
                  type="number"
                  placeholder="Enter decimals (e.g. 18)"
                  value={decimals}
                  onChange={(e) => setDecimals(Number(e.target.value))}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  "Create Token"
                )}
              </Button>
            </div>
          </form>
        </CardContent>

        {/* Token Address Section */}
        {tokenAddress && (
          <div className="max-w-md p-4">
            <h3 className="text-lg font-semibold">Your Token Address:</h3>
            <div className="flex items-center mt-2">
              <Input
                type="text"
                value={tokenAddress}
                readOnly
                className="mr-2"
              />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </div>
        )}
      </Card>

      {/* Unchanged Become Candidate Section */}
      <Card className="w-full h-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Become a Candidate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBecomeCandidate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Candidate Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="rewardAmount">Reward Amount</Label>
                <Input
                  id="rewardAmount"
                  type="number"
                  placeholder="Enter reward amount"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(Number(e.target.value))}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !tokenAddress}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  "Submit as Candidate"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Approve and Transfer Section */}
      <Card className="w-full h-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Approve and Transfer Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="voteContractAddress">Vote Contract Address</Label>
              <Input
                id="voteContractAddress"
                type="text"
                placeholder="Enter voting contract address"
                value={voteContractAddress}
                onChange={(e) => setVoteContractAddress(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="transferAmount">Amount to Transfer</Label>
              <Input
                id="transferAmount"
                type="number"
                placeholder="Enter amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(Number(e.target.value))}
                required
              />
            </div>

            {/* Approve Button */}
            <Button
              onClick={handleApproveTokens}
              className="w-full"
              disabled={loading || !tokenAddress}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                </>
              ) : (
                "Approve Tokens"
              )}
            </Button>

            {/* Transfer Button */}
            <Button
              onClick={handleTransferTokens}
              className="w-full"
              disabled={loading || !tokenAddress}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                </>
              ) : (
                "Transfer Tokens"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BecomeCandidate;
