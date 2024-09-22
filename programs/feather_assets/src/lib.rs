pub mod constants;
pub mod error;
// pub mod exapanded_2;
pub mod processor;
pub mod state;

use anchor_lang::prelude::*;
use light_sdk::merkle_context::{PackedAddressMerkleContext, PackedMerkleContext};

declare_id!("DD9JdX9UBs7MvfZTX8NrxVYDRXyC2aWymsQmqZc9avTo");

#[program]
pub mod feather_assets {
    use super::*;
    pub use constants::*;
    pub use processor::*;
    pub use state::*;

    // <-------------------------------------------------------------------------------------------->

    pub fn create_group<'info>(
        ctx: Context<'_, '_, '_, 'info, CreateGroup<'info>>,
        lrp: LightRootParams,
        seeds: u64,
        args: CreateGroupArgsV1,
    ) -> Result<()> {
        processor::create_group::handler(ctx, lrp, seeds, args)?;
        Ok(())
    }
    pub fn update_group_max_size<'info>(
        ctx: Context<'_, '_, '_, 'info, UpdateGroupMaxSize<'info>>,
        lrp: LightRootParams,
        seeds: u64,
        max_size: u32,
    ) -> Result<()> {
        processor::update_group_max_size::handler(ctx, lrp, seeds, max_size)?;
        Ok(())
    }
    // pub fn add_metadata_to_group<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: GroupMetadataArgsV1,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_group_metadata<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: UpdateGroupMetadataArgsV1,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn transfer_group_authority<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // // <-------------------------------------------------------------------------------------------->

    // pub fn create_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: CreateAssetArgsV1,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // // needs to send group light account
    // pub fn create_group_member_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: CreateAssetArgsV1,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // // <-------------------------------------------------------------------------------------------->

    // pub fn create_multisig_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: CreateAssetArgsV1,
    //     minimum_signers: u8, // need to provide n number of signers in remaining accounts
    //     n_signers: u8,       // used to calculate index in remaining_accounts where signers starts
    // ) -> Result<()> {
    //     Ok(())
    // }
    // // needs to send group light account
    // pub fn create_multisig_group_memeber_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: CreateAssetArgsV1,
    //     minimum_signers: u8, // need to provide n number of signers in remaining accounts
    //     n_signers: u8,       // used to calculate index in remaining_accounts where signers starts
    // ) -> Result<()> {
    //     Ok(())
    // }

    // // <-------------------------------------------------------------------------------------------->

    // pub fn add_metadata_to_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: AssetMetadataArgsV1,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn add_royalties_to_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: RoyaltyArgsV1,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_asset_royalties<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: UpdateRoyaltyArgsV1,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_asset_metadata<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: UpdateAssetMetadataArgsV1,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // // <-------------------------------------------------------------------------------------------->

    // pub fn add_metadata_to_asset_multisig<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: AssetMetadataArgsV1,
    //     number_of_signer: u8, // used to calculate index in remaining_accounts where signers starts
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn add_royalties_to_asset_multisig<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: RoyaltyArgsV1,
    //     number_of_signer: u8, // used to calculate index in remaining_accounts where signers starts
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_asset_royalties_multisig<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: UpdateRoyaltyArgsV1,
    //     number_of_signer: u8, // used to calculate index in remaining_accounts where signers starts
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_asset_metadata_multisig<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: UpdateAssetMetadataArgsV1,
    //     number_of_signer: u8, // used to calculate index in remaining_accounts where signers starts
    // ) -> Result<()> {
    //     Ok(())
    // }

    // // <-------------------------------------------------------------------------------------------->

    // pub fn freeze_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn thaw_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn burn_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn transfer_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // // <-------------------------------------------------------------------------------------------->

    // pub fn freeze_asset_multisig<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn thaw_asset_multisig<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn burn_asset_multisig<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn transfer_asset_multisig<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // // <-------------------------------------------------------------------------------------------->

    // pub fn delegate_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     time_lock: Option<u32>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn revoke_delegate_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_delegate_privledge<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     time_lock: Option<u32>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn permanent_delegate_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn rent_asset<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     rent_time: u32,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // // <-------------------------------------------------------------------------------------------->
    // pub fn delegate_asset_multisig<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     time_lock: Option<u32>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // pub fn revoke_delegate_asset_multsig<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_delegate_privledge_multisig<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     time_lock: Option<u32>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn permanent_delegate_asset_multisig<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn rent_asset_multisig<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     rent_time: u32,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // <-------------------------------------------------------------------------------------------->

    // No plans for protocol fees for now
    // pub fn initialize_fee_config<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_fee_config<'info>(
    //     ctx: LightContext<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct LightRootParams {
    pub inputs: Vec<Vec<u8>>,
    pub proof: CompressedProof,
    pub merkle_context: PackedMerkleContext,
    pub merkle_tree_root_index: u16,
    pub address_merkle_context: PackedAddressMerkleContext,
    pub address_merkle_tree_root_index: u16,
}
#[derive(Debug, Clone, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
pub struct CompressedProof {
    pub a: [u8; 32],
    pub b: [u8; 64],
    pub c: [u8; 32],
}
