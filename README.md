# Utsav - MUJ Event Management Platform

Utsav is a modern, end-to-end event management platform designed to digitize and streamline the entire workflow for club events at Manipal University Jaipur (MUJ). It handles everything from event creation and AI-powered notesheet generation to DSW approval, student registration, and real-time QR code check-in.

This project is built with a modern, type-safe stack including Next.js 16, Prisma, and Clerk, with AI features powered by Groq.

## ✨ Core Features

The platform is built around a core workflow for three distinct user roles:

### 1. For Club Managers

- **AI-Powered Notesheet Generation:** Create events using a simple form, and our system uses Groq's AI to instantly generate an official, formatted notesheet draft, matching MUJ's standards.
- **Event Management:** View the status of all submitted events (Pending, Approved, Rejected) in a clean dashboard.
- **QR Code Check-in:** Scan student QR code "tickets" at the event venue using a phone or laptop camera for real-time attendance tracking.

### 2. For DSW Officials

- **Approval Dashboard:** View a list of all events pending approval.
- **Review & Act:** Review the AI-generated notesheet and event details on a dedicated page.
- **Approve/Reject:** Approve or reject events with a single click. Rejection requires comments for feedback.

### 3. For Students

- **Event Discovery:** Browse a public page of all approved, upcoming events.
- **Simple Registration:** Register for any event with a single click.
- **QR Code Tickets:** View all registered events in a personal dashboard, with a unique QR code "ticket" for each one.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Frontend:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **UI:** [shadcn/ui](https://ui.shadcn.com/) (using `oklch` for MUJ branding)
- **Database:** [Neon DB](https://neon.tech/) (Serverless PostgreSQL)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.com/) (handles auth & role-based routing)
- **AI:** [Groq Cloud](https://groq.com/) (for notesheet generation)
- **QR Codes:** `html5-qrcode` (scanning) & `react-qr-code` (generation)
- **Form Management:** `react-hook-form` & `zod`

## ⚙️ Getting Started

### 1. Prerequisites

- Node.js (v18 or later)
- `npm` or `yarn`
- A free [Neon](https://neon.tech/) account
- A free [Clerk](https://clerk.com/) account
- A free [Groq Cloud](https://console.groq.com/) account

### 2. Environment Setup

Clone the repository and create a `.env` file in the root directory. Add the following keys:

```.env
# 1. NEON DATABASE URL
# Get this from your Neon project dashboard
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# 2. CLERK KEYS
# Get these from your Clerk application dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# 3. CLERK WEBHOOK
# Get this from the "Webhooks" section in your Clerk dashboard
CLERK_WEBHOOK_SECRET=whsec_...

# 4. GROQ AI KEY
# Get this from the "API Keys" section in your Groq Cloud dashboard
GROQ_API_KEY=gsk_...
```

### 3\. Install Dependencies

```bash
npm install
```

### 4\. Push Database Schema

This will sync your `prisma/schema.prisma` file with your Neon database.

```bash
npx prisma migrate dev
```

### 5\. Run the App

```bash
npm run dev
```

Your app is now running on `http://localhost:3000`.

## 🔧 Post-Setup: User Roles

This app will not work correctly until you assign user roles.

1.  **Sign up** for a new account. This user will be a `STUDENT` by default.
2.  Run `npx prisma studio` to open the database editor.
3.  Go to the `User` model and find your new user.
4.  To test DSW features, change their `role` from `STUDENT` to `DSW_OFFICIAL`.
5.  To test Club features, change their `role` to `CLUB_MANAGER`.
    - **Important:** You must also go to the `Club` model and create a new club. Set the `managerId` of that club to the `clerkId` of your club manager user.

<!-- end list -->

```

```
