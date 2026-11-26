export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')

export const initials = (name: string) =>
  name
    .replace(/^(د|أ|م)\.\s*/, '')
    .trim()
    .charAt(0)

let counter = 0
export const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`

/** A person's first name, without an academic or professional prefix (د. / أ. / م.). */
export const firstName = (name: string) => name.replace(/^(د|أ|م)\.\s*/, '').split(' ')[0]
