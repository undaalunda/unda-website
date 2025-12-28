// lib/generateEventJsonLD.ts

export function generateEventJsonLD(events: any[]) {
  return events.map((event) => ({
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": event.title || `Live at ${event.venue.name}`,
    "startDate": event.datetime,
    "location": {
      "@type": "Place",
      "name": event.venue.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": event.venue.address || "",
        "addressLocality": event.venue.city,
        "addressRegion": event.venue.region || "",
        "postalCode": event.venue.postal_code || "",
        "addressCountry": event.venue.country,
      },
    },
    "image": event.artist?.image_url ? [event.artist.image_url] : [],
    "description": `Live show by Unda Alunda at ${event.venue.name}`,
    "performer": {
      "@type": "Person",
      "name": "Unda Alunda",
      "@id": "https://unda-website.vercel.app#person",
    },
    "organizer": {
      "@type": "Organization",
      "name": "Unda Alunda",
      "url": "https://unda-website.vercel.app",
    },
  }));
}