use anchor_lang::prelude::*;
use light_sdk::light_account;

#[light_account]
#[derive(Clone, Debug, Default)]
pub struct GroupV1 {
    /// Requires to sign for adding member asset
    #[truncate]
    pub owner: Pubkey,
    /// required to derive the group seed when mutating
    #[truncate]
    pub derivation_key: Pubkey,
    pub max_size: u32,
    pub size: u32,
    /// If true, there's an associated metadata compressed account created
    pub has_metadata: bool,
}
