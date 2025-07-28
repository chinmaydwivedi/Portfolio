# 🚀 Minimal Portfolio Website

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. Features a beautiful starry background animation, real-time Codeforces integration, and a clean, professional design.

## ✨ Features

### 🎨 **Visual Design & Animations**
- **Starry Background Animation**: Interactive starry night sky with shooting stars and click-generated stars
- **Theme Toggle**: Seamless dark/light mode switching with smooth transitions
- **Framer Motion**: Smooth animations and transitions throughout the site
- **Responsive Design**: Fully responsive layout that works on all devices
- **Glass Morphism**: Modern glassmorphism effects with backdrop blur

### 📊 **Codeforces Integration**
- **Real-time Stats**: Live Codeforces user statistics and ratings
- **Interactive Rating Graph**: Visual representation of rating progression over time
- **Auto-refresh**: Automatic data refresh every 5 minutes
- **Manual Refresh**: Manual refresh button for immediate updates
- **Error Handling**: Graceful error handling with user-friendly messages

### 🛠 **Technical Features**
- **Next.js 15**: Latest version with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework with custom animations
- **Radix UI**: Accessible and customizable UI components
- **API Routes**: Server-side API endpoints for external integrations

## 🏗 **Architecture & Technologies**

### **Frontend Framework**
- **Next.js 15.2.4**: React framework with App Router
- **React 19**: Latest React version with concurrent features
- **TypeScript 5**: Static type checking

### **Styling & UI**
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Tailwind CSS Animate**: Animation utilities
- **Radix UI**: Headless UI components
  - Accordion, Alert Dialog, Avatar, Badge, Button, Card
  - Dialog, Dropdown Menu, Form, Hover Card, Input
  - Navigation Menu, Popover, Progress, Select, Separator
  - Slider, Switch, Tabs, Toast, Tooltip, and more
- **Lucide React**: Beautiful icon library
- **Framer Motion**: Animation library for React

### **Form Handling & Validation**
- **React Hook Form**: Performant forms with minimal re-renders
- **Zod**: TypeScript-first schema validation
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### **Data Visualization**
- **Recharts**: Composable charting library for React
- **Date-fns**: Modern JavaScript date utility library

### **Development Tools**
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 🔌 **APIs & External Services**

### **Codeforces API Integration**
The portfolio integrates with the Codeforces API through a custom Next.js API route:

**API Endpoint**: `/api/codeforces`
- **user.info**: Fetch user profile information
- **user.rating**: Get user rating history
- **user.status**: Retrieve user submission history

**Features**:
- Caching with 5-minute revalidation
- Error handling and fallbacks
- Rate limiting protection
- User-Agent headers for API compliance

### **API Route Implementation**
```typescript
// app/api/codeforces/route.ts
- Handles multiple Codeforces API endpoints
- Implements caching with Next.js revalidation
- Provides error handling and logging
- Supports query parameters for different data types
```

## 📁 **Project Structure**

```
├── app/
│   ├── api/
│   │   └── codeforces/
│   │       └── route.ts          # Codeforces API proxy
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main portfolio page
├── components/
│   ├── ui/                      # Radix UI components
│   ├── codeforces-rating-graph.tsx  # Rating visualization
│   ├── codeforces-stats.tsx     # Stats display
│   └── starry-background.tsx    # Background animation
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
└── public/                      # Static assets
```

## 🎯 **Key Components**

### **StarryBackground Component**
- Interactive starry night sky animation
- Click-generated stars with fade effects
- Theme-aware (dark/light mode)
- Shooting stars with multiple directions
- Morning sky animation for light mode

### **CodeforcesStats Component**
- Real-time user statistics display
- Rating color coding based on Codeforces standards
- Auto-refresh functionality
- Manual refresh capability
- Error state handling

### **CodeforcesRatingGraph Component**
- Visual rating progression chart
- Interactive tooltips
- Responsive design
- Theme-aware styling

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- pnpm (recommended) or npm

### **Installation**
```bash
# Clone the repository
git clone https://github.com/chinmaydwivedi/Portfolio.git
cd Portfolio

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

### **Environment Setup**
No environment variables required - the Codeforces API is public and doesn't require authentication.

### **Build for Production**
```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## 🎨 **Customization**

### **Personal Information**
Update the following in `app/page.tsx`:
- Name and title
- About section
- Skills list
- Project details
- Contact information

### **Codeforces Integration**
- Update the `handle` prop in the CodeforcesStats component
- Customize the refresh interval in the component
- Modify the API endpoint parameters as needed

### **Styling**
- Modify `app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize component styles in individual component files

## 📱 **Responsive Design**

The portfolio is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌟 **Performance Features**

- **Image Optimization**: Next.js Image component for optimized loading
- **Code Splitting**: Automatic code splitting with Next.js
- **Caching**: API responses cached for 5 minutes
- **Lazy Loading**: Components load on demand
- **Bundle Optimization**: Tree shaking and minification

## 🔧 **Development**

### **Available Scripts**
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### **Code Quality**
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks (if configured)

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 **Contact**

- **GitHub**: [@chinmaydwivedi](https://github.com/chinmaydwivedi)
- **Portfolio**: [Live Demo](https://your-portfolio-url.com)

---

⭐ **Star this repository if you found it helpful!**
