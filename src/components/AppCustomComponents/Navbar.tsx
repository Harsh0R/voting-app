"use client";
import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ModeToggle } from "../ui/mode-toggle";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gray-800 text-white p-4 dark:bg-black shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/">Voting App</Link>
        </div>

        <NavigationMenu className="hidden md:flex space-x-6">
          <NavigationMenuList className="flex space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/">All Candidates</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/become-candidate">Become Candidate</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex flex items-center space-x-4">
          <ModeToggle />
          <ConnectButton
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
            showBalance={{ smallScreen: false, largeScreen: true }}
          />
        </div>

        <button
          className="md:hidden focus:outline-none ml-5"
          aria-label="Toggle navigation menu"
          onClick={toggleMobileMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 flex">
          
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleMobileMenu}
          />
          <div className="bg-gray-900 text-white w-64 h-full shadow-lg z-30 transform transition-transform duration-300 ease-in-out">
            <div className="p-4">
              <h2 className=" flex items-center justify-between">
                Menu
                <ModeToggle />
              </h2>
              <div className="mt-6">
                <ConnectButton
                  accountStatus={{
                    smallScreen: "avatar",
                    largeScreen: "full",
                  }}
                  showBalance={{ smallScreen: false, largeScreen: true }}
                />
              </div>
              <NavigationMenu className="md:flex space-x-6">
                <NavigationMenuList className="flex flex-col space-y-4 mt-4">
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/"
                        onClick={toggleMobileMenu}
                        className="p-2 rounded hover:bg-gray-700 transition"
                      >
                        All Candidates
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/become-candidate"
                        onClick={toggleMobileMenu}
                        className="p-2 rounded hover:bg-gray-700 transition"
                      >
                        Become Candidate
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
