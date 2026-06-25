/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Linting is handled separately; don't fail production builds on lint.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
