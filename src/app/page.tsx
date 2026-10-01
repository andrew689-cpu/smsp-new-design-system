import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-page p-6">
      <h1 className="text-h1 mb-5">SMS Perkasa Design System</h1>
      <p className="text-body-lg text-text-muted mb-6 max-w-measure">
        Sistem desain untuk PT. Sumber Makmur Surya Perkasa. Semua nilai warna, tipografi,
        spasi, dan elevasi berasal dari satu sumber di <code>tokens/</code>.
      </p>
      <Link
        href="/showcase"
        className="bg-action-primary text-text-on-brand rounded-control inline-flex min-h-touch items-center px-5 font-bold"
      >
        Buka Showcase
      </Link>
    </main>
  );
}
