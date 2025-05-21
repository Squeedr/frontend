import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Search,
  Plus,
  FileImage,
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileCode,
  Clock,
  Download,
  Share2,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Access and manage your workspace documents and files.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search documents..." className="w-[200px] sm:w-[300px] pl-8" />
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared with me</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="all">All Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="shared" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sharedDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favoriteDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface Document {
  id: string
  name: string
  type: "pdf" | "doc" | "image" | "spreadsheet" | "code"
  size: string
  updatedAt: string
  owner: string
  shared?: boolean
  favorite?: boolean
}

function DocumentCard({ document }: { document: Document }) {
  const getIcon = (type: Document["type"]) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="h-10 w-10 text-red-500" />
      case "doc":
        return <FileText className="h-10 w-10 text-blue-500" />
      case "image":
        return <FileImage className="h-10 w-10 text-purple-500" />
      case "spreadsheet":
        return <FileSpreadsheet className="h-10 w-10 text-green-500" />
      case "code":
        return <FileCode className="h-10 w-10 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getIcon(document.type)}
            <div>
              <CardTitle className="text-base font-medium">{document.name}</CardTitle>
              <CardDescription className="text-xs">
                {document.size} • {document.type.toUpperCase()}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                {document.favorite ? (
                  <>
                    <span className="mr-2">★</span>
                    Remove from favorites
                  </>
                ) : (
                  <>
                    <span className="mr-2">☆</span>
                    Add to favorites
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="mr-1 h-3 w-3" />
          <span>Updated {document.updatedAt}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full justify-between items-center">
          <span className="text-xs text-gray-500">By {document.owner}</span>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            Open
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

const recentDocuments: Document[] = [
  {
    id: "1",
    name: "Project Proposal.pdf",
    type: "pdf",
    size: "2.4 MB",
    updatedAt: "Today, 10:30 AM",
    owner: "You",
    favorite: true,
  },
  {
    id: "2",
    name: "Meeting Notes.doc",
    type: "doc",
    size: "456 KB",
    updatedAt: "Yesterday",
    owner: "You",
  },
  {
    id: "3",
    name: "Budget Forecast.xlsx",
    type: "spreadsheet",
    size: "1.2 MB",
    updatedAt: "2 days ago",
    owner: "Sarah Johnson",
    shared: true,
  },
]

const sharedDocuments: Document[] = [
  {
    id: "3",
    name: "Budget Forecast.xlsx",
    type: "spreadsheet",
    size: "1.2 MB",
    updatedAt: "2 days ago",
    owner: "Sarah Johnson",
    shared: true,
  },
  {
    id: "4",
    name: "Marketing Strategy.doc",
    type: "doc",
    size: "890 KB",
    updatedAt: "1 week ago",
    owner: "Michael Chen",
    shared: true,
  },
  {
    id: "5",
    name: "Product Mockups.png",
    type: "image",
    size: "3.5 MB",
    updatedAt: "2 weeks ago",
    owner: "Emma Wilson",
    shared: true,
  },
]

const favoriteDocuments: Document[] = [
  {
    id: "1",
    name: "Project Proposal.pdf",
    type: "pdf",
    size: "2.4 MB",
    updatedAt: "Today, 10:30 AM",
    owner: "You",
    favorite: true,
  },
  {
    id: "6",
    name: "Client Contract.pdf",
    type: "pdf",
    size: "1.8 MB",
    updatedAt: "3 weeks ago",
    owner: "You",
    favorite: true,
  },
]

const allDocuments: Document[] = [
  ...recentDocuments,
  ...sharedDocuments.filter((doc) => !recentDocuments.some((rd) => rd.id === doc.id)),
  {
    id: "6",
    name: "Client Contract.pdf",
    type: "pdf",
    size: "1.8 MB",
    updatedAt: "3 weeks ago",
    owner: "You",
    favorite: true,
  },
  {
    id: "7",
    name: "API Documentation.js",
    type: "code",
    size: "340 KB",
    updatedAt: "1 month ago",
    owner: "Alex Rodriguez",
  },
  {
    id: "8",
    name: "Team Photo.jpg",
    type: "image",
    size: "5.2 MB",
    updatedAt: "1 month ago",
    owner: "You",
  },
]
