This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# Avatar & Image Handling System

This project uses a robust, scalable avatar and image handling system for all user and workspace images. This ensures UI consistency, performance, and graceful fallbacks for missing or broken images.

## Components

- **UserAvatar**: Renders user avatars with support for initials, fallback images, and skeleton loading states. Use this for all user profile images, including in tables, menus, and cards.
- **OptimizedImage**: Handles general image rendering with lazy loading, error fallback, and skeletons. Use for workspace or other non-user images.

## How It Works

- **Image Source**: User and workspace images should be placed in the `public/` directory. Reference them by relative path (e.g. `/stylized-jd-initials.png` or `/avatars/user123.png`).
- **Fallbacks**: If an image is missing or fails to load, the system will display user initials or a default placeholder image.
- **Initials**: If no image is provided, `UserAvatar` will automatically generate initials from the user's name.
- **Skeletons**: While loading, a skeleton placeholder is shown for a smooth UI experience.

## Best Practices for Adding Images

1. **Add to `public/`**: Place new user or workspace images in the `public/` directory. Use descriptive, unique filenames (e.g. `workspace-innovation-lab.png`).
2. **Reference in Data**: In user or workspace data, set the `image` or `avatar` property to the relative path (e.g. `/avatars/jane-doe.png`).
3. **Use Components**: Always use `UserAvatar` for user images and `OptimizedImage` for workspace/other images. Do not use `<img>` or Next.js `<Image>` directly for these cases.
4. **Fallbacks**: If you do not have an image, simply omit the `image` property or set it to `null`/`undefined`. The system will handle fallbacks automatically.
5. **Testing**: After adding new images, verify in the UI that they display correctly and fallback logic works as expected.

## Example Usage

```tsx
// User avatar in a table or menu
<UserAvatar user={{ name: "Jane Doe", email: "jane@example.com", image: "/avatars/jane-doe.png" }} size="md" />

// Workspace image
<OptimizedImage src="/workspaces/innovation-lab.png" alt="Innovation Lab" width={64} height={64} />
```

For more details, see the `PERFORMANCE.md` for advanced optimization tips.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
