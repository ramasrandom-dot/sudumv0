export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')

export const initials = (name: string) =>
  name
    .replace(/^(د|أ|م)\.\s*/, '')
    .trim()
    .charAt(0)

let counter = 0
export const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`
