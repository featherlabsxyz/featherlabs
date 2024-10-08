// use crate::*;

// pub fn handler<'info>(
//     ctx: Context<'_, '_, '_, 'info, TransferAsset<'info>>,
//     lrp: LightRootParams,
//     derivation_key: Pubkey,
// ) -> Result<()> {
//     let new_authority = ctx.accounts.new_authority;
//     let address_merkle_context =
//         unpack_address_merkle_context(lrp.address_merkle_context, ctx.remaining_accounts);
//     let mut ctx: LightContext<TransferAsset, LightTransferAsset> = LightContext::new(
//         ctx,
//         lrp.inputs,
//         lrp.merkle_context,
//         lrp.merkle_tree_root_index,
//         lrp.address_merkle_context,
//         lrp.address_merkle_tree_root_index,
//     )?;
//     let inputs = ParamsTransferAsset { derivation_key };
//     ctx.check_constraints(&inputs)?;
//     ctx.derive_address_seeds(lrp.address_merkle_context, &inputs);
//     let asset = &mut ctx.light_accounts.asset;
//     match asset.asset_authority_state {
//         AssetAuthorityVariantV1::Owner => {
//             asset.owner = new_authority.key();
//         }
//         AssetAuthorityVariantV1::Renter {
//             rent_time,
//             fallback_owner,
//             privilege,
//         } => {
//             if Clock::get()?.unix_timestamp > i64::from(rent_time) + Clock::get()?.unix_timestamp {
//                 asset.asset_authority_state = AssetAuthorityVariantV1::Owner;
//                 asset.owner = fallback_owner;
//                 return Err(FeatherErrorCode::CustomError.into());
//             }
//             match privilege {
//                 AssetPrivilege::All => asset.owner = new_authority.key(),
//                 AssetPrivilege::Transfer => asset.owner = new_authority.key(),
//                 AssetPrivilege::FreezeAndTransfer => asset.owner = new_authority.key(),
//                 AssetPrivilege::Tbf => asset.owner = new_authority.key(),
//                 _ => return Err(FeatherErrorCode::CustomError.into()),
//             }
//         }
//         AssetAuthorityVariantV1::OwnerDelegate {
//             time_lock,
//             delegate,
//             privilege,
//         } => todo!(),
//         AssetAuthorityVariantV1::OwnerPermanentDelegate {
//             delegate,
//             privilege,
//         } => todo!(),
//     }
//     let asset_address = Pubkey::new_from_array(derive_address(
//         &ctx.light_accounts.asset.new_address_params().unwrap().seed,
//         &address_merkle_context,
//     ));
//     msg!("Asset Compressed Account: {:?}", asset_address);
//     ctx.verify(lrp.proof)?;
//     Ok(())
// }
// #[light_accounts]
// #[instruction(derivation_key: Pubkey)]
// pub struct TransferAsset<'info> {
//     #[account(mut)]
//     #[fee_payer]
//     pub authority: Signer<'info>,
//     /// CHECK: Its safe
//     pub new_authority: AccountInfo<'info>,
//     #[self_program]
//     pub self_program: Program<'info, crate::program::FeatherAssets>,
//     /// CHECK: Checked in light-system-program.
//     #[authority]
//     pub cpi_signer: AccountInfo<'info>,
//     #[light_account(
//         mut,
//         seeds = [derivation_key.to_bytes().as_ref()]
//     )]
//     pub asset: LightAccount<AssetV1>,
// }

// pub struct ParamsTransferAsset {
//     derivation_key: Pubkey,
// }
