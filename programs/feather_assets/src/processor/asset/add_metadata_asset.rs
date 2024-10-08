use crate::*;
pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, AddMetadataToAsset<'info>>,
    lrp: LightRootParams,
    asset_derivation_key: Pubkey,
    args: AssetMetadataArgsV1,
) -> Result<()> {
    let address_merkle_context =
        unpack_address_merkle_context(lrp.address_merkle_context, ctx.remaining_accounts);

    let asset_seed_address =
        derive_address_seed(&[asset_derivation_key.to_bytes().as_ref()], &crate::ID);
    let asset_address =
        Pubkey::new_from_array(derive_address(&asset_seed_address, &address_merkle_context));
    msg!("Asset Compressed Account: {:?}", asset_address);
    let mut ctx: LightContext<AddMetadataToAsset, LightAddMetadataToAsset> = LightContext::new(
        ctx,
        lrp.inputs,
        lrp.merkle_context,
        lrp.merkle_tree_root_index,
        lrp.address_merkle_context,
        lrp.address_merkle_tree_root_index,
    )?;
    let inputs = ParamsAddMetadataToAsset {
        asset_derivation_key,
        asset_address,
    };
    ctx.check_constraints(&inputs)?;
    // ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
    let asset = &mut ctx.light_accounts.asset;
    asset.set_address_seed(derive_address_seed(
        &[asset_derivation_key.to_bytes().as_ref()],
        &crate::ID,
    ));
    let asset_data = &mut ctx.light_accounts.asset_data;
    asset_data.set_address_seed(derive_address_seed(
        &[ASSET_DATA_SEED, asset_address.to_bytes().as_ref()],
        &crate::ID,
    ));
    if asset.has_metadata {
        return Err(FeatherErrorCode::MetadataAccountExistAlready.into());
    }
    asset.has_metadata = true;
    asset_data.asset_key = asset_address;
    // asset_data.attributes = args.attributes.try_to_vec()?;
    asset_data.mutable = args.mutable;
    asset_data.name = args.name;
    asset_data.uri = args.uri;
    asset_data.update_authority = args.update_authority;
    let address = Pubkey::new_from_array(derive_address(
        &asset_data.new_address_params().unwrap().seed,
        &address_merkle_context,
    ));
    msg!("Asset Metadata Compressed Account: {:?}", address);
    ctx.verify(lrp.proof)?;
    Ok(())
}
#[light_accounts]
#[instruction(asset_derivation_key: Pubkey, asset_address: Pubkey)]
pub struct AddMetadataToAsset<'info> {
    #[account(mut)]
    #[fee_payer]
    pub authority: Signer<'info>,
    #[self_program]
    pub self_program: Program<'info, crate::program::FeatherAssets>,
    /// CHECK: Checked in light-system-program.
    #[authority]
    pub cpi_signer: AccountInfo<'info>,
    #[light_account(mut, seeds = [asset_derivation_key.to_bytes().as_ref()]
        constraint = asset.owner == authority.key() @ FeatherErrorCode::InvalidAssetSigner
    )]
    pub asset: LightAccount<AssetV1>,
    #[light_account(
        init,
        seeds = [ASSET_DATA_SEED, asset_address.to_bytes().as_ref()],
    )]
    pub asset_data: LightAccount<AssetDataV1>,
}

pub struct ParamsAddMetadataToAsset {
    pub asset_derivation_key: Pubkey,
    pub asset_address: Pubkey,
}
