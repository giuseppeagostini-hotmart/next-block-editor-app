'use client'

import { TiptapCollabProvider } from '@hocuspocus/provider'
import 'iframe-resizer/js/iframeResizer.contentWindow'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Doc as YDoc } from 'yjs'

import { BlockEditor } from '@/components/BlockEditor'

export interface AiState {
  isAiLoading: boolean
  aiError?: string | null
}

export default function Document({ params }: { params: { room: string } }) {
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null)
  const searchParams = useSearchParams()

  const hasCollab = parseInt(searchParams.get('noCollab') as string) !== 1

  const { room } = params

  const ydoc = useMemo(() => new YDoc(), [])

  return (
    <>
      <BlockEditor ydoc={ydoc} provider={provider} />
    </>
  )
}
