const stats = [
  { value: "3.8×", label: "Average lift in lead quality vs. static landing pages" },
  { value: "38%", label: "Median quiz completion rate across customers" },
  { value: "$0.42", label: "Average cost-per-lead on TikTok Ads" },
  { value: "<4 min", label: "From prompt to a published, ad-ready funnel" },
];

export function Conversion() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Built to convert</p>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient">
            Numbers that move when you swap a landing page for a quiz
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline rounded-2xl overflow-hidden border border-hairline">
          {stats.map((s) => (
            <div key={s.label} className="bg-background p-8 text-center">
              <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient">{s.value}</div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
