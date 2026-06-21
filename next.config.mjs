/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/garagedoors",
        destination: "/",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/account",
        permanent: true,
      },
      {
        source: "/demo",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
