import { Alchemy, AssetTransfersCategory, Network } from 'alchemy-sdk'
import { Address, zeroAddress } from 'viem'
import * as chains from 'viem/chains'

const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID

const AlchemyApi = {
  [chains.arbitrum.id]: new Alchemy({
    apiKey,
    network: Network.ARB_MAINNET,
  }),
  // [chains.mainnet.id]: new Alchemy({
  //   apiKey,
  //   network: Network.ETH_MAINNET,
  // }),
}

type SupportedChainId = keyof typeof AlchemyApi

const flashMintContract = '0xc6b3B4624941287bB7BdD8255302c1b337e42194'

export const fetchTokenTransfers = async (
  user?: Address,
  contractAddresses?: Address[],
  chainId?: number,
) => {
  if (
    !user ||
    !contractAddresses?.length ||
    !chainId ||
    chainId in AlchemyApi === false
  )
    return []

  const client = AlchemyApi[chainId as SupportedChainId]

  const transfers = (await Promise.all([
    client.core.getAssetTransfers({ // Closed positions
      contractAddresses,
      fromAddress: user,
      toAddress: flashMintContract,
      category: [AssetTransfersCategory.ERC20],
      withMetadata: true,
    }),
    client.core.getAssetTransfers({  // Opened positions
      contractAddresses,
      fromAddress: zeroAddress,
      toAddress: user,
      category: [AssetTransfersCategory.ERC20],
      withMetadata: true,
    }),
  ])).flatMap(({transfers}) => transfers)

  return transfers
}
