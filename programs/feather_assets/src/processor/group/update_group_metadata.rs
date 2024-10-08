use crate::*;

pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, UpdateGroupMetadata<'info>>,
    lrp: LightRootParams,
    derivation_key: Pubkey,
    args: UpdateGroupMetadataArgsV1,
) -> Result<()> {
    if args.name.is_none() && args.uri.is_none() {
        return Err(FeatherErrorCode::ArgumentsNotFound.into());
    }
    let address_merkle_context =
        unpack_address_merkle_context(lrp.address_merkle_context, ctx.remaining_accounts);
    let address_seed = derive_address_seed(&[derivation_key.to_bytes().as_ref()], &crate::ID);
    let group_address = derive_address(&address_seed, &address_merkle_context);
    msg!("Group Compressed Account: {:?}", group_address);
    let mut ctx: LightContext<UpdateGroupMetadata, LightUpdateGroupMetadata> = LightContext::new(
        ctx,
        lrp.inputs,
        lrp.merkle_context,
        lrp.merkle_tree_root_index,
        lrp.address_merkle_context,
        lrp.address_merkle_tree_root_index,
    )?;
    let inputs = ParamsUpdateGroupMetadata {
        derivation_key,
        group_address,
    };
    ctx.check_constraints(&inputs)?;
    ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
    let group_data = &mut ctx.light_accounts.group_data;
    let group_data_address = Pubkey::new_from_array(derive_address(
        &group_data.new_address_params().unwrap().seed,
        &address_merkle_context,
    ));
    msg!("Group Data Compressed Account: {:?}", group_data_address);
    if let Some(val) = args.name {
        group_data.name = val
    }
    if let Some(val) = args.uri {
        group_data.uri = val
    }
    ctx.verify(lrp.proof)?;
    Ok(())
}
#[light_accounts]
#[instruction(derivation_key: Pubkey, group_address: [u8;32])]
pub struct UpdateGroupMetadata<'info> {
    #[account(mut)]
    #[fee_payer]
    pub authority: Signer<'info>,
    #[self_program]
    pub self_program: Program<'info, crate::program::FeatherAssets>,
    /// CHECK: Checked in light-system-program.
    #[authority]
    pub cpi_signer: AccountInfo<'info>,
    #[light_account(
        mut,
        seeds = [derivation_key.to_bytes().as_ref()]
        constraint = authority.key() == group.owner @ FeatherErrorCode::InvalidGroupSigner
    )]
    pub group: LightAccount<GroupV1>,
    #[light_account(mut, seeds = [GROUP_DATA_SEED, group_address])]
    pub group_data: LightAccount<GroupDataV1>,
}

pub struct ParamsUpdateGroupMetadata {
    derivation_key: Pubkey,
    group_address: [u8; 32],
}
