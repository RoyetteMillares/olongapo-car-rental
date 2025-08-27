This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Clerk setup

Create an `.env.local` with:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Hygraph setup

Create an `.env.local` with:

```
NEXT_PUBLIC_HYGRAPH_CDN_URL=https://ap-south-1.cdn.hygraph.com/content/<PROJECT_ID>/<ENV>
HYGRAPH_CONTENT_API_URL=https://api-ap-south-1.hygraph.com/v2/<PROJECT_ID>/<ENV>
HYGRAPH_TOKEN=your_permanent_auth_token
```

In Hygraph:
- Project Settings → API Access → Permanent Auth Tokens: create a token with Content API permissions to Create/Read (and Publish if needed) on the `Booking` model in the `DRAFT` and `PUBLISHED` stages.
- Ensure the token can read related models (e.g., `Car`) if you connect relations.

## Admin access

Set the allowed admin emails (comma-separated):

```
NEXT_PUBLIC_ADMIN_EMAILS=email1@example.com,email2@example.com
```

The Admin link appears in the navbar for these users, and `/admin/bookings` is guarded server-side via `ADMIN_EMAILS` (server env; fallback to the same value if not set).