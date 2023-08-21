import dotenv from "dotenv";
dotenv.config();

import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
// import * as fs from "fs";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import {
  DataV2,
  createCreateMetadataAccountV2Instruction,
  createCreateMetadataAccountV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";

async function createNewMint(
  connection: web3.Connection,
  payer: web3.Keypair,
  mintAuthority: web3.PublicKey,
  freezeAuthority: web3.PublicKey,
  decimals: number
): Promise<web3.PublicKey> {
  const tokenMint = await token.createMint(
    connection,
    payer,
    mintAuthority,
    freezeAuthority,
    decimals
  );

  console.log(
    `Token Mint: https://explorer.solana.com/address/${tokenMint}?cluster=devnet`
  );

  return tokenMint;
}

async function createTokenAccount(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  owner: web3.PublicKey
) {
  const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    owner
  );

  console.log(
    `Token Account: https://explorer.solana.com/address/${tokenAccount.address}?cluster=devnet`
  );

  return tokenAccount;
}

async function mintTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  destination: web3.PublicKey,
  authority: web3.Keypair,
  amount: number
) {
  const transactionSignature = await token.mintTo(
    connection,
    payer,
    mint,
    destination,
    authority,
    amount
  );

  console.log(
    `Mint Token Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  );
}

async function transferTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  source: web3.PublicKey,
  destination: web3.PublicKey,
  owner: web3.Keypair,
  amount: number
) {
  const transactionSignature = await token.transfer(
    connection,
    payer,
    source,
    destination,
    owner,
    amount
  );

  console.log(
    `Transfer Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  );
}

async function burnTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  account: web3.PublicKey,
  mint: web3.PublicKey,
  owner: web3.Keypair,
  amount: number
) {
  const transactionSignature = await token.burn(
    connection,
    payer,
    account,
    mint,
    owner,
    amount
  );

  console.log(
    `Burn Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  );
}

const name = "BlockSmith";
const description = "adding blocks to solana";
const symbol = "BLS";

async function initializeKeypair(
  connection: web3.Connection
): Promise<web3.Keypair> {
  // if (!process.env.PRIVATE_KEY) {
  //   console.log("Creating .env file");
  //   const signer = web3.Keypair.generate();
  //   //fs.writeFileSync(".env", `PRIVATE_KEY=[${signer.secretKey.toString()}]`);
  //   await airdropSolIfNeeded(signer, connection);

  //   return signer;
  // }

  const PRIVATE_KEY = [
    160, 169, 239, 162, 38, 139, 218, 172, 155, 43, 73, 241, 135, 57, 66, 229,
    123, 40, 23, 139, 238, 52, 122, 61, 199, 79, 16, 236, 153, 68, 45, 183, 194,
    253, 222, 139, 6, 206, 90, 134, 127, 86, 114, 153, 152, 224, 151, 88, 159,
    253, 218, 193, 231, 67, 246, 34, 103, 111, 179, 139, 159, 137, 74, 177,
  ];
  //const secret = JSON.parse(PRIVATE_KEY ?? "") as number[];
  const secretKey = Uint8Array.from(PRIVATE_KEY);
  const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
  await airdropSolIfNeeded(keypairFromSecretKey, connection);
  return keypairFromSecretKey;
}

async function airdropSolIfNeeded(
  signer: web3.Keypair,
  connection: web3.Connection
) {
  const balance = await connection.getBalance(signer.publicKey);
  console.log("Current balance is", balance);
  if (balance < web3.LAMPORTS_PER_SOL) {
    console.log("Airdropping 1 SOL...");
    await connection.requestAirdrop(signer.publicKey, web3.LAMPORTS_PER_SOL);
  }
}

export async function mintWattTokens(destinationPublicKey: web3.PublicKey) {
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );
  const user = await initializeKeypair(connection);

  const mint = await token.createMint(
    connection,
    user,
    user.publicKey,
    user.publicKey,
    2
  );

  console.log(mint.toBase58());

  const tokenAccount = createTokenAccount(
    connection,
    user,
    mint,
    destinationPublicKey
  );

  const tokenAccountAddress = await (await tokenAccount).address;

  await mintTokens(connection, user, mint, tokenAccountAddress, user, 100);

  //     const metaplex = Metaplex.make(connection)
  //     .use(keypairIdentity(user))
  //     .use(
  //       bundlrStorage({
  //         address: "https://devnet.bundlr.network",
  //         providerUrl: "https://api.devnet.solana.com",
  //         timeout: 60000,
  //       })
  //     )

  //     const buffer = fs.readFileSync("src/bs.png")
  //     const file = toMetaplexFile(buffer,"bs.png")

  //     const imageUri = await metaplex.storage().upload(file)
  //     console.log("image uri", imageUri)

  //     const {uri} = await metaplex.nfts().uploadMetadata({
  //         name: name,
  //         description: description,
  //         image: imageUri
  //     })

  //     console.log("metadata uri:", uri)

  //      // get metadata account address
  //      const metadataPDA = metaplex.nfts().pdas().metadata({mint})

  //     // onchain metadata format
  //   const tokenMetadata = {
  //     name: name,
  //     symbol: symbol,
  //     uri: uri,
  //     sellerFeeBasisPoints: 0,
  //     creators: null,
  //     collection: null,
  //     uses: null,
  //   } as DataV2

  //     const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
  //         connection,
  //         user,
  //         mint,
  //         user.publicKey
  //     )

  //console.log((await tokenAccount).address);

  // token.mintTo(
  //     connection,
  //     user,
  //     mint,
  //     tokenAccount.address,
  //     user,
  //     100
  // )
}

// main()
//   .then(() => {
//     console.log("Finished successfully");
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.log(error);
//     process.exit(1);
//   });
