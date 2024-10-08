#![cfg(feature = "test-sbf")]
use anchor_lang::prelude::*;
use anchor_lang::InstructionData;
use feather_assets::{
    accounts::{CreateGroup as CreateGroupAcc, CreateMemberAsset as CreateMemberAssetAcc},
    instruction::{CreateGroup as CreateGroupIx, CreateMemberAsset as CreateMemberAssetIx},
    state::{CreateAssetArgsV1, CreateGroupArgsV1, GroupMetadataArgsV1},
    AssetMetadataArgsV1, GroupDataV1, GroupV1, LightRootParams,
};
use light_client::indexer::Indexer;
use light_sdk::{
    event::PublicTransactionEvent,
    merkle_context::{
        pack_address_merkle_context, pack_merkle_context, MerkleContext, RemainingAccounts,
    },
    verify::find_cpi_signer,
    PROGRAM_ID_ACCOUNT_COMPRESSION, PROGRAM_ID_LIGHT_SYSTEM,
};
use light_test_utils::{test_env::NOOP_PROGRAM_ID, RpcConnection};
mod setup;
use setup::*;
use solana_sdk::{
    instruction::Instruction, pubkey::Pubkey, signer::Signer, system_program::ID as SYSTEM_PROGRAM,
};
#[tokio::test]
async fn create_group() {
    let TestSetup {
        payer,
        mut rpc,
        env,
        mut test_indexer,
        address_merkle_context,
        account_compression_authority,
        registered_program_pda,
    } = setup_rpc_indexer().await;
    let merkle_context = MerkleContext {
        merkle_tree_pubkey: env.merkle_tree_pubkey,
        nullifier_queue_pubkey: env.nullifier_queue_pubkey,
        leaf_index: 0,
        queue_index: None,
    };
    let mut remaining_accounts = RemainingAccounts::default();
    let packed_merkle_context = pack_merkle_context(merkle_context, &mut remaining_accounts);
    let packed_address_merkle_context =
        pack_address_merkle_context(address_merkle_context, &mut remaining_accounts);
    let group_derivation_key: Pubkey = Pubkey::new_unique();
    let GroupAddresses {
        group_address,
        group_data_address,
        ..
    } = derive_group_addresses(group_derivation_key, &address_merkle_context);
    let group_address_vec = vec![group_address.to_bytes(), group_data_address.to_bytes()];

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
        derivation_key: group_derivation_key,
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
        payer: payer.pubkey(),
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
    let group_cad = compressed_accounts[1].clone();
    let group = group_cad
        .compressed_account
        .data
        .as_ref()
        .unwrap()
        .data
        .clone();
    let group_data_cad = compressed_accounts[0].clone();
    let group_data = group_data_cad
        .compressed_account
        .data
        .as_ref()
        .unwrap()
        .data
        .clone();
    let g = GroupV1::deserialize(&mut &group[..]).unwrap();
    let gd = GroupDataV1::deserialize(&mut &group_data[..]).unwrap();
    assert_eq!(g.derivation_key, group_derivation_key);
    assert_eq!(gd.name, "Group 1".to_string());
    let hash = group_cad.hash().unwrap();
    let merkle_tree_pubkey = group_cad.merkle_context.merkle_tree_pubkey;
    let mut remaining_accounts = RemainingAccounts::default();
    let packed_address_merkle_context =
        pack_address_merkle_context(address_merkle_context, &mut remaining_accounts);
    let merkle_context = pack_merkle_context(group_cad.merkle_context, &mut remaining_accounts);
    let asset_derivation_key: Pubkey = Pubkey::new_unique();
    let AssetAddresses {
        asset_address,
        asset_data_address,
        ..
    } = derive_asset_addresses(asset_derivation_key, &address_merkle_context);
    let asset_address_vec = vec![asset_address.to_bytes(), asset_data_address.to_bytes()];

    let rpc_result = test_indexer
        .create_proof_for_compressed_accounts(
            Some(&[hash]),
            Some(&[merkle_tree_pubkey]),
            Some(&asset_address_vec),
            Some(vec![
                env.address_merkle_tree_pubkey,
                env.address_merkle_tree_pubkey,
            ]),
            &mut rpc,
        )
        .await;
    let ix_data = CreateMemberAssetIx {
        args: CreateAssetArgsV1 {
            metadata: Some(AssetMetadataArgsV1 {
                mutable: true,
                name: "Asset".to_string(),
                uri: "uri".to_string(),
            }),
            rentable: true,
            transferrable: true,
            royalties_initializable: true,
        },
        group_derivation_key,
        asset_derivation_key,
        lrp: LightRootParams {
            inputs: vec![group],
            proof: rpc_result.proof,
            merkle_context,
            merkle_tree_root_index: rpc_result.root_indices[0],
            address_merkle_context: packed_address_merkle_context,
            address_merkle_tree_root_index: rpc_result.address_root_indices[0],
        },
    };
    let accounts = CreateMemberAssetAcc {
        authority: payer.pubkey(),
        account_compression_authority,
        account_compression_program: PROGRAM_ID_ACCOUNT_COMPRESSION,
        cpi_signer: find_cpi_signer(&PROGRAM_ID),
        light_system_program: PROGRAM_ID_LIGHT_SYSTEM,
        noop_program: NOOP_PROGRAM_ID,
        registered_program_pda,
        self_program: PROGRAM_ID,
        group_authority: payer.pubkey(),
        payer: payer.pubkey(),
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
        .await;
    match event {
        Err(err) => println!("{err}"),
        Ok(event) => println!("Success2"),
    }
}
