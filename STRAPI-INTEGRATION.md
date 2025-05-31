# Strapi Integration Guide

## Environment Setup

Create a `.env.local` file in the root of your project with the following content:

```
# Next.js Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:1337/api
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

## API Endpoints

The frontend is now configured to work with the following Strapi v5 API endpoints:

### Authentication & User
- `POST /api/auth/local/register` - Custom registration
- `POST /api/auth/local` - Standard login
- `GET /api/users/me` - Get current authenticated user

### Workspace
- `GET /api/workspaces` - List all workspaces
- `GET /api/workspaces/:id` - Get a specific workspace
- `POST /api/workspaces` - Create a workspace
- `PUT /api/workspaces/:id` - Update a workspace
- `DELETE /api/workspaces/:id` - Delete a workspace

### Session
- `GET /api/sessions` - List all sessions
- `GET /api/sessions/:id` - Get a specific session
- `POST /api/sessions` - Create a session
- `PUT /api/sessions/:id` - Update a session
- `DELETE /api/sessions/:id` - Delete a session

### Booking
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/:id` - Get a specific booking
- `POST /api/bookings` - Create a booking
- `PUT /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Delete a booking

## Strapi Collection Types

Make sure your Strapi backend has the following collection types:

### Workspace
- `name` (Text)
- `description` (Rich Text)
- `location` (Text)
- `capacity` (Number)
- `type` (Text)
- `hourlyRate` (Number)
- `amenities` (JSON)
- `availability` (Text)
- `image` (Media)

### Session
- `title` (Text)
- `workspace` (Relation to Workspace)
- `expertName` (Text)
- `expertId` (Text)
- `clientName` (Text)
- `clientId` (Text)
- `date` (Date)
- `startTime` (Time)
- `endTime` (Time)
- `price` (Number)
- `status` (Text)
- `notes` (Rich Text)
- `recordingUrl` (Text)

### Booking
- `session` (Relation to Session)
- `client` (Relation to User)
- `status` (Text)
- `createdAt` (DateTime)

## Troubleshooting

If you're getting 404 errors when trying to access the API:

1. Make sure your Strapi backend is running
2. Check that the collection types are created in Strapi
3. Verify that the API endpoints are accessible (try visiting http://localhost:1337/api/workspaces in your browser)
4. Ensure your `.env.local` file has the correct API URL
5. Check for URL format issues:
   - The base URL in `.env.local` should be `http://localhost:1337/api` (no trailing slash)
   - API endpoints in the code should not have leading slashes (e.g., use `workspaces` not `/workspaces`)
   - If you're still getting 404s, try accessing the API directly in your browser to verify it's working

## Development Workflow

1. Start your Strapi backend:
   ```bash
   cd path/to/your-strapi-project
   npm run develop
   ```

2. Start your Next.js frontend:
   ```bash
   cd squeedr-ui
   npm run dev
   ```

3. Create a workspace in the frontend and verify it appears in the Strapi admin panel 