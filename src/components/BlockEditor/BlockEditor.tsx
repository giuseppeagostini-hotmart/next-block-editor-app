'use client'

import { EditorContent, PureEditorContent } from '@tiptap/react'
import { useMemo, useRef } from 'react'

import { LinkMenu } from '@/components/menus'

import { useBlockEditor } from '@/hooks/useBlockEditor'

import '@/styles/index.css'

import { Sidebar } from '@/components/Sidebar'
import { Loader } from '@/components/ui/Loader'
import { EditorContext } from '@/context/EditorContext'
import { useAIState } from '@/hooks/useAIState'
import { createPortal } from 'react-dom'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { TextMenu } from '../menus/TextMenu'
import { EditorHeader } from './components/EditorHeader'
import { TiptapProps } from './types'

export const BlockEditor = ({ aiToken, ydoc, provider }: TiptapProps) => {
  const aiState = useAIState()
  const menuContainerRef = useRef(null)
  const editorRef = useRef<PureEditorContent | null>(null)

  const { editor, users, characterCount, collabState, leftSidebar } = useBlockEditor({ aiToken, ydoc, provider })

  const displayedUsers = users.slice(0, 3)

  const providerValue = useMemo(() => {
    return {
      isAiLoading: aiState.isAiLoading,
      aiError: aiState.aiError,
      setIsAiLoading: aiState.setIsAiLoading,
      setAiError: aiState.setAiError,
    }
  }, [aiState])

  if (!editor) {
    return null
  }

  const aiLoaderPortal = createPortal(<Loader label="AI is now doing its job." />, document.body)

  return (
    <EditorContext.Provider value={providerValue}>
      <div className="flex h-full" ref={menuContainerRef}>
        <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
        <div className="relative flex flex-col flex-1 h-full overflow-hidden">
          <EditorHeader
            characters={characterCount.characters()}
            collabState={collabState}
            users={displayedUsers}
            words={characterCount.words()}
            isSidebarOpen={leftSidebar.isOpen}
            toggleSidebar={leftSidebar.toggle}
          />
          <EditorContent editor={editor} ref={editorRef} className="flex-1 overflow-y-auto" />
          <ContentItemMenu editor={editor} />
          <LinkMenu editor={editor} appendTo={menuContainerRef} />
          <TextMenu editor={editor} />
        </div>
      </div>
      {aiState.isAiLoading && aiLoaderPortal}
    </EditorContext.Provider>
  )
}

export default BlockEditor
