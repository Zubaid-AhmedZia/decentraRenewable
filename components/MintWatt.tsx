import React, { useState } from "react";
import { mintWattTokens } from "../src/index"; // Adjust the path as needed
//import styles from "./Button.module.css";

import { useWallet } from "@solana/wallet-adapter-react";

const MintWatt: React.FC = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const { publicKey, connected } = useWallet();

  const handleMint = async () => {
    try {
      if (!connected || !publicKey) {
        alert("Please connect your wallet first!");
        return;
      }
      setAnimationStarted(true);
      await mintWattTokens(publicKey);
      setTimeout(() => {
        setAnimationStarted(false);
      }, 3000); // Adjust the duration as needed
      alert("Tokens minted successfully!");
    } catch (error) {
      console.error("Error minting tokens:", error);
      alert("Error minting tokens. Check the console for more details.");
    }
  };

  const buttonStyles = {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.3s",
    transform: animationStarted ? "scale(1.2)" : "scale(1)",
    backgroundColor: "#4CAF50",
    color: "white",
  };

  const symbolsStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
    fontSize: animationStarted ? "40px" : "20px", // Enlarge the symbols when the button is clicked
    transition: "font-size 0.3s", // Smooth transition effect
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <button style={buttonStyles} onClick={handleMint}>
        Mint Tokens
      </button>
      <div style={symbolsStyle}>
        <span>⚡</span>
        <span>🍃</span>
      </div>
    </div>
  );
};

export default MintWatt;

//export default MintWatt;
