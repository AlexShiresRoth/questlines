import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Questlines',
    short_name: 'Questlines',
    description: 'A Cozy collaborative goal sharing app, with an RPG twist',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    screenshots: [
      {
        src: '/mobile-screenshot.png',
        sizes: '791x1361',
        type: 'image/png',
      },
      {
        src: '/screenshot-wide.png',
        sizes: '3443x1841',
        type: 'image/png',
      },
    ],
  };
}
