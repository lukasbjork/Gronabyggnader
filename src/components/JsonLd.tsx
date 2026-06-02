/**
 * Renderar JSON-LD structured data i ett <script>-element.
 * Används för SEO (Organization, GeneralContractor, Service, FAQPage,
 * BlogPosting, BreadcrumbList) så att Google kan förstå sidan.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Datan är statisk och kommer från vår egen kod (inte användarinput).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
