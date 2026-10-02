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

**Canvas page**:
A named surface inside a Design canvas artifact, holding artboards. Listed in that canvas's
`project/canvas.json` under `pages[]`. "Prototype Mobbin 1" is one.
_Avoid_: Page (bare), tab, screen, board

**Artboard**:
One frame on a canvas page — a single screen, or one *state* of a screen. Exactly one `.dc.html`
file, with one entry in `boards`.
_Avoid_: Page, mockup, frame (bare), slide

**Produk Page**:
The SMS Perkasa product-detail surface. Reserved for that surface — never for a canvas page or
an artboard that happens to show it.
_Avoid_: Page (bare) when a canvas page is meant

**Toolbar**:
The bottom bar of a product surface: a search row whose left slot holds the combined
Filter & Urutkan control, sitting above the navigation row. Pressing that control replaces the
navigation row with the filter panel; it never covers it.
_Avoid_: Bottom bar, tab bar, filter bar — and never for the row above the price list

**Ringkasan filter**:
The row directly above the price list: the active filter chips with their remove action, the
`Hapus` link, and `Menampilkan X dari Y SKU`. It reports what the filter did; it never operates
the filter.
_Avoid_: Toolbar, filter bar, chip bar

**Detail SKU**:
The single-SKU surface — one size of one product, with its SKU number, weight, price per batang
and per kg. Opsi A's own name for it. Reached from a row in the price list.
_Avoid_: SKU Page, Produk Page, product page

**Identity tile**:
The small square slot in a product surface's identity block, overlapping the hero image from
below. It carries a supporting diagram — a dimension legend, say — never a product photo and
never a logo.
_Avoid_: Thumbnail, avatar, hero thumbnail

**Thumbnail**:
The product image in a price-list card view. Reserved for that — the flat Daftar view has none,
and the square in the identity block is an Identity tile.
_Avoid_: Identity tile, thumb, preview
