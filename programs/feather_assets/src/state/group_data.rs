use anchor_lang::prelude::*;
use light_sdk::light_account;

#[light_account]
pub struct GroupDataV1 {
    pub name: String,
    pub uri: String,
    pub mutable: bool,
    pub group_key: Pubkey,
    pub attributes: Vec<AttributeV1>,
}

#[light_account]
pub struct AttributeV1 {
    pub key: String,
    pub value: String,
}

pub trait AttributeVecExt {
    fn as_byte_vec(&self) -> Vec<Vec<u8>>;
}

impl AttributeVecExt for Vec<AttributeV1> {
    fn as_byte_vec(&self) -> Vec<Vec<u8>> {
        self.iter()
            .flat_map(|attr| vec![attr.key.as_bytes().to_vec(), attr.value.as_bytes().to_vec()])
            .collect()
    }
}
