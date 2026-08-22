/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Ensure the protected brother photos are bundled with the API route
    // that serves them (they live outside /public).
    outputFileTracingIncludes: {
      "/api/brother-photo/[file]": ["./brother-photos/**"],
    },
  },
};

module.exports = nextConfig;
