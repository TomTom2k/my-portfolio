/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "vykovagkhujwnrknazix.supabase.co",
      },
      // Thêm pattern generic cho supabase nếu cần sau này, hoặc domain khác
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
