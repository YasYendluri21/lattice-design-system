import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root. Without it Next walks up and can latch onto an unrelated lockfile
  // higher in the filesystem, which changes what gets traced into the build.
  outputFileTracingRoot: import.meta.dirname,
  // The CMS layer runs in-process during development; in a deployment this would point at
  // Optimizely, Contentful or Sanity via CMS_GRAPHQL_ENDPOINT.
  env: { CMS_GRAPHQL_ENDPOINT: process.env.CMS_GRAPHQL_ENDPOINT ?? '' }
};

export default config;
