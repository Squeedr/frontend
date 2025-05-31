"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useRole } from "@/hooks/use-role"
import { Mail, MessageSquare, Phone, HelpCircle, Search, Send, FileText, BookOpen, Headphones } from "lucide-react"

const faqData = [
  {
    category: "General",
    questions: [
      {
        question: "What is Squeedr?",
        answer: "Squeedr is an expert session platform that connects clients with experts for short-form booking sessions. It provides a seamless experience for booking, managing, and conducting expert sessions."
      },
      {
        question: "How do I get started?",
        answer: "To get started, create an account and complete your profile. Then, you can browse available experts, book sessions, and manage your bookings through the dashboard."
      },
      {
        question: "Is there a mobile app?",
        answer: "Currently, Squeedr is available as a web application. We're working on mobile apps for iOS and Android, which will be released soon."
      }
    ]
  },
  {
    category: "Booking",
    questions: [
      {
        question: "How do I book a session?",
        answer: "To book a session, navigate to the experts page, select an expert, choose an available time slot, and complete the booking process by providing your payment information."
      },
      {
        question: "Can I reschedule a session?",
        answer: "Yes, you can reschedule a session up to 24 hours before the scheduled time. Go to your dashboard, find the session, and click on the reschedule option."
      },
      {
        question: "What is the cancellation policy?",
        answer: "You can cancel a session up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours may be subject to a cancellation fee."
      }
    ]
  },
  {
    category: "Billing",
    questions: [
      {
        question: "How do I update my payment method?",
        answer: "To update your payment method, go to the Billing page in your dashboard, select 'Payment Methods', and click on 'Add Payment Method' or 'Edit' for an existing method."
      },
      {
        question: "When will I be charged?",
        answer: "You will be charged at the time of booking for the full session amount. For recurring sessions, you will be charged according to the billing cycle you selected."
      },
      {
        question: "How do I get a receipt?",
        answer: "Receipts are automatically generated and sent to your email after each session. You can also find all your receipts in the Billing section of your dashboard."
      }
    ]
  }
]

export default function SupportPage() {
  const { role } = useRole()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("faq")
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const filteredFaqs = faqData.flatMap(category =>
    category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setContactForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast({
        title: "Form incomplete",
        description: "Please fill in all fields before submitting.",
        variant: "destructive"
      })
      return
    }
    console.log("Form submitted:", contactForm)
    toast({
      title: "Message sent",
      description: "We'll get back to you as soon as possible.",
    })
    setContactForm({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Support</h1>
          <p className="text-gray-500">Get help with your account and services</p>
        </div>

        <Tabs defaultValue="faq" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search FAQs..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {searchQuery ? (
                  filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <h3 className="font-medium mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">No results found</h3>
                      <p className="text-gray-500">Try a different search term</p>
                    </div>
                  )
                ) : (
                  faqData.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
                      <div className="space-y-4">
                        {category.questions.map((faq, faqIndex) => (
                          <div key={faqIndex} className="border-b pb-4 last:border-0">
                            <h3 className="font-medium mb-2">{faq.question}</h3>
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get in touch with our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={contactForm.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is your question about?"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Please describe your issue in detail..."
                      rows={5}
                      value={contactForm.message}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button type="submit" className="w-full md:w-auto">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Email Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-gray-500" />
                    <span>support@squeedr.com</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">We'll respond within 24 hours</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-gray-500" />
                    <span>Available 9am-5pm EST</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Chat with our support team</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Phone Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-gray-500" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Mon-Fri, 9am-5pm EST</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Helpful Resources</CardTitle>
                <CardDescription>Guides, tutorials, and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 flex items-start">
                    <FileText className="h-6 w-6 mr-3 text-gray-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Getting Started Guide</h3>
                      <p className="text-sm text-gray-500 mt-1">Learn the basics of using Squeedr</p>
                      <Button variant="link" className="p-0 h-auto mt-2">Read Guide</Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 flex items-start">
                    <BookOpen className="h-6 w-6 mr-3 text-gray-500 mt-1" />
                    <div>
                      <h3 className="font-medium">User Manual</h3>
                      <p className="text-sm text-gray-500 mt-1">Comprehensive guide to all features</p>
                      <Button variant="link" className="p-0 h-auto mt-2">View Manual</Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 flex items-start">
                    <Headphones className="h-6 w-6 mr-3 text-gray-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Video Tutorials</h3>
                      <p className="text-sm text-gray-500 mt-1">Watch step-by-step tutorials</p>
                      <Button variant="link" className="p-0 h-auto mt-2">Watch Videos</Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 flex items-start">
                    <HelpCircle className="h-6 w-6 mr-3 text-gray-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Knowledge Base</h3>
                      <p className="text-sm text-gray-500 mt-1">Search our knowledge base</p>
                      <Button variant="link" className="p-0 h-auto mt-2">Browse Articles</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
