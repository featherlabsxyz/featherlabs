use anchor_lang::prelude::*;
use light_sdk::light_account;

#[light_account]
#[derive(Clone, Debug, Default)]
pub struct AssetRoyaltiesV1 {
    pub basis_points: u8,
    pub creators: Vec<CreatorArgsV1>,
    pub ruleset: RuleSetV1,
    #[truncate]
    pub asset_key: Pubkey,
    #[truncate]
    pub update_authority: Pubkey,
}

#[light_account]
#[derive(Debug, Clone)]
pub struct CreatorArgsV1 {
    address: Pubkey,
    percentage: u8,
}

pub trait CreatorsVecExt {
    fn as_byte_vec(&self) -> Vec<Vec<u8>>;
}
impl CreatorsVecExt for Vec<CreatorArgsV1> {
    fn as_byte_vec(&self) -> Vec<Vec<u8>> {
        self.iter()
            .flat_map(|args| vec![args.address.to_bytes().to_vec(), vec![args.percentage]])
            .collect()
    }
}

#[derive(Clone, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize, Default)]
#[repr(u8)]
pub enum RuleSetV1 {
    #[default]
    None,
    ProgramAllowList(Vec<Pubkey>),
    ProgramDenyList(Vec<Pubkey>), // empty means all
}

impl RuleSetV1 {
    fn as_byte_vec(&self) -> Vec<Vec<u8>> {
        match self {
            RuleSetV1::None => vec![vec![0]],
            RuleSetV1::ProgramAllowList(pubkeys) => {
                let mut result = vec![vec![1]];
                for pubkey in pubkeys {
                    result.push(pubkey.to_bytes().to_vec());
                }
                result
            }
            RuleSetV1::ProgramDenyList(pubkeys) => {
                let mut result = vec![vec![2]];
                for pubkey in pubkeys {
                    result.push(pubkey.to_bytes().to_vec());
                }
                result
            }
        }
    }
}
