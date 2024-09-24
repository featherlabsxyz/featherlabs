use anchor_lang::prelude::*;

#[error_code]
pub enum FeatherErrorCode {
    #[msg("Custom error message")]
    CustomError,
    #[msg("Invalid Max Size, there are existing members")]
    InvalidMaxSize,
    #[msg("Unauthorized group signer")]
    InvalidGroupSigner,
    #[msg("No Update Inputs found")]
    ArgumentsNotFound,
}
