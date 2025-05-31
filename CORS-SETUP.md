# CORS Configuration Setup

## Overview
This document outlines the CORS (Cross-Origin Resource Sharing) configuration for the Squeedr platform, allowing the Next.js frontend to communicate with the Strapi backend.

## Configuration Details

### Frontend (Next.js)
- **URL**: http://localhost:3000
- **Environment**: Development
- **Framework**: Next.js 15.2.4

### Backend (Strapi)
- **URL**: http://localhost:1337
- **API Endpoint**: http://localhost:1337/api
- **Environment**: Development

## Environment Variables

The following environment variables are configured in `.env`:

```env
# Next.js Environment Variables (Primary)
NEXT_PUBLIC_API_URL=http://localhost:1337/api
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Legacy React Variables (Compatibility)
REACT_APP_STRAPI_URL=http://localhost:1337
REACT_APP_STRAPI_API_URL=http://localhost:1337/api
```

## Required Strapi CORS Configuration

Your Strapi backend should be configured with the following CORS settings to allow requests from the frontend:

### config/middlewares.js (or middlewares.ts)
```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'dl.airtable.com'],
          'media-src': ["'self'", 'data:', 'blob:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://localhost:3002',
        'http://127.0.0.1:3000',
        // Add your production domain here when deploying
      ]
    }
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

## API Usage Examples

### Authentication Requests
```javascript
// Registration
const response = await fetch('http://localhost:1337/api/auth/local/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'user',
    email: 'user@example.com',
    password: 'password'
  })
});

// Login
const response = await fetch('http://localhost:1337/api/auth/local', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    identifier: 'user@example.com',
    password: 'password'
  })
});
```

### Authenticated Requests
```javascript
const response = await fetch('http://localhost:1337/api/users/me', {
  headers: {
    'Authorization': `Bearer ${jwt_token}`,
    'Content-Type': 'application/json',
  }
});
```

## Troubleshooting CORS Issues

### Common CORS Errors
1. **Access to fetch at 'http://localhost:1337/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy**
   - Solution: Ensure Strapi CORS middleware includes 'http://localhost:3000' in allowed origins

2. **No 'Access-Control-Allow-Origin' header is present**
   - Solution: Verify Strapi CORS configuration is properly set up

3. **CORS preflight request fails**
   - Solution: Ensure Strapi allows the required HTTP methods (GET, POST, PUT, DELETE, OPTIONS)

### Testing CORS Configuration
```bash
# Test basic connectivity
curl -I http://localhost:1337/api/users/me

# Test CORS preflight
curl -X OPTIONS http://localhost:1337/api/auth/local \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

## Development Workflow

1. **Start Strapi Backend**:
   ```bash
   cd your-strapi-project
   npm run develop
   # Should start on http://localhost:1337
   ```

2. **Start Next.js Frontend**:
   ```bash
   cd squeedr-ui
   npm run dev
   # Should start on http://localhost:3000
   ```

3. **Verify Communication**:
   - Frontend should be able to make requests to backend
   - No CORS errors in browser console
   - Authentication flow should work properly

## Production Considerations

When deploying to production:

1. Update environment variables with production URLs
2. Update Strapi CORS configuration with production domain
3. Ensure HTTPS is used for both frontend and backend
4. Consider using environment-specific configuration files

## Related Files

- `.env` - Environment variables
- `lib/api/auth.ts` - Authentication API calls
- `app/auth/page.tsx` - Authentication UI
- `hooks/use-role.tsx` - Role management hook 