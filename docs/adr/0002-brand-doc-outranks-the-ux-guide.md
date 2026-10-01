# 2. The brand document outranks the UX principles guide

Date: 2026-10-01

## Status

Accepted

## Context

Two specification documents seed this repo, and they contradict each other in eight places:

| Topic | `smsp-brand-identity.md` | `ui-ux-design-principles.md` |
|---|---|---|
| Saturation | #FF0000 is the signature red | "calm, soft, natural colors instead of overly bright or saturated" |
| Corners | biased **square**, container max 6px | "smooth, **rounded** card" |
| Dividers | "**firm** borders" | "light, faint, **soft**" |
| Smallest text | `caption` 12px is the floor | bottom-nav labels "**10px**–12px" |
| Letter spacing | no token exists | "subtle letter spacing on small uppercase labels" |
| Inactive items | `text-subtle` token | "**reduced opacity** rather than faint gray" |
| Screen bottom | "Navbar above, Bottom Nav below. **Never both**" | a sticky action bar **and** a bottom nav |
| Domain | B2B steel: kg, mm, batang, spec tables | consumer retail: Add to Cart, star ratings, "20% OFF" |

The last row is the deepest. `ui-ux-design-principles.md` is written for a consumer
e-commerce product page. SMS Perkasa sells structural steel to businesses and has no cart.

Leaving this unresolved would have been the worst outcome: a contract citing both documents
grants an agent licence to pick whichever suits the moment, and every conflict gets decided
differently by whoever touches it next.

## Decision

`smsp-brand-identity.md` wins on every **value**. `ui-ux-design-principles.md` advises on
**composition and layout only**. Where it names a number, that number is re-expressed as a
brand token or dropped:

- "24px margins" → `--space-5`
- "10–12px labels" → `--font-size-caption` (12px). The 10px step is not invented to satisfy a
  generic guide.
- "reduced opacity" → `--color-text-subtle`
- "muted, soft colours" → already satisfied. The brand's answer to saturation is restraint in
  **quantity** ("use red sparingly"), not a duller hue.

Its retail-specific principles are **out of domain** and dropped: star ratings, review counts,
promotional badges, total-price-in-button, quantity presets. Its structural principles are
kept: grid discipline, one font family, icon containers, dual-cue active states, 44px targets,
safe-area respect, badge restraint.

The one genuine gap it exposed — no letter-spacing token — was filled by adding
`--letter-spacing-{tight,normal,wide}` to the token source.

## Consequences

Conflicts have a standing answer, so they are not re-litigated per screen.

`ui-ux-design-principles.md` stays in the repo as a subordinate advisory document. A reader
finding it there will reasonably assume it is authoritative, which is precisely why this ADR
exists.

Composition guidance that *is* in domain still has to be read with judgement — "icons share
one visual language" is a Tier 3 rule and no check will ever confirm it.
