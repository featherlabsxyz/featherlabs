use anchor_lang::prelude::*;
use light_sdk::light_account;
pub const MAX_SIGNERS: usize = 10;

#[light_account]
pub struct AssetMultisig {
    pub m: u8,
    pub n: u8,
    pub asset_key: Pubkey,
    pub signers: [Pubkey; MAX_SIGNERS],
}

pub trait AssetMultisigExt {
    fn as_byte_vec(&self) -> Vec<Vec<u8>>;
}

impl AssetMultisigExt for [Pubkey; MAX_SIGNERS] {
    fn as_byte_vec(&self) -> Vec<Vec<u8>> {
        vec![self
            .iter()
            .flat_map(|signer| signer.to_bytes())
            .collect::<Vec<u8>>()]
    }
}
