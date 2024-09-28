use crate::*;
pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, UpdateGroupMaxSize<'info>>,
    lrp: LightRootParams,
    group_id: u32,
    max_size: u32,
) -> Result<()> {
    let mut ctx: LightContext<UpdateGroupMaxSize, LightUpdateGroupMaxSize> = LightContext::new(
        ctx,
        lrp.inputs,
        lrp.merkle_context,
        lrp.merkle_tree_root_index,
        lrp.address_merkle_context,
        lrp.address_merkle_tree_root_index,
    )?;
    let inputs = ParamsUpdateGroupMaxSize { max_size, group_id };
    ctx.check_constraints(&inputs)?;
    ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
    let current_size = ctx.light_accounts.group.size;
    require_gt!(max_size, current_size, FeatherErrorCode::InvalidMaxSize);
    ctx.light_accounts.group.max_size = max_size;
    ctx.verify(lrp.proof)?;
    Ok(())
}
#[light_accounts]
#[instruction(group_id: u32)]
pub struct UpdateGroupMaxSize<'info> {
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
    )]
    pub group: LightAccount<GroupV1>,
}

pub struct ParamsUpdateGroupMaxSize {
    pub group_id: u32,
    pub max_size: u32,
}
