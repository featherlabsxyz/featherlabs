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
    Alone {
        asset_id: u32,
        authority: Pubkey,
    },
    Member {
        group_address: Pubkey,
        member_number: u32,
    },
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
    pub fn generate_asset_seed(&self, lrp: &LightRootParams) -> Result<Vec<Vec<u8>>> {
        let asset_seed: Vec<Vec<u8>> = match self {
            AssetType::Alone {
                asset_id,
                authority,
            } => {
                vec![
                    ASSET_SEED.to_vec(),
                    authority.try_to_vec()?,
                    asset_id.to_le_bytes().to_vec(),
                ]
            }
            AssetType::Member {
                group_address,
                member_number,
            } => {
                let group: Result<LightMutAccount<GroupV1>> = LightMutAccount::try_from_slice(
                    lrp.inputs[lrp.inputs.len() - 1].as_slice(), // send group account at last so it does not get deserialized by macros
                    &lrp.merkle_context,
                    lrp.merkle_tree_root_index,
                    &lrp.address_merkle_context,
                );
                let group = group.map_err(|_| FeatherErrorCode::GroupAccountNotFound)?;

                require_eq!(group_address, &group.address, FeatherErrorCode::CustomError);
                vec![
                    ASSET_SEED.to_vec(),
                    group_address.to_bytes().to_vec(),
                    member_number.to_le_bytes().to_vec(),
                ]
            }
        };
        Ok(asset_seed)
    }
    pub fn validate_asset(&self, asset: &LightAccount<AssetV1>) -> Result<()> {
        match self {
            AssetType::Alone {
                asset_id,
                authority,
            } => {
                require_eq!(
                    asset.group_membership.is_none(),
                    true,
                    FeatherErrorCode::CustomError
                );
                require_eq!(&asset.owner, authority, FeatherErrorCode::CustomError);
            }
            AssetType::Member {
                group_address,
                member_number,
            } => {
                require_eq!(
                    asset.group_membership.is_some(),
                    true,
                    FeatherErrorCode::CustomError
                );
                require_eq!(
                    asset.group_membership.as_ref().unwrap().group_key,
                    *group_address,
                    FeatherErrorCode::CustomError
                );
                require_eq!(
                    asset.group_membership.as_ref().unwrap().member_number,
                    *member_number,
                    FeatherErrorCode::CustomError
                )
            }
        }
        Ok(())
    }
}
