use crate::*;
pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, CreateGroup<'info>>,
    lrp: LightRootParams,
    seeds: u64,
    args: CreateGroupArgsV1,
) -> Result<()> {
    let remaining_accounts = ctx.remaining_accounts;
    let mut ctx: LightContext<CreateGroup, LightCreateGroup> = LightContext::new(
        ctx,
        lrp.inputs,
        lrp.merkle_context,
        lrp.merkle_tree_root_index,
        lrp.address_merkle_context,
        lrp.address_merkle_tree_root_index,
    )?;
    let inputs = ParamsCreateGroup { seeds };
    ctx.check_constraints(&inputs)?;
    ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
    let group = &mut ctx.light_accounts.group;
    let group_address_params = group.new_address_params().unwrap();
    let address_merkle_context =
        unpack_address_merkle_context(lrp.address_merkle_context, remaining_accounts);
    let group_address = Pubkey::new_from_array(derive_address(
        &group_address_params.seed,
        &address_merkle_context,
    ));
    group.max_size = args.max_size;
    group.owner = ctx.anchor_context.accounts.authority.key();
    group.size = 0;
    group.address = group_address;
    let mut new_address_params = vec![group_address_params];
    let output_compressed_accounts = match args.metadata {
        Some(metadata_args) => {
            group.has_metadata = true;
            let mut group_data: LightInitAccount<GroupDataV1> = LightInitAccount::new(
                &lrp.merkle_context,
                &lrp.address_merkle_context,
                lrp.address_merkle_tree_root_index,
            );
            let associated_group_data_seed = derive_address_seed(
                &[GROUP_DATA_SEED, group_address.as_ref()],
                &crate::ID,
                &address_merkle_context,
            );
            group_data.set_address_seed(associated_group_data_seed);
            new_address_params.push(group_data.new_address_params());
            group_data.attributes = metadata_args.attributes;
            group_data.name = metadata_args.name;
            group_data.mutable = metadata_args.mutable;
            group_data.group_key = group_address;
            group_data.uri = metadata_args.uri;
            let mut output_compressed_accounts = vec![group
                .output_compressed_account(&crate::ID, remaining_accounts)?
                .unwrap()];
            output_compressed_accounts
                .push(group_data.output_compressed_account(&crate::ID, remaining_accounts)?);
            output_compressed_accounts
        }
        None => {
            group.has_metadata = false;
            let output_compressed_accounts = vec![group
                .output_compressed_account(&crate::ID, remaining_accounts)?
                .unwrap()];
            output_compressed_accounts
        }
    };
    let bump = Pubkey::find_program_address(
        &[CPI_AUTHORITY_PDA_SEED],
        ctx.accounts.get_invoking_program().key,
    )
    .1;
    let signer_seeds = [CPI_AUTHORITY_PDA_SEED, &[bump]];
    let instruction = InstructionDataInvokeCpi {
        proof: Some(lrp.proof),
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
#[light_accounts]
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
    #[light_account(init, seeds = [GROUP_SEED, authority.key().as_ref(), seeds.to_le_bytes().as_ref()])]
    pub group: LightAccount<GroupV1>,
}

pub struct ParamsCreateGroup {
    pub seeds: u64,
}