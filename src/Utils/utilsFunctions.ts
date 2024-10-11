import { ethers } from "ethers";
import { VotingContractAddress, contractABI, tokenAbi } from "../Constants/Constants";


export const A_DECIMAL = 10 ** 12;
export const B_DECIMAL = 10 ** 6;
export const MATIC_DECIMAL = 10 ** 18;


export function toWei(amount: string, decimal: number = 18) {
  const toWei = ethers.utils.parseUnits(amount, decimal);
  return toWei.toString();
}
export function toTokenA(amount: string, decimal: number = 12) {
  const toWei = ethers.utils.parseUnits(amount, decimal);
  return toWei.toString();
}
export function toTokenB(amount: string, decimal: number = 6) {
  const toWei = ethers.utils.parseUnits(amount, decimal);
  return toWei.toString();
}

export function toEth(amount: string, decimal: number = 18) {
  const toEth = ethers.utils.formatUnits(amount, decimal);
  return toEth.toString();
}
export function toEthA(amount: string, decimal: number = 12) {
  const toEth = ethers.utils.formatUnits(amount, decimal);
  return toEth.toString();
}
export function toEthB(amount: string, decimal: number = 6) {
  const toEth = ethers.utils.formatUnits(amount, decimal);
  return toEth.toString();
}

export const checkIfWalletConnected = async () => {
  try {
    if (!window.ethereum) {
      return console.log("INSTALL METAMASk");
    }

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    const firstAccount = accounts[0];
    return firstAccount;
  } catch (error) {
    console.log(error);
  }
};

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert("Please install Metamask");
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const firstAccount = accounts[0];

    return firstAccount;
  } catch (error) {
    console.log("error in connectWallet => ", error);
  }
};

export const connectContract = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(VotingContractAddress, contractABI, signer);
    return contract;
  } catch (error) {
    console.log("error in get Swapping contract => ", error);
  }
};



export const getTokenContract = async (tokenContractAddress: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
      tokenContractAddress,
      tokenAbi,
      signer
    );
    return tokenContract;
  } catch (error) {
    console.log("error in getTokenContract => ", error);
  }
};
