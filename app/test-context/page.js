'use client'

import { usePhotoSession } from '@/lib/context/PhotoSessionContext'
import Button from '@/components/ui/Button'
import { useState } from 'react'

export default function ContextTestPage() {
  const {
    settings,
    photos,
    retakeSlot,
    sessionStarted,
    startSession,
    addPhoto,
    isSessionComplete,
    getNextEmptySlot,
    setRetakeSlot,
    clearRetake,
    resetSession
  } = usePhotoSession()

  const [testResults, setTestResults] = useState([])

  const addTestResult = (test, passed) => {
    setTestResults(prev => [...prev, { test, passed, time: new Date().toLocaleTimeString() }])
  }

  const runTest1 = () => {
    startSession({ photoCount: 3, countdown: 5, mode: 'manual', method: 'per-foto', gesture: 'peace' })
    const passed = photos.length === 3 && photos.every(p => p.blob === null)
    addTestResult('Initialize 3 foto', passed)
  }

  const runTest2 = () => {
    startSession({ photoCount: 4, countdown: 3, mode: 'gesture', method: 'per-sesi', gesture: 'palm' })
    const passed = photos.length === 4 && photos.every(p => p.blob === null)
    addTestResult('Initialize 4 foto', passed)
  }

  const runTest3 = () => {
    const mockBlob = new Blob(['test'], { type: 'image/jpeg' })
    addPhoto(0, mockBlob)
    setTimeout(() => {
      const passed = photos[0].blob !== null && photos[1].blob === null
      addTestResult('Add photo slot 0', passed)
    }, 100)
  }

  const runTest4 = () => {
    const passed = isSessionComplete() === false
    addTestResult('isSessionComplete with empty slots', passed)
  }

  const runTest5 = () => {
    const mockBlob = new Blob(['test'], { type: 'image/jpeg' })
    addPhoto(0, mockBlob)
    addPhoto(1, mockBlob)
    setTimeout(() => {
      const nextSlot = getNextEmptySlot()
      const passed = nextSlot === 2
      addTestResult('getNextEmptySlot', passed)
    }, 100)
  }

  const runTest6 = () => {
    setRetakeSlot(2)
    setTimeout(() => {
      const passed = retakeSlot === 2
      addTestResult('setRetakeSlot', passed)
    }, 100)
  }

  const runTest7 = () => {
    clearRetake()
    setTimeout(() => {
      const passed = retakeSlot === null
      addTestResult('clearRetake', passed)
    }, 100)
  }

  const runAllTests = () => {
    setTestResults([])
    resetSession()
    setTimeout(() => runTest1(), 100)
    setTimeout(() => runTest2(), 200)
    setTimeout(() => runTest3(), 300)
    setTimeout(() => runTest4(), 400)
    setTimeout(() => runTest5(), 500)
    setTimeout(() => runTest6(), 600)
    setTimeout(() => runTest7(), 700)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Context Test Page</h1>

        {/* Current State */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="space-y-2 text-sm font-mono">
            <div><strong>sessionStarted:</strong> {sessionStarted.toString()}</div>
            <div><strong>photoCount:</strong> {settings.photoCount}</div>
            <div><strong>photos.length:</strong> {photos.length}</div>
            <div><strong>retakeSlot:</strong> {retakeSlot !== null ? retakeSlot : 'null'}</div>
            <div><strong>isSessionComplete:</strong> {isSessionComplete().toString()}</div>
            <div><strong>getNextEmptySlot:</strong> {getNextEmptySlot()}</div>
          </div>

          <div className="mt-4">
            <strong className="block mb-2">Photos Array:</strong>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
              {JSON.stringify(photos.map(p => ({
                slot: p.slot,
                hasBlob: p.blob !== null,
                timestamp: p.timestamp
              })), null, 2)}
            </pre>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Manual Tests</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button onClick={runTest1} variant="secondary" className="text-sm py-2">Test 1: Init 3</Button>
            <Button onClick={runTest2} variant="secondary" className="text-sm py-2">Test 2: Init 4</Button>
            <Button onClick={runTest3} variant="secondary" className="text-sm py-2">Test 3: Add Photo</Button>
            <Button onClick={runTest4} variant="secondary" className="text-sm py-2">Test 4: Complete</Button>
            <Button onClick={runTest5} variant="secondary" className="text-sm py-2">Test 5: Next Slot</Button>
            <Button onClick={runTest6} variant="secondary" className="text-sm py-2">Test 6: Retake</Button>
            <Button onClick={runTest7} variant="secondary" className="text-sm py-2">Test 7: Clear</Button>
            <Button onClick={resetSession} variant="danger" className="text-sm py-2">Reset</Button>
          </div>
          <div className="mt-4">
            <Button onClick={runAllTests} className="w-full">Run All Tests</Button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded ${
                    result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <span className="font-medium">{result.test}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{result.time}</span>
                    <span className={`font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {result.passed ? '✓ PASS' : '✗ FAIL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
