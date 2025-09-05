/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@your-scope/anchor-popover",
    "@your-scope/apps-popover",
    "@your-scope/settings-popover",
    "@your-scope/user-popover",
    "@your-scope/weather-api",
    "@your-scope/weather-card",
  ],
  async rewrites() {
    return [
      // Keep NextAuth (/api/auth/*) local; proxy only your backend
      { source: "/api/1/:path*", destination: "http://localhost:3000/api/1/:path*" }
    ];
  },
};
export default nextConfig;

