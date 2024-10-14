"use client";
import {
  connectContract,
  connectWallet,
  getTokenContract,
  toWei,
} from "@/Utils/utilsFunctions";
import React, { createContext, useEffect, useState, ReactNode } from "react";

// Define the shape of the context data
interface ContractContextType {
  contract: any;
  account: string;
  transactionStatus: string;
  becomeCandidate: (
    _name: string,
    _tokenAddress: string,
    _transferAmount: number
  ) => Promise<void>;
  loading: boolean;
  createToken: (
    _name: string,
    _symbol: string,
    _initialSupply: number,
    _decimal: number
  ) => Promise<string | void>;
  registerVoter: () => Promise<void>;
  sendTokenToVoteContract: (
    _amount: number,
    _candidateId: number
  ) => Promise<void>;
  vote: (_candidateId: number) => Promise<void>;
  getCandidates: () => Promise<Candidate[]>;
  getTokenDetails: () => Promise<void>;
  getTokenAddress: () => Promise<string | void>;
  approveTokens: (
    _contractAddress: string,
    _amount: number,
    _tokenAddress: string
  ) => Promise<void>;
  getCandidateIdByAddress: (address?: string) => Promise<number | null>;
}

interface Candidate {
  id: number;
  name: string;
  candidateAddress: string;
  voteCount: number;
  token: string;
  transferAmount: number;
}

// Create a typed context
export const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

// Define the context provider props type
interface ContractContextProviderProps {
  children: ReactNode;
}

const ContractContextProvider: React.FC<ContractContextProviderProps> = ({
  children,
}) => {
  const [contract, setContract] = useState<any>(undefined);
  const [account, setAccount] = useState<string>("");
  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const initializeContract = async () => {
      const contract = await connectContract();
      setContract(contract);
      await connectToWallet();
    };
    initializeContract();
  }, []);

  const connectToWallet = async () => {
    try {
      const account = await connectWallet();
      setAccount(account);
    } catch (error) {
      console.error("Error connecting wallet: ", error);
      setTransactionStatus("Failed to connect wallet.");
    }
  };

  const createToken = async (
    _name: string,
    _symbol: string,
    _initialSupply: number,
    _decimal: number
  ) => {
    setLoading(true);
    setTransactionStatus("");

    try {
      console.log(
        "In Create Token ==> ",
        _name,
        _symbol,
        _initialSupply,
        _decimal
      );
      const contract = await connectContract();
      console.log("Contract Address => ", contract);

      const tx = await contract?.createToken(
        _name,
        _symbol,
        _initialSupply,
        _decimal
      );
      const receipt = await tx.wait();

      const tokenAddress = receipt.events[0].args[0];
      console.log("Token Address => ", tokenAddress);

      setTransactionStatus("Token created successfully!");
      return tokenAddress;
    } catch (error) {
      setTransactionStatus("Error in creating token.");
      console.error("Error in creating token: ", error);
    } finally {
      setLoading(false);
    }
  };

  const registerVoter = async () => {
    setLoading(true);
    setTransactionStatus("");

    try {
      const contract = await connectContract();
      const tx = await contract?.registerVoter();
      await tx.wait();
      setTransactionStatus("Voter registered successfully!");
    } catch (error) {
      setTransactionStatus("Error in registerVoter.");
      console.error("Error in registerVoter: ", error);
    } finally {
      setLoading(false);
    }
  };

  const sendTokenToVoteContract = async (
    _amount: number,
    _candidateId: number
  ) => {
    setLoading(true);
    setTransactionStatus("");

    try {
      const contract = await connectContract();
      const tx = await contract?.sendTokenToVoteContract(_amount, _candidateId);
      await tx.wait();
      setTransactionStatus("Token sent successfully!");
    } catch (error) {
      setTransactionStatus("Error in sendTokenToVoteContract.");
      console.error("Error in sendTokenToVoteContract: ", error);
    } finally {
      setLoading(false);
    }
  };

  const vote = async (_candidateId: number) => {
    setLoading(true);
    setTransactionStatus("");

    try {
      const contract = await connectContract();
      const tx = await contract?.vote(_candidateId);
      await tx.wait();
      setTransactionStatus("Voted successfully!");
    } catch (error) {
      setTransactionStatus("Error in vote.");
      console.error("Error in vote: ", error);
    } finally {
      setLoading(false);
    }
  };

  const getCandidateIdByAddress = async (address: string = account) => {
    const contract = await connectContract();
    const candidatesData = await contract?.getCandidates();
    const candidates = candidatesData.map((candidate: any) => ({
      id: candidate.id.toNumber(),
      name: candidate.name,
      candidateAddress: candidate.candidateAddress,
      voteCount: candidate.voteCount.toNumber(),
      token: candidate.token,
      transferAmount: candidate.transferAmount.toNumber(),
    }));

    const filteredCandidate = candidates.find(
      (candidate: Candidate) =>
        candidate.candidateAddress.toLowerCase() === address.toLowerCase()
    );

    console.log("Candidates => ", candidates);
    console.log("Filtered Candidate => ", filteredCandidate);

    return filteredCandidate ? filteredCandidate.id : null;
  };

  const getCandidates = async (): Promise<Candidate[]> => {
    const contract = await connectContract();
    const candidatesData = await contract?.getCandidates();
    return candidatesData.map((candidate: any) => ({
      id: candidate.id.toNumber(),
      name: candidate.name,
      candidateAddress: candidate.candidateAddress,
      voteCount: candidate.voteCount.toNumber(),
      token: candidate.token,
      transferAmount: candidate.transferAmount.toNumber(),
    }));
  };

  const getTokenDetails = async () => {
    try {
      const contract = await connectContract();
      const balance = await contract?.tokenOfAddress(account);
      console.log("Token Balance => ", balance);
    } catch (error) {
      console.error("Error in getTokenBalance: ", error);
    }
  };

  const getTokenAddress = async (): Promise<string | void> => {
    try {
      const contract = await connectContract();
      const tokenAddress = await contract?.getTokenAddress();
      console.log("Token Address => ", tokenAddress);
      return tokenAddress;
    } catch (error) {
      console.error("Error in getTokenAddress: ", error);
    }
  };

  const approveTokens = async (
    _contractAddress: string,
    _amount: number,
    _tokenAddress: string
  ) => {
    setLoading(true);
    setTransactionStatus("");

    try {
      const contract = await getTokenContract(_tokenAddress);
      const amount = toWei(_amount.toString());

      const tx = await contract?.approve(_contractAddress, amount);
      await tx.wait();
      setTransactionStatus("Tokens Approved!");
    } catch (error) {
      setTransactionStatus("Error in approveTokens.");
      console.error("Error in approveTokens: ", error);
    } finally {
      setLoading(false);
    }
  };

  const becomeCandidate = async (
    _name: string,
    _tokenAddress: string,
    _transferAmount: number
  ) => {
    setLoading(true);
    setTransactionStatus("");

    try {
      const contract = await connectContract();
      const tx = await contract?.addCandidate(
        _name,
        _tokenAddress,
        _transferAmount
      );
      const receipt = await tx.wait();
      console.log("Receipt => ", receipt);
      setTransactionStatus("Candidate added successfully!");
    } catch (error) {
      setTransactionStatus("Error in BecomeCandidate.");
      console.error("Error in becomeCandidate: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContractContext.Provider
      value={{
        contract,
        account,
        transactionStatus,
        becomeCandidate,
        loading,
        createToken,
        registerVoter,
        sendTokenToVoteContract,
        vote,
        getCandidates,
        getTokenDetails,
        getTokenAddress,
        approveTokens,
        getCandidateIdByAddress,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContextProvider;
