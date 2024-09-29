use crate::*;

pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, TransferGroupAuthority<'info>>,
    lrp: LightRootParams,
    derivation_key: Pubkey,
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
    let inputs = ParamsTransferGroupAuthority { derivation_key };
    ctx.check_constraints(&inputs)?;
    ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
    ctx.light_accounts.group.owner = ctx.anchor_context.accounts.new_authority.key();
    ctx.verify(lrp.proof)?;
    Ok(())
}
#[light_accounts]
#[instruction(derivation_key: Pubkey)]
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
        seeds = [derivation_key.to_bytes().as_ref()]
        constraint = authority.key() == group.owner @ FeatherErrorCode::InvalidGroupSigner
    )]
    pub group: LightAccount<GroupV1>,
}

pub struct ParamsTransferGroupAuthority {
    derivation_key: Pubkey,
}
