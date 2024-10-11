"use client";
import React, { useContext, useState } from "react";
import { ContractContext } from "@/Context/contractContect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react"; // Loader icon from Shadcn
// import { useToast } from "../ui/toast1"; // Correct path for toast

const BecomeCandidate = () => {
    const { becomeCandidate, loading, transactionStatus } = useContext(ContractContext);
    const [name, setName] = useState<string>("");
    const [tokenAddress, setTokenAddress] = useState<string>("");
    const [transferAmount, setTransferAmount] = useState<number>(0);
    // const { addToast } = useToast(); // Correctly destructure addToast

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !tokenAddress || transferAmount <= 0) {
            // addToast({
            //     title: "Invalid Input",
            //     description: "Please fill in all the fields.",
            //     status: "error",
            // });
            alert("Please fill in all the fields.");
            return;
        }

        try {
            await becomeCandidate(name, tokenAddress, transferAmount);
            // addToast({
            //     title: "Success",
            //     description: "You have become a candidate!",
            //     status: "success",
            // });
            alert("You have become a candidate!");
        } catch (error) {
            console.error("Error while becoming a candidate:", error);
            // addToast({
            //     title: "Error",
            //     description: "Something went wrong!",
            //     status: "error",
            // });
            alert("Something went wrong!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md p-4">
                <CardHeader>
                    <CardTitle>Become a Candidate</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
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
                                <Label htmlFor="tokenAddress">Token Address</Label>
                                <Input
                                    id="tokenAddress"
                                    type="text"
                                    placeholder="Enter token contract address"
                                    value={tokenAddress}
                                    onChange={(e) => setTokenAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="transferAmount">Transfer Amount</Label>
                                <Input
                                    id="transferAmount"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={transferAmount}
                                    onChange={(e) => setTransferAmount(Number(e.target.value))}
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
                                    "Submit"
                                )}
                            </Button>
                        </div>
                    </form>

                    {transactionStatus && (
                        <div className="mt-4 text-center">
                            <p>{transactionStatus}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default BecomeCandidate;
