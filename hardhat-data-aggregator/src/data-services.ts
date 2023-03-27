import { JsonRpcProvider, JsonRpcSigner } from "ethers";
import { Address } from "./hardhat-types";
import { PrismaClient, Account } from '@prisma/client'


export class DataServices {
	public readonly prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	getAddresses(signers: JsonRpcSigner[]): Address[] {
		const addresses: Address[] = [];
		for (var i = 0; i < signers.length; i++) {
			addresses.push(new Address(signers[i].address));
		}

		return addresses;
	}

	async createAccounts(addresses: Address[]): Promise<void> {
		const data = addresses.map(item => {
		    return { address: item.value };
		});

		try {
			await this.prisma.account.createMany({
		    	data: data
			});
		} catch (e: any) {
			throw (e);
		}
	}

	
}