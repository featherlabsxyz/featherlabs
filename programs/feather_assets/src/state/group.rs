use anchor_lang::prelude::*;
use light_sdk::light_account;

#[light_account]
#[derive(Clone, Debug, Default)]
pub struct GroupV1 {
    pub max_size: u32,
    pub size: u32,
    pub owner: Pubkey,
    /// If true, there's an associated metadata compressed account created
    pub has_metadata: bool,
}
