use crate::*;
use error::ErrorCode;
use light_sdk::{
    compressed_account::LightAccount, context::LightContext, light_account, light_accounts,
    merkle_context::PackedAddressMerkleContext,
};

pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, UpdateGroupMaxSize<'info>>,
    lrp: LightRootParams,
    seeds: u64,
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
    let inputs = ParamsUpdateGroupMaxSize { max_size, seeds };
    ctx.check_constraints(&inputs)?;
    ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
    let current_size = ctx.light_accounts.group.size;
    require_gt!(max_size, current_size, ErrorCode::InvalidMaxSize);
    ctx.light_accounts.group.max_size = max_size;
    ctx.verify(light_sdk::proof::CompressedProof {
        a: lrp.proof.a,
        b: lrp.proof.b,
        c: lrp.proof.c,
    })?;
    Ok(())
}
#[light_accounts]
#[instruction(seeds: u64)]
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
        seeds.to_le_bytes().as_ref()]
    )]
    pub group: LightAccount<GroupV1>,
}

pub struct ParamsUpdateGroupMaxSize {
    pub seeds: u64,
    pub max_size: u32,
}
