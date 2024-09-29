#![warn(ambiguous_glob_reexports)]
pub mod constants;
pub mod error;
pub mod processor;
pub mod state;

use anchor_lang::prelude::*;
pub use constants::*;
pub use error::*;
use light_sdk::{
    address::*, compressed_account::*, context::*, light_account, light_accounts,
    merkle_context::*, program_merkle_context::*, proof::CompressedProof, traits::*, verify::*,
    CPI_AUTHORITY_PDA_SEED,
};
use processor::*;
pub use state::*;
declare_id!("HNyzkDmhZayxRG77bk84oxe13Qp3PcRhd5o5NJEF6E5W");

#[program]
pub mod feather_assets {
    use super::*;
    // <-------------------------------------------------------------------------------------------->

    pub fn create_group<'info>(
        ctx: Context<'_, '_, '_, 'info, CreateGroup<'info>>,
        lrp: LightRootParams,
        derivation_key: Pubkey,
        args: CreateGroupArgsV1,
    ) -> Result<()> {
        processor::create_group::handler(ctx, lrp, derivation_key, args)?;
        Ok(())
    }
    pub fn update_group_max_size<'info>(
        ctx: Context<'_, '_, '_, 'info, UpdateGroupMaxSize<'info>>,
        lrp: LightRootParams,
        derivation_key: Pubkey,
        max_size: u32,
    ) -> Result<()> {
        processor::update_group_max_size::handler(ctx, lrp, derivation_key, max_size)?;
        Ok(())
    }
    pub fn add_metadata_to_group<'info>(
        ctx: Context<'_, '_, '_, 'info, AddMetadataToGroup<'info>>,
        lrp: LightRootParams,
        derivation_key: Pubkey,
        args: GroupMetadataArgsV1,
    ) -> Result<()> {
        processor::add_metadata_group::handler(ctx, lrp, derivation_key, args)?;
        Ok(())
    }
    pub fn update_group_metadata<'info>(
        ctx: Context<'_, '_, '_, 'info, UpdateGroupMetadata<'info>>,
        lrp: LightRootParams,
        derivation_key: Pubkey,
        args: UpdateGroupMetadataArgsV1,
    ) -> Result<()> {
        processor::update_group_metadata::handler(ctx, lrp, derivation_key, args)?;
        Ok(())
    }
    pub fn transfer_group_authority<'info>(
        ctx: Context<'_, '_, '_, 'info, TransferGroupAuthority<'info>>,
        lrp: LightRootParams,
        derivation_key: Pubkey,
    ) -> Result<()> {
        processor::transfer_group_authority::handler(ctx, lrp, derivation_key)?;
        Ok(())
    }

    // <-------------------------------------------------------------------------------------------->

    pub fn create_asset<'info>(
        ctx: Context<'_, '_, '_, 'info, CreateAsset<'info>>,
        lrp: LightRootParams,
        derivation_key: Pubkey,
        args: CreateAssetArgsV1,
    ) -> Result<()> {
        processor::create_asset::handler(ctx, lrp, derivation_key, args)?;
        Ok(())
    }
    // // needs to send group light account
    pub fn create_member_asset<'info>(
        ctx: Context<'_, '_, '_, 'info, CreateMemberAsset<'info>>,
        lrp: LightRootParams,
        group_derivation_key: Pubkey,
        asset_derivation_key: Pubkey,
        args: CreateAssetArgsV1,
    ) -> Result<()> {
        processor::create_member_asset::handler(
            ctx,
            lrp,
            group_derivation_key,
            asset_derivation_key,
            args,
        )?;
        Ok(())
    }

    // <-------------------------------------------------------------------------------------------->

    // pub fn create_multisig_asset<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: CreateAssetArgsV1,
    //     minimum_signers: u8, // need to provide n number of signers in remaining accounts
    //     n_signers: u8,       // used to calculate index in remaining_accounts where signers starts
    // ) -> Result<()> {
    //     Ok(())
    // }
    // // needs to send group light account
    // pub fn create_multisig_group_memeber_asset<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: CreateAssetArgsV1,
    //     minimum_signers: u8, // need to provide n number of signers in remaining accounts
    //     n_signers: u8,       // used to calculate index in remaining_accounts where signers starts
    // ) -> Result<()> {
    //     Ok(())
    // }

    // <-------------------------------------------------------------------------------------------->

    pub fn add_metadata_to_asset<'info>(
        ctx: Context<'_, '_, '_, 'info, AddMetadataToAsset<'info>>,
        lrp: LightRootParams,
        asset_derivation_key: Pubkey,
        args: AssetMetadataArgsV1,
    ) -> Result<()> {
        processor::add_metadata_asset::handler(ctx, lrp, asset_derivation_key, args)?;
        Ok(())
    }
    pub fn add_royalties_to_asset<'info>(
        ctx: Context<'_, '_, '_, 'info, AddRoyaltiesToAsset<'info>>,
        lrp: LightRootParams,
        asset_derivation_key: Pubkey,
        args: RoyaltyArgsV1,
    ) -> Result<()> {
        processor::add_royalties_asset::handler(ctx, lrp, asset_derivation_key, args)?;
        Ok(())
    }
    // pub fn update_asset_royalties<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: UpdateRoyaltyArgsV1,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_asset_metadata<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: UpdateAssetMetadataArgsV1,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // // <-------------------------------------------------------------------------------------------->

    // pub fn add_metadata_to_asset_multisig<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: AssetMetadataArgsV1,
    //     number_of_signer: u8, // used to calculate index in remaining_accounts where signers starts
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn add_royalties_to_asset_multisig<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: RoyaltyArgsV1,
    //     number_of_signer: u8, // used to calculate index in remaining_accounts where signers starts
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_asset_royalties_multisig<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: UpdateRoyaltyArgsV1,
    //     number_of_signer: u8, // used to calculate index in remaining_accounts where signers starts
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_asset_metadata_multisig<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     args: UpdateAssetMetadataArgsV1,
    //     number_of_signer: u8, // used to calculate index in remaining_accounts where signers starts
    // ) -> Result<()> {
    //     Ok(())
    // }

    // // <-------------------------------------------------------------------------------------------->

    // pub fn freeze_asset<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn thaw_asset<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn burn_asset<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn transfer_asset<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // // <-------------------------------------------------------------------------------------------->

    // pub fn freeze_asset_multisig<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn thaw_asset_multisig<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn burn_asset_multisig<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn transfer_asset_multisig<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // // <-------------------------------------------------------------------------------------------->

    // pub fn delegate_asset<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     time_lock: Option<u32>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn revoke_delegate_asset<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_delegate_privledge<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     time_lock: Option<u32>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn permanent_delegate_asset<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn rent_asset<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     rent_time: u32,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // // <-------------------------------------------------------------------------------------------->
    // pub fn delegate_asset_multisig<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     time_lock: Option<u32>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // pub fn revoke_delegate_asset_multsig<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_delegate_privledge_multisig<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     time_lock: Option<u32>,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn permanent_delegate_asset_multisig<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn rent_asset_multisig<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    //     asset_privelege: AssetPrivilege,
    //     rent_time: u32,
    //     number_of_signer: u8,
    // ) -> Result<()> {
    //     Ok(())
    // }

    // <-------------------------------------------------------------------------------------------->

    // No plans for protocol fees for now
    // pub fn initialize_fee_config<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
    // ) -> Result<()> {
    //     Ok(())
    // }
    // pub fn update_fee_config<'info>(
    //     ctx: Context<'_, '_, '_, 'info, Initialize<'info>>,
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
