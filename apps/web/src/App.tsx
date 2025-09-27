import { useState } from 'preact/hooks'
import { PustacEditor } from '@pustac/editor'

export function App() {
  const [showEditor, setShowEditor] = useState(false)

  if (showEditor) {
    return (
      <div class="min-h-screen bg-white">
        <PustacEditor />
      </div>
    )
  }

  return (
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Welcome to Pustac</h1>
        <p class="text-gray-600 mb-6">A stupid-fast, distraction-free, typesetting-obsessed document editor.</p>
        
        <div class="text-center">
          <button 
            onClick={() => setShowEditor(true)}
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded transition-colors w-full"
          >
            Start Writing
          </button>
        </div>
        
        <div class="mt-6 text-sm text-gray-500">
          <p class="mb-2">Try these shortcuts:</p>
          <ul class="text-left space-y-1">
            <li><code class="bg-gray-100 px-1 rounded">### Heading</code> → H3</li>
            <li><code class="bg-gray-100 px-1 rounded">&gt; Quote</code> → Blockquote</li>
            <li><code class="bg-gray-100 px-1 rounded">- Item</code> → Bullet list</li>
            <li><code class="bg-gray-100 px-1 rounded">1. Item</code> → Numbered list</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
