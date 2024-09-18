export type FeatherAssets = {
  "version": "0.1.0",
  "name": "feather_assets",
  "constants": [
    {
      "name": "SEED",
      "type": "bytes",
      "value": "[102, 101, 97, 116, 104, 101, 114, 95, 97, 115, 115, 101, 116, 115]"
    }
  ],
  "instructions": [],
  "types": [
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
                "defined": "super::AttributeV1"
              }
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
                  "defined": "super::AttributeV1"
                }
              }
            }
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
            "name": "mutable",
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
            "type": "string"
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
      "name": "UpdateRoyaltyArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "basisPoints",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "creators",
            "type": {
              "option": {
                "vec": {
                  "defined": "CreatorArgsV1"
                }
              }
            }
          },
          {
            "name": "ruleset",
            "type": {
              "option": {
                "defined": "RuleSetV1"
              }
            }
          }
        ]
      }
    },
    {
      "name": "UpdateAssetMetadataArgsV1",
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
      "name": "AssetAuthorityVariantV1",
      "docs": [
        "Represents different states of ownership for an asset."
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Owner"
          },
          {
            "name": "Renter",
            "fields": [
              {
                "name": "rentTime",
                "type": "u32"
              },
              {
                "name": "fallbackOwner",
                "type": "publicKey"
              },
              {
                "name": "privilege",
                "type": {
                  "defined": "AssetPrivilege"
                }
              }
            ]
          },
          {
            "name": "OwnerDelegate",
            "fields": [
              {
                "name": "timeLock",
                "type": {
                  "option": "u32"
                }
              },
              {
                "name": "delegate",
                "type": "publicKey"
              },
              {
                "name": "privilege",
                "type": {
                  "defined": "AssetPrivilege"
                }
              }
            ]
          },
          {
            "name": "OwnerPermanentDelegate",
            "fields": [
              {
                "name": "delegate",
                "type": "publicKey"
              },
              {
                "name": "privilege",
                "type": {
                  "defined": "AssetPrivilege"
                }
              }
            ]
          }
        ]
      }
    },
    {
      "name": "AssetStateV1",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unlocked"
          },
          {
            "name": "LockedByDelegate"
          },
          {
            "name": "LockedByOwner"
          }
        ]
      }
    },
    {
      "name": "AssetPrivilege",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "All"
          },
          {
            "name": "Transfer"
          },
          {
            "name": "Burn"
          },
          {
            "name": "Freeze"
          },
          {
            "name": "FreezeAndTransfer"
          },
          {
            "name": "Tbf"
          },
          {
            "name": "AssetMetadataPrivilegeAttributes"
          },
          {
            "name": "AllExceptBurn"
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
    }
  ]
};

export const IDL: FeatherAssets = {
  "version": "0.1.0",
  "name": "feather_assets",
  "constants": [
    {
      "name": "SEED",
      "type": "bytes",
      "value": "[102, 101, 97, 116, 104, 101, 114, 95, 97, 115, 115, 101, 116, 115]"
    }
  ],
  "instructions": [],
  "types": [
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
                "defined": "super::AttributeV1"
              }
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
                  "defined": "super::AttributeV1"
                }
              }
            }
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
            "name": "mutable",
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
            "type": "string"
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
      "name": "UpdateRoyaltyArgsV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "basisPoints",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "creators",
            "type": {
              "option": {
                "vec": {
                  "defined": "CreatorArgsV1"
                }
              }
            }
          },
          {
            "name": "ruleset",
            "type": {
              "option": {
                "defined": "RuleSetV1"
              }
            }
          }
        ]
      }
    },
    {
      "name": "UpdateAssetMetadataArgsV1",
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
      "name": "AssetAuthorityVariantV1",
      "docs": [
        "Represents different states of ownership for an asset."
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Owner"
          },
          {
            "name": "Renter",
            "fields": [
              {
                "name": "rentTime",
                "type": "u32"
              },
              {
                "name": "fallbackOwner",
                "type": "publicKey"
              },
              {
                "name": "privilege",
                "type": {
                  "defined": "AssetPrivilege"
                }
              }
            ]
          },
          {
            "name": "OwnerDelegate",
            "fields": [
              {
                "name": "timeLock",
                "type": {
                  "option": "u32"
                }
              },
              {
                "name": "delegate",
                "type": "publicKey"
              },
              {
                "name": "privilege",
                "type": {
                  "defined": "AssetPrivilege"
                }
              }
            ]
          },
          {
            "name": "OwnerPermanentDelegate",
            "fields": [
              {
                "name": "delegate",
                "type": "publicKey"
              },
              {
                "name": "privilege",
                "type": {
                  "defined": "AssetPrivilege"
                }
              }
            ]
          }
        ]
      }
    },
    {
      "name": "AssetStateV1",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unlocked"
          },
          {
            "name": "LockedByDelegate"
          },
          {
            "name": "LockedByOwner"
          }
        ]
      }
    },
    {
      "name": "AssetPrivilege",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "All"
          },
          {
            "name": "Transfer"
          },
          {
            "name": "Burn"
          },
          {
            "name": "Freeze"
          },
          {
            "name": "FreezeAndTransfer"
          },
          {
            "name": "Tbf"
          },
          {
            "name": "AssetMetadataPrivilegeAttributes"
          },
          {
            "name": "AllExceptBurn"
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
    }
  ]
};
