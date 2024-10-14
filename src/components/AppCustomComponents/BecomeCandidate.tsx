"use client";
import React, { useContext, useState, useEffect } from "react";
import { ContractContext } from "@/Context/contractContect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/toast1";
import { VotingContractAddress } from "@/Constants/Constants";

const BecomeCandidate = () => {
  const {
    becomeCandidate,
    createToken,
    getTokenAddress,
    approveTokens,
    loading,
    getCandidateIdByAddress,
    sendTokenToVoteContract,
  } = useContext(ContractContext);

  const [name, setName] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState(0);
  const [decimals, setDecimals] = useState(18);
  const [tokenAddress, setTokenAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  // const [candidateId, setCandidateId] = useState<number>(0);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchTokenAddress = async () => {
      try {
        const addr = await getTokenAddress();
        // console.log("Token Address in BecomeCandidate => ", addr);
        setTokenAddress(addr);
      } catch (error) {
        console.error("Error fetching token address: ", error);
      }
    };

    fetchTokenAddress();
  }, [getTokenAddress]);

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
      setTokenAddress(tokenAddr);
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

  const handleBecomeCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tokenAddress || rewardAmount <= 0) {
      addToast({
        title: "Invalid Input",
        description:
          "Please fill in all the fields, including reward amount, to become a candidate.",
        status: "error",
      });
      return;
    }

    try {
      becomeCandidate(name, tokenAddress, rewardAmount);

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

  const handleApproveTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transferAmount <= 0 || !tokenAddress || !VotingContractAddress) {
      addToast({
        title: "Invalid Input",
        description: "Please enter a valid amount and voting contract address.",
        status: "error",
      });
      return;
    }

    try {
      await approveTokens(VotingContractAddress, transferAmount, tokenAddress);
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
    const candidateId = await getCandidateIdByAddress();
    // console.log("Candidate ID => ", candidateId);

    // setCandidateId(candidateId);
    if (transferAmount <= 0 || candidateId <= 0) {
      addToast({
        title: "Invalid Input",
        description: "Please enter a valid amount and candidate ID.",
        status: "error",
      });
      return;
    }

    try {
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
    <div className="flex flex-col space-y-8 md:space-y-10 lg:space-y-12 items-center justify-center min-h-screen py-8 px-4">
      <Card className="w-full max-w-md p-4 md:p-6 lg:p-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Create Token</CardTitle>
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

              <Button
                type="submit"
                className="w-full md:w-auto px-4 py-2 text-lg font-semibold"
              >
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
        {tokenAddress && (
          <div className="max-w-md p-4 md:p-6 lg:p-8">
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

      <Card className="w-full max-w-md p-4 md:p-6 lg:p-8">
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
                className="w-full md:w-auto px-4 py-2 text-lg font-semibold"
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

      <Card className="w-full max-w-md p-4 md:p-6 lg:p-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Approve and Transfer Tokens to contract
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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

            <Button
              onClick={handleApproveTokens}
              className="w-full md:w-auto px-4 py-2 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                </>
              ) : (
                "Approve Tokens"
              )}
            </Button>

            <Button
              onClick={handleTransferTokens}
              className="w-full md:w-auto px-4 py-2 text-lg font-semibold"
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
