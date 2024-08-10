'use client'

import { useState, useRef, useEffect } from 'react'
import { Box, Button, TextField } from '@mui/material'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the BetaHub support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return // Don't send empty messages

    setMessage('')
    setIsLoading(true)
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-950 via-gray-600 to-slate-400">
      <div className="flex flex-col w-full max-w-lg h-[700px] border border-gray-300 shadow-2xl shadow-slate-600 rounded-3xl bg-gray-800 p-6">
        <div className="flex flex-col space-y-4 flex-grow overflow-auto max-h-full">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'assistant' ? 'justify-start' : 'justify-end'
              }`}
            >
              <Box
                className={`rounded-lg p-4 max-w-xs md:max-w-sm text-sm ${
                  message.role === 'assistant'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white text-black'
                }`}
              >
                {message.content}
              </Box>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex space-x-2 mt-6 ">
          <TextField className='text-white'
            label="Type your message..."
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            InputLabelProps={{
              style: { color: 'rgba(255, 255, 255, 0.9)' } // Brighter label color
            }}
            InputProps={{
              className: 'focus:ring-2 focus:ring-slate-200 rounded-full text-white',
              style: { color: 'rgba(255, 255, 255, 0.9)' }, // Brighter text color
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(189, 190, 244, 0.7)', // Bright border color
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(189, 190, 244, 1)', // Even brighter on focus
                },
                '&.Mui-disabled fieldset': {
                  borderColor: 'rgba(189, 190, 244, 0.3)', // Light border when disabled
                },
              },
            }}
          />
          <Button
            variant="contained"
            className={`rounded text-sm font-medium transition-colors duration-300 ${
              isLoading
                ? 'bg-indigo-300'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
            } text-white`}
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  )
}
