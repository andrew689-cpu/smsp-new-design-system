# SMS Perkasa Design System

The design system for PT. Sumber Makmur Surya Perkasa, an Indonesian B2B structural-steel
distributor. It exists to make every SMS Perkasa surface read as engineered, solid and *ramah*
without each screen re-deciding color, type, spacing or depth.

## Language

### The agent contract

**Agent Contract**:
The layered set of rules every coding agent must obey in this repo, spanning an advisory layer
(`AGENTS.md` and a design-system skill) and a deterministic layer (lint, pre-commit and a Claude
Code hook).
_Avoid_: Harness, guardrails, the rules, instructions

**Harness**:
The agent runtime that executes the tool loop, hooks and permissions. Something we configure, never
something we author.
_Avoid_: using this word for the Agent Contract

### Commerce

**Hubungi Sales**:
The single conversion action on every SMS Perkasa surface. There is no cart and no checkout; the
primary CTA always hands the visitor to a salesperson.
_Avoid_: Add to Cart, Buy Now, Checkout, Beli

**Indicative Price**:
A published steel price shown for orientation only, never transacted against on the website. Always
display-only, always alongside Hubungi Sales.
_Avoid_: Price (bare), Harga (bare), list price

**Spec**:
A measured property of a steel product — dimension in mm, weight in kg, count in batang. Set in
`--font-numeric` with tabular figures and an explicit unit, never as a bare number.
_Avoid_: Attribute, property, variant

### Surfaces

**Showcase**:
The single component gallery that renders every component in both themes at both breakpoints. It
serves three consumers: visual review, Playwright, and the published Artifact.
_Avoid_: Storybook, docs site, kitchen sink, playground
