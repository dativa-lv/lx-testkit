import { knownRuleSets } from '../wcag/checklist.js';

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

const VALID_PRESELECTED_CRITERIA = ['form', 'images', 'multimedia'];
const VALID_RULE_SETS = ['all', 'axe', ...knownRuleSets];

function validatePreselectedCriteria(value, label, errors) {
  if (value === undefined) {
    return;
  }

  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array when provided.`);
    return;
  }

  value.forEach((item, itemIndex) => {
    if (!VALID_PRESELECTED_CRITERIA.includes(item)) {
      errors.push(`${label}[${itemIndex}] must be one of: ${VALID_PRESELECTED_CRITERIA.join(', ')}.`);
    }
  });
}

function validatePage(page, index, errors) {
  if (!page || typeof page !== 'object' || Array.isArray(page)) {
    errors.push(`pages[${index}] must be an object.`);
    return;
  }

  if (!isNonEmptyString(page.name)) {
    errors.push(`pages[${index}].name is required and must be a non-empty string.`);
  }

  const hasPath = isNonEmptyString(page.path);
  const hasUrl = isNonEmptyString(page.url);

  if (!hasPath && !hasUrl) {
    errors.push(`pages[${index}].path (relative to baseUrl) or pages[${index}].url is required.`);
  }

  validatePreselectedCriteria(page.preselectedCriteria, `pages[${index}].preselectedCriteria`, errors);

  if (page.states === undefined) {
    return;
  }

  if (!Array.isArray(page.states) || page.states.length === 0) {
    errors.push(`pages[${index}].states must be a non-empty array when provided.`);
    return;
  }

  page.states.forEach((state, stateIndex) => {
    if (!state || typeof state !== 'object' || Array.isArray(state)) {
      errors.push(`pages[${index}].states[${stateIndex}] must be an object.`);
      return;
    }

    if (!isNonEmptyString(state.name)) {
      errors.push(`pages[${index}].states[${stateIndex}].name is required and must be a non-empty string.`);
    }

    if (state.run !== undefined && typeof state.run !== 'function') {
      errors.push(`pages[${index}].states[${stateIndex}].run must be a function when provided.`);
    }

    validatePreselectedCriteria(
      state.preselectedCriteria,
      `pages[${index}].states[${stateIndex}].preselectedCriteria`,
      errors
    );
  });
}

/**
 * Validates an accessibility config object, throwing a single descriptive
 * error listing every problem found (instead of failing later with an
 * obscure Playwright error deep inside the runner).
 */
export function validateConfig(config) {
  const errors = [];

  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new Error('Accessibility config must export a default object.');
  }

  if (!isNonEmptyString(config.projectName)) {
    errors.push('"projectName" is required and must be a non-empty string.');
  }

  if (!isNonEmptyString(config.baseUrl)) {
    errors.push('"baseUrl" is required and must be a non-empty string.');
  }

  if (!Array.isArray(config.pages) || config.pages.length === 0) {
    errors.push('"pages" is required and must be a non-empty array.');
  } else {
    config.pages.forEach((page, index) => validatePage(page, index, errors));
  }

  if (config.ruleSet !== undefined) {
    errors.push('"ruleSet" has been renamed to "ruleSets".');
  }

  if (config.ruleSets !== undefined) {
    if (!Array.isArray(config.ruleSets) || config.ruleSets.length === 0) {
      errors.push('"ruleSets" must be a non-empty array.');
    } else {
      config.ruleSets.forEach((selectedRuleSet, index) => {
        if (!VALID_RULE_SETS.includes(selectedRuleSet)) {
          errors.push(`"ruleSets[${index}]" must be one of: ${VALID_RULE_SETS.join(', ')}.`);
        }
      });
    }
  }

  if (config.customChecks !== undefined && typeof config.customChecks !== 'boolean') {
    errors.push('"customChecks" must be a boolean when provided.');
  }

  if (errors.length > 0) {
    throw new Error(`Invalid accessibility config:\n- ${errors.join('\n- ')}`);
  }
}
