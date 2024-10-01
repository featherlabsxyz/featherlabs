use crate::*;
pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, UpdateGroupMaxSize<'info>>,
    lrp: LightRootParams,
    derivation_key: Pubkey,
    max_size: u32,
) -> Result<()> {
    let address_merkle_context =
        unpack_address_merkle_context(lrp.address_merkle_context, ctx.remaining_accounts);
    let mut ctx: LightContext<UpdateGroupMaxSize, LightUpdateGroupMaxSize> = LightContext::new(
        ctx,
        lrp.inputs,
        lrp.merkle_context,
        lrp.merkle_tree_root_index,
        lrp.address_merkle_context,
        lrp.address_merkle_tree_root_index,
    )?;
    let inputs = ParamsUpdateGroupMaxSize { derivation_key };
    ctx.check_constraints(&inputs)?;
    ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
    let current_size = ctx.light_accounts.group.size;
    let group_address = Pubkey::new_from_array(derive_address(
        &ctx.light_accounts.group.new_address_params().unwrap().seed,
        &address_merkle_context,
    ));
    msg!("Group Compressed Account: {:?}", group_address);
    require_gt!(max_size, current_size, FeatherErrorCode::InvalidMaxSize);
    ctx.light_accounts.group.max_size = max_size;
    ctx.verify(lrp.proof)?;
    Ok(())
}
#[light_accounts]
#[instruction(derivation_key: Pubkey)]
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
        seeds = [derivation_key.to_bytes().as_ref()]
    )]
    pub group: LightAccount<GroupV1>,
}

pub struct ParamsUpdateGroupMaxSize {
    pub derivation_key: Pubkey,
}
