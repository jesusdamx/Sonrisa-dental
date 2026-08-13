# Preview run doc — dental-dashboard (Next.js 16)

## Reproduce the artifacts a fresh checkout needs

1. **Node version (critical).** `.nvmrc` pins `20.18.0`. The machine's default `node` in PATH is
   `v14.19.3`, which is **too old** for Next 16 — `next dev` dies with
   `SyntaxError: Unexpected token '??='` in `node_modules/next/dist/server/config.js`.
   Always launch with Node 20.18.0 first:

   ```bash
   export PATH=/home/jesus/.nvm/versions/node/v20.18.0/bin:$PATH
   node --version   # must print v20.18.0
   ```

2. **Env files.** None exist in this project (no `.env*` files to copy). The app runs with no
   environment configuration.

3. **Dependencies.** `node_modules/` is committed-free but already installed in this checkout.
   For a fresh checkout, install from the lockfile:

   ```bash
   npm ci
   ```

## How to run the server

1. Ensure Node 20.18.0 is on PATH (see above), then start the dev server:

   ```bash
   npm run dev
   ```

2. **Port.** On the most recent run, `next dev` bound to **http://localhost:37337** instead of the
   usual 3000 (the `Local:` line in the startup log shows the actual port). To force a port, pass
   `-p 3000`: `npm run dev -- -p 3000`.

3. **Detached preview launch (Linux).** The command runner reaps background process groups, so
   launch under `setsid` and log to `.freebuff/`:

   ```bash
   { nohup setsid bash -c 'export PATH=/home/jesus/.nvm/versions/node/v20.18.0/bin:$PATH; exec npm run dev' > .freebuff/preview.log 2>&1 < /dev/null & echo "pid=$!"; disown; }
   ```

   Then confirm with `ps -p <pid>` after a few seconds and `curl -s -o /dev/null -w "%{http_code}" <url>`
   before registering the preview.
