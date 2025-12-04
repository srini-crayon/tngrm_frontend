"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Trash2 } from "lucide-react"

interface EnterpriseUser {
  id: string
  serialNo: string
  userName: string
  avatar: string
  email: string
  company: string
  contactNumber: string
  techStack: string[]
}

interface EnterpriseDetailsDrawerProps {
  user: EnterpriseUser
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EnterpriseDetailsDrawer({ user, open, onOpenChange }: EnterpriseDetailsDrawerProps) {
  const handleResetPassword = () => {
    // Handle password reset logic
    console.log("[v0] Reset password for user:", user.id)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto">
        <SheetHeader className="space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl">User Details</SheetTitle>
              <p className="text-sm text-muted-foreground">Account Information for the enterprise users</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={user.userName} readOnly className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} readOnly className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={user.company} readOnly className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number</Label>
            <Input id="contact" value={user.contactNumber} readOnly className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value="************" readOnly className="bg-gray-50" />
            <Button
              variant="link"
              className="h-auto p-0 text-sm text-blue-600 hover:text-blue-700"
              onClick={handleResetPassword}
            >
              Rest Password
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Tech Stack</Label>
            <div className="flex flex-wrap gap-2">
              {user.techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
