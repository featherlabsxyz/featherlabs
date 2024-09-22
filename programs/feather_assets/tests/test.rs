#![cfg(feature = "test-sbf")]

mod setup;
use anchor_lang::{InstructionData, ToAccountMetas};
use feather_assets::{
    accounts::CreateGroup as CreateGroupAcc,
    instruction::CreateGroup as CreateGroupIx,
    state::{CreateGroupArgsV1, GroupMetadataArgsV1},
    LightRootParams,
};
use light_client::indexer::Indexer;
use light_sdk::{
    address::{derive_address, derive_address_seed},
    merkle_context::{pack_address_merkle_context, pack_merkle_context},
    verify::find_cpi_signer,
    PROGRAM_ID_ACCOUNT_COMPRESSION, PROGRAM_ID_LIGHT_SYSTEM,
};
use light_test_utils::{test_env::NOOP_PROGRAM_ID, RpcConnection};
use setup::*;
use solana_sdk::{
    instruction::Instruction, msg, signer::Signer, system_program::ID as SYSTEM_PROGRAM,
};
#[tokio::test]
async fn create_group() {
    let (
        payer,
        mut rpc,
        env,
        mut test_indexer,
        mut remaining_accounts,
        address_merkle_context,
        merkle_context,
        account_compression_authority,
        registered_program_pda,
    ) = setup_rpc_indexer().await;
    let packed_merkle_context = pack_merkle_context(merkle_context, &mut remaining_accounts);
    let packed_address_merkle_context =
        pack_address_merkle_context(address_merkle_context, &mut remaining_accounts);
    let seed: u64 = 21093104141;
    let group_address_seed = derive_address_seed(
        &[
            b"group",
            payer.pubkey().as_ref(),
            seed.to_le_bytes().as_ref(),
        ],
        &PROGRAM_ID,
        &address_merkle_context,
    );
    let group_address = derive_address(&group_address_seed, &address_merkle_context);
    let group_data_address_seed = derive_address_seed(
        &[group_address.as_ref()],
        &PROGRAM_ID,
        &address_merkle_context,
    );
    let group_data_address = derive_address(&group_data_address_seed, &address_merkle_context);
    let group_address_vec = vec![group_address, group_data_address];

    let rpc_result = test_indexer
        .create_proof_for_compressed_accounts(
            None,
            None,
            Some(&group_address_vec),
            Some(vec![
                env.address_merkle_tree_pubkey,
                env.address_merkle_tree_pubkey,
            ]),
            &mut rpc,
        )
        .await;
    let create_group_ix = CreateGroupIx {
        args: CreateGroupArgsV1 {
            max_size: 10,
            metadata: Some(GroupMetadataArgsV1 {
                attributes: Vec::new(),
                mutable: true,
                name: "Group 1".to_string(),
                uri: "uri".to_string(),
            }),
        },
        lrp: LightRootParams {
            address_merkle_context: packed_address_merkle_context,
            address_merkle_tree_root_index: rpc_result.address_root_indices[0],
            merkle_tree_root_index: 0,
            inputs: Vec::new(),
            merkle_context: packed_merkle_context,
            proof: rpc_result.proof,
        },
        seeds: seed,
    };
    let create_group_acc = CreateGroupAcc {
        account_compression_authority,
        account_compression_program: PROGRAM_ID_ACCOUNT_COMPRESSION,
        authority: payer.pubkey(),
        cpi_signer: find_cpi_signer(&PROGRAM_ID),
        light_system_program: PROGRAM_ID_LIGHT_SYSTEM,
        noop_program: NOOP_PROGRAM_ID,
        registered_program_pda,
        self_program: PROGRAM_ID,
        signer: payer.pubkey(),
        system_program: SYSTEM_PROGRAM,
    };
    let ix = Instruction {
        accounts: [
            create_group_acc.to_account_metas(Some(true)),
            remaining_accounts.to_account_metas(),
        ]
        .concat(),
        data: create_group_ix.data(),
        program_id: PROGRAM_ID,
    };

    match rpc
        .create_and_send_transaction_with_event(&[ix], &payer.pubkey(), &[&payer], None)
        .await
    {
        Ok(event) => match event {
            Some(event_data) => {
                println!("{:#?}", event_data.0);
                test_indexer.add_compressed_accounts_with_token_data(&event_data.0);
            }
            None => {
                println!("Event data is None");
            }
        },
        Err(e) => {
            eprintln!("Error creating and sending transaction: {:?}", e);
        }
    }
}
