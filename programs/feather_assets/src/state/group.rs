use anchor_lang::prelude::*;
use light_sdk::light_account;

#[light_account]
pub struct GroupV1 {
    pub max_size: u32,
    pub size: u32,
    pub update_authority: Pubkey,
    pub has_metadata: bool,
}
