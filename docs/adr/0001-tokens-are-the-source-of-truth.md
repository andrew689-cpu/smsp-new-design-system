# 1. Tokens are the source of truth; the brand document is generated

Date: 2026-10-01

## Status

Accepted

## Context

`smsp-brand-identity.md` arrived as the project's only artifact, and it described itself as
*"generated directly from the design tokens, so they are exact as of `5d0829a`"* — a commit in
a repository we did not have. So the document was downstream of a token source that existed
somewhere else, and we had the artifact without the origin.

That left two options. Import the original token source, or treat the document as canonical
and rebuild the tokens from it.

The document turned out to be unusually complete: every primitive with CMYK and Pantone, both
theme resolutions for every semantic role, component tokens, and the full type, spacing,
radius, elevation and motion ladders. Enough to rebuild from without guessing.

The deeper problem was the direction of the arrow. A hand-maintained document describing
values that live in code drifts — always, and silently, because nothing fails when it does.
The document had already outlived its own source.

## Decision

`tokens/` is the source of truth. Both `src/styles/theme.css` and `smsp-brand-identity.md`
are generated from it by `npm run tokens`, and `npm run tokens:verify` fails if either is
stale. Verify runs in `npm run check` and in pre-commit.

Contrast ratios in the generated document are **measured** at build time from the token
values, not transcribed. Each text role declares the backdrop it is actually read against, so
`text-on-brand` is measured against the red fill rather than the page surface.

## Consequences

The document cannot drift from the code: making it stale fails the build.

Every ratio the original document asserted now verifies — 5.35:1 for the primary button label,
6.17:1 for the accessible red, 2.49:1 for disabled grey, 3.81:1 for the dark hairline ring,
4.55:1 for the scrim over white. We also confirmed its claim that the scrim cannot dim the
dark canvas at any alpha.

Editing `smsp-brand-identity.md` directly is now always wrong, which is surprising for a file
that looks like documentation. It carries a generated-file banner, Prettier ignores it, and
this ADR exists so the surprise is explained rather than discovered.

If the original token repository surfaces, reconciling it against `tokens/` is a real piece of
work. We judged a verifiable local source worth more than a provenance we could not reach.
