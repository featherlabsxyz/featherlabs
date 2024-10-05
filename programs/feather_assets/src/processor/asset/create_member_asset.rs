use crate::*;

pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, CreateMemberAsset<'info>>,
    lrp: LightRootParams,
    group_derivation_key: Pubkey,
    asset_derivation_key: Pubkey,
    args: CreateAssetArgsV1,
) -> Result<()> {
    let remaining_accounts = ctx.remaining_accounts;
    let authority = ctx.accounts.authority.key();
    let address_merkle_context =
        unpack_address_merkle_context(lrp.address_merkle_context, ctx.remaining_accounts);
    let address_seed = derive_address_seed(&[group_derivation_key.to_bytes().as_ref()], &crate::ID);
    let group_address =
        Pubkey::new_from_array(derive_address(&address_seed, &address_merkle_context));
    msg!("Group Compressed Account: {:?}", group_address);
    let mut ctx: LightContext<CreateMemberAsset, LightCreateMemberAsset> = LightContext::new(
        ctx,
        lrp.inputs,
        lrp.merkle_context,
        lrp.merkle_tree_root_index,
        lrp.address_merkle_context,
        lrp.address_merkle_tree_root_index,
    )?;
    let inputs = &ParamsCreateMemberAsset {
        group_derivation_key,
        group_address,
        asset_derivation_key,
    };
    ctx.check_constraints(inputs)?;
    ctx.derive_address_seeds(lrp.address_merkle_context, inputs);
    let group = &mut ctx.light_accounts.group;
    let asset = &mut ctx.light_accounts.asset;
    let asset_address_param = &mut asset.new_address_params().unwrap();
    let mut output_compressed_accounts: Vec<OutputCompressedAccountWithPackedContext> = vec![];
    let mut new_address_params = vec![asset_address_param.clone()];
    let address_merkle_context =
        unpack_address_merkle_context(lrp.address_merkle_context, remaining_accounts);
    let asset_address = Pubkey::new_from_array(derive_address(
        &asset_address_param.seed,
        &address_merkle_context,
    ));
    let new_size = group
        .size
        .checked_add(1)
        .ok_or(FeatherErrorCode::MemberAssetOverflow)?;
    group.size = new_size;
    output_compressed_accounts.push(
        group
            .output_compressed_account(&crate::ID, remaining_accounts)?
            .ok_or(FeatherErrorCode::CustomError)?,
    );
    msg!("Asset Compressed Account: {:?}", asset_address);
    asset.owner = authority;
    asset.derivation_key = asset_derivation_key;
    asset.has_multisig = false;
    asset.asset_authority_state = AssetAuthorityVariantV1::Owner;
    asset.asset_state = AssetStateV1::Unlocked;
    asset.group_membership = Some(GroupMembership {
        group_key: group_address,
        member_number: new_size,
    });
    asset.rentable = args.rentable;
    asset.transferable = args.transferrable;
    match args.metadata {
        Some(metadata) => {
            asset.has_metadata = true;
            let mut acc: LightInitAccount<AssetDataV1> = LightInitAccount::new(
                &lrp.merkle_context,
                &lrp.address_merkle_context,
                lrp.address_merkle_tree_root_index,
            );
            let address_seed =
                derive_address_seed(&[ASSET_DATA_SEED, asset_address.as_ref()], &crate::ID);
            acc.set_address_seed(address_seed);
            new_address_params.push(acc.new_address_params());
            let address =
                Pubkey::new_from_array(derive_address(&address_seed, &address_merkle_context));
            if metadata.name.len() == 0 || metadata.uri.len() == 0 {
                return Err(FeatherErrorCode::EmptyValueError.into());
            }
            acc.asset_key = asset_address;
            acc.attributes = metadata.attributes;
            acc.mutable = metadata.mutable;
            acc.name = metadata.name;
            acc.uri = metadata.uri;
            acc.privilege_attributes = Vec::new();
            let compressed = acc.output_compressed_account(&crate::ID, remaining_accounts)?;
            output_compressed_accounts.push(compressed);
            msg!("Asset Metadata Compressed Account: {:?}", address);
        }
        None => asset.has_metadata = false,
    }
    match args.royalties_initializable {
        true => asset.royalty_state = RoyalyState::Unintialized,
        false => asset.royalty_state = RoyalyState::Disabled,
    }
    output_compressed_accounts.insert(
        1,
        asset
            .output_compressed_account(&crate::ID, remaining_accounts)?
            .unwrap(),
    );
    let bump = Pubkey::find_program_address(
        &[CPI_AUTHORITY_PDA_SEED],
        ctx.accounts.get_invoking_program().key,
    )
    .1;
    let signer_seeds = [CPI_AUTHORITY_PDA_SEED, &[bump]];
    let instruction = InstructionDataInvokeCpi {
        proof: Some(lrp.proof),
        new_address_params,
        relay_fee: None,
        input_compressed_accounts_with_merkle_context: ctx
            .light_accounts
            .input_accounts(remaining_accounts)?,
        output_compressed_accounts,
        compress_or_decompress_lamports: None,
        is_compress: false,
        cpi_context: None,
    };
    verify(&ctx, &instruction, &[signer_seeds.as_slice()])?;
    Ok(())
}
#[light_accounts]
#[instruction(group_derivation_key: Pubkey, group_address: Pubkey, asset_derivation_key: Pubkey)]
pub struct CreateMemberAsset<'info> {
    #[account(mut)]
    #[fee_payer]
    pub payer: Signer<'info>,
    pub group_authority: Signer<'info>,
    /// CHECK: this is safe
    pub authority: UncheckedAccount<'info>,
    #[self_program]
    pub self_program: Program<'info, crate::program::FeatherAssets>,
    /// CHECK: Checked in light-system-program.
    #[authority]
    pub cpi_signer: AccountInfo<'info>,
    #[light_account(mut, seeds = [group_derivation_key.to_bytes().as_ref()],
        constraint = group_authority.key() == group.owner @ FeatherErrorCode::InvalidGroupSigner
    )]
    pub group: LightAccount<GroupV1>,
    #[light_account(init, seeds = [asset_derivation_key.to_bytes().as_ref()])]
    pub asset: LightAccount<AssetV1>,
}

struct ParamsCreateMemberAsset {
    pub group_derivation_key: Pubkey,
    pub group_address: Pubkey,
    pub asset_derivation_key: Pubkey,
}
