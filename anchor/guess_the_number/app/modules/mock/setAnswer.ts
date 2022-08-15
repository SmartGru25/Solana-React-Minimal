import { utils } from '@project-serum/anchor';
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

export const setAnswer = async(program: any, taker: Keypair, mint: PublicKey) => {
  const takerPublicKeyString = taker.publicKey.toString();
  let answer: string;

  switch(takerPublicKeyString) {
    case 'BBCkTVFxZbLPar5YpjqBzymPkcZvT7RMuDK59bbaPTd4':
      answer = 'Number 1';
      break;
    case 'DD83TEq47JeMKKrJqQWzabVmYkQfsof8CHsybQtGJvpo':
      answer = 'Number 2';
      break;
  }

  const [userAnswersPDA, _] = await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode('user-answers'),
      taker.publicKey.toBuffer(),
    ],
    program.programId
  )

  const signature = await program.methods
    .createUserAnswers(mint, answer)
    .accounts({
      user: taker.publicKey,
      userAnswers: userAnswersPDA,
    })
    .signers([taker])
    .rpc()

  const fetchUserAnswers = await program.account.userAnswers.fetch(userAnswersPDA);

  return [signature, fetchUserAnswers]
};