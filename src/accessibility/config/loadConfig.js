import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { validateConfig } from './validateConfig.js';

/**
 * Loads and validates an accessibility config module from an absolute path.
 * Throws descriptive errors for missing files, import failures, and invalid
 * config shapes so failures never surface as obscure Playwright errors later.
 */
export async function loadAccessibilityConfig(configPath) {
  if (!existsSync(configPath)) {
    throw new Error(`Config file does not exist: ${configPath}`);
  }

  let importedModule;
  try {
    importedModule = await import(pathToFileURL(configPath).href);
  } catch (err) {
    throw new Error(`Could not import config module at ${configPath}: ${err.message}`);
  }

  const config = importedModule.default ?? importedModule;
  validateConfig(config);
  return config;
}
