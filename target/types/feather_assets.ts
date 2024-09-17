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
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    }
  ],
  "types": [
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
      "name": "AssetOwnerVariantV1",
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
              "u32",
              "publicKey",
              {
                "defined": "AssetPrivilege"
              }
            ]
          },
          {
            "name": "OwnerDelegate",
            "fields": [
              {
                "option": "u32"
              },
              "publicKey",
              {
                "defined": "AssetPrivilege"
              }
            ]
          },
          {
            "name": "OwnerPermanentDelegate",
            "fields": [
              "publicKey",
              {
                "defined": "AssetPrivilege"
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
          },
          {
            "name": "Rented"
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
            "name": "MetadataPrivileges",
            "fields": [
              {
                "defined": "AssetDataDelegatePrivilegeV1"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "AssetDataDelegatePrivilegeV1",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "All"
          },
          {
            "name": "Uri"
          },
          {
            "name": "Attributes"
          },
          {
            "name": "PrivilegeAttributes"
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
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    }
  ],
  "types": [
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
      "name": "AssetOwnerVariantV1",
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
              "u32",
              "publicKey",
              {
                "defined": "AssetPrivilege"
              }
            ]
          },
          {
            "name": "OwnerDelegate",
            "fields": [
              {
                "option": "u32"
              },
              "publicKey",
              {
                "defined": "AssetPrivilege"
              }
            ]
          },
          {
            "name": "OwnerPermanentDelegate",
            "fields": [
              "publicKey",
              {
                "defined": "AssetPrivilege"
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
          },
          {
            "name": "Rented"
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
            "name": "MetadataPrivileges",
            "fields": [
              {
                "defined": "AssetDataDelegatePrivilegeV1"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "AssetDataDelegatePrivilegeV1",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "All"
          },
          {
            "name": "Uri"
          },
          {
            "name": "Attributes"
          },
          {
            "name": "PrivilegeAttributes"
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
