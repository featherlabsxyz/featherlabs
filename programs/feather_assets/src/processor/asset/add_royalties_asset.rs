use crate::*;
pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, AddRoyaltiesToAsset<'info>>,
    lrp: LightRootParams,
    asset_derivation_key: Pubkey,
    args: RoyaltyArgsV1,
) -> Result<()> {
    let address_merkle_context =
        unpack_address_merkle_context(lrp.address_merkle_context, ctx.remaining_accounts);
    let asset_address_seed =
        derive_address_seed(&[asset_derivation_key.to_bytes().as_ref()], &crate::ID);
    let asset_address =
        Pubkey::new_from_array(derive_address(&asset_address_seed, &address_merkle_context));
    msg!("Asset Compressed Account: {:?}", asset_address);
    let mut ctx: LightContext<AddRoyaltiesToAsset, LightAddRoyaltiesToAsset> = LightContext::new(
        ctx,
        lrp.inputs,
        lrp.merkle_context,
        lrp.merkle_tree_root_index,
        lrp.address_merkle_context,
        lrp.address_merkle_tree_root_index,
    )?;
    let inputs = ParamsAddRoyaltiesToAsset {
        asset_derivation_key,
        asset_address,
    };
    ctx.check_constraints(&inputs)?;
    ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
    let asset = &mut ctx.light_accounts.asset;
    let asset_royalty = &mut ctx.light_accounts.asset_royalty;
    if asset.royalty_state != RoyalyState::Unintialized {
        return Err(FeatherErrorCode::RoyaltyAlreadyInitializedOrDisabled.into());
    }
    asset.royalty_state = RoyalyState::Initialized;
    asset_royalty.asset_key = asset_address;
    asset_royalty.basis_points = args.basis_points;
    asset_royalty.creators = args.creators;
    asset_royalty.ruleset = args.ruleset;
    let address = Pubkey::new_from_array(derive_address(
        &asset_royalty.new_address_params().unwrap().seed,
        &address_merkle_context,
    ));
    msg!("Asset Royalty Compressed Account: {:?}", address);
    ctx.verify(lrp.proof)?;
    Ok(())
}
#[light_accounts]
#[instruction(asset_derivation_key: Pubkey, asset_address: Pubkey)]
pub struct AddRoyaltiesToAsset<'info> {
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
        seeds = [ASSET_ROYALTY_SEED, asset_address.to_bytes().as_ref()],
    )]
    pub asset_royalty: LightAccount<AssetRoyaltiesV1>,
}

pub struct ParamsAddRoyaltiesToAsset {
    pub asset_derivation_key: Pubkey,
    pub asset_address: Pubkey,
}
