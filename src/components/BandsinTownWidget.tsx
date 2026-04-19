// components/BandsinTownWidget.tsx
'use client';

import { useEffect, useState } from 'react';

interface Event {
  id: string;
  datetime: string;
  description?: string;
  venue: {
    name: string;
    city: string;
    country: string;
  };
  offers: {
    type: string;
    url: string;
    status: string;
  }[];
  url: string;
}

function parseVenueName(description: string): string | null {
  if (!description) return null;
  const match = description.match(/Venue:\s*([^\n/]+)/i);
  if (match) return match[1].trim();
  return null;
}

export default function BandsinTownWidget() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const appId = process.env.NEXT_PUBLIC_BANDSINTOWN_APP_ID;
        const res = await fetch(
          `https://rest.bandsintown.com/artists/Unda%20Alunda/events?app_id=${appId}&date=upcoming`
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Bandsintown fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).toUpperCase();
  };

  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTicketUrl = (event: Event) => {
    const ticketOffer = event.offers?.find((o) => o.type === 'Tickets');
    return ticketOffer?.url || event.url;
  };

  if (loading) {
    return (
      <div style={{ color: 'rgba(248,252,220,0.5)', padding: '2rem 0', fontSize: '12px', letterSpacing: '0.1em' }}>
        LOADING TOUR DATES...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'rgba(248,252,220,0.4)', padding: '2rem 0', fontSize: '12px' }}>
        Could not load tour dates. Please check back later.
      </div>
    );
  }

  return (
    <>
      <div className="bit-custom-widget">
        {events.length === 0 ? (
          <p style={{ color: 'rgba(248,252,220,0.4)', fontSize: '12px', letterSpacing: '0.1em' }}>
            NO UPCOMING TOUR DATES
          </p>
        ) : (
          <div className="bit-events-list">
            {events.map((event) => {
              const venueName = parseVenueName(event.description || '') || event.venue.name;
              return (
                // ✅ div + onClick แทน <a> ซ้อน <a>
                <div
                  key={event.id}
                  className="bit-event-row"
                  onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') window.open(event.url, '_blank', 'noopener,noreferrer');
                  }}
                >
                  {/* LEFT — Venue + Date */}
                  <div className="bit-event-left">
                    <p className="bit-event-venue">{venueName}</p>
                    <p className="bit-event-date">
                      {formatDate(event.datetime)} @ {formatTime(event.datetime)}
                    </p>
                  </div>

                  {/* CENTER — City, Country */}
                  <div className="bit-event-center">
                    <p className="bit-event-location">
                      {event.venue.city}, {event.venue.country}
                    </p>
                  </div>

                  {/* RIGHT — Buttons */}
                  <div
                    className="bit-event-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bit-btn bit-btn-rsvp"
                    >
                      RSVP
                    </a>
                    <a
                      href={getTicketUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bit-btn bit-btn-tickets"
                    >
                      TICKETS
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Request a Show */}
        <div className="bit-request-show">
          <a
            href="https://www.bandsintown.com/a/15621474?came_from=267&utm_medium=api&utm_source=public_api&utm_campaign=artist"
            target="_blank"
            rel="noopener noreferrer"
            className="bit-btn-request"
          >
            REQUEST A SHOW
          </a>
        </div>
      </div>

      <style jsx global>{`
        .bit-custom-widget {
          width: 100%;
          font-family: 'Cinzel', serif;
        }

        .bit-events-list {
          width: 100%;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bit-event-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          gap: 1rem;
          transition: background-color 0.25s ease;
          border-radius: 2px;
          margin: 0 -0.75rem;
          cursor: pointer;
        }

        @media (hover: hover) and (pointer: fine) {
          .bit-event-row:hover {
            background-color: rgba(248, 252, 220, 0.03);
          }
        }

        /* LEFT */
        .bit-event-left {
          flex: 1.5;
          min-width: 0;
        }

        .bit-event-venue {
          color: #dc9e63;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          margin: 0 0 0.25rem 0;
          text-transform: uppercase;
        }

        .bit-event-date {
          color: #f8fcdc;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.06em;
          margin: 0;
          opacity: 0.85;
        }

        /* CENTER */
        .bit-event-center {
          flex: 1.5;
          text-align: center;
        }

        .bit-event-location {
          color: #f8fcdc;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          margin: 0;
          text-transform: uppercase;
        }

        /* RIGHT */
        .bit-event-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          gap: 0.6rem;
        }

        .bit-btn {
          display: inline-block;
          padding: 0.45rem 1rem;
          font-family: 'Cinzel', serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-decoration: none !important;
          border-radius: 3px;
          transition: background-color 0.3s ease, border-color 0.3s ease;
          text-align: center;
          white-space: nowrap;
        }

        /* ✅ RSVP — บางมากๆ */
        .bit-btn-rsvp {
          background-color: transparent;
          border: 0.3px solid rgba(248, 252, 220, 0.35);
          color: #f8fcdc !important;
        }

        .bit-btn-tickets {
          background-color: #2a0000;
          border: 1px solid #2a0000;
          color: #f8fcdc !important;
        }

        @media (hover: hover) and (pointer: fine) {
          .bit-btn-rsvp:hover {
            background-color: rgba(248, 252, 220, 0.06);
            border-color: rgba(248, 252, 220, 0.5);
          }
          .bit-btn-tickets:hover {
            background-color: #5d0000;
            border-color: #5d0000;
          }
        }

        .bit-btn-rsvp:active {
          background-color: rgba(248, 252, 220, 0.06);
          transform: scale(0.98);
        }

        .bit-btn-tickets:active {
          background-color: #5d0000;
          border-color: #5d0000;
          transform: scale(0.98);
        }

        /* REQUEST A SHOW */
        .bit-request-show {
          margin-top: 1.5rem;
          width: 100%;
        }

        .bit-btn-request {
          display: block;
          width: 100%;
          padding: 1rem;
          background-color: #2a0000;
          border: 1px solid #2a0000;
          color: #f8fcdc !important;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.15rem;
          text-align: center;
          text-decoration: none !important;
          border-radius: 3px;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        @media (hover: hover) and (pointer: fine) {
          .bit-btn-request:hover {
            background-color: #5d0000;
            border-color: #5d0000;
          }
        }

        .bit-btn-request:active {
          background-color: #5d0000;
          border-color: #5d0000;
          transform: scale(0.98);
        }

        /* Mobile */
        @media (max-width: 640px) {
          .bit-event-row {
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .bit-event-left {
            flex: 1 1 100%;
          }

          .bit-event-center {
            flex: 1 1 auto;
            text-align: left;
          }

          .bit-event-right {
            flex: 0 0 auto;
          }
        }
      `}</style>
    </>
  );
}