import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/**",
      },
    ],
  },
  webpack(config) {
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "next/dist/compiled/next-devtools": path.resolve(
        "src/shims/next-devtools.ts",
      ),
    };

    return config;
  },
  allowedDevOrigins: ["192.168.6.167"],
  turbopack: {
    resolveAlias: {
      "next/dist/compiled/next-devtools": path.resolve(
        "src/shims/next-devtools.ts",
      ),
    },
  },
};

export default nextConfig;
