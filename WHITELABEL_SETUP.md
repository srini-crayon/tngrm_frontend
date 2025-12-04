# Whitelabel Configuration

This application supports whitelabel functionality to display different brands (Tangram AI and Redington).

## Setup

### Option 1: Environment Variable (Recommended for Deployment)

#### For Tangram AI Deployment
Create a `.env.local` file in your project root:
```bash
NEXT_PUBLIC_BRAND=tangram
```

Or copy from the example file:
```bash
cp env.tangram.example .env.local
```

#### For Redington Deployment
Create a `.env.local` file in your project root:
```bash
NEXT_PUBLIC_BRAND=redington
```

Or copy from the example file:
```bash
cp env.redington.example .env.local
```

#### Production Deployment Examples

**Vercel Deployment:**
- Tangram: Set `NEXT_PUBLIC_BRAND=tangram` in Vercel environment variables
- Redington: Set `NEXT_PUBLIC_BRAND=redington` in Vercel environment variables

**Docker Deployment:**
```bash
# Tangram container
docker run -e NEXT_PUBLIC_BRAND=tangram your-app

# Redington container  
docker run -e NEXT_PUBLIC_BRAND=redington your-app
```

**Build Scripts:**
```bash
# Tangram build
NEXT_PUBLIC_BRAND=tangram npm run build

# Redington build
NEXT_PUBLIC_BRAND=redington npm run build
```

#### Local Development Testing

**Test Tangram Brand:**
```bash
# Set environment variable
export NEXT_PUBLIC_BRAND=tangram
npm run dev
```

**Test Redington Brand:**
```bash
# Set environment variable  
export NEXT_PUBLIC_BRAND=redington
npm run dev
```

**Quick Brand Switch:**
```bash
# Switch to Tangram
echo "NEXT_PUBLIC_BRAND=tangram" > .env.local && npm run dev

# Switch to Redington
echo "NEXT_PUBLIC_BRAND=redington" > .env.local && npm run dev
```

### Option 2: Subdomain Detection (Multi-tenant)
The system automatically detects the brand based on the hostname:
- `tangram.yourdomain.com` → Tangram AI
- `redington.yourdomain.com` → Redington
- Default fallback → Tangram AI

## Available Brands

### Tangram AI
- Logo: `/tangram_log.png`
- Name: "Tangram AI"
- Primary Color: #000000
- Secondary Color: #6366f1

### Redington
- Logo: `/redington.JPG`
- Name: "Redington"
- Primary Color: #1f2937
- Secondary Color: #3b82f6

## Usage

The branding is automatically applied to:
- Navigation bar logo
- Footer logo and copyright text
- Any component using `BrandLogo` or `useBrand()` hook

## Components

- `BrandLogo` - Reusable logo component
- `useBrand()` - React hook for brand configuration
- `getBrandConfig()` - Function to get current brand config
- `getCurrentBrand()` - Function to get current brand type

## Adding New Brands

To add a new brand:

1. Add the brand type to the `Brand` type in `lib/brand.ts`
2. Add the brand configuration to `brandConfigs` object
3. Update the detection logic in `getCurrentBrand()` if needed
4. Add the logo file to the `public/` directory
