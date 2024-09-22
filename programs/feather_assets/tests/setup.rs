use light_client::{
    indexer::{test_indexer::TestIndexer, AddressMerkleTreeAccounts, StateMerkleTreeAccounts},
    rpc::test_rpc::ProgramTestRpcConnection,
};

use light_sdk::{
    merkle_context::{AddressMerkleContext, MerkleContext, RemainingAccounts},
    utils::get_cpi_authority_pda,
    PROGRAM_ID_ACCOUNT_COMPRESSION, PROGRAM_ID_LIGHT_SYSTEM,
};
use light_test_utils::{
    test_env::{setup_test_programs_with_accounts_v2, EnvAccounts},
    RpcConnection,
};

use solana_sdk::{pubkey::Pubkey, signature::Keypair};

pub static PROGRAM_ID: Pubkey = feather_assets::ID;
pub async fn setup_rpc_indexer() -> (
    Keypair,
    ProgramTestRpcConnection,
    EnvAccounts,
    TestIndexer<ProgramTestRpcConnection>,
    RemainingAccounts,
    AddressMerkleContext,
    MerkleContext,
    Pubkey,
    Pubkey,
) {
    let (rpc, env) = setup_test_programs_with_accounts_v2(Some(vec![(
        String::from("feather_assets"),
        PROGRAM_ID,
    )]))
    .await;
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
    let remaining_accounts = RemainingAccounts::default();
    let address_merkle_context = AddressMerkleContext {
        address_merkle_tree_pubkey: env.address_merkle_tree_pubkey,
        address_queue_pubkey: env.address_merkle_tree_queue_pubkey,
    };
    let merkle_context = MerkleContext {
        merkle_tree_pubkey: env.merkle_tree_pubkey,
        nullifier_queue_pubkey: env.nullifier_queue_pubkey,
        leaf_index: 0,
        queue_index: None,
    };
    let account_compression_authority = get_cpi_authority_pda(&PROGRAM_ID_LIGHT_SYSTEM);
    let registered_program_pda = Pubkey::find_program_address(
        &[PROGRAM_ID_LIGHT_SYSTEM.to_bytes().as_slice()],
        &PROGRAM_ID_ACCOUNT_COMPRESSION,
    )
    .0;
    let var_name = (
        payer,
        rpc,
        env,
        test_indexer,
        remaining_accounts,
        address_merkle_context,
        merkle_context,
        account_compression_authority,
        registered_program_pda,
    );
    return var_name;
}
