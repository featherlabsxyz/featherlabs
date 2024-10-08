use super::*;
use anchor_lang::prelude::*;
use light_sdk::light_account;
#[light_account]
#[derive(Clone, Debug, Default)]
pub struct AssetDataV1 {
    #[truncate]
    pub name: String,
    #[truncate]
    pub uri: String,
    pub mutable: bool,
    #[truncate]
    pub asset_key: Pubkey,
    #[truncate]
    pub update_authority: Pubkey,
}
