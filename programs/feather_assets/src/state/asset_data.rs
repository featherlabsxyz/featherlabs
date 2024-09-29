use super::*;
use anchor_lang::prelude::*;
use light_sdk::light_account;
#[light_account]
#[derive(Clone, Debug, Default)]
pub struct AssetDataV1 {
    pub name: String,
    pub uri: String,
    pub mutable: bool,
    pub asset_key: Pubkey,
    pub attributes: Vec<super::AttributeV1>,
    /// owner can't mutate this, only renter/delegate of asset with `AssetMetadataPrivilegeAttributes` can
    pub privilege_attributes: Vec<super::AttributeV1>,
}
