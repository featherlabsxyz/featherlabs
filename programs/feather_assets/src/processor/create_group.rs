use crate::*;
use light_sdk::{
    address::{derive_address, derive_address_seed, NewAddressParamsPacked},
    compressed_account::LightAccount,
    light_system_accounts,
    program_merkle_context::unpack_address_merkle_context,
    traits::InvokeCpiAccounts,
    verify::{verify, InstructionDataInvokeCpi},
    LightTraits,
};
pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, CreateGroup<'info>>,
    lrp: LightRootParams,
    seeds: u64,
    args: CreateGroupArgsV1,
) -> Result<()> {
    let CreateGroup { authority, .. } = ctx.accounts;
    let remaining_accounts = ctx.remaining_accounts;
    let mut new_address_params: Vec<NewAddressParamsPacked> = Vec::new();
    let mut output_compressed_accounts = Vec::new();
    let unpacked_address_merkle_context =
        unpack_address_merkle_context(lrp.address_merkle_context, remaining_accounts);
    let mut group: LightAccount<GroupV1> = LightAccount::new_init(
        &lrp.merkle_context,
        &lrp.address_merkle_context,
        lrp.address_merkle_tree_root_index,
    );
    let group_address_seed = derive_address_seed(
        &[
            GROUP_SEED,
            authority.key().as_ref(),
            seeds.to_le_bytes().as_ref(),
        ],
        &crate::ID,
        &unpacked_address_merkle_context,
    );
    group.set_address_seed(group_address_seed);
    let group_address = derive_address(&group_address_seed, &unpacked_address_merkle_context);
    new_address_params.push(group.new_address_params().unwrap());

    group.max_size = args.max_size;
    group.owner = authority.key();
    group.size = 0;

    if let Some(oca) = group.output_compressed_account(&crate::ID, remaining_accounts)? {
        output_compressed_accounts.push(oca);
    }

    match args.metadata {
        Some(metadata_args) => {
            group.has_metadata = true;
            let mut group_data: LightAccount<GroupDataV1> = LightAccount::new_init(
                &lrp.merkle_context,
                &lrp.address_merkle_context,
                lrp.address_merkle_tree_root_index,
            );
            let associated_group_data_seed = derive_address_seed(
                &[group_address.as_ref()],
                &crate::ID,
                &unpacked_address_merkle_context,
            );
            let associated_group_data_address = derive_address(
                &associated_group_data_seed,
                &unpacked_address_merkle_context,
            );
            group_data.set_address_seed(associated_group_data_seed);
            new_address_params.push(group_data.new_address_params().unwrap());
            group_data.attributes = metadata_args.attributes;
            group_data.name = metadata_args.name;
            group_data.mutable = metadata_args.mutable;
            group_data.group_key = Pubkey::new_from_array(group_address);
            group_data.uri = metadata_args.uri;

            if let Some(oca) =
                group_data.output_compressed_account(&crate::ID, remaining_accounts)?
            {
                output_compressed_accounts.push(oca);
            }
        }
        None => {
            group.has_metadata = false;
        }
    }
    let bump = Pubkey::find_program_address(
        &[CPI_AUTHORITY_PDA_SEED],
        ctx.accounts.get_invoking_program().key,
    )
    .1;
    let signer_seeds = [CPI_AUTHORITY_PDA_SEED, &[bump]];
    let instruction = InstructionDataInvokeCpi {
        proof: Some(light_sdk::proof::CompressedProof {
            a: lrp.proof.a,
            b: lrp.proof.b,
            c: lrp.proof.c,
        }),
        new_address_params,
        relay_fee: None,
        input_compressed_accounts_with_merkle_context: Vec::new(),
        output_compressed_accounts,
        compress_or_decompress_lamports: None,
        is_compress: false,
        cpi_context: None,
    };
    verify(&ctx, &instruction, &[signer_seeds.as_slice()])?;
    Ok(())
}
#[light_system_accounts]
#[derive(Accounts, LightTraits)]
#[instruction(seeds: u64)]
pub struct CreateGroup<'info> {
    #[account(mut)]
    #[fee_payer]
    pub signer: Signer<'info>,
    /// CHECK: this is safe
    pub authority: UncheckedAccount<'info>,
    #[self_program]
    pub self_program: Program<'info, crate::program::FeatherAssets>,
    /// CHECK: Checked in light-system-program.
    #[authority]
    pub cpi_signer: AccountInfo<'info>,
}
