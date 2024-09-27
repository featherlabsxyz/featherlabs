//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! <https://github.com/kinobi-so/kinobi>
//!

use borsh::BorshDeserialize;
use borsh::BorshSerialize;
use crate::generated::types::LightRootParams;
use crate::generated::types::GroupMetadataArgsV1;

/// Accounts.
pub struct AddMetadataToGroup {
      
              
          pub authority: solana_program::pubkey::Pubkey,
          
              
          pub self_program: solana_program::pubkey::Pubkey,
          
              
          pub cpi_signer: solana_program::pubkey::Pubkey,
          
              
          pub light_system_program: solana_program::pubkey::Pubkey,
          
              
          pub system_program: solana_program::pubkey::Pubkey,
          
              
          pub account_compression_program: solana_program::pubkey::Pubkey,
          
              
          pub registered_program_pda: solana_program::pubkey::Pubkey,
          
              
          pub noop_program: solana_program::pubkey::Pubkey,
          
              
          pub account_compression_authority: solana_program::pubkey::Pubkey,
      }

impl AddMetadataToGroup {
  pub fn instruction(&self, args: AddMetadataToGroupInstructionArgs) -> solana_program::instruction::Instruction {
    self.instruction_with_remaining_accounts(args, &[])
  }
  #[allow(clippy::vec_init_then_push)]
  pub fn instruction_with_remaining_accounts(&self, args: AddMetadataToGroupInstructionArgs, remaining_accounts: &[solana_program::instruction::AccountMeta]) -> solana_program::instruction::Instruction {
    let mut accounts = Vec::with_capacity(9 + remaining_accounts.len());
                            accounts.push(solana_program::instruction::AccountMeta::new(
            self.authority,
            true
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.self_program,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.cpi_signer,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.light_system_program,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.system_program,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.account_compression_program,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.registered_program_pda,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.noop_program,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.account_compression_authority,
            false
          ));
                      accounts.extend_from_slice(remaining_accounts);
    let mut data = AddMetadataToGroupInstructionData::new().try_to_vec().unwrap();
          let mut args = args.try_to_vec().unwrap();
      data.append(&mut args);
    
    solana_program::instruction::Instruction {
      program_id: crate::FEATHER_ASSETS_ID,
      accounts,
      data,
    }
  }
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct AddMetadataToGroupInstructionData {
            discriminator: [u8; 8],
                        }

impl AddMetadataToGroupInstructionData {
  pub fn new() -> Self {
    Self {
                        discriminator: [228, 44, 139, 206, 143, 0, 147, 96],
                                                            }
  }
}

impl Default for AddMetadataToGroupInstructionData {
  fn default() -> Self {
    Self::new()
  }
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct AddMetadataToGroupInstructionArgs {
                  pub lrp: LightRootParams,
                pub group_seed: u64,
                pub args: GroupMetadataArgsV1,
      }


/// Instruction builder for `AddMetadataToGroup`.
///
/// ### Accounts:
///
                      ///   0. `[writable, signer]` authority
          ///   1. `[]` self_program
          ///   2. `[]` cpi_signer
          ///   3. `[]` light_system_program
                ///   4. `[optional]` system_program (default to `11111111111111111111111111111111`)
          ///   5. `[]` account_compression_program
          ///   6. `[]` registered_program_pda
          ///   7. `[]` noop_program
          ///   8. `[]` account_compression_authority
#[derive(Clone, Debug, Default)]
pub struct AddMetadataToGroupBuilder {
            authority: Option<solana_program::pubkey::Pubkey>,
                self_program: Option<solana_program::pubkey::Pubkey>,
                cpi_signer: Option<solana_program::pubkey::Pubkey>,
                light_system_program: Option<solana_program::pubkey::Pubkey>,
                system_program: Option<solana_program::pubkey::Pubkey>,
                account_compression_program: Option<solana_program::pubkey::Pubkey>,
                registered_program_pda: Option<solana_program::pubkey::Pubkey>,
                noop_program: Option<solana_program::pubkey::Pubkey>,
                account_compression_authority: Option<solana_program::pubkey::Pubkey>,
                        lrp: Option<LightRootParams>,
                group_seed: Option<u64>,
                args: Option<GroupMetadataArgsV1>,
        __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

impl AddMetadataToGroupBuilder {
  pub fn new() -> Self {
    Self::default()
  }
            #[inline(always)]
    pub fn authority(&mut self, authority: solana_program::pubkey::Pubkey) -> &mut Self {
                        self.authority = Some(authority);
                    self
    }
            #[inline(always)]
    pub fn self_program(&mut self, self_program: solana_program::pubkey::Pubkey) -> &mut Self {
                        self.self_program = Some(self_program);
                    self
    }
            #[inline(always)]
    pub fn cpi_signer(&mut self, cpi_signer: solana_program::pubkey::Pubkey) -> &mut Self {
                        self.cpi_signer = Some(cpi_signer);
                    self
    }
            #[inline(always)]
    pub fn light_system_program(&mut self, light_system_program: solana_program::pubkey::Pubkey) -> &mut Self {
                        self.light_system_program = Some(light_system_program);
                    self
    }
            /// `[optional account, default to '11111111111111111111111111111111']`
#[inline(always)]
    pub fn system_program(&mut self, system_program: solana_program::pubkey::Pubkey) -> &mut Self {
                        self.system_program = Some(system_program);
                    self
    }
            #[inline(always)]
    pub fn account_compression_program(&mut self, account_compression_program: solana_program::pubkey::Pubkey) -> &mut Self {
                        self.account_compression_program = Some(account_compression_program);
                    self
    }
            #[inline(always)]
    pub fn registered_program_pda(&mut self, registered_program_pda: solana_program::pubkey::Pubkey) -> &mut Self {
                        self.registered_program_pda = Some(registered_program_pda);
                    self
    }
            #[inline(always)]
    pub fn noop_program(&mut self, noop_program: solana_program::pubkey::Pubkey) -> &mut Self {
                        self.noop_program = Some(noop_program);
                    self
    }
            #[inline(always)]
    pub fn account_compression_authority(&mut self, account_compression_authority: solana_program::pubkey::Pubkey) -> &mut Self {
                        self.account_compression_authority = Some(account_compression_authority);
                    self
    }
                    #[inline(always)]
      pub fn lrp(&mut self, lrp: LightRootParams) -> &mut Self {
        self.lrp = Some(lrp);
        self
      }
                #[inline(always)]
      pub fn group_seed(&mut self, group_seed: u64) -> &mut Self {
        self.group_seed = Some(group_seed);
        self
      }
                #[inline(always)]
      pub fn args(&mut self, args: GroupMetadataArgsV1) -> &mut Self {
        self.args = Some(args);
        self
      }
        /// Add an aditional account to the instruction.
  #[inline(always)]
  pub fn add_remaining_account(&mut self, account: solana_program::instruction::AccountMeta) -> &mut Self {
    self.__remaining_accounts.push(account);
    self
  }
  /// Add additional accounts to the instruction.
  #[inline(always)]
  pub fn add_remaining_accounts(&mut self, accounts: &[solana_program::instruction::AccountMeta]) -> &mut Self {
    self.__remaining_accounts.extend_from_slice(accounts);
    self
  }
  #[allow(clippy::clone_on_copy)]
  pub fn instruction(&self) -> solana_program::instruction::Instruction {
    let accounts = AddMetadataToGroup {
                              authority: self.authority.expect("authority is not set"),
                                        self_program: self.self_program.expect("self_program is not set"),
                                        cpi_signer: self.cpi_signer.expect("cpi_signer is not set"),
                                        light_system_program: self.light_system_program.expect("light_system_program is not set"),
                                        system_program: self.system_program.unwrap_or(solana_program::pubkey!("11111111111111111111111111111111")),
                                        account_compression_program: self.account_compression_program.expect("account_compression_program is not set"),
                                        registered_program_pda: self.registered_program_pda.expect("registered_program_pda is not set"),
                                        noop_program: self.noop_program.expect("noop_program is not set"),
                                        account_compression_authority: self.account_compression_authority.expect("account_compression_authority is not set"),
                      };
          let args = AddMetadataToGroupInstructionArgs {
                                                              lrp: self.lrp.clone().expect("lrp is not set"),
                                                                  group_seed: self.group_seed.clone().expect("group_seed is not set"),
                                                                  args: self.args.clone().expect("args is not set"),
                                    };
    
    accounts.instruction_with_remaining_accounts(args, &self.__remaining_accounts)
  }
}

  /// `add_metadata_to_group` CPI accounts.
  pub struct AddMetadataToGroupCpiAccounts<'a, 'b> {
          
                    
              pub authority: &'b solana_program::account_info::AccountInfo<'a>,
                
                    
              pub self_program: &'b solana_program::account_info::AccountInfo<'a>,
                
                    
              pub cpi_signer: &'b solana_program::account_info::AccountInfo<'a>,
                
                    
              pub light_system_program: &'b solana_program::account_info::AccountInfo<'a>,
                
                    
              pub system_program: &'b solana_program::account_info::AccountInfo<'a>,
                
                    
              pub account_compression_program: &'b solana_program::account_info::AccountInfo<'a>,
                
                    
              pub registered_program_pda: &'b solana_program::account_info::AccountInfo<'a>,
                
                    
              pub noop_program: &'b solana_program::account_info::AccountInfo<'a>,
                
                    
              pub account_compression_authority: &'b solana_program::account_info::AccountInfo<'a>,
            }

/// `add_metadata_to_group` CPI instruction.
pub struct AddMetadataToGroupCpi<'a, 'b> {
  /// The program to invoke.
  pub __program: &'b solana_program::account_info::AccountInfo<'a>,
      
              
          pub authority: &'b solana_program::account_info::AccountInfo<'a>,
          
              
          pub self_program: &'b solana_program::account_info::AccountInfo<'a>,
          
              
          pub cpi_signer: &'b solana_program::account_info::AccountInfo<'a>,
          
              
          pub light_system_program: &'b solana_program::account_info::AccountInfo<'a>,
          
              
          pub system_program: &'b solana_program::account_info::AccountInfo<'a>,
          
              
          pub account_compression_program: &'b solana_program::account_info::AccountInfo<'a>,
          
              
          pub registered_program_pda: &'b solana_program::account_info::AccountInfo<'a>,
          
              
          pub noop_program: &'b solana_program::account_info::AccountInfo<'a>,
          
              
          pub account_compression_authority: &'b solana_program::account_info::AccountInfo<'a>,
            /// The arguments for the instruction.
    pub __args: AddMetadataToGroupInstructionArgs,
  }

impl<'a, 'b> AddMetadataToGroupCpi<'a, 'b> {
  pub fn new(
    program: &'b solana_program::account_info::AccountInfo<'a>,
          accounts: AddMetadataToGroupCpiAccounts<'a, 'b>,
              args: AddMetadataToGroupInstructionArgs,
      ) -> Self {
    Self {
      __program: program,
              authority: accounts.authority,
              self_program: accounts.self_program,
              cpi_signer: accounts.cpi_signer,
              light_system_program: accounts.light_system_program,
              system_program: accounts.system_program,
              account_compression_program: accounts.account_compression_program,
              registered_program_pda: accounts.registered_program_pda,
              noop_program: accounts.noop_program,
              account_compression_authority: accounts.account_compression_authority,
                    __args: args,
          }
  }
  #[inline(always)]
  pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
    self.invoke_signed_with_remaining_accounts(&[], &[])
  }
  #[inline(always)]
  pub fn invoke_with_remaining_accounts(&self, remaining_accounts: &[(&'b solana_program::account_info::AccountInfo<'a>, bool, bool)]) -> solana_program::entrypoint::ProgramResult {
    self.invoke_signed_with_remaining_accounts(&[], remaining_accounts)
  }
  #[inline(always)]
  pub fn invoke_signed(&self, signers_seeds: &[&[&[u8]]]) -> solana_program::entrypoint::ProgramResult {
    self.invoke_signed_with_remaining_accounts(signers_seeds, &[])
  }
  #[allow(clippy::clone_on_copy)]
  #[allow(clippy::vec_init_then_push)]
  pub fn invoke_signed_with_remaining_accounts(
    &self,
    signers_seeds: &[&[&[u8]]],
    remaining_accounts: &[(&'b solana_program::account_info::AccountInfo<'a>, bool, bool)]
  ) -> solana_program::entrypoint::ProgramResult {
    let mut accounts = Vec::with_capacity(9 + remaining_accounts.len());
                            accounts.push(solana_program::instruction::AccountMeta::new(
            *self.authority.key,
            true
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.self_program.key,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.cpi_signer.key,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.light_system_program.key,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.system_program.key,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.account_compression_program.key,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.registered_program_pda.key,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.noop_program.key,
            false
          ));
                                          accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.account_compression_authority.key,
            false
          ));
                      remaining_accounts.iter().for_each(|remaining_account| {
      accounts.push(solana_program::instruction::AccountMeta {
          pubkey: *remaining_account.0.key,
          is_signer: remaining_account.1,
          is_writable: remaining_account.2,
      })
    });
    let mut data = AddMetadataToGroupInstructionData::new().try_to_vec().unwrap();
          let mut args = self.__args.try_to_vec().unwrap();
      data.append(&mut args);
    
    let instruction = solana_program::instruction::Instruction {
      program_id: crate::FEATHER_ASSETS_ID,
      accounts,
      data,
    };
    let mut account_infos = Vec::with_capacity(9 + 1 + remaining_accounts.len());
    account_infos.push(self.__program.clone());
                  account_infos.push(self.authority.clone());
                        account_infos.push(self.self_program.clone());
                        account_infos.push(self.cpi_signer.clone());
                        account_infos.push(self.light_system_program.clone());
                        account_infos.push(self.system_program.clone());
                        account_infos.push(self.account_compression_program.clone());
                        account_infos.push(self.registered_program_pda.clone());
                        account_infos.push(self.noop_program.clone());
                        account_infos.push(self.account_compression_authority.clone());
              remaining_accounts.iter().for_each(|remaining_account| account_infos.push(remaining_account.0.clone()));

    if signers_seeds.is_empty() {
      solana_program::program::invoke(&instruction, &account_infos)
    } else {
      solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
    }
  }
}

/// Instruction builder for `AddMetadataToGroup` via CPI.
///
/// ### Accounts:
///
                      ///   0. `[writable, signer]` authority
          ///   1. `[]` self_program
          ///   2. `[]` cpi_signer
          ///   3. `[]` light_system_program
          ///   4. `[]` system_program
          ///   5. `[]` account_compression_program
          ///   6. `[]` registered_program_pda
          ///   7. `[]` noop_program
          ///   8. `[]` account_compression_authority
#[derive(Clone, Debug)]
pub struct AddMetadataToGroupCpiBuilder<'a, 'b> {
  instruction: Box<AddMetadataToGroupCpiBuilderInstruction<'a, 'b>>,
}

impl<'a, 'b> AddMetadataToGroupCpiBuilder<'a, 'b> {
  pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
    let instruction = Box::new(AddMetadataToGroupCpiBuilderInstruction {
      __program: program,
              authority: None,
              self_program: None,
              cpi_signer: None,
              light_system_program: None,
              system_program: None,
              account_compression_program: None,
              registered_program_pda: None,
              noop_program: None,
              account_compression_authority: None,
                                            lrp: None,
                                group_seed: None,
                                args: None,
                    __remaining_accounts: Vec::new(),
    });
    Self { instruction }
  }
      #[inline(always)]
    pub fn authority(&mut self, authority: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
                        self.instruction.authority = Some(authority);
                    self
    }
      #[inline(always)]
    pub fn self_program(&mut self, self_program: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
                        self.instruction.self_program = Some(self_program);
                    self
    }
      #[inline(always)]
    pub fn cpi_signer(&mut self, cpi_signer: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
                        self.instruction.cpi_signer = Some(cpi_signer);
                    self
    }
      #[inline(always)]
    pub fn light_system_program(&mut self, light_system_program: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
                        self.instruction.light_system_program = Some(light_system_program);
                    self
    }
      #[inline(always)]
    pub fn system_program(&mut self, system_program: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
                        self.instruction.system_program = Some(system_program);
                    self
    }
      #[inline(always)]
    pub fn account_compression_program(&mut self, account_compression_program: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
                        self.instruction.account_compression_program = Some(account_compression_program);
                    self
    }
      #[inline(always)]
    pub fn registered_program_pda(&mut self, registered_program_pda: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
                        self.instruction.registered_program_pda = Some(registered_program_pda);
                    self
    }
      #[inline(always)]
    pub fn noop_program(&mut self, noop_program: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
                        self.instruction.noop_program = Some(noop_program);
                    self
    }
      #[inline(always)]
    pub fn account_compression_authority(&mut self, account_compression_authority: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
                        self.instruction.account_compression_authority = Some(account_compression_authority);
                    self
    }
                    #[inline(always)]
      pub fn lrp(&mut self, lrp: LightRootParams) -> &mut Self {
        self.instruction.lrp = Some(lrp);
        self
      }
                #[inline(always)]
      pub fn group_seed(&mut self, group_seed: u64) -> &mut Self {
        self.instruction.group_seed = Some(group_seed);
        self
      }
                #[inline(always)]
      pub fn args(&mut self, args: GroupMetadataArgsV1) -> &mut Self {
        self.instruction.args = Some(args);
        self
      }
        /// Add an additional account to the instruction.
  #[inline(always)]
  pub fn add_remaining_account(&mut self, account: &'b solana_program::account_info::AccountInfo<'a>, is_writable: bool, is_signer: bool) -> &mut Self {
    self.instruction.__remaining_accounts.push((account, is_writable, is_signer));
    self
  }
  /// Add additional accounts to the instruction.
  ///
  /// Each account is represented by a tuple of the `AccountInfo`, a `bool` indicating whether the account is writable or not,
  /// and a `bool` indicating whether the account is a signer or not.
  #[inline(always)]
  pub fn add_remaining_accounts(&mut self, accounts: &[(&'b solana_program::account_info::AccountInfo<'a>, bool, bool)]) -> &mut Self {
    self.instruction.__remaining_accounts.extend_from_slice(accounts);
    self
  }
  #[inline(always)]
  pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
    self.invoke_signed(&[])
  }
  #[allow(clippy::clone_on_copy)]
  #[allow(clippy::vec_init_then_push)]
  pub fn invoke_signed(&self, signers_seeds: &[&[&[u8]]]) -> solana_program::entrypoint::ProgramResult {
          let args = AddMetadataToGroupInstructionArgs {
                                                              lrp: self.instruction.lrp.clone().expect("lrp is not set"),
                                                                  group_seed: self.instruction.group_seed.clone().expect("group_seed is not set"),
                                                                  args: self.instruction.args.clone().expect("args is not set"),
                                    };
        let instruction = AddMetadataToGroupCpi {
        __program: self.instruction.__program,
                  
          authority: self.instruction.authority.expect("authority is not set"),
                  
          self_program: self.instruction.self_program.expect("self_program is not set"),
                  
          cpi_signer: self.instruction.cpi_signer.expect("cpi_signer is not set"),
                  
          light_system_program: self.instruction.light_system_program.expect("light_system_program is not set"),
                  
          system_program: self.instruction.system_program.expect("system_program is not set"),
                  
          account_compression_program: self.instruction.account_compression_program.expect("account_compression_program is not set"),
                  
          registered_program_pda: self.instruction.registered_program_pda.expect("registered_program_pda is not set"),
                  
          noop_program: self.instruction.noop_program.expect("noop_program is not set"),
                  
          account_compression_authority: self.instruction.account_compression_authority.expect("account_compression_authority is not set"),
                          __args: args,
            };
    instruction.invoke_signed_with_remaining_accounts(signers_seeds, &self.instruction.__remaining_accounts)
  }
}

#[derive(Clone, Debug)]
struct AddMetadataToGroupCpiBuilderInstruction<'a, 'b> {
  __program: &'b solana_program::account_info::AccountInfo<'a>,
            authority: Option<&'b solana_program::account_info::AccountInfo<'a>>,
                self_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
                cpi_signer: Option<&'b solana_program::account_info::AccountInfo<'a>>,
                light_system_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
                system_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
                account_compression_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
                registered_program_pda: Option<&'b solana_program::account_info::AccountInfo<'a>>,
                noop_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
                account_compression_authority: Option<&'b solana_program::account_info::AccountInfo<'a>>,
                        lrp: Option<LightRootParams>,
                group_seed: Option<u64>,
                args: Option<GroupMetadataArgsV1>,
        /// Additional instruction accounts `(AccountInfo, is_writable, is_signer)`.
  __remaining_accounts: Vec<(&'b solana_program::account_info::AccountInfo<'a>, bool, bool)>,
}
