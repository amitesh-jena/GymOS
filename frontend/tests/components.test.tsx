import React from "react"
import { render, screen, fireEvent, renderHook, act } from "@testing-library/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

describe("Design System Components", () => {
  describe("Button", () => {
    it("renders correctly and responses to clicks", () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click Me</Button>)
      const button = screen.getByRole("button", { name: "Click Me" })
      expect(button).toBeInTheDocument()
      fireEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it("handles disabled and loading states", () => {
      render(
        <div>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      )
      expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled()
      expect(screen.getByRole("button", { name: "Loading" })).toBeDisabled()
    })
  })

  describe("Form Elements", () => {
    it("renders Input with appropriate label", () => {
      render(
        <div>
          <Label htmlFor="test-input">Username</Label>
          <Input id="test-input" placeholder="Enter username" />
        </div>
      )
      const input = screen.getByLabelText("Username")
      expect(input).toBeInTheDocument()
      fireEvent.change(input, { target: { value: "john_doe" } })
      expect(input).toHaveValue("john_doe")
    })

    it("renders Textarea with appropriate accessibility", () => {
      render(
        <div>
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" placeholder="Details" />
        </div>
      )
      const textarea = screen.getByLabelText("Description")
      expect(textarea).toBeInTheDocument()
    })

    it("renders Checkbox interaction", () => {
      render(
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms</Label>
        </div>
      )
      const checkbox = screen.getByRole("checkbox", { name: "Accept terms" })
      expect(checkbox).not.toBeChecked()
      fireEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })

    it("renders Switch interaction", () => {
      render(
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" aria-label="Airplane Mode" />
        </div>
      )
      const switchEl = screen.getByRole("switch", { name: "Airplane Mode" })
      expect(switchEl).not.toBeChecked()
      fireEvent.click(switchEl)
      expect(switchEl).toBeChecked()
    })
  })

  describe("Layout & Display", () => {
    it("renders Card layout block", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>My Card</CardTitle>
          </CardHeader>
          <CardContent>Content here</CardContent>
        </Card>
      )
      expect(screen.getByText("My Card")).toBeInTheDocument()
      expect(screen.getByText("Content here")).toBeInTheDocument()
    })

    it("renders Badge variants", () => {
      render(<Badge variant="destructive">Error</Badge>)
      expect(screen.getByText("Error")).toBeInTheDocument()
    })

    it("renders Avatar fallback", () => {
      render(
        <Avatar>
          <AvatarImage src="/broken.png" alt="User" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )
      expect(screen.getByText("CN")).toBeInTheDocument()
    })

    it("renders Separator with role", () => {
      render(<Separator decorative={false} />)
      expect(screen.getByRole("separator")).toBeInTheDocument()
    })

    it("renders Skeleton animation block", () => {
      const { container } = render(<Skeleton className="w-10 h-10" />)
      expect(container.firstChild).toHaveClass("animate-pulse")
    })
  })

  describe("Interactive Navigations", () => {
    it("renders Tabs system", () => {
      render(
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Account content</TabsContent>
          <TabsContent value="password">Password content</TabsContent>
        </Tabs>
      )
      expect(screen.getByRole("tab", { name: "Account" })).toBeInTheDocument()
      expect(screen.getByText("Account content")).toBeInTheDocument()
    })
  })

  describe("Overlays & Portals", () => {
    it("handles Dialog opening", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Modal</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>This action is irreversible.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      const trigger = screen.getByText("Open Modal")
      fireEvent.click(trigger)
      expect(screen.getByText("Are you sure?")).toBeInTheDocument()
      expect(screen.getByText("This action is irreversible.")).toBeInTheDocument()
    })
    
    it("handles Select opening", () => {
      render(
        <Select>
          <SelectTrigger aria-label="Choices">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      )
      const trigger = screen.getByRole("combobox", { name: "Choices" })
      expect(trigger).toBeInTheDocument()
    })
  })
})
