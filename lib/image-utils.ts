/**
 * Utility functions for handling images with fallbacks
 */

/**
 * Returns a fallback image path if the primary image is not available
 * @param primaryPath The primary image path
 * @param fallbackPath The fallback image path
 * @returns The image path to use
 */
export function getImageWithFallback(primaryPath: string, fallbackPath: string = '/placeholder.jpg'): string {
  // In a real application, you might want to check if the image exists
  // For now, we'll use a simple approach with a fallback
  return primaryPath || fallbackPath;
}

/**
 * List of workspace images with their fallbacks
 */
export const workspaceImages: Record<string, string> = {
  'modern-conference-room.png': '/placeholder.jpg',
  'modern-collaboration-space.png': '/placeholder.jpg',
  'quiet-office.png': '/placeholder.jpg',
  'modern-meeting-room.png': '/placeholder.jpg',
  'modern-open-office.png': '/placeholder.jpg',
};

/**
 * List of avatar images with their fallbacks
 */
export const avatarImages: Record<string, string> = {
  'diverse-avatars.png': '/placeholder-user.jpg',
  'stylized-jd-initials.png': '/placeholder-user.jpg',
  'abstract-letter-aj.png': '/placeholder-user.jpg',
  'ed-initials-abstract.png': '/placeholder-user.jpg',
  'abstract-dw.png': '/placeholder-user.jpg',
  'abstract-jm.png': '/placeholder-user.jpg',
  'monogram-mb.png': '/placeholder-user.jpg',
  'stylized-sw.png': '/placeholder-user.jpg',
};

/**
 * Gets a workspace image with fallback
 * @param imageName The name of the workspace image
 * @returns The image path to use
 */
export function getWorkspaceImage(imageName: string): string {
  return workspaceImages[imageName] || '/placeholder.jpg';
}

/**
 * Gets an avatar image with fallback
 * @param imageName The name of the avatar image
 * @returns The image path to use
 */
export function getAvatarImage(imageName: string): string {
  return avatarImages[imageName] || '/placeholder-user.jpg';
} 