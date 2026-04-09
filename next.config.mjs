const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const remotePatterns = [
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
  {
    protocol: "https",
    hostname: "vault-vogue-server.vercel.app",
    pathname: "/**",
  },
];

if (apiUrl) {
  try {
    const { protocol, hostname, port } = new URL(apiUrl);

    remotePatterns.push({
      protocol: protocol.replace(":", ""),
      hostname,
      port,
      pathname: "/**",
    });
  } catch {
    console.warn("Invalid NEXT_PUBLIC_API_URL for next/image remotePatterns");
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
  allowedDevOrigins: ["192.168.6.167", "192.168.6.151"],
};

export default nextConfig;
