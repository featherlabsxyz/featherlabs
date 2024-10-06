use feather_assets::{ASSET_DATA_SEED, GROUP_DATA_SEED};
use light_client::{
    indexer::{test_indexer::TestIndexer, AddressMerkleTreeAccounts, StateMerkleTreeAccounts},
    rpc::test_rpc::ProgramTestRpcConnection,
};
use light_sdk::address::{derive_address, derive_address_seed};
use light_sdk::{
    merkle_context::AddressMerkleContext, utils::get_cpi_authority_pda,
    PROGRAM_ID_ACCOUNT_COMPRESSION, PROGRAM_ID_LIGHT_SYSTEM,
};
use light_test_utils::{
    test_env::{setup_test_programs_with_accounts_v2, EnvAccounts},
    RpcConnection,
};
use solana_sdk::{pubkey::Pubkey, signature::Keypair};
pub static PROGRAM_ID: Pubkey = feather_assets::ID;
pub async fn setup_rpc_indexer() -> TestSetup {
    let (rpc, env) = connection().await;
    let payer = rpc.get_payer().insecure_clone();
    let test_indexer: TestIndexer<ProgramTestRpcConnection> = TestIndexer::new(
        &[StateMerkleTreeAccounts {
            merkle_tree: env.merkle_tree_pubkey,
            nullifier_queue: env.nullifier_queue_pubkey,
            cpi_context: env.cpi_context_account_pubkey,
        }],
        &[AddressMerkleTreeAccounts {
            merkle_tree: env.address_merkle_tree_pubkey,
            queue: env.address_merkle_tree_queue_pubkey,
        }],
        true,
        true,
    )
    .await;
    let address_merkle_context = AddressMerkleContext {
        address_merkle_tree_pubkey: env.address_merkle_tree_pubkey,
        address_queue_pubkey: env.address_merkle_tree_queue_pubkey,
    };
    let account_compression_authority = get_cpi_authority_pda(&PROGRAM_ID_LIGHT_SYSTEM);
    let registered_program_pda = Pubkey::find_program_address(
        &[PROGRAM_ID_LIGHT_SYSTEM.to_bytes().as_slice()],
        &PROGRAM_ID_ACCOUNT_COMPRESSION,
    )
    .0;
    let test_setup = TestSetup {
        account_compression_authority,
        address_merkle_context,
        env,
        payer,
        registered_program_pda,
        rpc,
        test_indexer,
    };
    return test_setup;
}

pub struct TestSetup {
    pub payer: Keypair,
    pub rpc: ProgramTestRpcConnection,
    pub env: EnvAccounts,
    pub test_indexer: TestIndexer<ProgramTestRpcConnection>,
    pub address_merkle_context: AddressMerkleContext,
    pub account_compression_authority: Pubkey,
    pub registered_program_pda: Pubkey,
}
pub struct GroupAddresses {
    pub group_address_seed: Pubkey,
    pub group_address: Pubkey,
    pub group_data_address_seed: Pubkey,
    pub group_data_address: Pubkey,
}

pub fn derive_group_addresses(
    group_derivation_key: Pubkey,
    address_merkle_context: &AddressMerkleContext,
) -> GroupAddresses {
    let group_address_seed =
        derive_address_seed(&[group_derivation_key.to_bytes().as_ref()], &PROGRAM_ID);
    let group_address = derive_address(&group_address_seed, address_merkle_context);
    let group_data_address_seed =
        derive_address_seed(&[GROUP_DATA_SEED, group_address.as_ref()], &PROGRAM_ID);
    let group_data_address = derive_address(&group_data_address_seed, address_merkle_context);
    GroupAddresses {
        group_address_seed: Pubkey::new_from_array(group_address_seed),
        group_address: Pubkey::new_from_array(group_address),
        group_data_address_seed: Pubkey::new_from_array(group_data_address_seed),
        group_data_address: Pubkey::new_from_array(group_data_address),
    }
}

pub struct AssetAddresses {
    pub asset_address_seed: Pubkey,
    pub asset_address: Pubkey,
    pub asset_data_address_seed: Pubkey,
    pub asset_data_address: Pubkey,
}

pub fn derive_asset_addresses(
    asset_derivation_key: Pubkey,
    address_merkle_context: &AddressMerkleContext,
) -> AssetAddresses {
    let asset_address_seed =
        derive_address_seed(&[asset_derivation_key.to_bytes().as_ref()], &PROGRAM_ID);
    let asset_address = derive_address(&asset_address_seed, address_merkle_context);
    let asset_data_address_seed =
        derive_address_seed(&[ASSET_DATA_SEED, asset_address.as_ref()], &PROGRAM_ID);
    let asset_data_address = derive_address(&asset_data_address_seed, address_merkle_context);
    AssetAddresses {
        asset_address_seed: Pubkey::new_from_array(asset_address_seed),
        asset_address: Pubkey::new_from_array(asset_address),
        asset_data_address_seed: Pubkey::new_from_array(asset_data_address_seed),
        asset_data_address: Pubkey::new_from_array(asset_data_address),
    }
}

pub async fn connection() -> (ProgramTestRpcConnection, EnvAccounts) {
    return setup_test_programs_with_accounts_v2(Some(vec![(
        String::from("feather_assets"),
        PROGRAM_ID,
    )]))
    .await;
}
