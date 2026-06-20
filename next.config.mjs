/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/garagedoors",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
