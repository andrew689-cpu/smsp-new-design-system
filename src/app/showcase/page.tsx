import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { contrastRatio, formatRatio } from "@/lib/contrast";
import * as T from "@tokens/index";

/**
 * The Showcase — one gallery serving three consumers: visual review, Playwright, and the
 * published Artifact. Every section carries a stable `id` so e2e tests can target it.
 *
 * Phase 1 shows the token layer. Components are added to this same page in Phase 2; there
 * is deliberately no second gallery.
 */

function semanticValue(
  token: T.SemanticToken,
  theme: "light" | "dark",
): string {
  return token.literal ? token[theme] : T.resolve(token[theme]);
}

function Section({
  id,
  title,
  children,
  lead,
}: {
  id: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-showcase-section={id}
      className="border-border-default border-t pt-6 pb-8"
    >
      <h2 className="text-h2 mb-2">{title}</h2>
      {lead ? (
        <p className="text-small text-text-muted mb-5 max-w-measure">{lead}</p>
      ) : null}
      {children}
    </section>
  );
}

export default function ShowcasePage() {
  return (
    <main className="max-w-page mx-auto p-5">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="text-h1 mb-2">Showcase</h1>
          <p className="text-small text-text-muted">
            Token versi {T.TOKEN_VERSION} · dihasilkan dari <code>tokens/</code>
          </p>
        </div>
        <ThemeToggle />
      </header>

      <Section
        id="colors"
        title="Warna semantik"
        lead="Tier 2. Layar dibangun dari token ini, bukan dari primitif. Rasio kontras diukur terhadap latar yang sebenarnya."
      >
        {T.semanticGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <h3 className="text-h4 mb-3">{group.title}</h3>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {group.tokens.map((token) => {
                const light = semanticValue(token, "light");
                const dark = semanticValue(token, "dark");
                return (
                  <li
                    key={token.name}
                    className="border-border-default rounded-container shadow-card flex items-center gap-4 border p-3"
                  >
                    <span
                      aria-hidden="true"
                      className="border-border-strong rounded-md h-6 w-6 shrink-0 border"
                      style={{ background: `var(--color-${token.name})` }}
                    />
                    <span className="min-w-0">
                      <code className="text-small block font-bold">
                        --color-{token.name}
                      </code>
                      <span
                        className="text-caption text-text-muted block"
                        data-numeric
                      >
                        {light} / {dark}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </Section>

      <Section
        id="typography"
        title="Tipografi"
        lead="Lato untuk teks dan judul, Inter hanya untuk angka. Bobot nyata 400 / 700 / 900 saja."
      >
        <ul className="space-y-4">
          {[...T.fontSizes].reverse().map((size) => {
            const utility = size.name.replace(/^font-size-/, "");
            return (
              <li
                key={size.name}
                className="border-border-default border-b pb-3"
              >
                <span
                  className="block"
                  style={{
                    fontSize: `var(--text-${utility})`,
                    lineHeight: "var(--leading-snug)",
                  }}
                >
                  Baja Struktural
                </span>
                <span className="text-caption text-text-muted">
                  <code>text-{utility}</code> · {size.px}px · {size.value}
                </span>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
        id="numerics"
        title="Angka & satuan"
        lead="Setiap angka adalah ukuran, jumlah, atau harga — selalu dengan satuan eksplisit, rata kanan, tabular."
      >
        {/* The page body never scrolls sideways. A spec table that cannot fit gets its own
            overflow container instead — see smsp-brand-identity.md section 10. */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <caption className="text-small text-text-muted mb-2 text-left">
              Contoh spesifikasi baja
            </caption>
            <thead>
              <tr className="bg-table-header-bg">
                <th
                  scope="col"
                  className="text-small border-table-border border p-2 text-left"
                >
                  Produk
                </th>
                <th
                  scope="col"
                  className="text-small border-table-border border p-2 text-right"
                >
                  Panjang
                </th>
                <th
                  scope="col"
                  className="text-small border-table-border border p-2 text-right"
                >
                  Berat
                </th>
                <th
                  scope="col"
                  className="text-small border-table-border border p-2 text-right"
                >
                  Stok
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Besi Beton Ulir",
                  length: "12.000 mm",
                  weight: "47,5 kg",
                  stock: "1.240 batang",
                },
                {
                  name: "Hollow Galvanis",
                  length: "6.000 mm",
                  weight: "8,2 kg",
                  stock: "860 batang",
                },
                {
                  name: "Plat Kapal",
                  length: "6.000 mm",
                  weight: "235,0 kg",
                  stock: "74 lembar",
                },
              ].map((row) => (
                <tr key={row.name}>
                  <th
                    scope="row"
                    className="text-small border-table-border border p-2 text-left font-regular"
                  >
                    {row.name}
                  </th>
                  <td
                    className="text-small border-table-border border p-2"
                    data-numeric
                  >
                    {row.length}
                  </td>
                  <td
                    className="text-small border-table-border border p-2"
                    data-numeric
                  >
                    {row.weight}
                  </td>
                  <td
                    className="text-small border-table-border border p-2"
                    data-numeric
                  >
                    {row.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="spacing"
        title="Spasi"
        lead="Sepuluh langkah, ritme 4 / 8px. Tidak ada langkah di luar skala ini."
      >
        <ul className="space-y-2">
          {T.spacing.map((step) => (
            <li key={step.name} className="flex items-center gap-4">
              <code className="text-caption w-9 shrink-0">{step.name}</code>
              <span
                aria-hidden="true"
                className="bg-action-primary h-4"
                style={{
                  width: `var(--spacing-${step.name.replace(/^space-/, "")})`,
                }}
              />
              <span className="text-caption text-text-muted" data-numeric>
                {step.px} px
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="radius"
        title="Radius"
        lead="Cenderung bersudut tegas — bagian dari kesan terukur dan solid. Gunakan peran semantik."
      >
        <ul className="flex flex-wrap gap-4">
          {T.radiusRoles.map((role) => (
            <li key={role.name} className="text-center">
              <span
                aria-hidden="true"
                className="bg-bg-subtle border-border-strong mb-2 block h-7 w-7 border"
                style={{ borderRadius: `var(--${role.name})` }}
              />
              <code className="text-caption block">{role.name}</code>
              <span className="text-caption text-text-muted" data-numeric>
                {role.value}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="elevation"
        title="Elevasi"
        lead="Terang memakai lapisan bayangan; gelap memakai garis rambut 1px — bayangan tidak terbaca di permukaan gelap. Ini disengaja."
      >
        <ul className="flex flex-wrap gap-5">
          {T.elevationRoles.map((role) => (
            <li key={role.name}>
              <span
                aria-hidden="true"
                className="bg-bg-surface rounded-container mb-2 block h-7 w-9"
                style={{ boxShadow: `var(--${role.name})` }}
              />
              <code className="text-caption block">{role.name}</code>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="focus"
        title="Fokus"
        lead="Cincin 2px, offset 2px, minimal 3:1 di setiap permukaan. Tidak pernah dihilangkan."
      >
        <p className="text-small text-text-muted mb-3">
          Gunakan Tab untuk melihat cincin fokus. Kontras cincin terhadap
          permukaan:{" "}
          <span data-numeric>
            {formatRatio(
              contrastRatio(T.resolve("red-700"), T.resolve("neutral-0")),
            )}
          </span>{" "}
          (terang).
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="bg-action-primary text-text-on-brand rounded-control min-h-touch px-5 font-bold"
          >
            Hubungi Sales
          </button>
          <a
            href="#focus"
            className="text-text-link rounded-control inline-flex min-h-touch items-center px-2 font-bold underline"
          >
            Tautan contoh
          </a>
          <input
            aria-label="Contoh masukan"
            placeholder="Cari produk"
            className="bg-input-bg border-input-border text-input-text rounded-control min-h-touch border px-3"
          />
        </div>
      </Section>

      <Section
        id="layout"
        title="Layout"
        lead={`Satu breakpoint di ${T.BREAKPOINT_PX}px. Di bawahnya: Bottom Navigation. Di atasnya: Navbar. Tidak pernah keduanya.`}
      >
        <ul className="text-small space-y-2">
          {[...T.breakpoints, ...T.containers].map((item) => (
            <li key={item.name} className="flex flex-wrap gap-3">
              <code className="w-10 shrink-0">--{item.name}</code>
              <span data-numeric className="w-8">
                {item.value}
              </span>
              <span className="text-text-muted">{item.note}</span>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
