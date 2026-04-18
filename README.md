# Calendar App 📅

A simple, responsive calendar application with month view, event management, and persistent storage. Built with vanilla HTML, CSS, and JavaScript — no frameworks or build tools required.

## Features

- **Month View Calendar** — Display a full month grid with proper day alignment
- **Add Events** — Click any day to create an event with title, date, time, and description
- **Edit Events** — Click an event chip to modify its details
- **Delete Events** — Remove events with a confirmation dialog
- **Form Validation** — Real-time validation for required fields and time constraints
- **Persistent Storage** — Events saved to browser's localStorage as JSON
- **Today Highlight** — Current day visually distinguished with a blue circle
- **Responsive Design** — Works seamlessly on desktop (1200px), tablet (768px), and mobile (480px)
- **Modal Interface** — Clean, centered modal for adding/editing events
- **Easy Navigation** — Prev/Next buttons to browse months across year boundaries

## How to Use

1. **Open the app**: Simply open `index.html` in any modern web browser
   - No server required — works as a static file
   - File path: `file:///path/to/calendar-app-folder/index.html`

2. **Add an event**:
   - Click any day on the calendar
   - Fill in the event title (required), date, time, and description
   - Click "Save Event"

3. **Edit an event**:
   - Click an event chip (colored pill) on any day
   - Modal opens with event details pre-filled
   - Make changes and click "Save Event"

4. **Delete an event**:
   - Click an event chip to open it in edit mode
   - Click the "Delete Event" button at the bottom
   - Confirm the deletion

5. **Navigate months**:
   - Use "← Prev" and "Next →" buttons to move between months
   - Works across year boundaries

## Project Structure

```
calendar-app-folder/
├── index.html          # Page structure + modal markup
├── style.css           # Responsive layout + styling
├── app.js              # All application logic
├── tasks/
│   └── todo.md         # Project checklist & review
├── .claude/
│   └── claude.md       # Development workflow instructions
└── README.md           # This file
```

## Technologies Used

- **HTML5** — Semantic markup
- **CSS3** — CSS Grid, Flexbox, Media Queries
- **Vanilla JavaScript (ES6+)** — IIFE module pattern
- **localStorage API** — Event persistence
- **Crypto API** — UUID generation for events

## Form Validation

The app includes robust client-side validation:

- **Title** — Required, max 100 characters
- **Date** — Required, must be a valid date
- **Time** — End time must be after or equal to start time
- **Error Messages** — Inline validation feedback (no popups)

## Browser Support

Works in all modern browsers supporting:
- ES6 JavaScript
- CSS Grid & Flexbox
- localStorage API
- crypto.randomUUID()

Tested on Chrome, Firefox, Safari, and Edge.

## Data Storage

Events are stored in the browser's `localStorage` under the key `calendar_events` as a JSON array:

```json
[
  {
    "id": "uuid-string",
    "title": "Event Title",
    "date": "2026-04-18",
    "startTime": "10:00",
    "endTime": "11:00",
    "description": "Event description",
    "createdAt": "2026-04-18T23:12:00.000Z"
  }
]
```

## Security

- ✅ Event titles rendered safely via `textContent` (XSS prevention)
- ✅ No sensitive data stored in frontend
- ✅ Input validation prevents malformed data
- ✅ Graceful error handling for corrupted localStorage

## Responsive Design

| Screen Size | Behavior |
|---|---|
| Desktop (1200px+) | Full calendar grid with spacious cells |
| Tablet (768px–1199px) | Adjusted spacing, readable event chips |
| Mobile (< 480px) | Compact layout, stacked form buttons, optimized touch targets |

## Future Enhancements

- [ ] Week view and day view options
- [ ] Event categories with color coding
- [ ] Recurring events
- [ ] Event notifications
- [ ] Export events to iCal format
- [ ] Dark mode
- [ ] Search functionality
- [ ] Multi-day event support

## Development

See `tasks/todo.md` for the complete development checklist and task breakdown.

For development workflow, see `.claude/claude.md`.

## License

MIT

## Author

Created by Olena Shereiko (olenashereiko@gmail.com)
