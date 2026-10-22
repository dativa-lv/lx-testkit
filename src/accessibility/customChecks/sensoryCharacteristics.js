// Custom heuristic check for WCAG 1.3.3 (Sensory Characteristics), which
// axe-core cannot verify: "instructions ... do not rely solely on sensory
// characteristics such as shape, color, size, or [visual] location".
//
// A match here is treated as a violation (matchStatus becomes `not-match`)
// because it's real, if imperfect, evidence worth surfacing prominently -
// but it's still just a heuristic (e.g. "click the green Submit button" is
// fine if "Submit" is itself a sufficient identifier), so `needsManualReview`
// is set on the finding to keep the "needs manual verification" caveat in
// its error text rather than presenting it as a certain failure.
//
// The pattern is exported so it can be unit-tested directly (as plain JS)
// without a browser, and its `.source`/`.flags` are passed into
// `page.evaluate()` to run the same pattern inside the page (Playwright
// can't serialize RegExp objects across the evaluate() boundary).
const ACTION_VERBS =
  'click|press|tap|select|choose|nospied(?:iet|ies)?|spiediet|izv[ēe]lieties|noklik[šs][ķk]in(?:iet)?';

const SENSORY_DESCRIPTORS =
  'red|green|blue|yellow|orange|purple|pink|black|white|gray|grey|' +
  'round|square|circular|triangular|star-shaped|' +
  'left|right|top|bottom|above|below|next\\s+to|' +
  'sarkan\\w*|za[ļl]\\w*|zil\\w*|dzeltan?\\w*|oran[žz]\\w*|meln\\w*|balt\\w*|' +
  'apa[ļl]\\w*|kvadr[āa]tveida|apl[iī]s|tr[īi]sst[ūu]r\\w*|' +
  'kreisaj\\w*|labaj\\w*|augš[āa]\\w*|apakš[āa]\\w*|zem|virs|blakus';

export const SENSORY_REFERENCE_PATTERN = new RegExp(
  `\\b(?:${ACTION_VERBS})\\w*\\b[^.!?\\n]{0,60}\\b(?:${SENSORY_DESCRIPTORS})\\w*\\b`,
  'gi'
);

const MAX_FINDINGS = 25;

export async function checkSensoryCharacteristics(page) {
  const matches = await page.evaluate(
    ({ source, flags, maxFindings }) => {
      const pattern = new RegExp(source, flags);
      const results = [];

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const text = node.nodeValue;
          if (!text || !text.trim() || !node.parentElement) {
            return NodeFilter.FILTER_REJECT;
          }
          const style = window.getComputedStyle(node.parentElement);
          if (style.display === 'none' || style.visibility === 'hidden') {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      let node;
      while ((node = walker.nextNode()) && results.length < maxFindings) {
        const text = node.nodeValue.trim();
        pattern.lastIndex = 0;
        const found = pattern.exec(text);
        if (!found) {
          continue;
        }

        const parent = node.parentElement;
        const classes = String(parent.className || '')
          .split(/\s+/)
          .filter(Boolean)
          .join('.');
        const selector = parent.id
          ? `#${parent.id}`
          : `${parent.tagName.toLowerCase()}${classes ? `.${classes}` : ''}`;

        results.push({ text: text.slice(0, 200), selector, phrase: found[0] });
      }

      return results;
    },
    { source: SENSORY_REFERENCE_PATTERN.source, flags: SENSORY_REFERENCE_PATTERN.flags, maxFindings: MAX_FINDINGS }
  );

  if (matches.length === 0) {
    return { violations: [], incomplete: [] };
  }

  return {
    violations: [
      {
        id: 'custom-sensory-characteristics',
        impact: 'moderate',
        tags: ['wcag133'],
        needsManualReview: true,
        help: 'Content may rely on sensory characteristics (shape, color, size, or position) alone',
        description:
          'Automated heuristic flagged text referencing shape, color, or position near an action verb. ' +
          'Manually verify each instance also has a non-sensory identifier (e.g. visible text label) - ' +
          'this alone is not a confirmed failure.',
        nodes: matches.map((match) => ({
          target: [match.selector],
          failureSummary: `Matched "${match.phrase}" in: "${match.text}"`,
        })),
      },
    ],
    incomplete: [],
  };
}
