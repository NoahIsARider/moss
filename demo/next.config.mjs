const basePath = process.env.PAGES_BASE_PATH ?? "/moss";
export default {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  experimental: { externalDir: true },
  typescript: { tsconfigPath: "tsconfig.json" },
  poweredByHeader: false,
};
