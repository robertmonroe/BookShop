# BookShop - Digital & Print Bookstore

A modern e-commerce platform for selling books in multiple formats: audiobooks, ebooks, paperbacks, and hardcovers. Built with Next.js 14, PostgreSQL, Prisma, and integrated with Stripe for payments and Book Vault for print-on-demand fulfillment.

## Features

- 📚 **Multiple Book Formats**: Audiobooks, eBooks, Paperbacks, and Hardcovers
- 🛒 **Shopping Cart**: Persistent cart using Zustand
- 💳 **Payment Processing**: Stripe integration with webhook support
- 📖 **Digital Library**: Download purchased digital content with tracking
- 🎨 **Bold Modern Design**: Tailwind CSS with custom theme
- 🔐 **Authentication**: NextAuth.js with credentials provider
- 👨‍💼 **Admin Dashboard**: Manage books, orders, and customers
- 📦 **Print Fulfillment**: Book Vault API integration (ready to configure)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)
- Book Vault account (optional, for print fulfillment)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Update the `.env` file with your credentials:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal (optional)
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
PAYPAL_MODE="sandbox"

# Book Vault (optional)
BOOKVAULT_API_KEY="your_bookvault_api_key"
BOOKVAULT_API_URL="https://api.bookvault.app/v1"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 4. Create Admin User

You'll need to create an admin user. You can register normally at `/register` and then update the role in the database:

```sql
-- Run this in your PostgreSQL client or Prisma Studio
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
bookshop/
├── app/
│   ├── page.tsx          # Homepage
│   ├── books/            # Book catalog & detail pages
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── library/          # User's digital library
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── admin/            # Admin dashboard
│   │   ├── books/        # Book management
│   │   └── orders/       # Order management
│   └── api/              # API routes
│       ├── auth/         # NextAuth & registration
│       ├── checkout/     # Order creation
│       ├── download/     # Digital downloads
│       └── webhooks/     # Stripe webhooks
├── components/
│   ├── shop/             # Storefront components
│   ├── admin/            # Admin components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── db.ts             # Prisma client
│   ├── auth.ts           # NextAuth config
│   ├── store.ts          # Zustand cart store
│   ├── stripe.ts         # Stripe client
│   ├── paypal.ts         # PayPal client
│   └── bookvault.ts      # Book Vault API
└── prisma/
    └── schema.prisma     # Database schema
```

## Key Features

### Customer Features
- Browse books by format (audiobook, ebook, paperback, hardcover)
- Search and filter books
- Preview samples (audio/ebook)
- Add to cart with persistent storage
- Secure checkout with Stripe
- Access digital library with download tracking
- User authentication and profiles

### Admin Features
- Dashboard with key metrics
- Book management (CRUD operations)
- Order management and tracking
- Customer overview
- Format-specific pricing

## Stripe Setup

### 1. Get API Keys
- Sign up at [stripe.com](https://stripe.com)
- Get your test keys from the [Dashboard](https://dashboard.stripe.com/test/apikeys)
- Add them to `.env`

### 2. Set Up Webhook
For local development:
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

For production:
- Go to [Webhooks](https://dashboard.stripe.com/webhooks)
- Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
- Select event: `checkout.session.completed`
- Copy webhook signing secret to environment variables

### 3. Test Payments
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and any 3-digit CVC

## Book Vault Integration

To enable print-on-demand fulfillment:

1. Sign up at [Book Vault](https://www.bookvault.app/)
2. Get API credentials from your account
3. Add credentials to `.env`
4. Add Book Vault SKUs to your paperback/hardcover book formats
5. Orders with physical books will automatically forward to Book Vault for fulfillment

## Adding Books

Currently, books need to be added directly to the database. Future enhancements will include:
- Admin UI for adding/editing books
- Image upload functionality
- Bulk import from CSV
- Integration with book APIs (Google Books, etc.)

For now, you can add books via Prisma Studio:
```bash
npx prisma studio
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Setup for Production

Consider using:
- [Supabase](https://supabase.com) - Free PostgreSQL
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Railway](https://railway.app) - PostgreSQL hosting

## Database Migrations

When making schema changes:

```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Deploy to production
npx prisma migrate deploy
```

## Troubleshooting

### Database Connection Errors
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database exists

### Stripe Webhook Issues
- Use Stripe CLI for local testing
- Check webhook secret matches
- Verify endpoint is publicly accessible (production)

### NextAuth Errors
- Ensure NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain

## Future Enhancements

- [ ] Book management UI in admin panel
- [ ] File upload for covers and digital files
- [ ] Email notifications for orders
- [ ] PayPal integration completion
- [ ] Review and rating system
- [ ] Wishlist functionality
- [ ] Advanced search and filtering
- [ ] Book recommendations
- [ ] Coupon/discount codes
- [ ] Inventory management

## License

MIT

## Support

For issues and questions, please check the troubleshooting section or create an issue.
