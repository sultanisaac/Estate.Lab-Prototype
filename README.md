# Estate.Lab - Premium Real Estate Landing Page

**Estate.Lab** is a luxurious, high-converting real estate prototype built to showcase architecturally significant homes. Designed with a premium brand identity in mind, this landing page serves as a sophisticated digital catalog to attract potential home buyers and investors. 

The platform utilizes a "Real Estate Funnel" approach, guiding visitors from an immersive hero section down to exploring property collections, learning about architectural styles, building trust, and finally, lead capture.

## 🌟 Key Features

- **The Curated Collections:** Properties categorized by size and target demographic (Starter, Family, Signature collections).
- **Interactive 7-Image Gallery:** Each property features a seamless gallery modal showcasing the Exterior, Living Room, Kitchen, Master Bedroom, Bathroom, Multifunction Room, and Outdoor Space.
- **The Architecture Lab:** An interactive section that dynamically shifts the page background color when hovering over different architectural styles (Minimalis Modern, Tropis Modern, Skandinavia, Industrial).
- **Integrated Booking & Newsletter Systems:** Full booking flow and lead capture with serverless backend processing.
- **Automated Email Notifications:** Professional HTML email confirmations for both clients and advisors via Nodemailer and Gmail SMTP.
- **Responsive & Animated UI:** Built with a mobile-first approach, featuring smooth micro-animations, a premium video hero background, and hover lifts powered by Framer Motion.

## 🛠 Tech Stack

- **Framework:** React 18 & React Router
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (Premium customized theme)
- **Animations:** Framer Motion
- **Backend & API:** Vercel Serverless Functions
- **Email Service:** Nodemailer
- **Icons:** Lucide React
- **Language:** TypeScript

## 🎨 Brand Identity

- **Vibe/Tone:** Luxury, Trust, Premium, Architectural, Warm.
- **Primary Color:** `#0F4C5C` (Deep Emerald Teal)
- **Secondary Color:** `#D4B483` (Champagne Gold)
- **Typography:** *Playfair Display* (Headings), *Inter* (Body/UI)

## 🚀 Getting Started

To run this project locally, you will need to set up your environment variables for the backend services.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_gmail_app_password
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/components/ui/` - Reusable UI components (Buttons, Property Cards, Modals).
- `src/components/layout/` - Global layout components (Navbar, Footer).
- `src/data/` - Static datasets for properties and architectural styles.
- `src/App.tsx` - Main landing page assembly and sections.

---
*Engineered for Living. Designed for You.*
