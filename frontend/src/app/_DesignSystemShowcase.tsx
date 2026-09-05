import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { useToast } from '@/components/ui/use-toast';

import { ErrorState } from '@/components/ux/ErrorState';
import { EmptyState } from '@/components/ux/EmptyState';
import { SuccessState } from '@/components/ux/SuccessState';
import { LoadingState } from '@/components/ux/LoadingState';
import { NotAuthorizedState } from '@/components/ux/NotAuthorizedState';

export const DesignSystemShowcase = () => {
  const themes = ['light', 'dark', 'tinted', 'monochrome'] as const;
  const [theme, setTheme] = useState<(typeof themes)[number]>('light');
  const { toast } = useToast();

  const cycleTheme = () => {
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    const newTheme = themes[nextIndex];
    setTheme(newTheme);
    document.documentElement.classList.remove('dark', 'tinted', 'monochrome');
    if (newTheme !== 'light') {
      document.documentElement.classList.add(newTheme);
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground p-8`}>
      <div className="max-w-7xl mx-auto space-y-16 pb-20">
        <header className="flex items-center justify-between pb-8 border-b">
          <div>
            <h1 className="text-4xl font-bold text-primary">GymOS Design System</h1>
            <p className="text-xl text-muted-foreground mt-2">
              Tokens, Typography, Components & States
            </p>
          </div>
          <Button onClick={cycleTheme} variant="outline">
            Toggle Theme ({theme})
          </Button>
        </header>

        <section className="space-y-8">
          <h2 className="text-3xl font-semibold border-b pb-2">Typography & Semantic Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary text-primary-foreground rounded-lg">Primary</div>
            <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">Secondary</div>
            <div className="p-4 bg-destructive text-destructive-foreground rounded-lg">
              Destructive
            </div>
            <div className="p-4 bg-muted text-muted-foreground rounded-lg">Muted</div>
            <div className="p-4 bg-success text-success-foreground rounded-lg">Success</div>
            <div className="p-4 bg-warning text-warning-foreground rounded-lg">Warning</div>
            <div className="p-4 bg-info text-info-foreground rounded-lg">Info</div>
            <div className="p-4 bg-card text-card-foreground border rounded-lg">Card View</div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-semibold border-b pb-2">Core Interactions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Buttons & Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Delete</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <div className="flex space-x-2 items-center pt-2">
                  <Button loading>Saving</Button>
                  <Button disabled>Disabled</Button>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Badge>Default Badge</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Error</Badge>
                  <Badge variant="outline">Status</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="dnd" />
                  <Label htmlFor="dnd">Do not disturb mode</Label>
                </div>
                <RadioGroup defaultValue="comfortable">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="r1" />
                    <Label htmlFor="r1">Default</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfortable" id="r2" />
                    <Label htmlFor="r2">Comfortable</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Layout & Discovery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4 items-center">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
                <Separator />
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Language preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Profile</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overlays & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col gap-4 items-start">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover Tooltip</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is a helper tooltip</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                      <DialogDescription>Make changes to your profile here.</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Open Alert</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Options Dropdown</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Open Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent>The content inside the popover.</PopoverContent>
                </Popover>

                <Button
                  onClick={() =>
                    toast({
                      title: 'Operation successful',
                      description: 'Your data was saved',
                      variant: 'success',
                    })
                  }
                >
                  Trigger Success Toast
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-semibold border-b pb-2">Collections</h2>
          <Tabs defaultValue="preview" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="p-4 border rounded-md mt-2">
              Visual preview space...
            </TabsContent>
            <TabsContent value="code" className="p-4 border rounded-md mt-2">
              Code display space...
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Data Presentation</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-semibold border-b pb-2">UX States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ErrorState
              message="Could not load the member data from the server."
              onRetry={() => {}}
            />
            <SuccessState
              title="Member Created!"
              message="A new member profile for John Doe has been successfully activated in the database."
            >
              <Button onClick={() => {}}>View Profile</Button>
            </SuccessState>
            <EmptyState
              title="No active subscriptions"
              description="You have no subscriptions configured this month. Start by selecting a plan."
            />
            <NotAuthorizedState onGoBack={() => {}} />
            <LoadingState text="Fetching heavy statistics module..." />
          </div>
        </section>
      </div>
    </div>
  );
};
