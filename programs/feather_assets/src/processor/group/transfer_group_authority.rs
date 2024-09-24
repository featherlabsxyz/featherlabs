use crate::*;

pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, TransferGroupAuthority<'info>>,
    lrp: LightRootParams,
    group_seed: u64,
) -> Result<()> {
    let mut ctx: LightContext<TransferGroupAuthority, LightTransferGroupAuthority> =
        LightContext::new(
            ctx,
            lrp.inputs,
            lrp.merkle_context,
            lrp.merkle_tree_root_index,
            lrp.address_merkle_context,
            lrp.address_merkle_tree_root_index,
        )?;
    let inputs = ParamsTransferGroupAuthority { group_seed };
    ctx.check_constraints(&inputs)?;
    ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
    ctx.light_accounts.group.owner = ctx.anchor_context.accounts.new_authority.key();
    ctx.verify(lrp.proof)?;
    Ok(())
}
#[light_accounts]
#[instruction(group_seed: u64)]
pub struct TransferGroupAuthority<'info> {
    #[account(mut)]
    #[fee_payer]
    pub authority: Signer<'info>,
    /// CHECK: Its safe
    pub new_authority: AccountInfo<'info>,
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
}

pub struct ParamsTransferGroupAuthority {
    group_seed: u64,
}
