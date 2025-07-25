"use client"

import { useState } from "react"
import { AppSidebar } from "./AppSidebar"
import { ChatArea } from "./ChatArea"

export interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  isActive?: boolean
}

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function AICodingAssistant() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "React Hooks Best Practices",
      lastMessage: "Here's how to optimize your useEffect...",
      timestamp: new Date(Date.now() - 3600000),
      isActive: true,
    },
    {
      id: "2",
      title: "TypeScript Generic Functions",
      lastMessage: "You can create reusable generic functions...",
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: "3",
      title: "API Error Handling",
      lastMessage: "For robust error handling, consider...",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: "4",
      title: "Database Query Optimization",
      lastMessage: "To improve query performance...",
      timestamp: new Date(Date.now() - 172800000),
    },
    {
      id: "5",
      title: "CSS Grid vs Flexbox",
      lastMessage: "Grid is better for 2D layouts while...",
      timestamp: new Date(Date.now() - 259200000),
    },
  ])

  const [activeConversationId, setActiveConversationId] = useState("1")

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI coding assistant. I can help you with programming questions, code reviews, debugging, architecture decisions, and more. What would you like to work on today?",
      role: "assistant",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      content:
        "I'm working on a React component and I'm having trouble with useEffect. It seems to be running infinitely. Can you help me debug this?",
      role: "user",
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: "3",
      content: `I'd be happy to help you debug the infinite useEffect issue! This is a common problem. Here are the most likely causes and solutions:

\`\`\`javascript
// ❌ Common mistake - missing dependency array
useEffect(() => {
  fetchData();
}); // This runs on every render!

// ❌ Another mistake - object/array in dependency
const [user, setUser] = useState({});
useEffect(() => {
  updateUser();
}, [user]); // Object reference changes every render

// ✅ Correct approaches
useEffect(() => {
  fetchData();
}, []); // Empty array = run once on mount

useEffect(() => {
  fetchData();
}, [userId]); // Only run when userId changes

// ✅ For objects, use specific properties
useEffect(() => {
  updateUser();
}, [user.id, user.name]); // Track specific properties
\`\`\`

Could you share your specific useEffect code? I can provide a more targeted solution.`,
      role: "assistant",
      timestamp: new Date(Date.now() - 3400000),
    },
  ])

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      lastMessage: "Start a new conversation...",
      timestamp: new Date(),
      isActive: true,
    }

    setConversations((prev) => [newConversation, ...prev.map((conv) => ({ ...conv, isActive: false }))])
    setActiveConversationId(newConversation.id)
    setMessages([
      {
        id: Date.now().toString(),
        content: "Hello! I'm your AI coding assistant. How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  const handleSelectConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) => ({
        ...conv,
        isActive: conv.id === conversationId,
      })),
    )
    setActiveConversationId(conversationId)
    setSidebarOpen(false) // Close sidebar on mobile after selection
  }

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your question. Let me help you with that...",
        "That's a great question! Here's how you can approach it...",
        "I can help you solve this problem. Let me break it down...",
      ]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AppSidebar
        conversations={conversations}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatArea
          messages={messages}
          onSendMessage={handleSendMessage}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
    </div>
  )
}
