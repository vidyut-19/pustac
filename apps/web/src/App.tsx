import { useState } from 'preact/hooks'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Welcome to Pustac</h1>
        <p class="text-gray-600 mb-6">A modern document editor built with Preact and Tailwind CSS</p>
        
        <div class="text-center">
          <button 
            onClick={() => setCount(count + 1)}
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Count is {count}
          </button>
        </div>
      </div>
    </div>
  )
}
