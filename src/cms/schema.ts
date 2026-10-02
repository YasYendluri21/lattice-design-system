import { createSchema, createYoga } from 'graphql-yoga';
import { findPage, pages } from './content';

/**
 * The GraphQL content API.
 *
 * Modelled on how headless CMS platforms actually expose structured content: a page resolves to an
 * ordered union of block types, and the client selects fields per type with inline fragments. The
 * union is the important part — it is what lets an editor reorder and mix blocks while the
 * renderer stays a simple exhaustive switch.
 */

export const typeDefs = /* GraphQL */ `
  type Cta {
    label: String!
    href: String!
  }

  type HeroBlock {
    eyebrow: String!
    heading: String!
    body: String!
    primaryCta: Cta!
    secondaryCta: Cta
  }

  type Feature {
    id: ID!
    title: String!
    body: String!
    badge: String
  }

  type FeatureGridBlock {
    heading: String!
    features: [Feature!]!
  }

  type Metric {
    id: ID!
    value: String!
    label: String!
  }

  type MetricsBlock {
    heading: String!
    metrics: [Metric!]!
  }

  type Question {
    id: ID!
    question: String!
    answer: String!
  }

  type FaqBlock {
    heading: String!
    questions: [Question!]!
  }

  type CtaBlock {
    heading: String!
    body: String!
    cta: Cta!
  }

  union Block = HeroBlock | FeatureGridBlock | MetricsBlock | FaqBlock | CtaBlock

  type Page {
    slug: ID!
    title: String!
    description: String!
    blocks: [Block!]!
  }

  type Query {
    page(slug: ID!): Page
    pages: [Page!]!
  }
`;

export const schema = createSchema({
  typeDefs,
  resolvers: {
    Query: {
      page: (_: unknown, { slug }: { slug: string }) => findPage(slug) ?? null,
      pages: () => pages
    },
    // Block is a union, so the server has to say which concrete type each value is. The content
    // records carry __typename for exactly this reason.
    Block: {
      __resolveType: (block: { __typename: string }) => block.__typename
    }
  }
});

export const yoga = createYoga({ schema, graphqlEndpoint: '/api/graphql', fetchAPI: { Response } });
