import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';

const { SystemProgram } = web3;

export const getProgram = (connection: Connection, wallet: any) => {
  const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program(idl, programID, provider);
  return program;
};

export const sendTransaction = async (
  connection: Connection,
  wallet: any,
  program: Program
) => {
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: recipient,
      lamports: 1000000,
    })
  );

  const signature = await wallet.sendTransaction(tx, connection);
  await connection.confirmTransaction(signature);
  return signature;
};

