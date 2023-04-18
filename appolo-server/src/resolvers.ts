export const resolvers = {
  Query: {

    accounts: async (_: any, __: any, { dataSources }: any) => {
      return dataSources.prisma.account.findMany({
        where: {
          isContract: false
        }
      });
    },

    account: async (_: any, { address }: any, { dataSources }: any) => {
      const accounts = await dataSources.prisma.account.findMany({
          where: {
            AND: [
              { address: address },
              { isContract: false }
            ]
          }
      });
      return accounts[0];
    },

    contracts: async (_: any, { address }: any, { dataSources }: any) => {
      return dataSources.prisma.account.findMany({
        where: {
          isContract: true
        }
      });
    },

    contract: async (_: any, { address }: any, { dataSources }: any) => {
      const contracts = await dataSources.prisma.account.findMany({
          where: {
            AND: [
              { address: address },
              { isContract: true }
            ]
          }
      });

      if (contracts.length == 0) throw(new Error("CONTRACT_NOT_FOUND"))

      return contracts[0];
    },

    transactions: (_: any, __: any, { dataSources }: any) => {
      return dataSources.prisma.transaction.findMany({});
    },

    transaction: (_: any, { hash }: any, { dataSources }: any) => {
      return dataSources.prisma.transaction.findUnique({
        where: {
          hash: hash
        }
      });
    },

    blocks: (_: any, __: any, { dataSources }: any) => {
      return dataSources.prisma.block.findMany({});
    },

    block: (_: any, { number }: any, { dataSources }: any) => {
      return dataSources.prisma.block.findUnique({
        where: {
          number: number
        }
      });
    },

    abi: async (_: any, { address, cache }: any, { dataSources }: any) => {
      return JSON.stringify(await dataSources.abiServices.findABI(address, cache.toString()));
    },
  },

  Mutation: {
    importABIs: async (_: any, { addresses, names, abis }: any, { dataSources }: any) => {
      await dataSources.abiServices.importABIs(addresses, names, abis);
      return {
          status: "200"
      }
    },
  },

  RestResponse: {
   
  },

  Block: {},

  Account: {
    transactions: ({ address }: any, __: any, { dataSources }: any) => {
      return dataSources.prisma.transaction.findMany({
        where: {
          from: address
        }
      })
    }
  },

  Transaction: {
    transactionReceipt: ({ hash }: any, __: any, { dataSources }: any) => {
      return dataSources.prisma.transactionReceipt.findUnique({
        where: {
          hash: hash
        }
      })
    }
  },

  TransactionReceipt: {
    logs: ({ hash }: any, __: any, { dataSources }: any) => {
      return dataSources.prisma.log.findMany({
        where: {
          transactionHash: hash
        }
      })
    }
  },

  Log: {},


};

