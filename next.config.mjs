/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // O lint roda no seu editor; não deixamos ele derrubar o deploy.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
