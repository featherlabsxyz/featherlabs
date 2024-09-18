use anchor_lang::prelude::*;
use light_sdk::light_account;

#[light_account]
pub struct AssetV1 {
    pub owner: Pubkey,
    pub asset_authority_state: AssetAuthorityVariantV1,
    pub asset_state: AssetStateV1,

    pub group_membership: Option<GroupMembership>,

    pub transferable: bool,
    pub rentable: bool,
    pub delegatable: bool,

    /// If true, there's an associated royalties compressed account created
    pub has_royalties: bool,
    /// If true, there's an associated metadata compressed account created
    pub has_metadata: bool,
    /// If true, there's an associated multisig compressed account created
    pub has_multisig: bool,
}

#[light_account]
pub struct GroupMembership {
    pub group_key: Pubkey,
    pub member_number: u32,
}
#[derive(Clone, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize, Default)]
/// Represents different states of ownership for an asset.
pub enum AssetAuthorityVariantV1 {
    #[default]
    /// Default ownership state. It same for multsig as well.
    Owner,
    /// Temporary rental state with a time limit.
    ///
    /// Fields:
    /// - `rent_time`: The duration of the rental in seconds. When the time limit expires, it resets to the Owner/MultisigOwner state.
    /// - `fallback_owner`: The public key of the entity who is renting the asset.
    /// - `privilege`: The privileges granted to the renter.
    Renter {
        rent_time: u32,
        fallback_owner: Pubkey,
        privilege: AssetPrivilege,
    },

    /// Delegated ownership with an optional time lock.
    ///
    /// Fields:
    /// - `time_lock`: The optional duration in seconds.
    ///    If `Some(duration)`, the ownership will reset to Owner/MultisigOwner state after the time limit.
    ///    If `None`, it remains delegated until transferred or revoked.
    /// - `delegate`: The public key of the entity who has been delegated ownership.
    /// - `privilege`: The privileges granted to the delegate.
    OwnerDelegate {
        time_lock: Option<u32>,
        delegate: Pubkey,
        privilege: AssetPrivilege,
    },

    /// Permanent delegated ownership.
    ///
    /// Fields:
    /// - `Pubkey`: The public key of the entity who has permanent delegated ownership.
    /// - `AssetPrivilege`: The privileges granted to the permanent delegate.
    ///
    /// Note: It never resets to owner to state
    OwnerPermanentDelegate {
        delegate: Pubkey,
        privilege: AssetPrivilege,
    },
}
impl AssetAuthorityVariantV1 {
    fn as_byte_vec(&self) -> Vec<Vec<u8>> {
        match self {
            AssetAuthorityVariantV1::Owner => {
                vec![vec![0]]
            }
            AssetAuthorityVariantV1::Renter {
                rent_time,
                fallback_owner,
                privilege,
            } => {
                vec![
                    vec![1],
                    rent_time.to_le_bytes().to_vec(),
                    fallback_owner.to_bytes().to_vec(),
                    privilege.as_byte(),
                ]
            }
            AssetAuthorityVariantV1::OwnerDelegate {
                time_lock,
                delegate,
                privilege,
            } => {
                let mut result = vec![vec![2], delegate.to_bytes().to_vec(), privilege.as_byte()];
                if let Some(lock) = time_lock {
                    result.insert(1, lock.to_le_bytes().to_vec());
                } else {
                    result.insert(1, vec![]);
                }
                result
            }
            AssetAuthorityVariantV1::OwnerPermanentDelegate {
                delegate,
                privilege,
            } => {
                vec![vec![3], delegate.to_bytes().to_vec(), privilege.as_byte()]
            }
        }
    }
}

#[derive(Clone, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize, Default)]
#[repr(u8)]
pub enum AssetStateV1 {
    #[default]
    Unlocked = 0,
    LockedByDelegate = 1,
    LockedByOwner = 2,
}
impl AssetStateV1 {
    fn as_byte_vec(&self) -> Vec<Vec<u8>> {
        match self {
            AssetStateV1::Unlocked => vec![vec![0]],
            AssetStateV1::LockedByDelegate => vec![vec![1]],
            AssetStateV1::LockedByOwner => vec![vec![2]],
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
#[repr(u8)]
pub enum AssetPrivilege {
    None = 0,
    All = 1,
    Transfer = 2,
    Burn = 3,
    Freeze = 4,
    FreezeAndTransfer = 5,
    Tbf = 6,                              // transfer, burn, freeze
    AssetMetadataPrivilegeAttributes = 7, // Only renter/delegate managed
    AllExceptBurn,
}

impl AssetPrivilege {
    fn as_u8(&self) -> u8 {
        match self {
            AssetPrivilege::None => 0,
            AssetPrivilege::All => 1,
            AssetPrivilege::Transfer => 2,
            AssetPrivilege::Burn => 3,
            AssetPrivilege::Freeze => 4,
            AssetPrivilege::FreezeAndTransfer => 5,
            AssetPrivilege::Tbf => 6,
            AssetPrivilege::AssetMetadataPrivilegeAttributes => 7,
            AssetPrivilege::AllExceptBurn => 8,
        }
    }

    fn as_byte(&self) -> Vec<u8> {
        vec![self.as_u8()]
    }
}
