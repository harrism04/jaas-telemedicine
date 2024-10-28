/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nextjs.org',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_JAAS_APP_ID: process.env.NEXT_PUBLIC_JAAS_APP_ID,
    JAAS_PRIVATE_KEY: process.env.JAAS_PRIVATE_KEY,
  },
};

export default nextConfig;
