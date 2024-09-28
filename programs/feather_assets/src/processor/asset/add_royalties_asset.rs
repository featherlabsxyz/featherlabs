use crate::*;
pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, AddRoyaltiesToAsset<'info>>,
    lrp: LightRootParams,
    asset_type: AssetType,
    args: RoyaltyArgsV1,
) -> Result<()> {
    let asset_seed = asset_type.generate_asset_seed(&lrp)?;
    let mut ctx: LightContext<AddRoyaltiesToAsset, LightAddRoyaltiesToAsset> = LightContext::new(
        ctx,
        lrp.inputs,
        lrp.merkle_context,
        lrp.merkle_tree_root_index,
        lrp.address_merkle_context,
        lrp.address_merkle_tree_root_index,
    )?;
    let inputs = ParamsAddRoyaltiesToAsset { asset_seed };
    ctx.check_constraints(&inputs)?;
    ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
    let asset = &mut ctx.light_accounts.asset;
    asset_type.validate_asset(&asset)?;
    let asset_royalty = &mut ctx.light_accounts.asset_royalty;
    if asset.has_royalties {
        return Err(FeatherErrorCode::MetadataAccountExistAlready.into());
    }
    asset.has_royalties = true;
    asset_royalty.asset_key = asset.address;
    asset_royalty.basis_points = args.basis_points;
    asset_royalty.creators = args.creators;
    asset_royalty.ruleset = args.ruleset;

    ctx.verify(lrp.proof)?;
    Ok(())
}
#[light_accounts]
#[instruction(asset_seed: Vec<Vec<u8>>)]
pub struct AddRoyaltiesToAsset<'info> {
    #[account(mut)]
    #[fee_payer]
    pub authority: Signer<'info>,
    #[self_program]
    pub self_program: Program<'info, crate::program::FeatherAssets>,
    /// CHECK: Checked in light-system-program.
    #[authority]
    pub cpi_signer: AccountInfo<'info>,
    #[light_account(mut, seeds = [&asset_seed.concat()]
        constraint = asset.owner == authority.key() @ FeatherErrorCode::InvalidAssetSigner
    )]
    pub asset: LightAccount<AssetV1>,
    #[light_account(
        init,
        seeds = [ASSET_ROYALTY_SEED, asset.address.as_ref()],
    )]
    pub asset_royalty: LightAccount<AssetRoyaltiesV1>,
}

pub struct ParamsAddRoyaltiesToAsset {
    pub asset_seed: Vec<Vec<u8>>,
}
