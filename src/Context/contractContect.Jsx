"use client";
import {
  connectContract,
  connectWallet,
  getTokenContract,
  toWei,
} from "@/Utils/utilsFunctions";
import React, { createContext, useEffect, useState } from "react";

export const ContractContext = createContext();

const ContractContextProvider = ({ children }) => {
  const [contract, setContract] = useState();
  const [account, setAccount] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [loading, setLoading] = useState(false);

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
    _name,
    _symbol,
    _initalSupply,
    _decimal
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
    _amount,
    _candidateId
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

  const vote = async (_candidateId) => {
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

  const getCandidateIdByAddress = async (
    address = account
  ) => {
    // console.log("Address => ", address);
    const contract = await connectContract();

    const candidatesData = await contract?.getCandidates();
    const candidates = candidatesData.map((candidate) => ({
      id: candidate.id.toNumber(),
      name: candidate.name,
      candidateAddress: candidate.candidateAddress,
      voteCount: candidate.voteCount.toNumber(),
      token: candidate.token,
      transferAmount: candidate.transferAmount.toNumber(),
    }));

    const filteredCandidate = candidates.find(
      (candidate) =>
        candidate.candidateAddress.toLowerCase() === address.toLowerCase()
    );

    console.log("Candidates => ", candidates);
    console.log("Filtered Candidate => ", filteredCandidate);

    return filteredCandidate ? filteredCandidate.id : null;
  };

  const getCandidates = async () => {
    const contract = await connectContract();

    const candidatesData = await contract?.getCandidates();
    return candidatesData.map((candidate) => ({
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
    _contractAddress,
    _amount,
    _tokenAddress
  ) => {
    setLoading(true);
    setTransactionStatus("");

    try {
      const contract = await getTokenContract(_tokenAddress);
      console.log("Contract Token Address in approveTokens => ", contract);
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
    _name,
    _tokenAddress,
    _transferAmount
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
