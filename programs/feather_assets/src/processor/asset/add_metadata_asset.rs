use crate::*;
pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, AddMetadataToAsset<'info>>,
    lrp: LightRootParams,
    asset_type: AssetType,
    args: AssetMetadataArgsV1,
) -> Result<()> {
    let asset_seed = asset_type.generate_asset_seed(&lrp)?;
    let mut ctx: LightContext<AddMetadataToAsset, LightAddMetadataToAsset> = LightContext::new(
        ctx,
        lrp.inputs,
        lrp.merkle_context,
        lrp.merkle_tree_root_index,
        lrp.address_merkle_context,
        lrp.address_merkle_tree_root_index,
    )?;
    let inputs = ParamsAddMetadataToAsset { asset_seed };
    ctx.check_constraints(&inputs)?;
    ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
    let asset_data = &mut ctx.light_accounts.asset_data;
    let asset = &mut ctx.light_accounts.asset;
    asset_type.validate_asset(&asset)?;

    if asset.has_metadata {
        return Err(FeatherErrorCode::MetadataAccountExistAlready.into());
    }
    asset.has_metadata = true;
    asset_data.asset_key = asset.address;
    asset_data.attributes = args.attributes;
    asset_data.mutable = args.mutable;
    asset_data.name = args.name;
    asset_data.uri = args.uri;
    asset_data.privilege_attributes = Vec::new();

    ctx.verify(lrp.proof)?;
    Ok(())
}
#[light_accounts]
#[instruction(asset_seed: Vec<Vec<u8>>)]
pub struct AddMetadataToAsset<'info> {
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
        seeds = [ASSET_DATA_SEED ,asset.address.as_ref()],
    )]
    pub asset_data: LightAccount<AssetDataV1>,
}

pub struct ParamsAddMetadataToAsset {
    pub asset_seed: Vec<Vec<u8>>,
}
