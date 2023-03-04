import * as solanaWeb3 from "@solana/web3.js";
import * as solanaToken from "@solana/spl-token";
import * as anchor from '../dist/cjs'
import NodeWallet from "../dist/cjs/nodewallet";
import * as utils from "../utils";


export interface IExdata {
    escrowKey:solanaWeb3.PublicKey,
    exchangeIdx:anchor.BN,
    initializer:solanaWeb3.PublicKey,
    taker:solanaWeb3.PublicKey,
    initializerMint:solanaWeb3.PublicKey,
    initializerAmount:number,
    takerMint:solanaWeb3.PublicKey,
    takerAmount:number,
}

const Sol = 'So11111111111111111111111111111111111111112';

const getProgram = async(
  connection:solanaWeb3.Connection, 
  payer:solanaWeb3.Keypair,
) =>{
  const wallet = await new NodeWallet(payer);
  const provider = new anchor.AnchorProvider(connection,wallet,utils.opts);
  const safe_exchange_idl = await import("./safe_exchange.json");
  const programID = '9Vfg3sFgXTH79HfUaQDsT4vnXTVvPhJcXcmbnd1VzYV9';
  const program = new anchor.Program(safe_exchange_idl, programID, provider);
  return program;
}

export const getExchangeCancelList = async(
  cluster:solanaWeb3.Cluster, 
  initializer:solanaWeb3.Keypair,
) =>{
  console.log('getExchangeCancelList');
  const connection = utils.createConnection(cluster);
  const program = await getProgram(connection,initializer);
  const exchangeStates = await program.account.exchangeState.all([{
      memcmp: {
            offset: 8 + // Discriminator.
                    8, // transferIdx.
            bytes: initializer.publicKey.toBase58(),
        }
  }]);
  const items:IExdata[] = [];

  for(let item of exchangeStates){
    items.push({
      escrowKey:item.publicKey,
      exchangeIdx: item.account.exchangeIdx,
      initializer:item.account.initializer,
      taker: item.account.taker,
      initializerMint:item.account.initializerMint,
      initializerAmount:item.account.initializerAmount,
      takerMint:item.account.takerMint,
      takerAmount:item.account.takerAmount,
    })
  }

   items.sort((a,b) => {
      if(a.exchangeIdx > b.exchangeIdx)
        return -1
      else
        return 1
})
  
  console.log(items.length,items[items.length-1]);
  return items;
 
}


export const getTransferConfirmlList = async(
  cluster:solanaWeb3.Cluster, 
  taker:solanaWeb3.Keypair,
) =>{
  console.log('getTransferConfirmlList');
  const connection = utils.createConnection(cluster);
  const program = await getProgram(connection,taker);
  const exchangeStates = await program.account.exchangeState.all([{
      memcmp: {
            offset: 8 + // Discriminator.
                    8 + // transferIdx.
                    32, // initializer
            bytes: taker.publicKey.toBase58(),
        }
  }]);
  const items:IExdata[] = [];
  for(let item of exchangeStates){
    items.push({
      escrowKey:item.publicKey,
      exchangeIdx: item.account.exchangeIdx,
      initializer:item.account.initializer,
      taker: item.account.taker,
      initializerMint:item.account.initializerMint,
      initializerAmount:item.account.initializerAmount,
      takerMint:item.account.takerMint,
      takerAmount:item.account.takerAmount,
    })
  }

   items.sort((a,b) => {
      if(a.exchangeIdx > b.exchangeIdx)
        return -1
      else
        return 1
})
  
  console.log(items.length,items);
  return items;
 
}


export const ExchangeInit = async(
    cluster: solanaWeb3.Cluster, 
    initializer: solanaWeb3.Keypair,
    _initializer_mint: string,
    _initializer_amount: string,
    _taker:string,
    _taker_mint: string,
    _taker_amount: string,
    )=>{
    
      console.log('SafeExchangeInit');
      const connection = utils.createConnection(cluster);
      const program = await getProgram(connection,initializer);

      const exchange_idx = new anchor.BN(Date.now());
      const taker = utils.publicKeyFromString(_taker); 

      if (_initializer_mint.includes(Sol) && !_taker_mint.includes(Sol)) {
        const initializer_amount = new anchor.BN(Number(_initializer_amount)*solanaWeb3.LAMPORTS_PER_SOL)
        const taker_mint = await solanaToken.getMint(connection,
                              utils.publicKeyFromString(_taker_mint));
        const taker_amount =  new anchor.BN(Number(_taker_amount)*Math.pow(10,taker_mint.decimals))
        const exchange_state = (await solanaWeb3.PublicKey.findProgramAddress(
          [new TextEncoder().encode("state"), 
            exchange_idx.toArrayLike(Buffer, "le", 8),
            initializer.publicKey.toBuffer(),
            taker.toBuffer(),
            taker_mint.address.toBuffer(),
          ],
          program.programId
        ))[0];
       
        const signature = await program.methods
        .initializeSolToken(
          exchange_idx, 
          initializer_amount,
          taker_amount,
        )
        .accounts({
          initializer: initializer.publicKey,
          taker: taker,
          takerMint: taker_mint.address,
          exchangeState:  exchange_state,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([initializer])
        .rpc();

        console.log('SafeTransferInit_Sol_Token is finished:',signature);
        const exchangeStates = await program.account.exchangeState.fetch(exchange_state);
        console.log('SafeTransferInit_Sol_Token is finished:',exchange_state,exchangeStates);
        return;
      }

      if (!_initializer_mint.includes(Sol) && _taker_mint.includes(Sol)){
        const initializer_mint = await solanaToken.getMint(connection,
                              utils.publicKeyFromString(_initializer_mint));
        const initializer_amount = new anchor.BN(Number(_initializer_amount)*Math.pow(10,initializer_mint.decimals))
        const taker_amount = new anchor.BN(Number(_taker_amount)*solanaWeb3.LAMPORTS_PER_SOL)

        const initializerWithdrawTokenAccount = await solanaToken.getOrCreateAssociatedTokenAccount(
          connection,
          initializer, // payer
          initializer_mint.address,    // token
          initializer.publicKey,  // who to create an account for
        )  
        const escrow_wallet = (await solanaWeb3.PublicKey.findProgramAddress(
          [new TextEncoder().encode("wallet"), 
          exchange_idx.toArrayLike(Buffer, "le", 8),
          initializer.publicKey.toBuffer(),
          initializer_mint.address.toBuffer(),
          taker.toBuffer(),
          ],
          program.programId
        ))[0];
  
        const exchange_state = (await solanaWeb3.PublicKey.findProgramAddress(
          [new TextEncoder().encode("state"), 
          exchange_idx.toArrayLike(Buffer, "le", 8),
          initializer.publicKey.toBuffer(),
          initializer_mint.address.toBuffer(),
          taker.toBuffer(),
          ],
          program.programId
        ))[0];
  
        console.log('SafeExchangeInit_token_sol', escrow_wallet,exchange_state);

        const signature = await program.methods
        .initializeTokenSol(
          exchange_idx, 
          initializer_amount, 
          taker_amount,
        )
        .accounts({
          initializer: initializer.publicKey,
          initializerMint: initializer_mint.address,
          taker: taker,
          initializerWithdrawTokenAccount: initializerWithdrawTokenAccount.address,
          exchangeState:  exchange_state,
          escrowWallet: escrow_wallet,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
        })
        .signers([initializer])
        .rpc();
    
        console.log('SafeExchangeInit_token_sol is finished:',signature);
        return;
      }
      
      if (!_initializer_mint.includes(Sol) && !_taker_mint.includes(Sol)){ 
        const initializer_mint = await solanaToken.getMint(connection,
                              utils.publicKeyFromString(_initializer_mint));
        const initializer_amount = new anchor.BN(Number(_initializer_amount)*Math.pow(10,initializer_mint.decimals))
        const taker_mint = await solanaToken.getMint(connection,
                              utils.publicKeyFromString(_taker_mint));
        const taker_amount =  new anchor.BN(Number(_taker_amount)*Math.pow(10,taker_mint.decimals))
        const initializerWithdrawTokenAccount = await solanaToken.getOrCreateAssociatedTokenAccount(
          connection,
          initializer, // payer
          initializer_mint.address,    // token
          initializer.publicKey,  // who to create an account for
        )  
        const escrow_wallet = (await solanaWeb3.PublicKey.findProgramAddress(
          [new TextEncoder().encode("wallet"), 
          exchange_idx.toArrayLike(Buffer, "le", 8),
          initializer.publicKey.toBuffer(),
          initializer_mint.address.toBuffer(),
          taker.toBuffer(),
          taker_mint.address.toBuffer(),
          ],
          program.programId
        ))[0];
  
        const exchange_state = (await solanaWeb3.PublicKey.findProgramAddress(
          [new TextEncoder().encode("state"), 
          exchange_idx.toArrayLike(Buffer, "le", 8),
          initializer.publicKey.toBuffer(),
          initializer_mint.address.toBuffer(),
          taker.toBuffer(),
          taker_mint.address.toBuffer(),
          ],
          program.programId
        ))[0];
  
        console.log('SafeExchangeInit_token_token', escrow_wallet,exchange_state);

        const signature = await program.methods
        .initializeTokenToken(
          exchange_idx, 
          initializer_amount, 
          taker_amount,
        )
        .accounts({
          initializer: initializer.publicKey,
          initializerMint: initializer_mint.address,
          taker: taker,
          takerMint: taker_mint.address,
          initializerWithdrawTokenAccount: initializerWithdrawTokenAccount.address,
          exchangeState:  exchange_state,
          escrowWallet: escrow_wallet,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
        })
        .signers([initializer])
        .rpc();
    
        console.log('SafeExchangeInit_token_token is finished:',signature);
        return;
      }
      
  }
  
  
export const ExchangeCancel = async(
  cluster:solanaWeb3.Cluster, 
  initializer:solanaWeb3.Keypair,
  exchange_data:IExdata,
  )=>{
  
    console.log('SafeExchange_cancel');
    const connection = utils.createConnection(cluster);
    const program = await getProgram(connection,initializer);

    const exchangeIdx = exchange_data.exchangeIdx;
    const taker = exchange_data.taker;
    
    if (exchange_data.initializerMint.toString().includes(Sol) && 
             !exchange_data.takerMint.toString().includes(Sol) )
      {
        const taker_mint = await solanaToken.getMint(connection,exchange_data.takerMint);
        const exchange_state = (await solanaWeb3.PublicKey.findProgramAddress(
          [new TextEncoder().encode("state"), 
            exchangeIdx.toArrayLike(Buffer, "le", 8),
            initializer.publicKey.toBuffer(),
            taker.toBuffer(),
            taker_mint.address.toBuffer(),
          ],
          program.programId
        ))[0];
        
        console.log('SafeExchangeCancel_Sol_Token',exchange_state);
        const signature = await program.methods
        .cancelSolToken(
          exchangeIdx,
        )
        .accounts({
          initializer: initializer.publicKey,
          taker: taker,
          takerMint: taker_mint.address,
          exchangeState:  exchange_state,
          systemProgram: anchor.web3.SystemProgram.programId,
      })
        .signers([initializer])
        .rpc();
        
        console.log('SafeExchangeCancel_Sol_Token is finished',signature);
        return;
    }
    if (!exchange_data.initializerMint.toString().includes(Sol) && 
              exchange_data.takerMint.toString().includes(Sol)){

          const initializer_mint = await solanaToken.getMint(connection,exchange_data.initializerMint);
          const initializerWithdrawTokenAccount = await solanaToken.getOrCreateAssociatedTokenAccount(
            connection,
            initializer, // payer
            initializer_mint.address,    // token
            initializer.publicKey,  // who to create an account for
          )
      
          const escrow_wallet = (await solanaWeb3.PublicKey.findProgramAddress(
            [new TextEncoder().encode("wallet"), 
              exchangeIdx.toArrayLike(Buffer, "le", 8),
              initializer.publicKey.toBuffer(),
              initializer_mint.address.toBuffer(),
              taker.toBuffer(),
            ],
            program.programId
          ))[0];

          const exchange_state = (await solanaWeb3.PublicKey.findProgramAddress(
            [new TextEncoder().encode("state"), 
              exchangeIdx.toArrayLike(Buffer, "le", 8),
              initializer.publicKey.toBuffer(),
              initializer_mint.address.toBuffer(),
              taker.toBuffer(),
            ],
            program.programId
          ))[0];
          
          console.log('SafeExchangeCancel_Token_Token',escrow_wallet,exchange_state);
          const signature = await program.methods
          .cancelTokenSol(
            exchangeIdx,
          )
          .accounts({
            initializer: initializer.publicKey,
            initializerMint: initializer_mint.address,
            taker: taker,
            initializerWithdrawTokenAccount: initializerWithdrawTokenAccount.address,
            exchangeState:  exchange_state,
            escrowWallet: escrow_wallet,
            tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
        })
        .signers([initializer])
        .rpc();
        
        console.log('SafeExchangeCancel_Token_Token is finished',signature);
        return;
    }

    if (!exchange_data.initializerMint.toString().includes(Sol) && 
        !exchange_data.takerMint.toString().includes(Sol))
    {
      const initializer_mint = await solanaToken.getMint(connection,exchange_data.initializerMint);
      const taker_mint = await solanaToken.getMint(connection,exchange_data.takerMint);
      const initializerWithdrawTokenAccount = await solanaToken.getOrCreateAssociatedTokenAccount(
        connection,
        initializer, // payer
        initializer_mint.address,    // token
        initializer.publicKey,  // who to create an account for
      )
   
      const escrow_wallet = (await solanaWeb3.PublicKey.findProgramAddress(
        [new TextEncoder().encode("wallet"), 
          exchangeIdx.toArrayLike(Buffer, "le", 8),
          initializer.publicKey.toBuffer(),
          initializer_mint.address.toBuffer(),
          taker.toBuffer(),
          taker_mint.address.toBuffer(),
        ],
        program.programId
      ))[0];

      const exchange_state = (await solanaWeb3.PublicKey.findProgramAddress(
        [new TextEncoder().encode("state"), 
          exchangeIdx.toArrayLike(Buffer, "le", 8),
          initializer.publicKey.toBuffer(),
          initializer_mint.address.toBuffer(),
          taker.toBuffer(),
          taker_mint.address.toBuffer(),
        ],
        program.programId
      ))[0];
      
      console.log('SafeExchangeCancel_Token_Token',escrow_wallet,exchange_state);
      const signature = await program.methods
      .cancelTokenToken(
        exchangeIdx,
      )
      .accounts({
        initializer: initializer.publicKey,
        initializerMint: initializer_mint.address,
        taker: taker,
        takerMint: taker_mint.address,
        initializerWithdrawTokenAccount: initializerWithdrawTokenAccount.address,
        exchangeState:  exchange_state,
        escrowWallet: escrow_wallet,
        tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
    })
    .signers([initializer])
    .rpc();
    
    console.log('SafeExchangeCancel_Token_Token is finished',signature);
    }   
}


export const ExchangeConfirm = async(
  cluster:solanaWeb3.Cluster, 
  taker:solanaWeb3.Keypair,
  exchange_data:  IExdata,
  )=>{
  
    console.log('SafeExchangeConfirm');
    const connection = utils.createConnection(cluster);
    const program = await getProgram(connection,taker);

    const exchangeIdx = exchange_data.exchangeIdx;
    const initializer = exchange_data.initializer;  
 
    if (exchange_data.initializerMint.toString().includes(Sol) && 
             !exchange_data.takerMint.toString().includes(Sol) ) {
      const taker_mint = await solanaToken.getMint(connection,exchange_data.takerMint); 
      const initializerReceiveTokenAccount = await solanaToken.getOrCreateAssociatedTokenAccount(
        connection,
        taker, // payer
        taker_mint.address,    // token
        exchange_data.initializer,  // who to create an account for
      )
    
      const takerWithdrawTokenAccount = await solanaToken.getOrCreateAssociatedTokenAccount(
        connection,
        taker, // payer
        taker_mint.address,    // token
        taker.publicKey,  // who to create an account for
      )
      const exchange_state = (await solanaWeb3.PublicKey.findProgramAddress(
        [new TextEncoder().encode("state"), 
          exchangeIdx.toArrayLike(Buffer, "le", 8),
          initializer.toBuffer(),
          taker.publicKey.toBuffer(),
          taker_mint.address.toBuffer(),
        ],
        program.programId
      ))[0];

      console.log('SafeExchangeConfirm_sol_token',exchange_state);
      const signature = await program.methods
      .exchangeSolToken(
        exchangeIdx
      )
        .accounts({
          initializer: initializer,
          taker: taker.publicKey,
          takerMint: taker_mint.address,
          initializerReceiveTokenAccount: initializerReceiveTokenAccount.address,
          takerWithdrawTokenAccount: takerWithdrawTokenAccount.address,
          exchangeState:  exchange_state,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
        })
        .signers([taker])
        .rpc();
      
        console.log('SafeExchangeConfirm_sol_token is finished',signature);
    }
    if (!exchange_data.initializerMint.toString().includes(Sol) && 
              exchange_data.takerMint.toString().includes(Sol)){

        const initializer_mint = await solanaToken.getMint(connection,exchange_data.initializerMint);       
        const takerReceiveTokenAccount = await solanaToken.getOrCreateAssociatedTokenAccount(
          connection,
          taker, // payer
          initializer_mint.address,    // token
          taker.publicKey,  // who to create an account for
        )

        const escrow_wallet = (await solanaWeb3.PublicKey.findProgramAddress(
          [new TextEncoder().encode("wallet"), 
            exchangeIdx.toArrayLike(Buffer, "le", 8),
            initializer.toBuffer(),
            initializer_mint.address.toBuffer(),
            taker.publicKey.toBuffer(),
          ],
          program.programId
        ))[0];

        const exchange_state = (await solanaWeb3.PublicKey.findProgramAddress(
          [new TextEncoder().encode("state"), 
            exchangeIdx.toArrayLike(Buffer, "le", 8),
            initializer.toBuffer(),
            initializer_mint.address.toBuffer(),
            taker.publicKey.toBuffer(),
          ],
          program.programId
        ))[0];

        console.log('SafeExchangeConfirm_token_token',escrow_wallet,exchange_state);
        const signature = await program.methods
        .exchangeTokenSol(
          exchangeIdx
        )
          .accounts({
            initializer: initializer,
            initializerMint: initializer_mint.address,
            taker: taker.publicKey,
            takerReceiveTokenAccount: takerReceiveTokenAccount.address,
            exchangeState:  exchange_state,
            escrowWallet: escrow_wallet,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
          })
          .signers([taker])
          .rpc();
        
        console.log('SafeExchangeConfirm_token_token is finished',signature);
    }

    if (!exchange_data.initializerMint.toString().includes(Sol) && 
        !exchange_data.takerMint.toString().includes(Sol)) {
        const taker_mint = await solanaToken.getMint(connection,exchange_data.takerMint); 
        const initializer_mint = await solanaToken.getMint(connection,exchange_data.initializerMint);       
        const initializerReceiveTokenAccount = await solanaToken.getOrCreateAssociatedTokenAccount(
          connection,
          taker, // payer
          taker_mint.address,    // token
          exchange_data.initializer,  // who to create an account for
        )
      
        const takerWithdrawTokenAccount = await solanaToken.getOrCreateAssociatedTokenAccount(
          connection,
          taker, // payer
          taker_mint.address,    // token
          taker.publicKey,  // who to create an account for
        )

        const takerReceiveTokenAccount = await solanaToken.getOrCreateAssociatedTokenAccount(
          connection,
          taker, // payer
          initializer_mint.address,    // token
          taker.publicKey,  // who to create an account for
        )

        const escrow_wallet = (await solanaWeb3.PublicKey.findProgramAddress(
          [new TextEncoder().encode("wallet"), 
            exchangeIdx.toArrayLike(Buffer, "le", 8),
            initializer.toBuffer(),
            initializer_mint.address.toBuffer(),
            taker.publicKey.toBuffer(),
            taker_mint.address.toBuffer(),
          ],
          program.programId
        ))[0];

        const exchange_state = (await solanaWeb3.PublicKey.findProgramAddress(
          [new TextEncoder().encode("state"), 
            exchangeIdx.toArrayLike(Buffer, "le", 8),
            initializer.toBuffer(),
            initializer_mint.address.toBuffer(),
            taker.publicKey.toBuffer(),
            taker_mint.address.toBuffer(),
          ],
          program.programId
        ))[0];

        console.log('SafeExchangeConfirm_token_token',escrow_wallet,exchange_state);
        const signature = await program.methods
        .exchangeTokenToken(
          exchangeIdx
        )
          .accounts({
            initializer: initializer,
            initializerMint: initializer_mint.address,
            taker: taker.publicKey,
            takerMint: taker_mint.address,
            initializerReceiveTokenAccount: initializerReceiveTokenAccount.address,
            takerWithdrawTokenAccount: takerWithdrawTokenAccount.address,
            takerReceiveTokenAccount: takerReceiveTokenAccount.address,
            exchangeState:  exchange_state,
            escrowWallet: escrow_wallet,
            tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
          })
          .signers([taker])
          .rpc();
        
        console.log('SafeExchangeConfirm_token_token is finished',signature);
    }
}