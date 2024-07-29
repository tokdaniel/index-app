import { fetchTokenTransfers } from '@/lib/utils/api/alchemy'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

export const useTokenHistory = (...tokens: Address[]) => {
  const { address: user, chainId } = useAccount()

  const { data: tokenHistory } = useQuery({
    initialData: [],
    enabled: Boolean(user && chainId),
    queryKey: ['token-history'],
    queryFn: () => fetchTokenTransfers(user, tokens, chainId),
    select: (data) => data,
  })

  return tokenHistory
}
