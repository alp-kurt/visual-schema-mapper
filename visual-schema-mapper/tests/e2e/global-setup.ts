const JEST_MATCHERS_SYMBOL = Symbol.for('$$jest-matchers-object')

/**
 * Playwright adds `expect` to the global scope, which may include Jest-specific matcher
 * metadata. Removing the matcher symbol avoids leaking Jest state into Playwright tests
 * that only need the basic assertions provided by Playwright.
 */
export default async function globalSetup(): Promise<void> {
  const globalExpect = getGlobalExpect()

  if (!globalExpect) {
    return
  }

  removeJestMatchers(globalExpect)
}

function getGlobalExpect(): Record<PropertyKey, unknown> | null {
  const candidate = (globalThis as Record<PropertyKey, unknown> | undefined)?.['expect']

  if (candidate === null || typeof candidate !== 'object') {
    return null
  }

  return candidate as Record<PropertyKey, unknown>
}

function removeJestMatchers(expectObject: Record<PropertyKey, unknown>): void {
  if (Object.prototype.hasOwnProperty.call(expectObject, JEST_MATCHERS_SYMBOL)) {
    Reflect.deleteProperty(expectObject, JEST_MATCHERS_SYMBOL)
  }
}
