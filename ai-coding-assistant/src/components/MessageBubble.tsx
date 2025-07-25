"use client"

import { useState } from "react"
import { Bot, User, Copy, Check } from "lucide-react"
import type { Message } from "./AICodingAssistant"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const renderMessageContent = (content: string) => {
    // Simple code block detection and rendering
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <span key={lastIndex} className="whitespace-pre-wrap">
            {content.slice(lastIndex, match.index)}
          </span>,
        )
      }

      // Add code block
      parts.push(
        <div key={match.index} className="my-3 first:mt-0 last:mb-0">
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 text-xs text-gray-400">
              <span>{match[1] || "code"}</span>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-mono text-gray-300">{match[2]}</code>
            </pre>
          </div>
        </div>,
      )

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <span key={lastIndex} className="whitespace-pre-wrap">
          {content.slice(lastIndex)}
        </span>,
      )
    }

    return parts.length > 0 ? parts : <span className="whitespace-pre-wrap">{content}</span>
  }

  const isUser = message.role === "user"

  return (
    <div className={`flex items-start gap-3 group ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-blue-600" : "bg-gradient-to-br from-blue-500 to-purple-600"
        }`}
      >
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? "flex flex-col items-end" : ""}`}>
        <div
          className={`rounded-2xl p-4 ${
            isUser
              ? "bg-blue-600 text-white rounded-tr-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-sm"
          }`}
        >
          <div className="text-sm leading-relaxed font-mono">{renderMessageContent(message.content)}</div>
        </div>

        {/* Message Actions */}
        <div
          className={`flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
            isUser ? "flex-row-reverse" : ""
          }`}
        >
          <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(message.timestamp)}</span>
          <button
            onClick={copyToClipboard}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  )
}
