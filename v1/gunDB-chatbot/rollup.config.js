import svelte from "rollup-plugin-svelte"; // Compile Svelte components
import commonjs from "@rollup/plugin-commonjs"; // Convert CommonJS modules to ES6
import resolve from "@rollup/plugin-node-resolve"; // Locate modules using the Node resolution algorithm
import livereload from "rollup-plugin-livereload"; // Reload the browser when the code changes
import { terser } from "rollup-plugin-terser"; // Minify generated es bundle
import css from "rollup-plugin-css-only"; // Extract CSS into a separate file
import child_process from "child_process";

const production = !process.env.ROLLUP_WATCH;

function serve() {
  // Start a web server
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = child_process.spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    }
  };
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
      // Enable run-time checks when not in production
      compilerOptions: {
        dev: !production
      }
    }),

    css({ output: "bundle.css" }),

    resolve({
      browser: true,
      dedupe: ["svelte"]
    }),

    // Node tried to load your configuration file as CommonJS even though it is likely an ES module. To resolve this, change the extension of your configuration to ".mjs", set "type": "module" in your package.json file or pass the "--bundleConfigAsCjs" flag.
    commonjs(),

    //in dev mode, call `npm run start` once the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the browser when changes occur
    !production && livereload("public"),

    // If we're building for production (npm run build  instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
}