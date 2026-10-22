import { describe, test, expect } from 'bun:test';
import { AccessibilityReportBuilder } from '../../src/accessibility/report/AccessibilityReportBuilder.js';
import { wcagCriteria } from '../../src/accessibility/wcag/criteria.js';
import { evaluateAxeResults } from '../../src/accessibility/wcag/evaluator.js';
import { axeRuleNames } from '../../src/accessibility/wcag/checklist.js';

// Contract test: guards the exact shape required by the LX accessibility
// protocol tool (see the uploaded report.json example). Any renamed/missing
// property, wrong nesting, or broken error reference should fail here.

function buildSampleReport() {
  const builder = new AccessibilityReportBuilder({
    projectName: 'LX portāls',
    baseUrl: 'https://lx-ui.dev/lv',
    protocol: {
      institutionName: null,
      checkPerformedBy: [{ fullName: '', role: null }],
    },
    generatedAt: new Date('2026-09-16T07:13:56.410Z'),
  });

  const axeResults = {
    passes: [{ id: 'button-name', tags: ['wcag412'] }],
    violations: [
      {
        id: 'spacing-within-word',
        tags: ['wcag132'],
        impact: 'moderate',
        description: 'Ensure text is not styled using css in a way that could be misread',
        help: 'Izmantotas atstarpes, lai kontrolētu atstarpes vārda iekšienē',
        helpUrl: 'https://dequeuniversity.com/rules/axe/spacing-within-word',
        nodes: [{ target: ['.title'], failureSummary: 'Fix this' }],
      },
    ],
  };

  builder.addPage({
    name: 'button variations',
    url: 'https://lx-ui.dev/lv/sandbox/button/variations',
    criterionStatuses: evaluateAxeResults(axeResults),
  });

  return builder.build();
}

describe('AccessibilityReportBuilder contract', () => {
  test('root object has exactly the required top-level keys', () => {
    const report = buildSampleReport();
    expect(Object.keys(report).sort()).toEqual(
      ['projectDetails', 'protocolData', 'selectedPageId', 'pages', 'errorRegistry'].sort()
    );
  });

  test('projectDetails matches the required shape', () => {
    const { projectDetails } = buildSampleReport();
    expect(Object.keys(projectDetails).sort()).toEqual(['projectName', 'date'].sort());
    expect(projectDetails.projectName).toBe('LX portāls');
    expect(typeof projectDetails.date).toBe('string');
  });

  test('protocolData matches the required shape', () => {
    const { protocolData } = buildSampleReport();
    expect(Object.keys(protocolData).sort()).toEqual(
      [
        'institutionName',
        'url',
        'date',
        'checkPerformedBy',
        'checkConfirmedByName',
        'checkConfirmedByRole',
      ].sort()
    );
    expect(protocolData.url).toBe('https://lx-ui.dev/lv');
    expect(Array.isArray(protocolData.checkPerformedBy)).toBe(true);
    expect(Object.keys(protocolData.checkPerformedBy[0]).sort()).toEqual(
      ['fullName', 'role', '_lx_appendableKey', 'canRemove'].sort()
    );
  });

  test('pages contain every registry criterion with the required shape', () => {
    const { pages } = buildSampleReport();
    expect(pages).toHaveLength(1);

    const page = pages[0];
    expect(Object.keys(page).sort()).toEqual(
      ['id', '_lx_appendableKey', 'name', 'url', 'preselectedCriteria', 'criteria'].sort()
    );
    expect(page.id).toBe(page._lx_appendableKey);
    expect(page.criteria).toHaveLength(wcagCriteria.length);

    for (const criterion of page.criteria) {
      expect(Object.keys(criterion).sort()).toEqual(
        ['id', 'number', 'name', 'category', 'matchStatus', 'expanded', 'errors'].sort()
      );
      expect(Array.isArray(criterion.errors)).toBe(true);
    }
  });

  test('matchStatus only uses the LX status vocabulary', () => {
    const { pages } = buildSampleReport();
    const allowed = new Set(['match', 'not-match', 'not-verifiable', null]);
    for (const criterion of pages[0].criteria) {
      expect(allowed.has(criterion.matchStatus)).toBe(true);
    }
  });

  test('a violation becomes a not-match criterion with an error reference', () => {
    const { pages } = buildSampleReport();
    const criterion = pages[0].criteria.find((c) => c.number === '1.3.2');
    expect(criterion.matchStatus).toBe('not-match');
    expect(criterion.errors).toHaveLength(1);
  });

  test('a criterion with no automated coverage stays null (never falsely "match")', () => {
    const { pages } = buildSampleReport();
    const criterion = pages[0].criteria.find((c) => c.number === '2.1.1');
    expect(criterion.matchStatus).toBeNull();
  });

  test('errorRegistry entries have the required shape and resolve back to the criterion/page', () => {
    const { pages, errorRegistry } = buildSampleReport();
    const page = pages[0];
    const criterion = page.criteria.find((c) => c.number === '1.3.2');
    const [regId] = criterion.errors;

    expect(Object.keys(errorRegistry[regId]).sort()).toEqual(
      [
        'regId',
        'id',
        'name',
        'errorDetails',
        'files',
        'extended',
        'level',
        '_lx_appendableKey',
        'criterionId',
        'criterionName',
        'criterionNumber',
        'criterionCategory',
        'pageId',
      ].sort()
    );

    const entry = errorRegistry[regId];
    expect(entry.regId).toBe(regId);
    expect(entry.pageId).toBe(page.id);
    expect(entry.criterionId).toBe(criterion.id);
    expect(entry.criterionNumber).toBe('1.3.2');
    expect(entry.level).toBe(3);
  });

  test('generated ids are unique across pages and the error registry', () => {
    const { pages, errorRegistry } = buildSampleReport();
    const ids = [pages[0].id, ...Object.keys(errorRegistry)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('selectedPageId points at a real page', () => {
    const { pages, selectedPageId } = buildSampleReport();
    expect(pages.some((p) => p.id === selectedPageId)).toBe(true);
  });
});

describe('AccessibilityReportBuilder preselectedCriteria gating', () => {
  function buildPageWithViolation(preselectedCriteria) {
    const builder = new AccessibilityReportBuilder({
      projectName: 'LX portāls',
      baseUrl: 'https://lx-ui.dev/lv',
      generatedAt: new Date('2026-09-16T07:13:56.410Z'),
    });

    // "image-alt" maps to 1.1.1 (category "images"), a gated category.
    const axeResults = {
      violations: [
        {
          id: 'image-alt',
          tags: ['wcag111'],
          impact: 'critical',
          description: 'Images must have alternate text',
          nodes: [{ target: ['img'], failureSummary: 'Add alt text' }],
        },
      ],
    };

    const page = builder.addPage({
      name: 'readme',
      url: 'https://lx-ui.dev/lv/info/readme',
      criterionStatuses: evaluateAxeResults(axeResults),
      preselectedCriteria,
    });

    return { builder, page };
  }

  test('a gated category (images/multimedia/form) stays not-verifiable with no errors when not preselected', () => {
    const { page } = buildPageWithViolation([]);
    const criterion = page.criteria.find((c) => c.number === '1.1.1');
    expect(criterion.matchStatus).toBe('not-verifiable');
    expect(criterion.errors).toEqual([]);
  });

  test('preselecting the category unlocks real evaluation (violations surface as not-match)', () => {
    const { page, builder } = buildPageWithViolation(['images']);
    const criterion = page.criteria.find((c) => c.number === '1.1.1');
    expect(criterion.matchStatus).toBe('not-match');
    expect(criterion.errors).toHaveLength(1);
    expect(builder.errorRegistry[criterion.errors[0]].criterionNumber).toBe('1.1.1');
  });

  test('the page records exactly the preselected categories', () => {
    const { page } = buildPageWithViolation(['images', 'form']);
    expect(page.preselectedCriteria).toEqual(['images', 'form']);
  });

  test('non-gated categories (e.g. structure, keyboard) are unaffected by preselectedCriteria', () => {
    const { page } = buildPageWithViolation([]);
    const structureCriterion = page.criteria.find((c) => c.number === '4.1.2');
    expect(structureCriterion.matchStatus).toBeNull();
  });
});

describe('AccessibilityReportBuilder incomplete findings', () => {
  test('an incomplete finding is registered as an error but the criterion stays not-verifiable', () => {
    const builder = new AccessibilityReportBuilder({
      projectName: 'LX portāls',
      baseUrl: 'https://lx-ui.dev/lv',
      generatedAt: new Date('2026-09-16T07:13:56.410Z'),
    });

    const axeResults = {
      incomplete: [
        {
          id: 'th-has-data-cells',
          tags: ['wcag131'],
          impact: 'serious',
          description: 'Ensure that th elements and elements with role=columnheader/rowheader have data cells they describe',
          help: 'Table headers in a data table must refer to data cells',
          nodes: [{ target: ['table'], failureSummary: 'Table data cells are missing or empty' }],
        },
      ],
    };

    const page = builder.addPage({
      name: 'aaa',
      url: 'https://localhost:44342/lv/exhibition',
      criterionStatuses: evaluateAxeResults(axeResults),
    });

    const criterion = page.criteria.find((c) => c.number === '1.3.1');
    expect(criterion.matchStatus).toBe('not-verifiable');
    expect(criterion.errors).toHaveLength(1);

    const entry = builder.errorRegistry[criterion.errors[0]];
    expect(entry.id).toBe('th-has-data-cells');
    expect(entry.errorDetails).toContain('Needs manual verification');
    // Uses the LX manual checklist's own localized name for known axe rules
    // instead of axe's English help text (see wcag/checklist.js).
    expect(entry.name).toBe(axeRuleNames['th-has-data-cells']);
  });

  test('falls back to axe help text when a rule has no LX checklist name', () => {
    const builder = new AccessibilityReportBuilder({
      projectName: 'LX portāls',
      baseUrl: 'https://lx-ui.dev/lv',
      generatedAt: new Date('2026-09-16T07:13:56.410Z'),
    });

    const axeResults = {
      violations: [
        {
          id: 'not-a-real-axe-rule-id',
          tags: ['wcag412'],
          impact: 'serious',
          help: 'Some axe help text',
          nodes: [],
        },
      ],
    };

    const page = builder.addPage({
      name: 'aaa',
      url: 'https://localhost:44342/lv/exhibition',
      criterionStatuses: evaluateAxeResults(axeResults),
    });

    const criterion = page.criteria.find((c) => c.number === '4.1.2');
    const entry = builder.errorRegistry[criterion.errors[0]];
    expect(entry.name).toBe('Some axe help text');
  });

  test('a violation can also carry needsManualReview (e.g. custom heuristic checks), staying not-match with the caveat text', () => {
    const builder = new AccessibilityReportBuilder({
      projectName: 'LX portāls',
      baseUrl: 'https://lx-ui.dev/lv',
      generatedAt: new Date('2026-09-16T07:13:56.410Z'),
    });

    const axeResults = {
      violations: [
        {
          id: 'custom-sensory-characteristics',
          tags: ['wcag133'],
          impact: 'moderate',
          needsManualReview: true,
          help: 'Content may rely on sensory characteristics alone',
          description: 'Automated heuristic flagged text referencing shape, color, or position near an action verb.',
          nodes: [{ target: ['li'], failureSummary: 'Matched "click the red" in: "..."' }],
        },
      ],
    };

    const page = builder.addPage({
      name: 'aaa',
      url: 'https://localhost:44342/lv/exhibition',
      criterionStatuses: evaluateAxeResults(axeResults),
    });

    const criterion = page.criteria.find((c) => c.number === '1.3.3');
    expect(criterion.matchStatus).toBe('not-match');

    const entry = builder.errorRegistry[criterion.errors[0]];
    expect(entry.errorDetails).toContain('Needs manual verification');
  });
});

describe('AccessibilityReportBuilder multiple violations', () => {
  function buildPage(axeResults) {
    const builder = new AccessibilityReportBuilder({
      projectName: 'LX portāls',
      baseUrl: 'https://lx-ui.dev/lv',
      generatedAt: new Date('2026-09-16T07:13:56.410Z'),
    });

    const page = builder.addPage({
      name: 'readme',
      url: 'https://lx-ui.dev/lv/info/readme',
      criterionStatuses: evaluateAxeResults(axeResults),
    });

    return { builder, page };
  }

  test('two different axe rules violating the same criterion each get their own registry entry', () => {
    const { builder, page } = buildPage({
      violations: [
        { id: 'aria-command-name', tags: ['wcag412'], impact: 'serious', description: 'a', nodes: [] },
        { id: 'nested-interactive', tags: ['wcag412'], impact: 'serious', description: 'b', nodes: [] },
      ],
    });

    const criterion = page.criteria.find((c) => c.number === '4.1.2');
    expect(criterion.matchStatus).toBe('not-match');
    expect(criterion.errors).toHaveLength(2);
    expect(new Set(criterion.errors).size).toBe(2); // distinct regIds

    const registeredRuleIds = criterion.errors.map((regId) => builder.errorRegistry[regId].id);
    expect(registeredRuleIds.sort()).toEqual(['aria-command-name', 'nested-interactive']);
  });

  test('one rule failing on many nodes stays a single registry entry summarizing all affected elements', () => {
    const nodes = Array.from({ length: 7 }, (_, i) => ({
      target: [`#el-${i}`],
      failureSummary: 'Element has a tabindex greater than 0',
    }));
    const { builder, page } = buildPage({
      violations: [{ id: 'tabindex', tags: [], impact: 'serious', description: 'x', nodes }],
    });

    const criterion = page.criteria.find((c) => c.number === '0');
    expect(criterion.errors).toHaveLength(1);
    const entry = builder.errorRegistry[criterion.errors[0]];
    expect(entry.errorDetails).toContain('Affected elements (7)');
  });

  test('one axe rule mapped to multiple criteria creates one registry entry per criterion', () => {
    const { builder, page } = buildPage({
      violations: [
        {
          id: 'link-name',
          tags: ['wcag244', 'wcag412'],
          impact: 'serious',
          description: 'Links must have discernible text',
          nodes: [],
        },
      ],
    });

    const linkPurpose = page.criteria.find((c) => c.number === '2.4.4');
    const nameRoleValue = page.criteria.find((c) => c.number === '4.1.2');

    expect(linkPurpose.matchStatus).toBe('not-match');
    expect(nameRoleValue.matchStatus).toBe('not-match');
    expect(linkPurpose.errors).toHaveLength(1);
    expect(nameRoleValue.errors).toHaveLength(1);

    // Different registry entries (different regId, different criterion), same underlying axe rule id.
    expect(linkPurpose.errors[0]).not.toBe(nameRoleValue.errors[0]);
    expect(builder.errorRegistry[linkPurpose.errors[0]].id).toBe('link-name');
    expect(builder.errorRegistry[nameRoleValue.errors[0]].id).toBe('link-name');
    expect(builder.errorRegistry[linkPurpose.errors[0]].criterionNumber).toBe('2.4.4');
    expect(builder.errorRegistry[nameRoleValue.errors[0]].criterionNumber).toBe('4.1.2');
  });
});
