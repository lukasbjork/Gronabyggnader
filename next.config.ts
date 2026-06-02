import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Helt statisk export -> bygger till ./out, hostas gratis/billigt på Netlify.
  output: "export",
  // Krävs vid statisk export (ingen Image Optimization-server körs).
  images: { unoptimized: true },
  // Mappbaserade, rena URL:er (t.ex. /tjanster/index.html) som funkar på statisk hosting.
  trailingSlash: true,
};

export default nextConfig;
