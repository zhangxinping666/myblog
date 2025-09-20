// UI组件使用示例和测试
// 这个文件展示了如何使用我们创建的UI组件

import { Button } from './button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Input } from './input'
import { Label } from './label'
import { Textarea } from './textarea'
import { Separator } from './separator'
import { Skeleton } from './skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

// 这个文件主要用于验证所有组件的导入是否正确
// 实际使用时，这些组件将通过 @/components/ui 统一导入

export function UIComponentsExample() {
  return (
    <div className="p-8 space-y-8">
      {/* Button 示例 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Buttons</h2>
        <div className="flex gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">🚀</Button>
        </div>
      </div>

      <Separator />

      {/* Card 示例 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Cards</h2>
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the card content area.</p>
          </CardContent>
          <CardFooter>
            <Button>Action</Button>
          </CardFooter>
        </Card>
      </div>

      <Separator />

      {/* Form 示例 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Form Controls</h2>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" placeholder="Email" />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="message">Your message</Label>
          <Textarea placeholder="Type your message here." id="message" />
        </div>
      </div>

      <Separator />

      {/* Skeleton 示例 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Loading States</h2>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Interactive 组件示例 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Interactive Components</h2>
        
        {/* Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a tooltip</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}