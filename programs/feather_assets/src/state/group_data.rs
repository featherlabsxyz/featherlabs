use super::*;
use anchor_lang::prelude::*;
use light_sdk::light_account;

#[light_account]
pub struct GroupDataV1 {
    pub name: String,
    pub uri: String,
    pub mutable: bool,
    pub group_key: Pubkey,
    pub attributes: Vec<super::AttributeV1>,
}
