import React from "react";

interface Props {}

export const ConnectWallet: React.FC<Props> = () => {
  const connectWallet = () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        const accounts = window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Metamask not installed");
    }
  };

  return (
    <button className="ml-2" onClick={connectWallet}>
      Connect Wallet
    </button>
  );
};
