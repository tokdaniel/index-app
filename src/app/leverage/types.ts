import { Token } from '@/constants/tokens'

import { TransactionReceipt } from 'viem'
import { LeverageType } from './provider'

export interface BaseTokenStats {
  symbol: string
  price: number
  change24h: number
  low24h: number
  high24h: number
}

export type EnrichedToken = Token & {
  balance: bigint
  usd?: number
  unitPriceUsd?: number
  size?: string
  leverageType?: LeverageType | null
}


export type EtherScanResponse = {
  message: string
  result: (TransactionReceipt & { timestamp: `${number}`})[]
}