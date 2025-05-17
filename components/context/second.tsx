"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useAddress, useMetamask, useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext<any>(null);

export const StateContextProvider = ({ children }: { children: React.ReactNode }) => {
    const address = useAddress();
    const connect = useMetamask();
    const signer = useSigner();

    const [sdk, setSdk] = useState<ThirdwebSDK | null>(null);
    const contractAddress = "0xAD62BA0614d9e2a6ECAcAf92889d5e190749c290";
    const [contract, setContract] = useState<any>(null);

    useEffect(() => {
        if (signer) {
            setSdk(ThirdwebSDK.fromSigner(signer, "sepolia"));
        }
    }, [signer]);

    useEffect(() => {
        if (sdk) {
            const loadContract = async () => {
                try {
                    const contractInstance = await sdk.getContract(contractAddress);
                    setContract(contractInstance);
                } catch (error) {
                    console.error("Error loading contract:", error);
                }
            };
            loadContract();
        }
    }, [sdk]);

    // Pre-buy: lock ETH in escrow on-chain
    const preBuy = async (productId: string) => {
        if (!contract) throw new Error("Contract not loaded");
        try {
            const price = await contract.call("getProductPrice", [productId]);
            if (!price) throw new Error("Price not found or invalid");

            const tx = await contract.call("preBuy", [productId], { value: price });
            return tx;
        } catch (error) {
            console.error("Error in preBuy:", error);
            throw error;
        }
    };

    // Lock-buy: finalize or refund
    const lockBuy = async (productId: string, approve: boolean) => {
        if (!contract) throw new Error("Contract not loaded");
        try {
            const tx = await contract.call("lockBuy", [productId, approve]);
            return tx;
        } catch (error) {
            console.error("Error in lockBuy:", error);
            throw error;
        }
    };

    return (
        <StateContext.Provider
            value={{
                address,
                connect,
                sdk,
                contract,
                signer,
                preBuy,
                lockBuy,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);