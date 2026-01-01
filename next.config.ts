import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Configure Turbopack to resolve MathJax v4 package imports
  // MathJax v4 uses ES modules - package.json maps ./js/* to ./mjs/* for imports
  turbopack: {
    resolveAlias: {
      // Default font (mathjax-newcm) - this is the default font in v4
      "#default-font/svg/default.js":
        "@mathjax/mathjax-newcm-font/js/svg/default.js",
      "#default-font/svg/default":
        "@mathjax/mathjax-newcm-font/js/svg/default.js",
      "#default-font/svg": "@mathjax/mathjax-newcm-font/js/svg",
      "#default-font": "@mathjax/mathjax-newcm-font",
    },
  },
  // Also configure webpack for compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Resolve MathJax v4 package imports for server-side rendering
      // Package imports like #default-font need to be resolved to actual packages
      // These are Node.js package imports that webpack needs help resolving
      const aliases: Record<string, string> = {};

      // Default font (mathjax-newcm) - this is the default font in v4
      // MathJax v4 uses ES modules in the mjs directory
      try {
        const newcmBase = resolve(
          require.resolve("@mathjax/mathjax-newcm-font/package.json"),
          ".."
        );
        aliases["#default-font/svg/default.js"] = resolve(
          newcmBase,
          "mjs/svg/default.js"
        );
        aliases["#default-font/svg/default"] = resolve(
          newcmBase,
          "mjs/svg/default.js"
        );
        aliases["#default-font/svg"] = resolve(newcmBase, "mjs/svg");
        aliases["#default-font"] = newcmBase;
      } catch (e) {
        console.warn("Could not resolve @mathjax/mathjax-newcm-font:", e);
      }

      // Resolve MathJax bundle directory for server-side imports
      try {
        const mathjaxSrcBase = resolve(
          require.resolve("@mathjax/src/package.json"),
          ".."
        );
        // Map es5 path to bundle directory (as per package.json exports)
        aliases["@mathjax/src/es5"] = resolve(mathjaxSrcBase, "bundle");
        aliases["@mathjax/src/bundle"] = resolve(mathjaxSrcBase, "bundle");
      } catch (e) {
        console.warn("Could not resolve @mathjax/src bundle:", e);
      }

      config.resolve.alias = {
        ...config.resolve.alias,
        ...aliases,
      };

      // Ensure package imports are resolved correctly
      config.resolve.extensionAlias = {
        ...config.resolve.extensionAlias,
        ".js": [".js", ".mjs"],
      };

      // Mark MathJax bundle files as external to prevent bundling
      // These are CommonJS files that should be loaded at runtime
      if (!config.externals) {
        config.externals = [];
      }
      config.externals.push({
        '@mathjax/src/es5/tex-svg.js': 'commonjs @mathjax/src/es5/tex-svg.js',
        '@mathjax/src/bundle/tex-svg.js': 'commonjs @mathjax/src/bundle/tex-svg.js',
      });
    }
    return config;
  },
};

export default nextConfig;
