use anchor_lang::prelude::*;
use light_sdk::{
    context::LightContext, light_accounts, merkle_context::PackedAddressMerkleContext,
};

use crate::LightContextExt;
pub fn handler(ctx: &mut LightContext<Initialize, LightInitialize>) -> Result<()> {
    Ok(())
}
#[light_accounts]
pub struct Initialize<'info> {
    #[account(mut)]
    #[fee_payer]
    pub signer: Signer<'info>,
    #[self_program]
    pub self_program: Program<'info, crate::program::FeatherAssets>,
    /// CHECK: Checked in light-system-program.
    #[authority]
    pub cpi_signer: AccountInfo<'info>,
}
