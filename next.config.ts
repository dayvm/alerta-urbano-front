import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'alerta-urbano-back.onrender.com', // <--- SEU BACKEND
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
