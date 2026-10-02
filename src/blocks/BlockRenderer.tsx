import type { Block } from '@/cms/content';
import { Accordion } from '@/components/Accordion';
import { Badge } from '@/components/Badge';
import { ButtonLink } from '@/components/ButtonLink';
import { Card, CardBody, CardTitle } from '@/components/Card';

/**
 * Maps CMS block types to components.
 *
 * This is the only place content and presentation meet. Everything above it is structured data
 * from the CMS; everything below is the design system. The switch is exhaustive — the `never` in
 * the default branch means adding a block type to the schema without handling it here is a
 * compile error, not a blank space on a live page.
 */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <Block key={`${block.__typename}-${index}`} block={block} />
      ))}
    </>
  );
}

function Block({ block }: { block: Block }) {
  switch (block.__typename) {
    case 'HeroBlock':
      return (
        <section className="border-b border-neutral-200 bg-gradient-to-b from-brand-50 to-neutral-0 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">
              {block.eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-neutral-900 text-balance md:text-5xl">
              {block.heading}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-600">{block.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink size="lg" href={block.primaryCta.href}>
                {block.primaryCta.label}
              </ButtonLink>
              {block.secondaryCta && (
                <ButtonLink size="lg" variant="secondary" href={block.secondaryCta.href}>
                  {block.secondaryCta.label}
                </ButtonLink>
              )}
            </div>
          </div>
        </section>
      );

    case 'MetricsBlock':
      return (
        <section className="border-b border-neutral-200 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold text-neutral-900">{block.heading}</h2>
            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              {block.metrics.map((metric) => (
                <div key={metric.id} className="border-l-2 border-brand-500 pl-4">
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <span className="block text-3xl font-bold tabular-nums text-neutral-900">
                      {metric.value}
                    </span>
                    <span className="mt-1 block text-base text-neutral-600" aria-hidden="true">
                      {metric.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      );

    case 'FeatureGridBlock':
      return (
        <section className="border-b border-neutral-200 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold text-neutral-900">{block.heading}</h2>
            <ul className="mt-8 grid list-none gap-5 p-0 md:grid-cols-2">
              {block.features.map((feature) => (
                <Card as="li" key={feature.id}>
                  {feature.badge && (
                    <div className="mb-3">
                      <Badge tone="brand">{feature.badge}</Badge>
                    </div>
                  )}
                  <CardTitle>{feature.title}</CardTitle>
                  <CardBody>{feature.body}</CardBody>
                </Card>
              ))}
            </ul>
          </div>
        </section>
      );

    case 'FaqBlock':
      return (
        <section className="border-b border-neutral-200 py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-8 text-2xl font-semibold text-neutral-900">{block.heading}</h2>
            <Accordion
              headingLevel={3}
              items={block.questions.map((q) => ({ id: q.id, question: q.question, answer: q.answer }))}
            />
          </div>
        </section>
      );

    case 'CtaBlock':
      return (
        <section className="bg-neutral-900 py-16">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold text-neutral-0">{block.heading}</h2>
              <p className="mt-2 text-base leading-relaxed text-neutral-300">{block.body}</p>
            </div>
            <ButtonLink size="lg" href={block.cta.href}>
              {block.cta.label}
            </ButtonLink>
          </div>
        </section>
      );

    default: {
      // Exhaustiveness check: a new block type in the schema must be handled above.
      const unhandled: never = block;
      void unhandled;
      return null;
    }
  }
}
