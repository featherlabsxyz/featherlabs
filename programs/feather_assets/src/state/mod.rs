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
    pub royalty: Option<RoyaltyArgsV1>,
}
#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub enum AssetType {
    Alone { seeds: u64 },
    Member { group_seed: u64, member_number: u32 },
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

impl AssetType {
    pub fn generate_asset_seed(
        &self,
        authority_key: &Pubkey,
        lrp: &LightRootParams,
        address_merkle_context: &AddressMerkleContext,
    ) -> Result<Vec<Vec<u8>>> {
        let asset_seed: Vec<Vec<u8>> = match self {
            AssetType::Alone { seeds } => {
                vec![
                    ASSET_SEED.to_vec(),
                    authority_key.try_to_vec()?,
                    seeds.to_le_bytes().to_vec(),
                ]
            }
            AssetType::Member {
                group_seed,
                member_number,
            } => {
                let group: Result<LightMutAccount<GroupV1>> = LightMutAccount::try_from_slice(
                    lrp.inputs[0].as_slice(),
                    &lrp.merkle_context,
                    lrp.merkle_tree_root_index,
                    &lrp.address_merkle_context,
                );
                let group = group.map_err(|_| FeatherErrorCode::GroupAccountNotFound)?;

                let group_address_seed = derive_address_seed(
                    &[
                        GROUP_SEED,
                        group.owner.as_ref(),
                        group_seed.to_le_bytes().as_ref(),
                    ],
                    &crate::ID,
                    &address_merkle_context,
                );
                let group_address = derive_address(&group_address_seed, &address_merkle_context);
                vec![
                    ASSET_SEED.to_vec(),
                    group_address.to_vec(),
                    member_number.to_le_bytes().to_vec(),
                ]
            }
        };
        Ok(asset_seed)
    }
}
