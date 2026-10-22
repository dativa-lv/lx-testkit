import { wcagCriteria, relevantCriteriaCategories } from '../wcag/criteria.js';
import { impactToLevel } from '../wcag/evaluator.js';
import { axeRuleNames } from '../wcag/checklist.js';
import { generateId } from '../ids/generateId.js';

function formatErrorDetails(violation, { needsManualReview = false } = {}) {
  const nodeCount = violation.nodes?.length ?? 0;
  const nodeSummaries = (violation.nodes ?? [])
    .slice(0, 5)
    .map((node) => {
      const selector = Array.isArray(node.target) ? node.target.join(' ') : String(node.target);
      return node.failureSummary ? `${selector} - ${node.failureSummary}` : selector;
    })
    .join('\n');

  return [
    needsManualReview ? 'Needs manual verification - this could not be confirmed automatically.' : null,
    violation.description,
    nodeCount ? `Affected elements (${nodeCount}):\n${nodeSummaries}` : null,
    violation.helpUrl ? `More info: ${violation.helpUrl}` : null,
  ]
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Builds the LX accessibility report object (`projectDetails`, `protocolData`,
 * `selectedPageId`, `pages`, `errorRegistry`) from normalized findings.
 *
 * This builder knows nothing about Playwright or axe-core: it only consumes
 * `{ name, url, criterionStatuses, preselectedCriteria }` per page, where
 * `criterionStatuses` is the `Map<criterionNumber, { matchStatus, violations }>`
 * produced by `wcag/evaluator.js`, and `preselectedCriteria` is the array of
 * content categories (`images`/`multimedia`/`form`) confirmed present on the
 * page - criteria in those categories stay "not-verifiable" until unlocked.
 */
export class AccessibilityReportBuilder {
  constructor({ projectName, protocol = {}, baseUrl, generatedAt = new Date() } = {}) {
    const isoDate = generatedAt.toISOString();

    this.projectDetails = {
      projectName: projectName ?? null,
      date: isoDate,
    };

    const checkPerformedBy = protocol.checkPerformedBy?.length
      ? protocol.checkPerformedBy
      : [{ fullName: '', role: null }];

    this.protocolData = {
      institutionName: protocol.institutionName ?? null,
      url: baseUrl ?? null,
      date: isoDate.slice(0, 10),
      checkPerformedBy: checkPerformedBy.map((person) => ({
        fullName: person.fullName ?? '',
        role: person.role ?? null,
        _lx_appendableKey: generateId(),
        canRemove: false,
      })),
      checkConfirmedByName: protocol.checkConfirmedByName ?? null,
      checkConfirmedByRole: protocol.checkConfirmedByRole ?? null,
    };

    this.selectedPageId = null;
    this.pages = [];
    this.errorRegistry = {};
  }

  registerError({ violation, criterion, pageId, needsManualReview = false }) {
    const regId = generateId();

    this.errorRegistry[regId] = {
      regId,
      id: violation.id,
      name: axeRuleNames[violation.id] ?? violation.help ?? violation.description ?? violation.id,
      errorDetails: formatErrorDetails(violation, { needsManualReview }),
      files: [],
      extended: false,
      level: impactToLevel(violation.impact),
      _lx_appendableKey: generateId(),
      criterionId: criterion.id,
      criterionName: criterion.name,
      criterionNumber: criterion.number,
      criterionCategory: criterion.category,
      pageId,
    };

    return regId;
  }

  addPage({ name, url, criterionStatuses, preselectedCriteria = [] }) {
    const pageId = generateId();

    const criteria = wcagCriteria.map((criterion) => {
      // Categories like images/multimedia/form only apply when the page is
      // known to contain that kind of content - otherwise automated (or even
      // manual) evaluation can't say anything meaningful about them.
      const isGatedCategory = relevantCriteriaCategories.includes(criterion.category);
      const isUnlocked = !isGatedCategory || preselectedCriteria.includes(criterion.category);

      if (!isUnlocked) {
        return {
          id: criterion.id,
          number: criterion.number,
          name: criterion.name,
          category: criterion.category,
          matchStatus: 'not-verifiable',
          expanded: false,
          errors: [],
        };
      }

      const status = criterionStatuses.get(criterion.number);
      const errors = [
        ...(status?.violations ?? []).map((violation) =>
          this.registerError({ violation, criterion, pageId, needsManualReview: Boolean(violation.needsManualReview) })
        ),
        ...(status?.incomplete ?? []).map((violation) =>
          this.registerError({ violation, criterion, pageId, needsManualReview: violation.needsManualReview ?? true })
        ),
      ];

      return {
        id: criterion.id,
        number: criterion.number,
        name: criterion.name,
        category: criterion.category,
        matchStatus: status?.matchStatus ?? null,
        expanded: false,
        errors,
      };
    });

    const page = {
      id: pageId,
      _lx_appendableKey: pageId,
      name,
      url,
      preselectedCriteria: [...preselectedCriteria],
      criteria,
    };

    this.pages.push(page);

    if (!this.selectedPageId) {
      this.selectedPageId = pageId;
    }

    return page;
  }

  build() {
    return {
      projectDetails: this.projectDetails,
      protocolData: this.protocolData,
      selectedPageId: this.selectedPageId,
      pages: this.pages,
      errorRegistry: this.errorRegistry,
    };
  }
}
