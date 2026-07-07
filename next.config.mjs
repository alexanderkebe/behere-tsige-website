/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Linting is handled separately; don't fail production builds on lint.
  eslint: { ignoreDuringBuilds: true },
  // Lets a production build run alongside a dev server (which locks .next):
  // NEXT_DIST_DIR=.next-build npm run build
  distDir: process.env.NEXT_DIST_DIR || '.next',
  async headers() {
    return [
      {
        // Hero videos, images, and fonts under public/assets change rarely:
        // let browsers keep them a day and CDNs a month, so repeat visits
        // don't re-download megabytes of media.
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=2592000',
          },
        ],
      },
      {
        source: '/:font(Benaiah.ttf|Benaiah.otf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
