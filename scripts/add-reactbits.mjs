#!/usr/bin/env node
// Installs a React Bits component (https://reactbits.dev) from its shadcn
// registry on GitHub into src/components/reactbits/<Name>/.
//
// Usage: npm run reactbits -- <ComponentName> [variant]
//   variant: TS-TW (default), TS-CSS, JS-TW, JS-CSS
// Example: npm run reactbits -- SplitText
//
// Equivalent to `npx shadcn@latest add https://reactbits.dev/r/<Name>-TS-TW`,
// but reads from raw.githubusercontent.com so it works when reactbits.dev is unreachable.
import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const [name, variant = 'TS-TW'] = process.argv.slice(2)
if (!name) {
  console.error('Usage: npm run reactbits -- <ComponentName> [TS-TW|TS-CSS|JS-TW|JS-CSS]')
  process.exit(1)
}

const url = `https://raw.githubusercontent.com/DavidHDev/react-bits/main/public/r/${name}-${variant}.json`
const res = await fetch(url)
if (!res.ok) {
  console.error(`Could not fetch ${url} (${res.status}). Check the component name at https://reactbits.dev`)
  process.exit(1)
}
const item = await res.json()

const outRoot = join(process.cwd(), 'src/components/reactbits')
for (const file of item.files) {
  const dest = join(outRoot, file.path)
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, file.content)
  console.log(`  wrote ${dest.replace(process.cwd() + '/', '')}`)
}

const deps = item.dependencies ?? []
if (deps.length) {
  console.log(`  installing ${deps.join(' ')}`)
  execSync(`npm install ${deps.map((d) => JSON.stringify(d)).join(' ')}`, { stdio: 'inherit' })
}
console.log(`Added ${item.title ?? name}.`)
