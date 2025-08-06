import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Impede que erros do ESLint interrompam a build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
