#!/usr/bin/env node
// Builds the single-file preview for hosting as a claude.ai artifact.
// The host supplies its own <html>/<head>/<body> wrapper and links carry no page path,
// so this strips the document shell, sets lang/dir in script, and routes in memory.
//
// Usage: npm run build:artifact   →   dist-artifact/sudum.html
import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

execSync('npx vite build --mode single --outDir dist-artifact/build', {
  stdio: 'inherit',
  env: { ...process.env, VITE_ROUTER: 'memory' },
})

const src = readFileSync('dist-artifact/build/index.html', 'utf8')
const script = src.match(/<script type="module"[^>]*>[\s\S]*?<\/script>/g)
const style = src.match(/<style[^>]*>[\s\S]*?<\/style>/g)
if (script?.length !== 1 || style?.length !== 1) throw new Error('Unexpected build output shape')

const page = [
  '<title>منصة سُدُم</title>',
  '<meta name="description" content="سُدُم — حاضنة جامعة الأميرة نورة بنت عبدالرحمن: رحلة من الفكرة إلى السوق في أربع محطات." />',
  '<meta name="theme-color" content="#031330" />',
  '<script>document.documentElement.lang = "ar"; document.documentElement.dir = "rtl";</script>',
  style[0],
  '<div id="root"></div>',
  script[0],
].join('\n')

mkdirSync('dist-artifact', { recursive: true })
writeFileSync('dist-artifact/sudum.html', page)
console.log(`dist-artifact/sudum.html (${Math.round(page.length / 1024)} KB)`)
