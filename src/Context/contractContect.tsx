"use client";
import { connectContract, connectWallet } from "@/Utils/utilsFunctions";
import React, { createContext, useEffect, useState } from "react";

export const ContractContext = createContext<any>(null);

const ContractContextProvider = ({ children }: any) => {
  const [contract, setContract] = useState<any>();
  const [account, setAccount] = useState<string | null>(null);
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

  const becomeCandidate = async (
    _name: string,
    _tokenAddress: string,
    _transferAmount: number
  ) => {
    setLoading(true);
    setTransactionStatus(""); // Reset status before the transaction

    try {
      const contract = await connectContract();
      const tx = await contract?.addCandidate(_name, _tokenAddress, _transferAmount);
      await tx.wait(); // Wait for the transaction to be mined
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
      value={{contract, account, transactionStatus, becomeCandidate, loading }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContextProvider;
