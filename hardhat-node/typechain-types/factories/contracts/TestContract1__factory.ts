/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  TestContract1,
  TestContract1Interface,
} from "../../contracts/TestContract1";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "ContractCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "to",
        type: "address",
      },
    ],
    name: "send",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "var1",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506127106000556040513081527fcf78cf0d6f3d8371e1075c69c492ab4ec5d8cf23a1a239b6a51a1d00be7ca3129060200160405180910390a160fe806100586000396000f3fe60806040526004361060265760003560e01c80633e58c58c14602b57806367e919b614603c575b600080fd5b603a6036366004609a565b6062565b005b348015604757600080fd5b50605060005481565b60405190815260200160405180910390f35b6040516001600160a01b038216903480156108fc02916000818181858888f193505050501580156096573d6000803e3d6000fd5b5050565b60006020828403121560ab57600080fd5b81356001600160a01b038116811460c157600080fd5b939250505056fea26469706673582212208e0e316e744c4c7a2cf4c61b7dc0e3bd11d435b69fc039c486fb526836ab840464736f6c63430008110033";

type TestContract1ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestContract1ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestContract1__factory extends ContractFactory {
  constructor(...args: TestContract1ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TestContract1> {
    return super.deploy(overrides || {}) as Promise<TestContract1>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestContract1 {
    return super.attach(address) as TestContract1;
  }
  override connect(signer: Signer): TestContract1__factory {
    return super.connect(signer) as TestContract1__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestContract1Interface {
    return new utils.Interface(_abi) as TestContract1Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestContract1 {
    return new Contract(address, _abi, signerOrProvider) as TestContract1;
  }
}
