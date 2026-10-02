'use client';

import { useState } from 'react';
import { Accordion } from '@/components/Accordion';
import { Alert } from '@/components/Alert';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { ButtonLink } from '@/components/ButtonLink';
import { Card, CardBody, CardTitle } from '@/components/Card';
import { Checkbox, SelectField, TextField } from '@/components/Field';
import { Dialog } from '@/components/Dialog';
import { Tabs } from '@/components/Tabs';

/**
 * The component gallery.
 *
 * Storybook is where each component is documented in isolation with its full matrix of states.
 * This page is the complement: everything on one surface, so you can check that the components
 * actually sit together — consistent heights, aligned baselines, one focus ring, one type scale.
 * Interaction bugs between components show up here and nowhere else.
 */

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-neutral-200 py-10">
      <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
      <p className="mt-1 max-w-2xl text-base text-neutral-600">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function ComponentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');

  const emailError = email.length > 0 && !email.includes('@') ? 'Enter a valid email address' : undefined;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold text-neutral-900">Components</h1>
      <p className="mt-3 max-w-2xl text-lg text-neutral-600">
        Eleven components, every one built from the token set. Try them with the keyboard — tab
        through the tabs, open the dialog and press Escape, expand the accordion.
      </p>

      <Section title="Button" description="Four variants, three sizes, plus loading and disabled states.">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section
        title="ButtonLink"
        description="Looks like a button, is an anchor. Anything that navigates uses this, so middle-click and open-in-new-tab work."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/">Back to overview</ButtonLink>
          <ButtonLink href="https://www.w3.org/WAI/standards-guidelines/wcag/" variant="secondary" external>
            Read WCAG
          </ButtonLink>
        </div>
      </Section>

      <Section title="Badge" description="Status markers where the text carries the meaning, never the colour alone.">
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge tone="brand">Brand</Badge>
          <Badge tone="success" label="Status">
            Active
          </Badge>
          <Badge tone="warning">Pending</Badge>
          <Badge tone="danger">Failed</Badge>
          <Badge tone="info">Draft</Badge>
        </div>
      </Section>

      <Section
        title="Alert"
        description="Warnings and errors announce assertively; info and success wait politely for a pause in speech."
      >
        <div className="grid gap-3">
          <Alert tone="info" title="Scheduled maintenance">
            The publishing API is read-only on Sunday between 02:00 and 04:00 UTC.
          </Alert>
          <Alert tone="success" title="Changes published" />
          <Alert tone="warning" title="Two locales are missing translations">
            The build will pass, but those pages fall back to English.
          </Alert>
          <Alert tone="danger" title="Could not reach the CMS">
            The content query timed out after 10 seconds. Retry, or check the endpoint.
          </Alert>
        </div>
      </Section>

      <Section
        title="Form fields"
        description="Label, hint and error are wired to each control, so the description is announced with the field rather than floating beside it."
      >
        <div className="grid max-w-md gap-5">
          <TextField
            label="Work email"
            hint="We use this for publishing notifications."
            required
            type="email"
            value={email}
            error={emailError}
            onChange={(event) => setEmail(event.target.value)}
          />
          <SelectField
            label="Environment"
            options={[
              { value: 'prod', label: 'Production' },
              { value: 'staging', label: 'Staging' },
              { value: 'dev', label: 'Development' }
            ]}
          />
          <Checkbox label="Notify the content team on publish" hint="Sends a single digest, not one message per change." />
        </div>
      </Section>

      <Section title="Card" description="A surface for grouped content. Interactive only when the whole card is actionable.">
        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <CardTitle>Static card</CardTitle>
            <CardBody>Used for grouping. No hover state, because nothing here is clickable.</CardBody>
          </Card>
          <Card interactive>
            <CardTitle>Interactive card</CardTitle>
            <CardBody>Elevates on hover and on focus within, so keyboard users see the same affordance.</CardBody>
          </Card>
        </div>
      </Section>

      <Section
        title="Tabs"
        description="Roving tabindex: the whole tab list is one stop in the page's tab order. Arrow keys move between tabs, Home and End jump to the ends."
      >
        <Tabs
          aria-label="Implementation details"
          items={[
            {
              id: 'tokens',
              label: 'Tokens',
              content:
                'Colour, type, radius and shadow come from tokens/design-tokens.json, compiled into the Tailwind theme. No component hardcodes a value.'
            },
            {
              id: 'content',
              label: 'Content',
              content:
                'Pages are an ordered union of typed blocks fetched over GraphQL. The renderer maps block type to component with an exhaustive switch.'
            },
            {
              id: 'testing',
              label: 'Testing',
              content:
                'Vitest covers the ARIA wiring and keyboard behaviour; Playwright drives the rendered pages and runs axe against each one.'
            }
          ]}
        />
      </Section>

      <Section title="Accordion" description="Each trigger is a real button inside a heading, so it appears in the screen reader's heading list.">
        <Accordion
          items={[
            { id: 'a1', question: 'Does it support multiple open panels?', answer: 'Yes — pass multiple. Single mode still allows closing the open panel.' },
            { id: 'a2', question: 'What heading level do the triggers use?', answer: 'Whatever the page needs. headingLevel keeps the document outline correct.' },
            { id: 'a3', question: 'Is collapsed content reachable by Tab?', answer: 'No. Closed panels unmount rather than hide, so nothing inside stays in the tab order.' }
          ]}
        />
      </Section>

      <Section
        title="Dialog"
        description="Focus moves in on open, is trapped while open, and returns to the trigger on close. Escape closes it and the page behind does not scroll."
      >
        <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Publish to production?"
          description="Six pages changed since the last publish. This takes effect immediately."
          footer={
            <>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Publish</Button>
            </>
          }
        >
          <p className="text-base text-neutral-600">
            Try it with the keyboard: Tab cycles inside the dialog and cannot reach the page behind,
            and Escape returns focus to the button that opened it.
          </p>
        </Dialog>
      </Section>
    </div>
  );
}
