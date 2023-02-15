import * as solanaWeb3 from "@solana/web3.js";
import * as solanaToken from "@solana/spl-token";
import * as anchor from '../dist/cjs'
import NodeWallet from "../dist/cjs/nodewallet";
import * as utils from "../utils";


export interface ITransferDate {
    escrowKey:solanaWeb3.PublicKey,
    transferIdx:anchor.BN,
    sender:solanaWeb3.PublicKey,
    receiver:solanaWeb3.PublicKey,
    mint:solanaWeb3.PublicKey,
    amount:number,
}

const getProgram = async(
  connection:solanaWeb3.Connection, 
  payer:solanaWeb3.Keypair,
) =>{

  const wallet = await new NodeWallet(payer);
  const provider = new anchor.AnchorProvider(connection,wallet,utils.opts);
  const safe_transfer_idl = await import("./safe_transfer.json");
  const programID = 'BpCbo5wS53SLmnppnPeZCi271V87s4MkiT9YijMLxC36';
  const program = new anchor.Program(safe_transfer_idl, programID, provider);
  return program;
}


export const getTransferCancelList = async(
  cluster:solanaWeb3.Cluster, 
  sender:solanaWeb3.Keypair,
) =>{
  console.log('getTransferCancelList');
  const connection = utils.createConnection(cluster);
  const program = await getProgram(connection,sender);
  const transferStates = await program.account.transferState.all([{
      memcmp: {
            offset: 8 + // Discriminator.
                    8, // transferIdx.
            bytes: sender.publicKey.toBase58(),
        }
  }]);

  const items:ITransferDate[] = [];
  for(let item of transferStates){
    items.push({
      escrowKey:item.publicKey,
      transferIdx: item.account.transferIdx,
      sender:item.account.sender,
      receiver:item.account.receiver,
      mint:item.account.mint,
      amount:item.account.amount,
    });
  }

  items.sort((a,b) => {
      if(a.transferIdx > b.transferIdx)
        return -1
      else
        return 1
})
  
  console.log(items.length,items[items.length-1]);
  return items;
 
}


export const getTransferComfirmList = async(
  cluster:solanaWeb3.Cluster, 
  receiver:solanaWeb3.Keypair,
) =>{
  console.log('getTransferComfirmList');
  const connection = utils.createConnection(cluster);
  const program = await getProgram(connection,receiver);
  const transferStates = await program.account.transferState.all([{
      memcmp: {
            offset: 8 + // Discriminator.
                    8 + // transferIdx
                    32, // sender.
            bytes: receiver.publicKey.toBase58(),
        }
  }]);

  const items:ITransferDate[] = [];
  for(let item of transferStates){
   items.push({
      escrowKey:item.publicKey,
      transferIdx: item.account.transferIdx,
      sender:item.account.sender,
      receiver:item.account.receiver,
      mint:item.account.mint,
      amount:item.account.amount,
    });
  }

  items.sort((a,b) => {
    if(a.transferIdx > b.transferIdx)
      return -1
    else
      return 1
})
  
  console.log(items.length,items[items.length-1]);
  return items;
 
}

export const TransferInit = async(
    cluster: solanaWeb3.Cluster, 
    sender: solanaWeb3.Keypair,
    _receiver: string,
    _mint: string,
    _amount: string,
    )=>{
    
      console.log('SafeTransferInit 0',sender.publicKey.toString());
      const connection = utils.createConnection(cluster);
      const program = await getProgram(connection,sender);

      const receiver = utils.publicKeyFromString(_receiver);
      const transfer_idx = new anchor.BN(Date.now()); 

      if (_mint.includes('So11111111111111111111111111111111111111112')) {
        console.log('initializeSol:',_mint);
        const amount = new anchor.BN(Number(_amount)*solanaWeb3.LAMPORTS_PER_SOL);
        const transfer_state = (await solanaWeb3.PublicKey.findProgramAddress(
          [new TextEncoder().encode("state"), 
            transfer_idx.toArrayLike(Buffer, "le", 8),
            sender.publicKey.toBuffer(),
            receiver.toBuffer(),
          ],
          program.programId
        ))[0];
       
        const signature = await program.methods
        .initializeSol(
          transfer_idx, 
          amount,
        )
        .accounts({
          sender: sender.publicKey,
          receiver: receiver,
          transferState:  transfer_state,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([sender])
        .rpc();

        console.log('SafeTransferInit_Sol is finished:',signature);
        const transferStates = await program.account.transferState.fetch(transfer_state);
        console.log('SafeTransferInit_Sol is finished:',transfer_state,transferStates);
      }
      else {
        console.log('initializeToken:',_mint);
        const mint = await solanaToken.getMint(connection,
                                      utils.publicKeyFromString(_mint));
        const amount = new anchor.BN(Number(_amount)*Math.pow(10,mint.decimals));
        const token_withdraw = await solanaToken.getOrCreateAssociatedTokenAccount(
          connection,
          sender, // payer
          mint.address,    // token
          sender.publicKey,  // who to create an account for
        )

        const escrow_wallet = (await solanaWeb3.PublicKey.findProgramAddress(
          [new TextEncoder().encode("wallet"), 
          transfer_idx.toArrayLike(Buffer, "le", 8),
          sender.publicKey.toBuffer(),
          receiver.toBuffer(),
          mint.address.toBuffer(),
          ],
          program.programId
        ))[0];
    
        const transfer_state = (await solanaWeb3.PublicKey.findProgramAddress(
          [new TextEncoder().encode("state"), 
            transfer_idx.toArrayLike(Buffer, "le", 8),
            sender.publicKey.toBuffer(),
            receiver.toBuffer(),
            mint.address.toBuffer(),
          ],
          program.programId
        ))[0];
    
        console.log('SafeTransferInit 1', escrow_wallet,transfer_state);
          
        const signature = await program.methods
        .initializeToken(
          transfer_idx, 
          amount,
        )
        .accounts({
          sender: sender.publicKey,
          receiver: receiver,
          mint: mint.address,
          tokenWithdraw: token_withdraw.address,
          transferState:  transfer_state,
          escrowWallet: escrow_wallet,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
        })
        .signers([sender])
        .rpc();
    
        console.log('SafeTransferInit is finished:',signature);
        const transferStates = await program.account.transferState.fetch(transfer_state);
        console.log('SafeTransferInit is finished:',transferStates);
        
      }
  }

  
export const TransferCancel = async(
  cluster:solanaWeb3.Cluster, 
  sender:solanaWeb3.Keypair,
  transfer_data:ITransferDate,
  )=>{
  
    console.log('SafeTransferCancel0',sender.publicKey.toString());
    const connection = utils.createConnection(cluster);
    const program = await getProgram(connection,sender);

    const transfer_idx = transfer_data.transferIdx;
    const receiver = transfer_data.receiver;

    if (transfer_data.mint.toString().includes('So11111111111111111111111111111111111111112')) {
      console.log('SafeTransferCancel_Sol:',transfer_data.mint);

      const transfer_state = (await solanaWeb3.PublicKey.findProgramAddress(
        [new TextEncoder().encode("state"), 
          transfer_idx.toArrayLike(Buffer, "le", 8),
          sender.publicKey.toBuffer(),
          receiver.toBuffer(),
        ],
        program.programId
      ))[0];
      
      console.log('SafeTransferCancel_Sol 1');
      
      const signature = await program.methods
      .cancelSol(
        transfer_idx
      )
      .accounts({
        sender: sender.publicKey,
        receiver: receiver,
        transferState:  transfer_state,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([sender])
      .rpc();
      
      console.log('SafeTransferCancel_Sol is finished:',signature);
      
    }
    else {
      const mint = await solanaToken.getMint(connection,transfer_data.mint);
      const token_deposit = await solanaToken.getOrCreateAssociatedTokenAccount(
        connection,
        sender, // payer
        mint.address,    // token
        sender.publicKey,  // who to create an account for
      )
    
      const escrow_wallet = (await solanaWeb3.PublicKey.findProgramAddress(
        [new TextEncoder().encode("wallet"), 
          transfer_idx.toArrayLike(Buffer, "le", 8),
          sender.publicKey.toBuffer(),
          receiver.toBuffer(),
          mint.address.toBuffer(),
        ],
        program.programId
      ))[0];

      const transfer_state = (await solanaWeb3.PublicKey.findProgramAddress(
        [new TextEncoder().encode("state"), 
          transfer_idx.toArrayLike(Buffer, "le", 8),
          sender.publicKey.toBuffer(),
          receiver.toBuffer(),
          mint.address.toBuffer(),
        ],
        program.programId
      ))[0];
      
      console.log('SafeTransferCancel 1');
      
      const signature = await program.methods
      .cancelToken(
        transfer_idx
      )
      .accounts({
        sender: sender.publicKey,
        receiver: receiver,
        mint: mint.address,
        tokenDeposit: token_deposit.address,
        transferState:  transfer_state,
        escrowWallet: escrow_wallet,
        tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
      })
      .signers([sender])
      .rpc();
      
      console.log('SafeTransferCancel is finished:',signature);
      
    }
}


export const TransferComfirm = async(
  cluster:solanaWeb3.Cluster, 
  receiver:solanaWeb3.Keypair,
  transfer_data:  ITransferDate,
  )=>{
  
    console.log('SafeTransferComfirm 0');
    const connection = utils.createConnection(cluster);
    const program = await getProgram(connection,receiver);

    const sender = transfer_data.sender;
    const transfer_idx = transfer_data.transferIdx;

    if (transfer_data.mint.toString().includes('So11111111111111111111111111111111111111112')) {
      console.log('SafeTransferComfirm_Sol:',transfer_data.mint);

      const transfer_state = (await solanaWeb3.PublicKey.findProgramAddress(
        [new TextEncoder().encode("state"), 
          transfer_idx.toArrayLike(Buffer, "le", 8),
          sender.toBuffer(),
          receiver.publicKey.toBuffer(),
        ],
        program.programId
      ))[0];

      console.log('SafeTransferComfirm 1');
      
      const signature = await program.methods
      .transferSol(
        transfer_idx
      )
      .accounts({
        sender: sender,
        receiver: receiver.publicKey,
        transferState:  transfer_state,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([receiver])
      .rpc();
      
      console.log('SafeTransferComfirm_Sol is finished',signature);
    }
    else {
      const mint = await solanaToken.getMint(connection,transfer_data.mint);
      const token_deposit = await solanaToken.getOrCreateAssociatedTokenAccount(
        connection,
        receiver, // payer
        mint.address,    // token
        receiver.publicKey,  // who to create an account for
      )
   
      const escrow_wallet = (await solanaWeb3.PublicKey.findProgramAddress(
        [new TextEncoder().encode("wallet"), 
          transfer_idx.toArrayLike(Buffer, "le", 8),
          sender.toBuffer(),
          receiver.publicKey.toBuffer(),
          mint.address.toBuffer(),
        ],
        program.programId
      ))[0];

      const transfer_state = (await solanaWeb3.PublicKey.findProgramAddress(
        [new TextEncoder().encode("state"), 
          transfer_idx.toArrayLike(Buffer, "le", 8),
          sender.toBuffer(),
          receiver.publicKey.toBuffer(),
          mint.address.toBuffer(),
        ],
        program.programId
      ))[0];

      console.log('SafeTransferComfirm 1');
      
      const signature = await program.methods
      .transferToken(
        transfer_idx
      )
      .accounts({
        sender: sender,
        receiver: receiver.publicKey,
        mint: mint.address,
        tokenDeposit: token_deposit.address,
        transferState:  transfer_state,
        escrowWallet: escrow_wallet,
        tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
      })
      .signers([receiver])
      .rpc();
      
      console.log('SafeTransferComfirm is finished',signature);
    }
}
  /*
  export const TransferInit1 = async(
    cluster: solanaWeb3.Cluster, 
    sender: solanaWeb3.Keypair,
    _receiver: string,
    _mint: string,
    _amount: string,
    )=>{
    
      console.log('SafeTransferInit 0',sender.publicKey.toString());
      const connection = utils.createConnection(cluster);
      const program = await getProgram(connection,sender);

      const receiver = utils.publicKeyFromString(_receiver);
      const mint = await solanaToken.getMint(connection,
                                     utils.publicKeyFromString(_mint));
      const amount = new anchor.BN(Number(_amount)*Math.pow(10,mint.decimals));
      const token_withdraw = await solanaToken.getOrCreateAssociatedTokenAccount(
        connection,
        sender, // payer
        mint.address,    // token
        sender.publicKey,  // who to create an account for
      )

      const transfer_idx = new anchor.BN(Date.now());   
      const escrow_wallet = (await solanaWeb3.PublicKey.findProgramAddress(
        [new TextEncoder().encode("wallet"), 
         transfer_idx.toArrayLike(Buffer, "le", 8),
         sender.publicKey.toBuffer(),
         receiver.toBuffer(),
         mint.address.toBuffer(),
        ],
        program.programId
      ))[0];
  
      const transfer_state = (await solanaWeb3.PublicKey.findProgramAddress(
         [new TextEncoder().encode("state"), 
          transfer_idx.toArrayLike(Buffer, "le", 8),
          sender.publicKey.toBuffer(),
          receiver.toBuffer(),
          mint.address.toBuffer(),
        ],
        program.programId
      ))[0];
  
      console.log('SafeTransferInit 1', escrow_wallet,transfer_state);
        
      const signature = await program.methods
      .initializeToken(
        transfer_idx, 
        amount,
      )
      .accounts({
        sender: sender.publicKey,
        receiver: receiver,
        mint: mint.address,
        tokenWithdraw: token_withdraw.address,
        transferState:  transfer_state,
        escrowWallet: escrow_wallet,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
      })
      .signers([sender])
      .rpc();
  
      console.log('SafeTransferInit is finished:',signature);
      const transferStates = await program.account.transferState.fetch(transfer_state);
      console.log('SafeTransferInit is finished:',transferStates);
      
  }
 
export const TransferCancel = async(
  cluster:solanaWeb3.Cluster, 
  sender:solanaWeb3.Keypair,
  transfer_data:ITransferDate,
  )=>{
  
    console.log('SafeTransferCancel0',sender.publicKey.toString());
    const connection = utils.createConnection(cluster);
    const program = await getProgram(connection,sender);

    const transfer_idx = transfer_data.transferIdx;
    const receiver = transfer_data.receiver;
    const mint = await solanaToken.getMint(connection,transfer_data.mint);
    const token_deposit = await solanaToken.getOrCreateAssociatedTokenAccount(
      connection,
      sender, // payer
      mint.address,    // token
      sender.publicKey,  // who to create an account for
    )
   
    const escrow_wallet = (await solanaWeb3.PublicKey.findProgramAddress(
      [new TextEncoder().encode("wallet"), 
        transfer_idx.toArrayLike(Buffer, "le", 8),
        sender.publicKey.toBuffer(),
        receiver.toBuffer(),
        mint.address.toBuffer(),
      ],
      program.programId
    ))[0];

    const transfer_state = (await solanaWeb3.PublicKey.findProgramAddress(
      [new TextEncoder().encode("state"), 
        transfer_idx.toArrayLike(Buffer, "le", 8),
        sender.publicKey.toBuffer(),
        receiver.toBuffer(),
        mint.address.toBuffer(),
      ],
      program.programId
    ))[0];
    
    console.log('SafeTransferCancel 1');
    const signature = await program.methods
    .cancelToken(
      transfer_idx
    )
    .accounts({
      sender: sender.publicKey,
      receiver: receiver,
      mint: mint.address,
      tokenDeposit: token_deposit.address,
      transferState:  transfer_state,
      escrowWallet: escrow_wallet,
      tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
    })
    .signers([sender])
    .rpc();
    
    console.log('SafeTransferCancel is finished:',signature);
}


export const TransferComfirm = async(
  cluster:solanaWeb3.Cluster, 
  receiver:solanaWeb3.Keypair,
  transfer_data:  ITransferDate,
  )=>{
  
    console.log('SafeTransferComfirm 0');
    const connection = utils.createConnection(cluster);
    const program = await getProgram(connection,receiver);

    const sender = transfer_data.sender;
    const transfer_idx = transfer_data.transferIdx;
    const mint = await solanaToken.getMint(connection,transfer_data.mint);
    const token_deposit = await solanaToken.getOrCreateAssociatedTokenAccount(
      connection,
      receiver, // payer
      mint.address,    // token
      receiver.publicKey,  // who to create an account for
    )
   
    const escrow_wallet = (await solanaWeb3.PublicKey.findProgramAddress(
      [new TextEncoder().encode("wallet"), 
        transfer_idx.toArrayLike(Buffer, "le", 8),
        sender.toBuffer(),
        receiver.publicKey.toBuffer(),
        mint.address.toBuffer(),
      ],
      program.programId
    ))[0];

    const transfer_state = (await solanaWeb3.PublicKey.findProgramAddress(
      [new TextEncoder().encode("state"), 
        transfer_idx.toArrayLike(Buffer, "le", 8),
        sender.toBuffer(),
        receiver.publicKey.toBuffer(),
        mint.address.toBuffer(),
      ],
      program.programId
    ))[0];

    console.log('SafeTransferComfirm 1');
    
    const signature = await program.methods
    .transferToken(
      transfer_idx
    )
    .accounts({
      sender: sender,
      receiver: receiver.publicKey,
      mint: mint.address,
      tokenDeposit: token_deposit.address,
      transferState:  transfer_state,
      escrowWallet: escrow_wallet,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
    })
    .signers([receiver])
    .rpc();
    
    console.log('SafeTransferComfirm is finished',signature);
    
}
*/ 