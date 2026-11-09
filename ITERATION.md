Both prototypes were iterated from the feedback in the FigJam **PROTOTYPE** section. The FigJam was only read.

Open `Web/index.html` or `Mobile/index.html` in a browser. Keep both folders and the shared `prototype.js` and `prototype.css` together.

Changes
-------
- Clearer landing copy distinguishes alcohol-free and low-alcohol events.
- Higher-contrast supporting text, larger labels, visible keyboard focus, and larger date/time targets.
- English/German controls for common interface labels; event descriptions and some supporting copy retain their original language.
- More alcohol-free choices.
- Mobile filter heading, wrapping filter buttons, persistent navigation, and Home links through booking and hosting.
- Every Web and Mobile page except Home and My Tickets has a labeled Back button. It returns to the actual previously visited page, including visits through header navigation, tabs, and completion screens. Home has no Back button. My Tickets has a Home button that goes directly to the landing page.
- Attendance counts derived from capacity and remaining spots; prominent ticket dates.
- Booking confirmation groups the booking reference, ticket count, and confirmation contacts in a Booking details section matching the bordered Location details section on both prototypes.
- Paid tickets disclose the 5% service fee. Free events show no fees. Pay-what-you-can reservations explain contributions at the event.
- Hosts can enter decimal prices and create a weekly or fortnightly series of four separately bookable dates. Preview explains the series. Invalid dates and fixed prices are rejected.
- Removed the disabled host-profile section from event setup.
- Safety and support sections on event and booking confirmation pages, plus Report a concern on upcoming and past tickets, open an event-specific report form. Guests can report an attendee/event or a host/venue, choose a reason, and add details. A confirmation displays a report reference. Reports stay in session memory and are not sent anywhere.
- Report a concern is also visible in the Web header and Mobile page headers, including Home. The report form includes an event/space selector so it can be opened without first selecting an event.

Validation
----------
JavaScript syntax and whitespace checks passed. Temporary DOM-based checks passed for both prototypes: discovery, attendance, reporting, recurring publishing, decimal prices, two-ticket booking, ticket dates, language switching, and reset. The step-free access filter was subsequently removed; syntax and whitespace checks passed after removal.

Browser preview was unavailable, so rendered layout and native date/time pickers still need visual verification. This remains a front-end prototype: bookings, payments, notifications, venue accessibility, and reports use demo data and have no connected services. Refreshing clears session changes.
