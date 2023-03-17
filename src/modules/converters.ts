/* eslint-disable no-param-reassign */
export function StringToNumberOrNull (input: string | undefined): number | null {
  input = input?.trim()
  if (typeof input !== 'string') { return null }

  const value = parseInt(input, 10)
  if (isNaN(value)) { return null }
  if (value < 0) { return null }

  return value
}

export function StringToBooleanOrNull (input: string | undefined): boolean | null {
  input = input?.trim()
  if (typeof input !== 'string') { return null }

  if (input.toLowerCase() === 'true') { return true }
  if (input.toLowerCase() === 'false') { return false }

  if (input.toLowerCase() === '1') { return true }
  if (input.toLowerCase() === '0') { return false }

  return null
}
