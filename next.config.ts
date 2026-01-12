import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects: () => {
    return [
      {
        source: "/",
        destination: "/conversation",
        permanent: false, // TODO: 배포 시 수정.
      },
    ];
  },
};

export default nextConfig;
