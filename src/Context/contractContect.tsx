"use client";
import {
  connectContract,
  connectWallet,
  getTokenContract,
  toWei,
} from "@/Utils/utilsFunctions";
import React, { createContext, useEffect, useState } from "react";

interface ContractContextType {
  contract: any; // You can replace this with a proper type for your contract
  account: string | null;
  transactionStatus: string;
  loading: boolean;
  createToken: (_name: string, _symbol: string, _initalSupply: number, _decimal: number) => Promise<string | undefined>;
  registerVoter: () => Promise<void>;
  sendTokenToVoteContract: (_amount: number, _candidateId: number) => Promise<void>;
  vote: (_candidateId: number) => Promise<void>;
  getCandidates: () => Promise<Candidate[]>;
  getTokenDetails: () => Promise<void>;
  getTokenAddress: () => Promise<string | undefined>;
  approveTokens: (_contractAddress: string, _amount: number, _tokenAddress: string) => Promise<void>;
  becomeCandidate: (_name: string, _tokenAddress: string, _transferAmount: number) => Promise<void>;
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
interface Props {
  children: React.ReactNode;
}

export const ContractContext = createContext<ContractContextType | null>(null);


const ContractContextProvider = ({ children }: Props) => {
  const [contract, setContract] = useState<any>();
  const [account, setAccount] = useState<string>('');
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
    _initalSupply: number,
    _decimal: number
  ) => {
    setLoading(true);
    setTransactionStatus("");

    try {
      console.log(
        "In Create Token ==> ",
        _name,
        _symbol,
        _initalSupply,
        _decimal
      );

      const contract = await connectContract();
      console.log("Contract Address => ", contract);

      const tx = await contract?.createToken(
        _name,
        _symbol,
        _initalSupply,
        _decimal
      );
      const receipt = await tx.wait(); // Wait for the transaction to be mined

      // Assuming that the token address is emitted as an event from the contract
      const tokenAddress = receipt.events[0].args[0]; // Adjust this based on your contract's event structure
      console.log("Token Address => ", tokenAddress);

      setTransactionStatus("Token created successfully!");
      return tokenAddress; // Return the token address
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

  const getCandidateIdByAddress = async (address: string = account): Promise<number | null> => {
    // console.log("Address => ", address);

    const candidatesData = await contract.getCandidates();
    const candidates = candidatesData.map((candidate: any) => ({
      id: candidate.id.toNumber(),
      name: candidate.name,
      candidateAddress: candidate.candidateAddress,
      voteCount: candidate.voteCount.toNumber(),
      token: candidate.token,
      transferAmount: candidate.transferAmount.toNumber(),
    }));

    // Normalize addresses to lowercase for comparison
    const filteredCandidate = candidates.find(
      (candidate: any) =>
        candidate.candidateAddress.toLowerCase() === address.toLowerCase()
    );

    console.log("Candidates => ", candidates);
    console.log("Filtered Candidate => ", filteredCandidate);

    return filteredCandidate ? filteredCandidate.id : null;
  };

  const getCandidates = async (): Promise<Candidate[]> => {
    const candidatesData = await contract.getCandidates();
    return candidatesData.map((candidate: any) => ({
      id: candidate.id.toNumber(), // Convert BigNumber to Number
      name: candidate.name,
      candidateAddress: candidate.candidateAddress,
      voteCount: candidate.voteCount.toNumber(), // Convert BigNumber to Number
      token: candidate.token, // Assuming token is represented as a string
      transferAmount: candidate.transferAmount.toNumber(), // Convert BigNumber to Number
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

  const getTokenAddress = async () => {
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
      console.log("Contract Token Address => ", contract);
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
    setTransactionStatus(""); // Reset status before the transaction

    try {
      const contract = await connectContract();
      const tx = await contract?.addCandidate(
        _name,
        _tokenAddress,
        _transferAmount
      );
      const receipt = await tx.wait(); // Wait for the transaction to be mined
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
