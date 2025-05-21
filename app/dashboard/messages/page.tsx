"use client"

import { useState } from "react"
import { MoreHorizontal, Search, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { messages } from "@/lib/mock-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Get unique contacts
  const contacts = Array.from(new Set([...messages.map((m) => m.sender), ...messages.map((m) => m.recipient)])).filter(
    (contact) => contact !== "Jane Smith",
  ) // Assuming current user is Jane Smith

  // Filter contacts based on search
  const filteredContacts = contacts.filter((contact) => contact.toLowerCase().includes(searchQuery.toLowerCase()))

  // Get messages for selected contact
  const contactMessages = selectedContact
    ? messages
        .filter((m) => m.sender === selectedContact || m.recipient === selectedContact)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : []

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return

    setIsLoading(true)

    // Simulate sending message
    setTimeout(() => {
      // In a real app, this would send the message to the server
      console.log(`Sending message to ${selectedContact}: ${newMessage}`)

      // Clear the input and loading state
      setNewMessage("")
      setIsLoading(false)
    }, 500)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-lg border">
      {/* Contacts sidebar */}
      <div className="w-64 border-r bg-gray-50 dark:bg-gray-900">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-auto h-[calc(100%-4rem)]">
          {filteredContacts.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No contacts found</div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedContact === contact ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <Avatar>
                  <AvatarFallback>{getInitials(contact)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{contact}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {messages.find((m) => m.sender === contact || m.recipient === contact)?.content.substring(0, 20)}...
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(selectedContact)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedContact}</div>
                  <div className="text-sm text-gray-500">Online</div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                  <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Block Contact</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {contactMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === "Jane Smith" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === "Jane Smith"
                        ? "bg-black text-white dark:bg-gray-700"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">{formatMessageTime(message.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  disabled={isLoading}
                />
                <Button
                  className="bg-black hover:bg-gray-800 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={handleSendMessage}
                  disabled={isLoading}
                >
                  {isLoading ? <Skeleton className="h-4 w-4 rounded-full" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Select a contact</h2>
              <p className="text-gray-500 mt-2">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
