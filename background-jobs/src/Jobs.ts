import { JsonRpcProvider, JsonRpcSigner, TransactionReceipt as Receipt, TransactionResponse, Block} from "ethers";
import { Address } from "./Address";
import { PrismaClientServices } from "./PrismaClientServices";
import { HardhatNodeServices, EnhancedBlock } from "./HardhatNodeServices";
import { Account, TransactionReceipt } from '@prisma/client';

// Summary:
// Import: hardhat raw data into db
// Transform: transform db data to UI friendly(aka. graphql)
export class ImportJob {
	public prismaClientServices: PrismaClientServices;
	public hardhatNodeServices: HardhatNodeServices;
	
	constructor(hardhatNodeServices: HardhatNodeServices, prismaClientServices: PrismaClientServices) {
		this.hardhatNodeServices = hardhatNodeServices;
		this.prismaClientServices = prismaClientServices;
	}

	getAddresses(signers: JsonRpcSigner[]): Address[] {
		const addresses: Address[] = [];
		for (var i = 0; i < signers.length; i++) {
			addresses.push(new Address(signers[i].address));
		}

		return addresses; 
	}
 
	async upsertAccounts(addresses: Address[], balances: bigint[], isContracts: boolean[]): Promise<void> {
		
		try {
			const accounts: Account[] = await this.prismaClientServices.prisma.account.findMany({});
			const accountsToCreate: Address[] = [];
			const balancesToCreate: string[] = [];
			const accountsToUpdate: Address[] = [];
			const balancesToUpdate: string[] = [];

			if (accounts.length == 0) {
				addresses.map((item) => {
					accountsToCreate.push(item);
				})
				balances.map((item) => {
					balancesToCreate.push(item.toString());
				})
			} 

			if (accounts.length > 0) {
				// find out creates
				addresses.map((a, i) => {
					let isExist: boolean = false;
					accounts.map((b) => {
						if ( a.equal(new Address(b.address)) ) {
							isExist = true;
						} 
					})

					if (!isExist) {
						accountsToCreate.push(a);
						balancesToCreate.push(balances[i].toString());
					}
				})

				// find out updates
				addresses.map((a, i) => {
					accounts.map((b) => {
						if ( a.equal(new Address(b.address)) && balances[i] != BigInt(b.balance) ) {
							accountsToUpdate.push(a);
							balancesToUpdate.push(balances[i].toString());
						}
					})
				})
			}
			
			// exec create
			if (accountsToCreate.length > 0) {
				await this.prismaClientServices.create.accounts(accountsToCreate, balancesToCreate, isContracts, false);
			}

			// exec update
			if (accountsToUpdate.length > 0) {
				accountsToUpdate.map(async (item, i) => {
					await this.prismaClientServices.update.account(item, balancesToUpdate[i]);
				})
			}
		} catch (e: any) {
			throw (e);
		}
	}

	async importJobExec(bn: bigint): Promise<void> {
		try {	

			// upsert accounts		
			const addresses: Address[] = this.getAddresses(
				await this.hardhatNodeServices.signers
			);

			await this.upsertAccounts(
				addresses,
				await this.hardhatNodeServices.getBalances(addresses),
				addresses.map(() => {
					return false;
				})
			)

			// create block, with transaction, with receipt, with log
			const enhancedBlock: EnhancedBlock = await this.hardhatNodeServices.getEnhancedBlock(bn);
			const data = {
				number: enhancedBlock.block.number.toString(),
				baseFeePerGas: (enhancedBlock.block.baseFeePerGas as bigint).toString(),
			  	difficulty: enhancedBlock.block.difficulty.toString(),
			  	extraData: enhancedBlock.block.extraData,
			  	gasLimit: enhancedBlock.block.gasLimit.toString(),
			  	gasUsed: enhancedBlock.block.gasUsed.toString(),
			  	hash: enhancedBlock.block.hash as string,
			  	miner: enhancedBlock.block.miner,
			  	nonce: enhancedBlock.block.nonce,
			  	parentHash: enhancedBlock.block.parentHash,
			  	timestamp: enhancedBlock.block.timestamp.toString(),
				transactions: {
					create: 
						enhancedBlock.transactions.map((item, i) => {
							return {
							  	chainId: item.chainId.toString(),
							 	data: item.data,
							  	from: item.from,
							  	gasLimit: item.gasLimit.toString(),
							  	gasPrice: item.gasPrice.toString(),
							  	maxFeePerGas: (item.maxFeePerGas as bigint).toString(),
							  	maxPriorityFeePerGas: (item.maxPriorityFeePerGas as bigint).toString(),
							  	nonce: item.nonce.toString(),
							  	to: item.to,
							  	type: item.type.toString(), 
							  	value: item.value.toString(),
							  	r: item.signature.r,
							  	s: item.signature.s,
							  	v: item.signature.v.toString(),
								transactionReceipt: {
									create: {
										hash: enhancedBlock.transactionReceipts[i].hash,
										blockHash: enhancedBlock.transactionReceipts[i].blockHash,
									  	blockNumber: enhancedBlock.transactionReceipts[i].blockNumber.toString(),
									  	contractAddress: enhancedBlock.transactionReceipts[i].contractAddress,
									  	cumulativeGasUsed: enhancedBlock.transactionReceipts[i].cumulativeGasUsed.toString(),
									  	from: enhancedBlock.transactionReceipts[i].from,
									  	gasPrice: enhancedBlock.transactionReceipts[i].gasPrice.toString(),
									  	gasUsed: enhancedBlock.transactionReceipts[i].gasUsed.toString(),
									  	index: enhancedBlock.transactionReceipts[i].index.toString(),
									  	logsBloom: enhancedBlock.transactionReceipts[i].logsBloom,
									  	status: (enhancedBlock.transactionReceipts[i].status as number).toString(),
									  	to: enhancedBlock.transactionReceipts[i].to,
										logs: {
											create:
												enhancedBlock.transactionReceipts[i].logs.map((_item) => {
													return {														
														index: _item.index.toString(),
														transactionIndex: _item.transactionIndex.toString(),
														blockHash: _item.blockHash,
													  	blockNumber: _item.blockNumber.toString(),
													  	address: _item.address,
													  	data: _item.data,
													  	topics: _item.topics as string[]
													}
												})
										}
									}
								}
							}
						})
				}
			}

			await this.prismaClientServices.prisma.block.create({
				data: data
			})
			
		} catch(e: any) {
			throw (e);
		}
	}

	async transformJobExec(bn: bigint): Promise<void> {
		try { 
			await this.createContracts(bn) 
		} catch (e: any) {
			throw (e);
		}
	}

	async createContracts(bn: bigint): Promise<void> {
		try {
			// load raw tx, tx receipt form db
			const contractAddresses: { contractAddress: string | null }[] = await this.prismaClientServices.prisma.transactionReceipt.findMany({
				where: {
					AND: [
						{ 
							blockNumber: { equals: bn.toString() } 
						}, 
						{ 
							contractAddress: { not: null } 
						},
						{ 
							contractAddress: { not: undefined } 
						}
					]
				},
				select: {
					contractAddress: true
				}
			})
			
			// save contract addresses into Account
			const addresses: Address[] = [];
			contractAddresses.map((item) => {
				 addresses.push(new Address(item.contractAddress as string));
			})

			await this.upsertAccounts(
				addresses,
				await this.hardhatNodeServices.getBalances(addresses),
				addresses.map(() => {
					return true;
				})
			)
		} catch (e: any) {
			throw (e)
		}
	}
}






