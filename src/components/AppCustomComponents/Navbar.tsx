"use client";
import React, { useContext } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ContractContext } from "@/Context/contractContect";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ModeToggle } from "../ui/mode-toggle";

const Navbar: React.FC = () => {
  const { account } = useContext(ContractContext);

  return (
    <nav className="bg-gray-800 text-white p-4 dark:bg-black">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/">Voting App</Link>
        </div>

        <NavigationMenu className="hidden md:flex space-x-6">
          <NavigationMenuList className="flex space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/">All Candidate</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/become-candidate">Become Candidate</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Wallet connection button */}
        {/* {account ? (
          <Button
            variant={account ? "default" : "outline"}
            className="bg-purple-600"
            onClick={connectWallet}
          >
            Connected to {account.slice(0, 6)}...{account.slice(-4)}
          </Button>
        ) : (
          <Button
            variant={account ? "default" : "outline"}
            className="bg-purple-600"
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        )} */}

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
