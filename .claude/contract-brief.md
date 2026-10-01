SMS PERKASA DESIGN SYSTEM — NON-NEGOTIABLES (loaded every session)

Source of truth is tokens/. src/styles/theme.css and smsp-brand-identity.md are GENERATED:
edit tokens/ and run `npm run tokens`. Editing either generated file is always wrong.

Tier 0 — unrepresentable. Alert/Badge require icon AND label. Spec requires a unit. Logo takes
a variant, never a className. If you are tempted to weaken one of these props, you have found
a design problem, not a types problem.

Tier 1 — blocks commit. No raw hex/rgb. No primitive tokens (--color-red-*, --color-neutral-*)
in product UI. No Tailwind arbitrary values (bg-[#...], p-[13px]). Font weight 400/700/900
only. No raw px in CSS (1rem = 10px — divide by 10, never 16). No raw ms or cubic-bezier.
Never remove the focus ring. axe-core must pass in BOTH themes.

Tailwind namespaces are RESET, so an off-system class does not compile — it is silently
MISSING, not an error. `min-h-11` and `font-normal` are dead here; use `min-h-touch` and
`font-regular`. Run `npm run lint:contract` to catch these.

Domain: no cart, no checkout. The one conversion action is "Hubungi Sales". Prices are
display-only ("Indicative Price"). User copy is Bahasa Indonesia; token names stay English.

Tier 3 — human judgement, NOT machine-checkable: "is red used sparingly", "does the
whitespace read as restraint", "is this ramah rather than cold". Do not claim these pass.
