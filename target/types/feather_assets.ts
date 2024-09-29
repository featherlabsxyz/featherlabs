export type FeatherAssets = {
  "version": "0.1.0",
  "name": "feather_assets",
  "constants": [
    {
      "name": "ASSET_DATA_SEED",
      "type": "bytes",
      "value": "[97, 115, 115, 101, 116, 95, 100, 97, 116, 97]"
    },
    {
      "name": "ASSET_ROYALTY_SEED",
      "type": "bytes",
      "value": "[97, 115, 115, 101, 116, 95, 114, 111, 121, 97, 108, 116, 121]"
    },
    {
      "name": "GROUP_DATA_SEED",
      "type": "bytes",
      "value": "[103, 114, 111, 117, 112, 95, 100, 97, 116, 97]"
    },
    {
      "name": "SEED",
      "type": "bytes",
      "value": "[102, 101, 97, 116, 104, 101, 114, 95, 97, 115, 115, 101, 116, 115]"
    }
  ],
  "instructions": [
    {
      "name": "createGroup",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "derivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "CreateGroupArgsV1"
          }
        }
      ]
    },
    {
      "name": "updateGroupMaxSize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "derivationKey",
          "type": "publicKey"
        },
        {
          "name": "maxSize",
          "type": "u32"
        }
      ]
    },
    {
      "name": "addMetadataToGroup",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "derivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "GroupMetadataArgsV1"
          }
        }
      ]
    },
    {
      "name": "updateGroupMetadata",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "derivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "UpdateGroupMetadataArgsV1"
          }
        }
      ]
    },
    {
      "name": "transferGroupAuthority",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "derivationKey",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createAsset",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "derivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "CreateAssetArgsV1"
          }
        }
      ]
    },
    {
      "name": "createMemberAsset",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "groupAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "groupDerivationKey",
          "type": "publicKey"
        },
        {
          "name": "assetDerivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "CreateAssetArgsV1"
          }
        }
      ]
    },
    {
      "name": "addMetadataToAsset",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "assetDerivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "AssetMetadataArgsV1"
          }
        }
      ]
    },
    {
      "name": "addRoyaltiesToAsset",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "assetDerivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "RoyaltyArgsV1"
          }
        }
      ]
    }
  ],
  "types": [
    {
      "name": "CompressedProof",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "a",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "b",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "c",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "LightRootParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "inputs",
            "type": {
              "vec": "bytes"
            }
          },
          {
            "name": "proof",
            "type": {
              "defined": "CompressedProof"
            }
          },
          {
            "name": "merkleContext",
            "type": {
              "defined": "PackedMerkleContext"
            }
          },
          {
            "name": "merkleTreeRootIndex",
            "type": "u16"
          },
          {
            "name": "addressMerkleContext",
            "type": {
              "defined": "PackedAddressMerkleContext"
            }
          },
          {
            "name": "addressMerkleTreeRootIndex",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "AssetMetadataArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "mutable",
            "type": "bool"
          },
          {
            "name": "attributes",
            "type": {
              "vec": {
                "defined": "AttributeV1"
              }
            }
          }
        ]
      }
    },
    {
      "name": "AttributeV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": "string"
          },
          {
            "name": "value",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "CreateAssetArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "transferrable",
            "type": "bool"
          },
          {
            "name": "rentable",
            "type": "bool"
          },
          {
            "name": "metadata",
            "type": {
              "option": {
                "defined": "AssetMetadataArgsV1"
              }
            }
          },
          {
            "name": "royalty",
            "type": {
              "option": {
                "defined": "RoyaltyArgsV1"
              }
            }
          }
        ]
      }
    },
    {
      "name": "CreateGroupArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "maxSize",
            "type": "u32"
          },
          {
            "name": "metadata",
            "type": {
              "option": {
                "defined": "GroupMetadataArgsV1"
              }
            }
          }
        ]
      }
    },
    {
      "name": "GroupMetadataArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "mutable",
            "type": "bool"
          },
          {
            "name": "attributes",
            "type": {
              "vec": {
                "defined": "AttributeV1"
              }
            }
          }
        ]
      }
    },
    {
      "name": "RoyaltyArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "basisPoints",
            "type": "u8"
          },
          {
            "name": "creators",
            "type": {
              "vec": {
                "defined": "CreatorArgsV1"
              }
            }
          },
          {
            "name": "ruleset",
            "type": {
              "defined": "RuleSetV1"
            }
          }
        ]
      }
    },
    {
      "name": "UpdateGroupMetadataArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "uri",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "attributes",
            "type": {
              "option": {
                "vec": {
                  "defined": "AttributeV1"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "CreatorArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "publicKey"
          },
          {
            "name": "percentage",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "RuleSetV1",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "ProgramAllowList",
            "fields": [
              {
                "vec": "publicKey"
              }
            ]
          },
          {
            "name": "ProgramDenyList",
            "fields": [
              {
                "vec": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "PackedAddressMerkleContext",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "addressMerkleTreePubkeyIndex",
            "type": "u8"
          },
          {
            "name": "addressQueuePubkeyIndex",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "PackedMerkleContext",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merkleTreePubkeyIndex",
            "type": "u8"
          },
          {
            "name": "nullifierQueuePubkeyIndex",
            "type": "u8"
          },
          {
            "name": "leafIndex",
            "type": "u32"
          },
          {
            "name": "queueIndex",
            "docs": [
              "Index of leaf in queue. Placeholder of batched Merkle tree updates",
              "currently unimplemented."
            ],
            "type": {
              "option": {
                "defined": "QueueIndex"
              }
            }
          }
        ]
      }
    },
    {
      "name": "QueueIndex",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "queueId",
            "docs": [
              "Id of queue in queue account."
            ],
            "type": "u8"
          },
          {
            "name": "index",
            "docs": [
              "Index of compressed account hash in queue."
            ],
            "type": "u16"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CustomError",
      "msg": "Custom error message"
    },
    {
      "code": 6001,
      "name": "InvalidMaxSize",
      "msg": "Invalid Max Size, there are existing members"
    },
    {
      "code": 6002,
      "name": "InvalidGroupSigner",
      "msg": "Unauthorized group signer"
    },
    {
      "code": 6003,
      "name": "InvalidAssetSigner",
      "msg": "Unauthorized asset signer"
    },
    {
      "code": 6004,
      "name": "ArgumentsNotFound",
      "msg": "No Update Inputs found"
    },
    {
      "code": 6005,
      "name": "MemberAssetOverflow",
      "msg": "Max members reached"
    },
    {
      "code": 6006,
      "name": "MetadataAccountExistAlready",
      "msg": "Metadata Account Already Exist"
    },
    {
      "code": 6007,
      "name": "RoyaltyAccountExistAlready",
      "msg": "Royalty Account Already Exist"
    },
    {
      "code": 6008,
      "name": "GroupAccountNotFound",
      "msg": "Group Account Not Found"
    },
    {
      "code": 6009,
      "name": "CustomFailedToDeriveAssetSeed"
    }
  ]
};

export const IDL: FeatherAssets = {
  "version": "0.1.0",
  "name": "feather_assets",
  "constants": [
    {
      "name": "ASSET_DATA_SEED",
      "type": "bytes",
      "value": "[97, 115, 115, 101, 116, 95, 100, 97, 116, 97]"
    },
    {
      "name": "ASSET_ROYALTY_SEED",
      "type": "bytes",
      "value": "[97, 115, 115, 101, 116, 95, 114, 111, 121, 97, 108, 116, 121]"
    },
    {
      "name": "GROUP_DATA_SEED",
      "type": "bytes",
      "value": "[103, 114, 111, 117, 112, 95, 100, 97, 116, 97]"
    },
    {
      "name": "SEED",
      "type": "bytes",
      "value": "[102, 101, 97, 116, 104, 101, 114, 95, 97, 115, 115, 101, 116, 115]"
    }
  ],
  "instructions": [
    {
      "name": "createGroup",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "derivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "CreateGroupArgsV1"
          }
        }
      ]
    },
    {
      "name": "updateGroupMaxSize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "derivationKey",
          "type": "publicKey"
        },
        {
          "name": "maxSize",
          "type": "u32"
        }
      ]
    },
    {
      "name": "addMetadataToGroup",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "derivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "GroupMetadataArgsV1"
          }
        }
      ]
    },
    {
      "name": "updateGroupMetadata",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "derivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "UpdateGroupMetadataArgsV1"
          }
        }
      ]
    },
    {
      "name": "transferGroupAuthority",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "derivationKey",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createAsset",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "derivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "CreateAssetArgsV1"
          }
        }
      ]
    },
    {
      "name": "createMemberAsset",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "groupAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "groupDerivationKey",
          "type": "publicKey"
        },
        {
          "name": "assetDerivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "CreateAssetArgsV1"
          }
        }
      ]
    },
    {
      "name": "addMetadataToAsset",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "assetDerivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "AssetMetadataArgsV1"
          }
        }
      ]
    },
    {
      "name": "addRoyaltiesToAsset",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "selfProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cpiSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lightSystemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "registeredProgramPda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "noopProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accountCompressionAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lrp",
          "type": {
            "defined": "LightRootParams"
          }
        },
        {
          "name": "assetDerivationKey",
          "type": "publicKey"
        },
        {
          "name": "args",
          "type": {
            "defined": "RoyaltyArgsV1"
          }
        }
      ]
    }
  ],
  "types": [
    {
      "name": "CompressedProof",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "a",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "b",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "c",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "LightRootParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "inputs",
            "type": {
              "vec": "bytes"
            }
          },
          {
            "name": "proof",
            "type": {
              "defined": "CompressedProof"
            }
          },
          {
            "name": "merkleContext",
            "type": {
              "defined": "PackedMerkleContext"
            }
          },
          {
            "name": "merkleTreeRootIndex",
            "type": "u16"
          },
          {
            "name": "addressMerkleContext",
            "type": {
              "defined": "PackedAddressMerkleContext"
            }
          },
          {
            "name": "addressMerkleTreeRootIndex",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "AssetMetadataArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "mutable",
            "type": "bool"
          },
          {
            "name": "attributes",
            "type": {
              "vec": {
                "defined": "AttributeV1"
              }
            }
          }
        ]
      }
    },
    {
      "name": "AttributeV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": "string"
          },
          {
            "name": "value",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "CreateAssetArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "transferrable",
            "type": "bool"
          },
          {
            "name": "rentable",
            "type": "bool"
          },
          {
            "name": "metadata",
            "type": {
              "option": {
                "defined": "AssetMetadataArgsV1"
              }
            }
          },
          {
            "name": "royalty",
            "type": {
              "option": {
                "defined": "RoyaltyArgsV1"
              }
            }
          }
        ]
      }
    },
    {
      "name": "CreateGroupArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "maxSize",
            "type": "u32"
          },
          {
            "name": "metadata",
            "type": {
              "option": {
                "defined": "GroupMetadataArgsV1"
              }
            }
          }
        ]
      }
    },
    {
      "name": "GroupMetadataArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "mutable",
            "type": "bool"
          },
          {
            "name": "attributes",
            "type": {
              "vec": {
                "defined": "AttributeV1"
              }
            }
          }
        ]
      }
    },
    {
      "name": "RoyaltyArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "basisPoints",
            "type": "u8"
          },
          {
            "name": "creators",
            "type": {
              "vec": {
                "defined": "CreatorArgsV1"
              }
            }
          },
          {
            "name": "ruleset",
            "type": {
              "defined": "RuleSetV1"
            }
          }
        ]
      }
    },
    {
      "name": "UpdateGroupMetadataArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "uri",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "attributes",
            "type": {
              "option": {
                "vec": {
                  "defined": "AttributeV1"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "CreatorArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "publicKey"
          },
          {
            "name": "percentage",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "RuleSetV1",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "ProgramAllowList",
            "fields": [
              {
                "vec": "publicKey"
              }
            ]
          },
          {
            "name": "ProgramDenyList",
            "fields": [
              {
                "vec": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "PackedAddressMerkleContext",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "addressMerkleTreePubkeyIndex",
            "type": "u8"
          },
          {
            "name": "addressQueuePubkeyIndex",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "PackedMerkleContext",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merkleTreePubkeyIndex",
            "type": "u8"
          },
          {
            "name": "nullifierQueuePubkeyIndex",
            "type": "u8"
          },
          {
            "name": "leafIndex",
            "type": "u32"
          },
          {
            "name": "queueIndex",
            "docs": [
              "Index of leaf in queue. Placeholder of batched Merkle tree updates",
              "currently unimplemented."
            ],
            "type": {
              "option": {
                "defined": "QueueIndex"
              }
            }
          }
        ]
      }
    },
    {
      "name": "QueueIndex",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "queueId",
            "docs": [
              "Id of queue in queue account."
            ],
            "type": "u8"
          },
          {
            "name": "index",
            "docs": [
              "Index of compressed account hash in queue."
            ],
            "type": "u16"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CustomError",
      "msg": "Custom error message"
    },
    {
      "code": 6001,
      "name": "InvalidMaxSize",
      "msg": "Invalid Max Size, there are existing members"
    },
    {
      "code": 6002,
      "name": "InvalidGroupSigner",
      "msg": "Unauthorized group signer"
    },
    {
      "code": 6003,
      "name": "InvalidAssetSigner",
      "msg": "Unauthorized asset signer"
    },
    {
      "code": 6004,
      "name": "ArgumentsNotFound",
      "msg": "No Update Inputs found"
    },
    {
      "code": 6005,
      "name": "MemberAssetOverflow",
      "msg": "Max members reached"
    },
    {
      "code": 6006,
      "name": "MetadataAccountExistAlready",
      "msg": "Metadata Account Already Exist"
    },
    {
      "code": 6007,
      "name": "RoyaltyAccountExistAlready",
      "msg": "Royalty Account Already Exist"
    },
    {
      "code": 6008,
      "name": "GroupAccountNotFound",
      "msg": "Group Account Not Found"
    },
    {
      "code": 6009,
      "name": "CustomFailedToDeriveAssetSeed"
    }
  ]
};
