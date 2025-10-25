/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      "blog.unrealshot.com",
      "localhost",
      "astria.ai",
      "api.astria.ai",
      "sdbooth2-production.s3.amazonaws.com",
      "xdka2sdembhhqc3o.public.blob.vercel-storage.com",
      "norpsr0wtvuo7qpe.public.blob.vercel-storage.com",
      "replicate.delivery",
      "replicate.com",
      "fal.ai",
      "fal.media",
      "v3.fal.media",
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/ai-influencer-generator/",
        destination: "/ai-influencer-generator",
        permanent: true,
      },
    ];
  },
}

export default nextConfig
