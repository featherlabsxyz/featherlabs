pub mod asset;
pub mod asset_data;
pub mod asset_multisig;
pub mod asset_royalties;
pub mod group;
pub mod group_data;

use crate::*;
use anchor_lang::prelude::*;
pub use asset::*;
pub use asset_data::*;
pub use asset_multisig::*;
pub use asset_royalties::*;
pub use group::*;
pub use group_data::*;
#[light_account]
#[derive(Debug, Clone)]
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

// <---------------------GroupArgs------------------------>

#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct CreateGroupArgsV1 {
    pub max_size: u32,
    pub metadata: Option<GroupMetadataArgsV1>,
}
#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct GroupMetadataArgsV1 {
    pub name: String,
    pub uri: String,
    pub mutable: bool,
    pub attributes: Vec<super::AttributeV1>,
}
#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct UpdateGroupMetadataArgsV1 {
    pub name: Option<String>,
    pub uri: Option<String>,
    pub attributes: Option<Vec<super::AttributeV1>>,
}

// <---------------------AssetArgs------------------------>

#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct CreateAssetArgsV1 {
    pub transferrable: bool,
    pub rentable: bool,
    pub metadata: Option<AssetMetadataArgsV1>,
    pub royalties_initializable: bool,
}
#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct RoyaltyArgsV1 {
    pub basis_points: u8,
    pub creators: Vec<CreatorArgsV1>,
    pub ruleset: RuleSetV1,
}
#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct AssetMetadataArgsV1 {
    pub name: String,
    pub uri: String,
    pub mutable: bool,
    pub attributes: Vec<AttributeV1>,
}
#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct UpdateRoyaltyArgsV1 {
    pub basis_points: Option<u8>,
    pub creators: Option<Vec<CreatorArgsV1>>,
    pub ruleset: Option<RuleSetV1>,
}
#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct UpdateAssetMetadataArgsV1 {
    pub name: Option<String>,
    pub uri: Option<String>,
    pub attributes: Option<Vec<AttributeV1>>,
}
