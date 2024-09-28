use crate::*;

pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, UpdateGroupMetadata<'info>>,
    lrp: LightRootParams,
    group_id: u32,
    args: UpdateGroupMetadataArgsV1,
) -> Result<()> {
    if args.attributes.is_none() && args.name.is_none() && args.uri.is_none() {
        return Err(FeatherErrorCode::ArgumentsNotFound.into());
    }
    let mut ctx: LightContext<UpdateGroupMetadata, LightUpdateGroupMetadata> = LightContext::new(
        ctx,
        lrp.inputs,
        lrp.merkle_context,
        lrp.merkle_tree_root_index,
        lrp.address_merkle_context,
        lrp.address_merkle_tree_root_index,
    )?;
    let inputs = ParamsUpdateGroupMetadata { group_id };
    ctx.check_constraints(&inputs)?;
    ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
    let group_data = &mut ctx.light_accounts.group_data;
    if let Some(val) = args.attributes {
        group_data.attributes = val
    }
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
#[instruction(group_id: u32)]
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
        seeds = [GROUP_SEED,
        authority.key().as_ref(),
        group_id.to_le_bytes().as_ref()]
        constraint = authority.key() == group.owner @ FeatherErrorCode::InvalidGroupSigner
    )]
    pub group: LightAccount<GroupV1>,
    #[light_account(mut, seeds = [GROUP_DATA_SEED, group.address.as_ref()])]
    pub group_data: LightAccount<GroupDataV1>,
}

pub struct ParamsUpdateGroupMetadata {
    group_id: u32,
}
