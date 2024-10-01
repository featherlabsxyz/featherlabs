use anchor_lang::prelude::*;

#[error_code]
pub enum FeatherErrorCode {
    #[msg("Custom error message")]
    CustomError,
    #[msg("Invalid Max Size, there are existing members")]
    InvalidMaxSize,
    #[msg("Unauthorized group signer")]
    InvalidGroupSigner,
    #[msg("Unauthorized asset signer")]
    InvalidAssetSigner,
    #[msg("No Update Inputs found")]
    ArgumentsNotFound,
    #[msg("Max members reached")]
    MemberAssetOverflow,
    #[msg("Metadata Account Already Exist")]
    MetadataAccountExistAlready,
    #[msg("Royalty Account Already Exist")]
    RoyaltyAccountExistAlready,
    #[msg("Group Account Not Found")]
    GroupAccountNotFound,
    #[msg("Sent Empty Values")]
    EmptyValueError,
    #[msg("Failed To Derive Asset Seed Custom")]
    CustomFailedToDeriveAssetSeed,
}
