# CLAUDE.md - AI Assistant Development Guide

This document provides comprehensive guidance for AI assistants working on the partners-li PRM/CRM system. It includes codebase structure, development workflows, conventions, and best practices.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Development Workflows](#development-workflows)
5. [Database Architecture](#database-architecture)
6. [Code Conventions](#code-conventions)
7. [Common Tasks](#common-tasks)
8. [Testing & Quality](#testing--quality)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)
11. [Important Files Reference](#important-files-reference)
12. [AI Assistant Guidelines](#ai-assistant-guidelines)

---

## 🎯 Project Overview

### Purpose
**partners-li** is a comprehensive Partner Relationship Management (PRM/CRM) system designed to manage logistics, payment, and marketplace partners. It provides tools for partner management, CRM activities, health monitoring, strategic analysis, and reporting.

### Project Stats
- **Version:** 0.3.0
- **Lines of Code:** ~29,000 TypeScript/TSX lines
- **Components:** 40+ shadcn/ui components
- **Pages:** 16 application pages
- **Database Tables:** 12 main tables
- **Edge Functions:** 4 serverless functions

### Key Features
- Multi-category partner management (Payment, Marketplace, Logistics)
- Complete CRM system (contacts, activities, tasks, documents)
- Kanban pipeline with drag-and-drop
- Automated health scoring and alerts
- Strategic analysis (Gartner quadrants, Pareto analysis)
- Google Calendar integration
- Store management
- Monthly metrics tracking
- Legal/contract management
- Dark mode support
- Responsive design (mobile-first)

---

## 🛠️ Technology Stack

### Frontend Core
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety (strict mode disabled for rapid dev)
- **Vite 5.4.19** - Build tool with SWC plugin for fast refresh
- **React Router 6.30.1** - Client-side routing
- **TanStack React Query 5.83.0** - Server state management

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI primitives
- **Radix UI** - Accessible component primitives (40+ components used)
- **Lucide React** - Icon library
- **next-themes** - Dark mode support
- **Sonner** - Toast notifications
- **class-variance-authority + clsx + tailwind-merge** - Dynamic styling

### Forms & Validation
- **React Hook Form 7.61.1** - Form state management
- **Zod 3.25.76** - Runtime schema validation
- **@hookform/resolvers** - Integration between RHF and Zod

### Backend & Database
- **Supabase 2.76.1** - PostgreSQL BaaS
  - PostgreSQL 15
  - Row Level Security (RLS) enabled on all tables
  - Edge Functions (Deno runtime)
  - Auto-generated TypeScript types (1072 lines)
  - Realtime subscriptions support

### Additional Libraries
- **@dnd-kit** - Drag & drop for Kanban board
- **date-fns** - Date manipulation
- **Recharts** - Data visualization
- **ical.js** - Calendar parsing
- **googleapis** - Google Calendar OAuth integration
- **react-resizable-panels** - Resizable panel layouts

---

## 📁 Project Structure

### Overview
```
/home/user/partners-li/
├── src/                          # Source code (~29,000 lines)
│   ├── components/               # React components (organized by feature)
│   │   ├── admin/               # Admin panel components
│   │   ├── dashboard/           # Dashboard widgets
│   │   ├── expectations/        # Expectations/milestones module
│   │   ├── layout/              # Layout components (Sidebar, MobileMenu)
│   │   ├── partners/            # Partner management (22 components)
│   │   │   ├── PartnerForm/    # Multi-section form components
│   │   │   └── DetailTabs/     # Tabbed detail views
│   │   ├── payment-methods/     # Payment method components
│   │   ├── pipeline/            # Kanban pipeline
│   │   ├── reports/             # Reporting components
│   │   ├── settings/            # Settings UI
│   │   ├── stores/              # Store management
│   │   ├── strategic/           # Strategic analysis tools
│   │   └── ui/                  # shadcn/ui components (40+ files, 4035 lines)
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.tsx     # Supabase authentication
│   │   └── BlurContext.tsx     # Sensitive data blur toggle
│   ├── hooks/                   # Custom React hooks (5 hooks)
│   ├── integrations/
│   │   └── supabase/            # Supabase client & types
│   │       ├── client.ts       # Initialized Supabase client
│   │       └── types.ts        # Auto-generated database types (1072 lines)
│   ├── lib/                     # Utility libraries (18 files)
│   │   ├── db.ts               # Database CRUD operations (31KB, 900+ lines)
│   │   ├── partner-schema.ts   # Zod validation schemas
│   │   ├── payment-method-schema.ts
│   │   ├── contracts.ts        # Contract management
│   │   ├── google-calendar-*.ts # Calendar integrations
│   │   ├── storage.ts          # Supabase Storage utilities
│   │   ├── strategic-analysis.ts # Pareto, Gartner quadrants
│   │   └── seed*.ts            # Database seeding scripts
│   ├── pages/                   # Route pages (16 pages)
│   ├── types/                   # TypeScript definitions (9 files)
│   ├── data/                    # Seed data
│   ├── App.tsx                  # Root component with routing
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles & CSS variables
├── supabase/                    # Backend configuration
│   ├── config.toml             # Supabase project config
│   ├── migrations/             # Database migrations (15 files)
│   └── functions/              # Edge Functions (4 functions)
│       ├── calculate-health-scores/
│       ├── fetch-calendar/
│       ├── google-oauth-token/
│       └── google-oauth-refresh/
├── public/                      # Static assets
├── Configuration Files
│   ├── vite.config.ts          # Vite bundler config
│   ├── tailwind.config.ts      # Tailwind customization
│   ├── tsconfig.json           # TypeScript config
│   ├── components.json         # shadcn/ui config
│   ├── eslint.config.js        # ESLint rules
│   └── package.json
└── Documentation (20 MD files)
```

### Key Directories

#### `/src/components/`
Feature-based component organization. Each feature has its own directory with related components.

**Pattern:** Complex features are split into subdirectories:
- `ComponentForm/` - Form sections (e.g., `IdentificationSection.tsx`, `PrioritySection.tsx`)
- `ComponentDetailTabs/` - Tab views (e.g., `ContactsTab.tsx`, `HealthTab.tsx`)
- `shared/` - Reusable sub-components

#### `/src/lib/`
Business logic and utility functions. **CRITICAL FILES:**

- **`db.ts`** (31KB, 900+ lines) - Complete database abstraction layer
  - All CRUD operations for partners, contacts, activities, tasks, documents
  - Health metrics operations
  - Alert management
  - Type-safe functions with proper error handling
  - **ALWAYS use functions from this file instead of direct Supabase queries**

- **`partner-schema.ts`** - Zod validation schemas for partner forms
- **`payment-method-schema.ts`** - Zod schemas for payment methods
- **`strategic-analysis.ts`** - Pareto analysis, Gartner quadrant calculations
- **`storage.ts`** - Supabase Storage bucket operations

#### `/src/types/`
TypeScript type definitions. Key files:
- `partner.ts` - Partner data models
- `payment-method.ts` - Payment method types
- `crm.ts` - CRM entities (contacts, activities, tasks)
- `expectations.ts` - Milestone/expectations types
- `field-config.ts` - Dynamic field configurations

#### `/src/pages/`
Route components. All routes except `/auth` are protected by `<ProtectedRoute>`.

#### `/supabase/migrations/`
Database schema migrations (15 files). **Do not modify directly** - create new migrations instead.

---

## 🔧 Development Workflows

### Local Development Setup

```bash
# Install dependencies
npm install

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables
Located in `.env` (auto-generated by Lovable Cloud):
```
VITE_SUPABASE_PROJECT_ID=jekodgwqmhskmshtvmfh
VITE_SUPABASE_URL=https://jekodgwqmhskmshtvmfh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<key>
```

### Development Server
- **URL:** `http://localhost:8080`
- **Hot Reload:** Enabled via Vite + SWC
- **Component Tagging:** Enabled in dev mode via lovable-tagger plugin

### Path Aliases
TypeScript and Vite are configured with path alias:
```typescript
"@/*" → "./src/*"
```

**Example:**
```typescript
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
```

---

## 🗄️ Database Architecture

### Database Provider
**Supabase** (PostgreSQL 15) hosted on Lovable Cloud
- **Project ID:** `jekodgwqmhskmshtvmfh`
- **Region:** Auto-selected

### Core Tables

#### 1. **partners** (Main partner data)
- Stores payment, marketplace, and logistics partners
- Uses JSONB `data` column for flexible, type-specific fields
- Fields: `id`, `user_id`, `name`, `type`, `data`, `is_important`, `priority_rank`, `pareto_focus`
- Triggers: Auto-updates `updated_at`
- **IMPORTANT:** `type` field must be one of: `"payment"`, `"marketplace"`, `"logistic"`

#### 2. **partner_contacts** (Contact persons)
- Linked to partners via `partner_id`
- Fields: `name`, `role`, `email`, `phone`, `is_primary`, `notes`
- One contact can be marked as primary per partner

#### 3. **partner_activities** (CRM timeline)
- Records meetings, calls, emails
- Fields: `activity_type` (enum), `status` (enum), `title`, `scheduled_date`, `completed_date`, `participants` (JSONB)
- **Participants structure:**
  ```json
  [{"name": "João Silva", "role": "CEO", "contact_id": "uuid"}]
  ```

#### 4. **partner_tasks** (Task management)
- Linked to partners and optionally to activities
- Fields: `title`, `description`, `priority` (enum), `status` (enum), `due_date`, `assigned_to`
- Can be assigned to other users

#### 5. **partner_documents** (File metadata)
- Stores metadata only (files in Supabase Storage)
- Fields: `file_name`, `file_type`, `file_size`, `storage_path`, `document_type`

#### 6. **partner_health_metrics** (Calculated scores)
- One record per partner (1:1 relationship)
- Auto-calculated by Edge Function
- Fields: `overall_score`, `health_status`, `performance_score`, `engagement_score`, `commercial_score`
- **Health Status:** `excellent` (≥80), `good` (≥60), `warning` (≥40), `critical` (<40)

#### 7. **partner_monthly_metrics** (Financial tracking)
- Monthly GMV and rebate tracking per partner
- Used for Pareto (80/20) analysis
- Fields: `year`, `month`, `gmv_share`, `rebate_share`, `gmv_amount`, `rebate_amount`
- **Unique constraint:** `(partner_id, user_id, year, month)`

#### 8. **partner_alerts** (Automated alerts)
- System-generated alerts based on metrics
- Fields: `alert_type`, `severity`, `title`, `message`, `is_read`, `is_resolved`
- Alert types: `no_contact`, `high_priority_issues`, `health_critical`, `low_engagement`

#### 9. **expectation_milestones** (Strategic planning)
- Quarterly/annual planning milestones
- Fields: `quarter`, `year`, `milestone_type`, `description`, `status`, `target_date`

#### 10. **stores** (Store management)
- Physical, online, or hybrid stores
- Links to partners via array fields: `logistic_partners`, `payment_partners`, `marketplace_partners`
- JSONB fields: `address`, `business_hours`, `contact_info`, `metrics`

#### 11. **field_configs** (Dynamic fields)
- User-specific field customizations
- Allows runtime field configuration without code changes

#### 12. **user_roles** (RBAC)
- User role management: `admin`, `moderator`, `user`
- Used for permission checks via `has_role()` function

### Database ENUMs
```sql
-- Application roles
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');

-- Activity types
CREATE TYPE activity_type AS ENUM ('meeting', 'call', 'email', 'task', 'note');
CREATE TYPE activity_status AS ENUM ('scheduled', 'completed', 'cancelled', 'pending');

-- Task types
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done', 'cancelled');

-- Health status
CREATE TYPE health_status AS ENUM ('excellent', 'good', 'warning', 'critical');

-- Store types
CREATE TYPE store_type AS ENUM ('physical', 'online', 'hybrid');
CREATE TYPE store_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
```

### Row Level Security (RLS)

**ALL tables have RLS enabled.** Key policies:

1. **Standard pattern for most tables:**
   - Users can SELECT/INSERT/UPDATE/DELETE their own data (`user_id = auth.uid()`)
   - Admins can do everything (`has_role(auth.uid(), 'admin')`)

2. **Special case - partner_tasks:**
   - Users can view tasks they created OR tasks assigned to them
   - Users can update tasks they created OR tasks assigned to them
   - Only creators can delete tasks

### Database Operations

**ALWAYS use functions from `/src/lib/db.ts` instead of direct Supabase queries.**

Example operations available in `db.ts`:
```typescript
// Partners
getPartners(userId: string, filters?: PartnerFilters)
getPartnerById(id: string)
createPartner(partner: PartnerData)
updatePartner(id: string, updates: Partial<PartnerData>)
deletePartner(id: string)

// Contacts
getPartnerContacts(partnerId: string)
createContact(contact: ContactData)
updateContact(id: string, updates: Partial<ContactData>)
deleteContact(id: string)

// Activities
getPartnerActivities(partnerId: string)
createActivity(activity: ActivityData)
updateActivity(id: string, updates: Partial<ActivityData>)
deleteActivity(id: string)

// Tasks
getPartnerTasks(partnerId: string)
createTask(task: TaskData)
updateTask(id: string, updates: Partial<TaskData>)
deleteTask(id: string)

// Health Metrics
getHealthMetrics(partnerId: string)
calculateHealthScores() // Invokes Edge Function

// Alerts
getActiveAlerts(userId: string)
markAlertAsRead(id: string)
resolveAlert(id: string)

// Documents
uploadDocument(file: File, partnerId: string, metadata: DocumentMetadata)
deleteDocument(id: string, storagePath: string)
```

### Edge Functions

#### 1. **calculate-health-scores**
- **Path:** `/functions/v1/calculate-health-scores`
- **Method:** POST
- **Auth:** Required
- **Purpose:** Calculates health scores for all user's partners and generates alerts
- **Invocation:**
  ```typescript
  const { data, error } = await supabase.functions.invoke('calculate-health-scores')
  ```

#### 2. **fetch-calendar**
- **Purpose:** Fetches Google Calendar events via iCal link
- Integration with Google Calendar

#### 3. **google-oauth-token**
- **Purpose:** Exchanges OAuth code for access token
- Part of Google Calendar OAuth flow

#### 4. **google-oauth-refresh**
- **Purpose:** Refreshes expired OAuth tokens
- Automatic token refresh handling

---

## 📝 Code Conventions

### General Style
- **No semicolons** (implicit)
- **Functional components** only (no class components)
- **Async/await** over `.then()` chains
- **Early returns** for guard clauses
- **Destructuring** for props and objects

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `PartnerDetailView.tsx` |
| Component Files | PascalCase.tsx | `ContactsTab.tsx` |
| Utilities/Hooks | kebab-case files, camelCase exports | `use-toast.ts` exports `useToast()` |
| Database Tables | snake_case | `partner_contacts` |
| Database Columns | snake_case | `created_at`, `is_primary` |
| Types/Interfaces | PascalCase | `PartnerData`, `ContactInfo` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| CSS Classes | kebab-case | `.sensitive-data` |

### TypeScript

**Strict mode is DISABLED** for rapid development:
```json
{
  "noImplicitAny": false,
  "strictNullChecks": false,
  "noUnusedLocals": false,
  "noUnusedParameters": false
}
```

**Implications:**
- Type annotations are optional but encouraged
- Null/undefined checks are not enforced by compiler
- Watch for potential runtime errors

**Best Practices:**
- Use explicit types for function parameters and returns
- Leverage auto-generated Supabase types from `@/integrations/supabase/types`
- Define interfaces for complex data structures

### Component Structure

**Standard React component pattern:**
```typescript
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"

interface ComponentProps {
  title: string
  onSave?: (data: SomeType) => void
}

export const Component = ({ title, onSave }: ComponentProps) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Logic here
      onSave?.(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h2>{title}</h2>
      <Button onClick={handleSubmit} disabled={loading}>
        Save
      </Button>
    </div>
  )
}
```

### Form Patterns

**React Hook Form + Zod:**
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
})

type FormData = z.infer<typeof formSchema>

export const MyForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    // Submit logic
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### State Management Patterns

#### Server State (Supabase data)
**ALWAYS use React Query:**
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getPartners, createPartner } from "@/lib/db"

// Query
const { data: partners, isLoading, error } = useQuery({
  queryKey: ["partners", userId],
  queryFn: () => getPartners(userId),
})

// Mutation
const queryClient = useQueryClient()
const createMutation = useMutation({
  mutationFn: createPartner,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["partners"] })
  },
})
```

#### Local State
Use `useState` for component-local state:
```typescript
const [isOpen, setIsOpen] = useState(false)
```

#### Global State
Use React Context (see `AuthContext`, `BlurContext`):
```typescript
// Define context
export const MyContext = createContext<MyContextType | undefined>(undefined)

// Provider component
export const MyProvider = ({ children }) => {
  const [state, setState] = useState(initialState)

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  )
}

// Hook for consuming
export const useMyContext = () => {
  const context = useContext(MyContext)
  if (!context) throw new Error("useMyContext must be used within MyProvider")
  return context
}
```

### Styling Conventions

**Tailwind CSS + CSS Variables:**

1. **Use Tailwind utilities first:**
   ```tsx
   <div className="flex items-center gap-4 p-6 rounded-lg bg-background">
   ```

2. **For complex/repeated patterns, use cn() utility:**
   ```tsx
   import { cn } from "@/lib/utils"

   <div className={cn(
     "base-classes",
     condition && "conditional-classes",
     className
   )}>
   ```

3. **CSS variables are defined in `index.css`:**
   - Semantic tokens: `--background`, `--foreground`, `--primary`, `--secondary`
   - Component tokens: `--sidebar-background`, `--sidebar-foreground`
   - Dark mode variants automatically applied via `dark:` class

4. **Responsive design:**
   - Mobile-first approach
   - Breakpoint: `md` (768px)
   - Example: `<div className="hidden md:block">` (hidden on mobile, visible on desktop)

### Error Handling

**Standard pattern:**
```typescript
try {
  const result = await someAsyncOperation()
  toast.success("Operation successful")
  return result
} catch (error) {
  console.error("Operation failed:", error)
  toast.error("Operation failed. Please try again.")
  throw error // Re-throw if caller needs to handle
}
```

**With React Query:**
```typescript
const mutation = useMutation({
  mutationFn: someOperation,
  onSuccess: () => {
    toast.success("Success!")
  },
  onError: (error) => {
    console.error("Error:", error)
    toast.error("Something went wrong")
  },
})
```

---

## 🔨 Common Tasks

### Adding a New Page

1. **Create page component in `/src/pages/`:**
   ```typescript
   // src/pages/NewPage.tsx
   export default function NewPage() {
     return <div>New Page Content</div>
   }
   ```

2. **Add route in `/src/App.tsx`:**
   ```typescript
   import NewPage from "./pages/NewPage"

   // Inside Routes component
   <Route path="/new-page" element={<ProtectedRoute><NewPage /></ProtectedRoute>} />
   ```

3. **Add navigation link in Sidebar** (`src/components/layout/Sidebar.tsx`)

### Adding a New Component

1. **Determine the appropriate directory** (by feature)
2. **Create component file:**
   ```typescript
   // src/components/feature/MyComponent.tsx
   interface MyComponentProps {
     // Props definition
   }

   export const MyComponent = ({ ...props }: MyComponentProps) => {
     // Component logic
     return <div>...</div>
   }
   ```

3. **Export from index if creating a module** (optional)

### Adding shadcn/ui Component

**Use the shadcn CLI (if available) or copy from shadcn/ui docs:**

```bash
# Example (if CLI is set up)
npx shadcn-ui@latest add dialog

# Components are added to src/components/ui/
```

**components.json config:**
```json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Working with Forms

1. **Define Zod schema:**
   ```typescript
   const schema = z.object({
     field: z.string().min(1, "Required"),
   })
   ```

2. **Use React Hook Form:**
   ```typescript
   const form = useForm({
     resolver: zodResolver(schema),
   })
   ```

3. **Use shadcn Form components** (Form, FormField, FormItem, FormLabel, FormControl, FormMessage)

4. **Handle submission:**
   ```typescript
   const onSubmit = async (data) => {
     await createMutation.mutateAsync(data)
   }
   ```

### Working with Database

**ALWAYS use `/src/lib/db.ts` functions:**

```typescript
import { getPartners, createPartner } from "@/lib/db"
import { useAuth } from "@/contexts/AuthContext"

const { user } = useAuth()
const { data: partners } = useQuery({
  queryKey: ["partners", user.id],
  queryFn: () => getPartners(user.id),
})

const createMutation = useMutation({
  mutationFn: createPartner,
})
```

**If you need a new database operation not in `db.ts`:**

1. Add function to `db.ts` following existing patterns
2. Use proper error handling
3. Return type-safe results
4. Document the function

### Adding a New Database Table

**DO NOT modify existing migrations. Create a new migration:**

1. **Create migration file** in `supabase/migrations/`:
   ```sql
   -- supabase/migrations/YYYYMMDDHHMMSS_add_new_table.sql

   CREATE TABLE IF NOT EXISTS public.new_table (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
   );

   -- Enable RLS
   ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

   -- Add policies
   CREATE POLICY "Users can view their own records"
     ON public.new_table FOR SELECT
     USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

   -- Add trigger for updated_at
   CREATE TRIGGER update_new_table_updated_at
     BEFORE UPDATE ON public.new_table
     FOR EACH ROW
     EXECUTE FUNCTION public.update_updated_at_column();

   -- Add indexes
   CREATE INDEX idx_new_table_user_id ON public.new_table(user_id);
   ```

2. **Run migration** (if using local Supabase CLI):
   ```bash
   supabase db push
   ```

3. **Regenerate types:**
   ```bash
   supabase gen types typescript --local > src/integrations/supabase/types.ts
   ```

4. **Add CRUD functions to `db.ts`**

### Implementing Authentication Check

**Use AuthContext:**
```typescript
import { useAuth } from "@/contexts/AuthContext"

const MyComponent = () => {
  const { user, session, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>

  return <div>Welcome, {user.email}</div>
}
```

**Protected Routes are handled in App.tsx via `<ProtectedRoute>` wrapper.**

### Working with Supabase Storage

**Use `/src/lib/storage.ts` functions:**

```typescript
import { uploadFile, deleteFile, getPublicUrl } from "@/lib/storage"

// Upload
const { data, error } = await uploadFile({
  bucket: "documents",
  file: fileObject,
  path: `partners/${partnerId}/${fileName}`,
})

// Get URL
const url = getPublicUrl("documents", storagePath)

// Delete
await deleteFile("documents", storagePath)
```

---

## 🧪 Testing & Quality

### Current State
**⚠️ No testing framework is currently set up.**

The project does not have:
- Jest/Vitest
- Testing Library
- Cypress/Playwright
- Test files

This is common for rapid prototyping on platforms like Lovable.

### Code Quality Tools

**ESLint:**
```bash
npm run lint
```

Configuration in `eslint.config.js`:
- React Hooks rules
- React Refresh rules
- TypeScript ESLint

### Recommended Testing Approach (if implementing)

1. **Unit/Component Testing:** Vitest + React Testing Library
2. **E2E Testing:** Playwright
3. **Type Checking:** TypeScript (already enabled)

---

## 🚀 Deployment

### Platform
**Lovable Cloud** - Platform-managed deployment

### Build Process
```bash
# Production build
npm run build

# Output: dist/
```

Vite bundles the application into static files in `dist/` directory.

### Environment Variables
Managed by Lovable Cloud platform. Variables are auto-injected from `.env`.

Required variables:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Deployment Workflow
1. Code is committed to repository
2. Lovable Cloud auto-deploys on push (if configured)
3. Build runs via `npm run build`
4. Static files are served

### Production Considerations
- **No robots.txt** (SEO disabled via `public/robots.txt`)
- **No analytics** currently configured
- **No error tracking** (consider adding Sentry)
- **No performance monitoring** (consider adding tools)

---

## 🔍 Troubleshooting

### Common Issues

#### 1. **Supabase Connection Errors**
**Symptoms:** "Failed to fetch" or connection refused errors

**Solutions:**
- Check `.env` file has correct Supabase credentials
- Verify Supabase project is active in dashboard
- Check network connectivity
- Review Supabase project API settings

#### 2. **RLS Policy Errors**
**Symptoms:** "row-level security policy" error or empty query results

**Solutions:**
- Verify user is authenticated (`auth.uid()` returns valid ID)
- Check RLS policies in Supabase dashboard
- Ensure `user_id` column is set correctly on INSERT
- Verify user has correct role if using `has_role()`

#### 3. **Type Errors**
**Symptoms:** TypeScript errors about missing types

**Solutions:**
- Regenerate Supabase types: `supabase gen types typescript`
- Check imports are using correct paths with `@/` alias
- Verify TypeScript config hasn't changed

#### 4. **React Query Not Updating**
**Symptoms:** UI doesn't reflect database changes

**Solutions:**
- Check query invalidation after mutations:
  ```typescript
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["partners"] })
  }
  ```
- Verify query keys are consistent
- Check React Query DevTools (if installed)

#### 5. **Form Validation Errors**
**Symptoms:** Form submits with invalid data or shows unexpected errors

**Solutions:**
- Check Zod schema matches form structure
- Verify `resolver: zodResolver(schema)` is set
- Console.log form errors: `console.log(form.formState.errors)`
- Check default values match schema types

#### 6. **Dark Mode Not Working**
**Symptoms:** Theme doesn't switch or styles are broken

**Solutions:**
- Verify `next-themes` ThemeProvider wraps app
- Check CSS variables are defined for both light and dark modes
- Ensure Tailwind's dark mode is set to 'class' in config
- Test with DevTools to verify `dark` class on `<html>`

#### 7. **Build Failures**
**Symptoms:** `npm run build` fails

**Solutions:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for console errors during build
- Verify all imports are correct (no missing files)
- Check TypeScript errors: `npx tsc --noEmit`

---

## 📚 Important Files Reference

### Configuration Files

| File | Purpose | Key Settings |
|------|---------|--------------|
| `package.json` | Dependencies & scripts | React 18, TypeScript, Vite, Supabase |
| `vite.config.ts` | Build configuration | Port 8080, path alias `@/*`, SWC plugin |
| `tsconfig.json` | TypeScript settings | Strict mode OFF, path alias configured |
| `tailwind.config.ts` | Tailwind customization | shadcn/ui plugin, theme tokens |
| `components.json` | shadcn/ui config | Component paths, style settings |
| `eslint.config.js` | Linting rules | React, TypeScript rules |

### Critical Source Files

| File | Lines | Purpose |
|------|-------|---------|
| `src/lib/db.ts` | 900+ | **Complete database abstraction layer** - USE THIS for all DB operations |
| `src/integrations/supabase/types.ts` | 1072 | Auto-generated DB types - DO NOT manually edit |
| `src/lib/partner-schema.ts` | 300+ | Zod validation schemas for partners |
| `src/lib/strategic-analysis.ts` | 200+ | Pareto analysis, Gartner quadrants |
| `src/components/ui/*` | 4035 | shadcn/ui components |
| `src/App.tsx` | - | Routing configuration |
| `src/main.tsx` | - | Application entry point |
| `src/index.css` | - | Global styles, CSS variables, Tailwind directives |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview, features, installation |
| `SUPABASE.md` | Complete database schema documentation (1155 lines) |
| `CHANGELOG.md` | Version history with 24h highlights |
| `GUIA_INSTALACAO.md` | Installation guide (Portuguese) |
| `GUIA_DO_USUARIO.md` | User guide (Portuguese) |
| `GOOGLE_CALENDAR_INTEGRATION.md` | Calendar integration setup |
| `TROUBLESHOOTING_CALENDAR.md` | Calendar troubleshooting |
| `VALIDATION_SCHEMAS.md` | Schema documentation |

---

## 🤖 AI Assistant Guidelines

### When Working on This Project

#### 1. **Always Start By:**
- Reading this document (CLAUDE.md)
- Understanding the feature area you're working on
- Checking `SUPABASE.md` for database schema details
- Reviewing existing similar components for patterns

#### 2. **Database Operations:**
- ✅ **DO:** Use functions from `src/lib/db.ts`
- ❌ **DON'T:** Write direct Supabase queries in components
- ✅ **DO:** Add new functions to `db.ts` if needed
- ❌ **DON'T:** Modify Supabase types manually

#### 3. **Component Creation:**
- ✅ **DO:** Follow feature-based organization
- ✅ **DO:** Use shadcn/ui components from `src/components/ui/`
- ✅ **DO:** Implement proper TypeScript interfaces
- ❌ **DON'T:** Create new basic UI components (button, input, etc.) - use shadcn/ui

#### 4. **State Management:**
- ✅ **DO:** Use React Query for server state (Supabase data)
- ✅ **DO:** Use useState for local component state
- ✅ **DO:** Use Context for global app state
- ❌ **DON'T:** Use Redux, Zustand, or other state libraries

#### 5. **Forms:**
- ✅ **DO:** Use React Hook Form + Zod
- ✅ **DO:** Define Zod schemas for validation
- ✅ **DO:** Use shadcn/ui Form components
- ❌ **DON'T:** Use uncontrolled forms or manual validation

#### 6. **Styling:**
- ✅ **DO:** Use Tailwind utility classes
- ✅ **DO:** Use CSS variables for theming
- ✅ **DO:** Follow mobile-first responsive design
- ❌ **DON'T:** Write custom CSS unless absolutely necessary

#### 7. **Database Changes:**
- ✅ **DO:** Create new migration files
- ✅ **DO:** Enable RLS on new tables
- ✅ **DO:** Add proper indexes
- ✅ **DO:** Create policies for SELECT, INSERT, UPDATE, DELETE
- ❌ **DON'T:** Modify existing migrations
- ❌ **DON'T:** Skip RLS policies

#### 8. **Error Handling:**
- ✅ **DO:** Use try-catch for async operations
- ✅ **DO:** Show user-friendly error messages with toast
- ✅ **DO:** Log errors to console for debugging
- ❌ **DON'T:** Silently swallow errors

#### 9. **Code Quality:**
- ✅ **DO:** Follow existing naming conventions
- ✅ **DO:** Write self-documenting code
- ✅ **DO:** Add comments for complex logic
- ✅ **DO:** Keep components focused and small
- ❌ **DON'T:** Create monolithic components

#### 10. **Performance:**
- ✅ **DO:** Use React.memo for expensive components
- ✅ **DO:** Implement proper React Query caching
- ✅ **DO:** Lazy load heavy components if needed
- ❌ **DON'T:** Fetch data in loops
- ❌ **DON'T:** Create unnecessary re-renders

### Making Changes

#### Small Changes (Bug fixes, minor improvements)
1. Locate the relevant file(s)
2. Make the change following existing patterns
3. Test locally
4. Document if necessary

#### Medium Changes (New component, new feature section)
1. Review similar existing implementations
2. Plan component structure
3. Implement following conventions
4. Update relevant documentation
5. Test thoroughly

#### Large Changes (New feature, database changes)
1. **Plan thoroughly:**
   - Document the feature requirements
   - Design database schema changes (if any)
   - Sketch component hierarchy
   - Identify reusable components

2. **Implement incrementally:**
   - Start with database (migrations, RLS policies)
   - Add functions to `db.ts`
   - Create types/interfaces
   - Build UI components
   - Wire up state management
   - Add routing

3. **Test comprehensively:**
   - Test happy paths
   - Test error cases
   - Test edge cases
   - Test RLS policies
   - Test responsive design

4. **Document:**
   - Update relevant .md files
   - Add code comments for complex logic
   - Update CHANGELOG.md

### Debugging Approach

1. **Reproduce the issue**
2. **Check the browser console** for errors
3. **Verify authentication** (user logged in?)
4. **Check RLS policies** (permissions correct?)
5. **Review React Query** (data fetching correct?)
6. **Check form validation** (Zod schema correct?)
7. **Inspect network tab** (Supabase requests succeeding?)
8. **Review recent changes** (what was changed recently?)

### Communication with Users

When discussing changes:
- Be specific about file paths
- Reference line numbers when relevant
- Explain the "why" not just the "what"
- Provide context about architectural decisions
- Mention potential side effects or risks

### Best Practices Checklist

Before submitting changes:
- [ ] Code follows naming conventions
- [ ] Components are properly typed
- [ ] Database operations use `db.ts` functions
- [ ] Forms use React Hook Form + Zod
- [ ] Error handling is implemented
- [ ] Toast notifications for user feedback
- [ ] RLS policies tested (if DB changes)
- [ ] Responsive design works (mobile + desktop)
- [ ] Dark mode works correctly
- [ ] No console errors
- [ ] Code is self-documenting or has comments

---

## 📖 Additional Resources

### Internal Documentation
- **Database Schema:** See `SUPABASE.md` (comprehensive 1155-line doc)
- **Changelog:** See `CHANGELOG.md` (includes 24h highlights)
- **User Guide:** See `GUIA_DO_USUARIO.md`
- **Calendar Integration:** See `GOOGLE_CALENDAR_INTEGRATION.md`

### External Resources
- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com/
- **React Hook Form:** https://react-hook-form.com/
- **Zod:** https://zod.dev/
- **TanStack Query:** https://tanstack.com/query/latest
- **Supabase:** https://supabase.com/docs
- **Vite:** https://vitejs.dev/

---

## 🎯 Quick Reference

### Frequently Used Commands
```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Build for production
npm run lint         # Lint code
```

### Frequently Used Imports
```typescript
// Supabase
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"

// Database operations
import { getPartners, createPartner } from "@/lib/db"

// React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Forms
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { toast } from "sonner"

// Auth
import { useAuth } from "@/contexts/AuthContext"
```

### Frequently Used Patterns
```typescript
// Query pattern
const { data, isLoading, error } = useQuery({
  queryKey: ["key", id],
  queryFn: () => fetchFunction(id),
})

// Mutation pattern
const mutation = useMutation({
  mutationFn: updateFunction,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["key"] })
    toast.success("Success!")
  },
  onError: (error) => {
    console.error(error)
    toast.error("Failed")
  },
})

// Form pattern
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { /* ... */ },
})
```

---

**Last Updated:** 2025-11-19
**Version:** 1.0
**Maintained By:** AI Assistants working on partners-li

---

*This document should be updated whenever significant architectural changes are made to the project.*
