import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ensure Babel packages are properly transpiled for browser use
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },
  transpilePackages: ['@babel/parser', '@babel/traverse', '@babel/types'],
};

export default nextConfig;
