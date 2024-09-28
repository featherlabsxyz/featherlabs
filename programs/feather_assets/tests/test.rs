#![cfg(feature = "test-sbf")]

mod setup;
use anchor_lang::{AnchorDeserialize, InstructionData, ToAccountMetas};
use feather_assets::{
    accounts::{CreateGroup as CreateGroupAcc, CreateMemberAsset as CreateMemberAssetAcc},
    constants::{GROUP_DATA_SEED, GROUP_SEED},
    instruction::{CreateGroup as CreateGroupIx, CreateMemberAsset as CreateMemberAssetIx},
    state::{CreateGroupArgsV1, GroupMetadataArgsV1},
    AssetMetadataArgsV1, CreateAssetArgsV1, GroupDataV1, GroupV1, LightRootParams, RoyaltyArgsV1,
    RuleSetV1,
};
use light_client::indexer::Indexer;
use light_sdk::{
    address::{derive_address, derive_address_seed},
    event::PublicTransactionEvent,
    merkle_context::{pack_address_merkle_context, pack_merkle_context},
    verify::find_cpi_signer,
    PROGRAM_ID_ACCOUNT_COMPRESSION, PROGRAM_ID_LIGHT_SYSTEM,
};
use light_test_utils::{test_env::NOOP_PROGRAM_ID, RpcConnection};
use setup::*;
use solana_sdk::{
    instruction::Instruction, pubkey::Pubkey, signer::Signer, system_program::ID as SYSTEM_PROGRAM,
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
    let group_seed: u64 = 2109141;
    let group_address_seed = derive_address_seed(
        &[
            GROUP_SEED,
            payer.pubkey().as_ref(),
            group_seed.to_le_bytes().as_ref(),
        ],
        &PROGRAM_ID,
        &address_merkle_context,
    );
    let group_address = derive_address(&group_address_seed, &address_merkle_context);
    let group_data_address_seed = derive_address_seed(
        &[GROUP_DATA_SEED, group_address.as_ref()],
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
    let ix_data = CreateGroupIx {
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
        seeds: group_seed,
    };
    let accounts = CreateGroupAcc {
        authority: payer.pubkey(),
        account_compression_authority,
        account_compression_program: PROGRAM_ID_ACCOUNT_COMPRESSION,
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
            accounts.to_account_metas(Some(true)),
            remaining_accounts.to_account_metas(),
        ]
        .concat(),
        data: ix_data.data(),
        program_id: PROGRAM_ID,
    };

    let event = rpc
        .create_and_send_transaction_with_event::<PublicTransactionEvent>(
            &[ix],
            &payer.pubkey(),
            &[&payer],
            None,
        )
        .await
        .unwrap();
    test_indexer.add_compressed_accounts_with_token_data(&event.unwrap().0);
    let compressed_accounts = test_indexer.get_compressed_accounts_by_owner(&PROGRAM_ID);
    assert_eq!(compressed_accounts.len(), 2);
    let group = &compressed_accounts[1]
        .compressed_account
        .data
        .as_ref()
        .unwrap()
        .data;
    let group_data = &compressed_accounts[0]
        .compressed_account
        .data
        .as_ref()
        .unwrap()
        .data;
    let group = GroupV1::deserialize(&mut &group[..]).unwrap();
    let group_data = GroupDataV1::deserialize(&mut &group_data[..]).unwrap();
    assert_eq!(group.address, Pubkey::new_from_array(group_address));
    assert_eq!(group_data.name, "Group 1".to_string());
    // let rpc_result = test_indexer.create_proof_for_compressed_accounts(None, None, new_addresses, address_merkle_tree_pubkeys, rpc)
    // let ix_data = CreateMemberAssetIx {
    //     args: CreateAssetArgsV1 {
    //         metadata: Some(AssetMetadataArgsV1 {
    //             attributes: Vec::new(),
    //             mutable: true,
    //             name: "Asset".to_string(),
    //             uri: "uri".to_string(),
    //         }),
    //         rentable: true,
    //         transferrable: true,
    //         royalty: Some(RoyaltyArgsV1 {
    //             basis_points: 100,
    //             creators: Vec::new(),
    //             ruleset: RuleSetV1::ProgramDenyList(Vec::new()),
    //         }),
    //     },
    //     group_seed,
    //     lrp: LightRootParams {
    //         inputs: (),
    //         proof: (),
    //         merkle_context: (),
    //         merkle_tree_root_index: (),
    //         address_merkle_context: (),
    //         address_merkle_tree_root_index: (),
    //     },
    // };
    // let accounts = CreateMemberAssetAcc {
    //     authority: payer.pubkey(),
    //     account_compression_authority,
    //     account_compression_program: PROGRAM_ID_ACCOUNT_COMPRESSION,
    //     cpi_signer: find_cpi_signer(&PROGRAM_ID),
    //     light_system_program: PROGRAM_ID_LIGHT_SYSTEM,
    //     noop_program: NOOP_PROGRAM_ID,
    //     registered_program_pda,
    //     self_program: PROGRAM_ID,
    //     signer: payer.pubkey(),
    //     system_program: SYSTEM_PROGRAM,
    // };
    // let ix = Instruction {
    //     accounts: [
    //         accounts.to_account_metas(Some(true)),
    //         remaining_accounts.to_account_metas(),
    //     ]
    //     .concat(),
    //     data: ix_data.data(),
    //     program_id: PROGRAM_ID,
    // };

    // let event = rpc
    //     .create_and_send_transaction_with_event::<PublicTransactionEvent>(
    //         &[ix],
    //         &payer.pubkey(),
    //         &[&payer],
    //         None,
    //     )
    //     .await;
    // match event {
    //     Err(err) => println!("{err}"),
    //     Ok(event) => println!("Success2"),
    // }
}
