use crate::*;
pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, AddMetadataToGroup<'info>>,
    lrp: LightRootParams,
    group_seed: u64,
    args: GroupMetadataArgsV1,
) -> Result<()> {
    let mut ctx: LightContext<AddMetadataToGroup, LightAddMetadataToGroup> = LightContext::new(
        ctx,
        lrp.inputs,
        lrp.merkle_context,
        lrp.merkle_tree_root_index,
        lrp.address_merkle_context,
        lrp.address_merkle_tree_root_index,
    )?;
    let inputs = ParamsAddMetadataToGroup { group_seed };
    ctx.check_constraints(&inputs)?;
    ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
    let group_data = &mut ctx.light_accounts.group_data;
    let group = &mut ctx.light_accounts.group;

    group_data.group_key = group.address;
    group_data.attributes = args.attributes;
    group_data.mutable = args.mutable;
    group_data.name = args.name;
    group_data.uri = args.uri;
    group.has_metadata = true;

    ctx.verify(lrp.proof)?;
    Ok(())
}
#[light_accounts]
#[instruction(group_seed: u64)]
pub struct AddMetadataToGroup<'info> {
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
        group_seed.to_le_bytes().as_ref()]
        constraint = authority.key() == group.owner @ FeatherErrorCode::InvalidGroupSigner
    )]
    pub group: LightAccount<GroupV1>,
    #[light_account(init, seeds = [GROUP_DATA_SEED, group.address.as_ref()])]
    pub group_data: LightAccount<GroupDataV1>,
}

pub struct ParamsAddMetadataToGroup {
    pub group_seed: u64,
}
