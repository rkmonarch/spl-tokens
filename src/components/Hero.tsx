"use client";

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  MINT_SIZE,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToCheckedInstruction,
  createTransferInstruction,
  createBurnCheckedInstruction,
  createApproveCheckedInstruction,
  createRevokeInstruction,
  createCloseAccountInstruction,
} from "@solana/spl-token";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useState } from "react";
import { toast } from "react-toastify";
import formatAddress from "@/utils/formatAddress";

export default function Hero() {
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");
  const [mint, setMint] = useState<PublicKey | null>(null);

  async function createToken() {
    if (!publicKey) {
      console.error("Wallet is not connected");
      return;
    }

    const mintKeypair = Keypair.generate();
    const lamports = await connection.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9,
        publicKey,
        publicKey
      )
    );

    try {
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;

      const signature = await sendTransaction(transaction, connection, {
        signers: [mintKeypair],
      });
      await connection.confirmTransaction(signature, "confirmed");
      console.log(
        "Token created with public key:",
        mintKeypair.publicKey.toBase58()
      );
      setMint(mintKeypair.publicKey);
      toast.success(
        `Token created successfully! Mint: ${mintKeypair.publicKey.toBase58()}`
      );
    } catch (error) {
      console.error("Failed to create token:", error);
      toast.error("Failed to create token.");
    }
  }

  async function mintTokens() {
    if (!publicKey || !mint) {
      console.error("Wallet is not connected or mint not set.");
      return;
    }

    const ata = getAssociatedTokenAddressSync(mint, publicKey);

    let tx = new Transaction();
    tx.add(
      createAssociatedTokenAccountInstruction(publicKey, ata, publicKey, mint),
      createMintToCheckedInstruction(
        mint,
        ata,
        publicKey,
        100 * LAMPORTS_PER_SOL,
        9
      )
    );

    tx.feePayer = publicKey;
    tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    try {
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Tokens minted:", 100);
      toast.success("Tokens minted successfully!");
    } catch (error) {
      console.error("Failed to mint tokens:", error);
      toast.error("Failed to mint tokens.");
    }
  }

  async function sendTokens() {
    if (!publicKey || !mint) {
      console.error("Wallet is not connected or mint not set.");
      return;
    }

    const receiver = new PublicKey(
      "8vU3WgmVnVDa13hXAevKA3Vhe7XtbwHrQja6aVx15KwV"
    );
    const senderATA = getAssociatedTokenAddressSync(mint, publicKey);
    const receiverATA = getAssociatedTokenAddressSync(mint, receiver);

    let tx = new Transaction();
    tx.add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        receiverATA,
        receiver,
        mint
      ),
      createTransferInstruction(
        senderATA,
        receiverATA,
        publicKey,
        1 * LAMPORTS_PER_SOL
      )
    );

    tx.feePayer = publicKey;
    tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    try {
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Tokens sent:", 1);
      toast.success("Tokens sent successfully!");
    } catch (error) {
      console.error("Failed to send tokens:", error);
      toast.error("Failed to send tokens.");
    }
  }

  async function burnTokens() {
    if (!publicKey || !mint) {
      console.error("Wallet is not connected or mint not set.");
      return;
    }

    const ata = getAssociatedTokenAddressSync(mint, publicKey);

    let tx = new Transaction();
    tx.add(
      createBurnCheckedInstruction(
        ata,
        mint,
        publicKey,
        1 * LAMPORTS_PER_SOL,
        9
      )
    );

    tx.feePayer = publicKey;
    tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    try {
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Tokens burned:", 1);
      toast.success("Tokens burned successfully!");
    } catch (error) {
      console.error("Failed to burn tokens:", error);
      toast.error("Failed to burn tokens.");
    }
  }

  async function delegate() {
    if (!publicKey || !mint) {
      console.error("Wallet is not connected or mint not set.");
      return;
    }

    const ata = getAssociatedTokenAddressSync(mint, publicKey);
    const delegate = new PublicKey(
      "8vU3WgmVnVDa13hXAevKA3Vhe7XtbwHrQja6aVx15KwV"
    );

    let tx = new Transaction();
    tx.add(
      createApproveCheckedInstruction(
        ata,
        mint,
        delegate,
        publicKey,
        1 * LAMPORTS_PER_SOL,
        9
      )
    );

    tx.feePayer = publicKey;
    tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    try {
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Tokens delegated:", 1);
      toast.success("Tokens delegated successfully!");
    } catch (error) {
      console.error("Failed to delegate tokens:", error);
      toast.error("Failed to delegate tokens.");
    }
  }

  async function revokeDelegate() {
    if (!publicKey || !mint) {
      console.error("Wallet is not connected or mint not set.");
      return;
    }

    const ata = getAssociatedTokenAddressSync(mint, publicKey);

    let tx = new Transaction();
    tx.add(createRevokeInstruction(ata, publicKey));

    tx.feePayer = publicKey;
    tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    try {
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Tokens revoked.");
      toast.success("Tokens revoked successfully!");
    } catch (error) {
      console.error("Failed to revoke tokens:", error);
      toast.error("Failed to revoke tokens.");
    }
  }

  async function closeTokenAccount() {
    if (!publicKey || !mint) {
      console.error("Wallet is not connected or mint not set.");
      return;
    }

    const ata = getAssociatedTokenAddressSync(mint, publicKey);

    let tx = new Transaction();
    tx.add(createCloseAccountInstruction(ata, publicKey, publicKey));

    tx.feePayer = publicKey;
    tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    try {
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Token account closed.");
      toast.success("Token account closed successfully!");
    } catch (error) {
      console.error("Failed to close token account:", error);
      toast.error("Failed to close token account.");
    }
  }

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-4">Check the console for actions.</div>
      <div className="text-center mb-4">
        Make sure you are connected to the wallet.
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-4">
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={createToken}
          >
            Create Token
          </button>
        </div>
        {mint && (
          <>
            <div className="flex space-x-4">
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={mintTokens}
              >
                Mint Tokens
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={sendTokens}
              >
                {`Send Tokens to ${formatAddress(
                  "8vU3WgmVnVDa13hXAevKA3Vhe7XtbwHrQja6aVx15KwV"
                )}`}
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={burnTokens}
              >
                Burn Tokens
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={delegate}
              >
                {`Delegate Tokens to ${formatAddress(
                  "8vU3WgmVnVDa13hXAevKA3Vhe7XtbwHrQja6aVx15KwV"
                )}`}
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={revokeDelegate}
              >
                Revoke Delegate
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={closeTokenAccount}
              >
                Close Token Account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
