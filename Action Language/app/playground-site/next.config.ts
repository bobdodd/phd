import type { NextConfig } from "next";
// @ts-ignore
import WebpackObfuscator from 'webpack-obfuscator';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {},
  webpack: (config, { isServer, dev }) => {
    // Ensure Babel packages are properly transpiled for browser use
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };

    // Configure module resolution to include .js files explicitly
    config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];

    // Allow importing .js files from src/lib
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts'],
      '.jsx': ['.jsx', '.tsx'],
    };

    // Add code obfuscation in production (not in dev mode, not on server)
    if (!dev && !isServer) {
      config.plugins.push(
        new WebpackObfuscator({
          rotateStringArray: true,
          stringArray: true,
          stringArrayThreshold: 0.75,
          identifierNamesGenerator: 'hexadecimal',
          renameGlobals: false,
          selfDefending: true,
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.4,
          debugProtection: false, // Set to true for extra protection (may cause issues)
          disableConsoleOutput: false,
          reservedNames: [
            // Preserve Monaco Editor and React names
            '^monaco',
            '^React',
            '^next',
          ],
        }, [
          // Exclude node_modules from obfuscation (only obfuscate your code)
          'node_modules/**',
        ])
      );
    }

    return config;
  },
  transpilePackages: ['@babel/parser', '@babel/traverse', '@babel/types'],
};

export default nextConfig;
