use anchor_lang::prelude::*;
use light_sdk::light_account;

#[light_account]
#[derive(Clone, Debug, Default)]
pub struct GroupV1 {
    #[truncate]
    pub address: Pubkey,
    #[truncate]
    pub max_size: u32,
    pub size: u32,
    #[truncate]
    pub owner: Pubkey,
    #[truncate]
    /// If true, there's an associated metadata compressed account created
    pub has_metadata: bool,
}
