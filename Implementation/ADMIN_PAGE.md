# Estate.Lab Admin Dashboard Implementation Plan

This document tracks the progress of the Estate.Lab `/admin` dashboard. We are following a UI-First approach, building the interface with mock data before connecting the backend.

---

## 🗺️ Development Roadmap

### Phase 1: The Front Door (UI)
- [x] Set up the `/admin` route in React Router.
- [x] Build the PIN login screen (with the "271302" password check via React state).

### Phase 2: The Dashboard Layout (UI)
- [x] Build the Admin Sidebar (Navigation).
- [x] Build the Admin Header.
- [x] Create the Overview page with stats cards.

### Phase 3: The Content Pages (UI)
- [x] Build the Bookings & Inquiry Management table.
- [x] Build the Property Catalog Management page (List + Forms).
- [x] Build the Newsletter Subscribers list.
- [x] Build the Content Management (Architecture Lab) settings.

### Phase 4: The Backend Connection (Vercel KV + ImgBB)
- [ ] Setup Vercel KV for data storage and ImgBB for image hosting.
- [ ] Convert simple PIN login to verify via backend securely (if required).
- [ ] Fetch and update real bookings from Vercel KV.
- [ ] Connect property edits (Upload images to ImgBB -> Save data to Vercel KV).
- [ ] Connect newsletter subscriber data to Vercel KV.

---

## ✨ Admin Features Breakdown & Checklist

### 1. 📊 Overview / Dashboard
A quick snapshot of how the platform is performing.
- [x] **Total Bookings/Inquiries:** How many people have requested a viewing or consultation.
- [x] **New Leads:** Number of recent newsletter subscribers.
- [x] **Recent Activity Feed:** A quick list of the latest actions (e.g., "John Doe booked a viewing for Property X").

### 2. 📅 Booking & Inquiry Management (High Priority)
Since your app has an integrated booking system, you need a place to manage these requests.
- [x] **Data Table:** A list of all bookings with columns for Name, Email, Phone, Property of Interest, and Date.
- [x] **Status Toggles:** Ability to mark a booking as Pending, Contacted, or Closed.
- [x] **Quick Actions:** A button to quickly email or WhatsApp the client directly from the dashboard.

### 3. 🏡 Property Catalog Management (CRUD)
Currently, your properties might be stored in static files (like `src/data/`), but an admin page is the perfect place to manage them visually.
- [x] **Property List:** View all properties categorized by collection (Starter, Family, Signature).
- [x] **Add/Edit/Delete:** A form to add a new property, update its price, or change its description.
- [x] **Gallery Manager:** A way to upload or change the 7-image gallery (Exterior, Living Room, Kitchen, etc.) for each property.

### 4. 📧 Newsletter Subscribers
A simple CRM feature for your marketing efforts.
- [x] **Subscriber List:** A list of all emails captured through the newsletter form.
- [x] **Export Button:** A button to export the list as a .csv file so you can import it into tools like Mailchimp or send bulk emails.
