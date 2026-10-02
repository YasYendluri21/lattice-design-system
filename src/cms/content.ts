/**
 * The content store behind the GraphQL layer.
 *
 * In a deployment this is Optimizely, Contentful or Sanity. Here it's a local module with the same
 * shape, so the repository runs with no account and no keys — and, more usefully, so the page code
 * can be written against a schema rather than against a vendor's SDK. Swapping to a real CMS means
 * pointing `CMS_GRAPHQL_ENDPOINT` at it and matching the schema; no component changes.
 *
 * The content model is deliberately the one marketing sites actually need: a page is an ordered
 * list of typed blocks, not a blob of rich text, so the same components compose any page an editor
 * assembles.
 */

export interface HeroBlock {
  __typename: 'HeroBlock';
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string } | null;
}

export interface FeatureGridBlock {
  __typename: 'FeatureGridBlock';
  heading: string;
  features: Array<{ id: string; title: string; body: string; badge: string | null }>;
}

export interface MetricsBlock {
  __typename: 'MetricsBlock';
  heading: string;
  metrics: Array<{ id: string; value: string; label: string }>;
}

export interface FaqBlock {
  __typename: 'FaqBlock';
  heading: string;
  questions: Array<{ id: string; question: string; answer: string }>;
}

export interface CtaBlock {
  __typename: 'CtaBlock';
  heading: string;
  body: string;
  cta: { label: string; href: string };
}

export type Block = HeroBlock | FeatureGridBlock | MetricsBlock | FaqBlock | CtaBlock;

export interface Page {
  slug: string;
  title: string;
  description: string;
  blocks: Block[];
}

export const pages: Page[] = [
  {
    slug: 'home',
    title: 'Lattice — a design system that ships',
    description:
      'An accessible React component library, driven by design tokens and composed from a headless CMS.',
    blocks: [
      {
        __typename: 'HeroBlock',
        eyebrow: 'Design system',
        heading: 'Components your editors can actually assemble',
        body: 'Lattice pairs an accessible React component library with a content model that marketing owns. Designers change a token, editors rearrange blocks, and nobody files a ticket to move a button.',
        primaryCta: { label: 'Browse components', href: '/components' },
        secondaryCta: { label: 'Read the tokens', href: '#tokens' }
      },
      {
        __typename: 'MetricsBlock',
        heading: 'What it buys you',
        metrics: [
          { id: 'm1', value: '11', label: 'Components, documented in Storybook' },
          { id: 'm2', value: '0', label: 'Hardcoded colours outside the token file' },
          { id: 'm3', value: 'WCAG 2.1 AA', label: 'Verified by automated axe checks in CI' }
        ]
      },
      {
        __typename: 'FeatureGridBlock',
        heading: 'How it fits together',
        features: [
          {
            id: 'f1',
            title: 'Tokens are the contract',
            body: 'A Figma export compiles straight into the Tailwind theme. If a value is not a token, there is no utility class for it, so drift is a build error rather than a design review.',
            badge: 'Figma to code'
          },
          {
            id: 'f2',
            title: 'Content is structured, not pasted',
            body: 'Pages are an ordered list of typed blocks fetched over GraphQL. Editors reorder and refill them; the renderer maps each block type to a component and nothing else.',
            badge: 'Headless CMS'
          },
          {
            id: 'f3',
            title: 'Accessibility is tested, not asserted',
            body: 'Focus management, roving tabindex and live-region politeness are built into the components, and every page is scanned with axe in the end-to-end suite.',
            badge: 'WCAG 2.1 AA'
          },
          {
            id: 'f4',
            title: 'Server-rendered by default',
            body: 'Blocks render on the server; only the components that genuinely need state — tabs, dialog, accordion — opt into the client. The marketing page ships almost no JavaScript.',
            badge: 'Next.js'
          }
        ]
      },
      {
        __typename: 'FaqBlock',
        heading: 'Questions we get',
        questions: [
          {
            id: 'q1',
            question: 'Why generate the Tailwind theme instead of writing it?',
            answer:
              'Because then design owns it. The token file is the export from Figma, and the theme is a build artefact. When a brand colour changes, nobody greps the codebase — they re-export and rebuild.'
          },
          {
            id: 'q2',
            question: 'Why typed blocks rather than rich text?',
            answer:
              'Rich text puts layout decisions in the editor and markup you cannot style in the database. Typed blocks keep the editor in charge of what and the design system in charge of how.'
          },
          {
            id: 'q3',
            question: 'How is accessibility verified?',
            answer:
              'Three layers. Components encode the patterns — focus trapping in the dialog, roving tabindex in the tabs. Unit tests assert the ARIA wiring. The Playwright suite runs axe against every rendered page and fails the build on a violation.'
          },
          {
            id: 'q4',
            question: 'What would change to run this against a real CMS?',
            answer:
              'The endpoint. Queries are written against a schema, not a vendor SDK, so pointing CMS_GRAPHQL_ENDPOINT at Optimizely, Contentful or Sanity and matching the block types is the whole migration.'
          }
        ]
      },
      {
        __typename: 'CtaBlock',
        heading: 'Have a look at the components',
        body: 'Every component below is documented in Storybook with its states, its keyboard behaviour, and the accessibility decisions behind it.',
        cta: { label: 'Open the component gallery', href: '/components' }
      }
    ]
  }
];

export const findPage = (slug: string): Page | undefined => pages.find((page) => page.slug === slug);
