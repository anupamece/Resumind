# 📄 RESUMIND - AI-Powered Resume Analyzer

**RESUMIND** is a modern, intelligent resume analysis platform that provides instant ATS (Applicant Tracking System) compatibility scoring and comprehensive feedback using AI-powered analysis. Built with React Router 7, TypeScript, and Puter.js for cloud integration.

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Resume Analysis** - Advanced resume evaluation using Claude 3.7 Sonnet
- **ATS Compatibility Scoring** - Real-time scoring for resume optimization
- **PDF Processing** - Client-side PDF to image conversion using PDF.js
- **Interactive UI Components** - Accordion-style detailed feedback with color-coded insights
- **Cloud Storage Integration** - Seamless file storage via Puter.js platform
- **Drag & Drop Upload** - Intuitive file upload with validation and preview

### 📊 Analysis Categories
- **Overall Score** - Comprehensive 0-100 rating system
- **ATS Score** - Applicant Tracking System compatibility rating
- **Tone & Style** - Writing tone and professional style analysis
- **Content Quality** - Skills, experience, and content relevance evaluation
- **Document Structure** - Layout, formatting, and organization assessment
- **Skills Matching** - Technical and soft skills alignment with job requirements

### 🎨 User Experience
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Status Updates** - Progress indicators during analysis
- **Interactive Score Visualization** - Animated circular progress indicators
- **Color-Coded Feedback** - Green (good), yellow (average), red (needs improvement)
- **Detailed Tooltips** - Contextual help and explanations
- **Authentication Flow** - Secure Puter.js authentication system

## � Tech Stack

### Frontend
- **React 19** - Latest React with hooks and concurrent features
- **TypeScript** - Full type safety and IntelliSense support
- **React Router 7** - File-based routing with SSR support
- **Tailwind CSS 4** - Utility-first styling with custom design system
- **Vite** - Fast build tool with HMR for development

### Libraries & Integrations
- **PDF.js 3.11.174** - Client-side PDF processing and rendering
- **React Dropzone** - File upload with drag-and-drop functionality
- **Zustand** - Lightweight state management for Puter integration
- **Puter.js v2** - Cloud storage, authentication, and AI services
- **Tailwind Merge + clsx** - Dynamic class composition utilities

### Development Tools
- **TypeScript 5.9** - Static type checking
- **ESLint & Prettier** - Code formatting and linting
- **Vite TypeScript Paths** - Import path resolution
- **Docker** - Containerization support

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm or pnpm
- Modern browser with JavaScript enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## 📖 Usage Guide

### 1. Authentication
- Navigate to the application
- Click "Log In" to authenticate via Puter.js
- Complete the authentication flow

### 2. Upload & Analyze Resume
1. **Navigate to Upload** - Click "Upload Resume" in navigation
2. **Fill Job Details** - Enter company name, job title, and job description
3. **Upload PDF** - Drag & drop or click to upload your resume (max 20MB)
4. **Start Analysis** - Click "Analyze" to begin AI processing
5. **View Results** - Automatically redirected to detailed results page

### 3. Review Feedback
- **Overall Score** - View comprehensive 0-100 rating
- **ATS Analysis** - Check Applicant Tracking System compatibility
- **Category Breakdown** - Expand sections for detailed insights:
  - Tone & Style recommendations
  - Content improvement suggestions
  - Structure optimization tips
  - Skills matching analysis

### 4. Resume Management
- Access previously analyzed resumes from the home dashboard
- Click any resume card to revisit detailed analysis
- View original PDF and generated preview images

## 🏗 Project Structure

```
resume-analyzer/
├── app/                          # Application source code
│   ├── components/               # Reusable UI components
│   │   ├── Navbar.tsx           # Navigation header
│   │   ├── FileUploader.tsx     # Drag-and-drop file upload
│   │   ├── ScoreCircle.tsx      # Circular progress indicator
│   │   ├── ResumeCard.tsx       # Resume preview card
│   │   ├── details.tsx          # Accordion feedback details
│   │   ├── ats.tsx              # ATS score component
│   │   └── ...                  # Additional components
│   ├── routes/                  # Page components
│   │   ├── home.tsx             # Dashboard with resume cards
│   │   ├── Auth.tsx             # Authentication page
│   │   ├── Upload.tsx           # Resume upload form
│   │   └── Resume.tsx           # Detailed analysis results
│   ├── lib/                     # Utility libraries
│   │   ├── puter.ts             # Puter.js integration & Zustand store
│   │   ├── pdf2image.ts         # PDF to image conversion
│   │   └── utils.ts             # General utilities
│   ├── app.css                  # Global styles & Tailwind config
│   └── root.tsx                 # Application root with providers
├── constants/                   # Application constants
│   └── index.ts                 # Sample data & AI prompts
├── types/                       # TypeScript definitions
│   ├── index.d.ts               # Application types
│   └── puter.d.ts               # Puter.js type definitions
├── public/                      # Static assets
│   ├── images/                  # UI images and backgrounds
│   ├── icons/                   # SVG icons
│   └── pdf.worker.min.js        # PDF.js worker file
├── package.json                 # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── Dockerfile                  # Container configuration
└── README.md                   # Project documentation
```

## 🔧 Available Scripts

```bash
# Development server with HMR
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run typecheck
```

## 🚢 Deployment

### Docker Deployment
```bash
# Build the container
docker build -t resumind .

# Run the container
docker run -p 3000:3000 resumind
```

### Platform Support
The application can be deployed to any platform supporting Node.js applications:
- **Vercel** - Recommended for React Router 7 apps
- **Netlify** - Full-stack deployment support
- **AWS ECS/Fargate** - Container-based deployment
- **Google Cloud Run** - Serverless containers
- **Railway** - Simple deployment platform
- **Fly.io** - Global application platform

### Build Output
```
build/
├── client/     # Static assets for CDN
└── server/     # Server-side code for Node.js
```

## 🎨 Design System

### Color Palette
- **Primary Gradient** - Purple to blue (`#8e98ff` → `#606beb`)
- **Status Colors** - Green (good), Yellow (average), Red (needs work)
- **Neutral Tones** - Gray scale for text and backgrounds
- **Accent Colors** - Light blue gradients for backgrounds

### Typography
- **Primary Font** - Mona Sans (Google Fonts)
- **Heading Scale** - 3rem to 6xl responsive sizing
- **Body Text** - Optimized for readability

### Components
- **Gradient Borders** - Subtle light blue gradients
- **Glass Morphism** - Backdrop blur effects
- **Smooth Animations** - CSS transitions and transforms
- **Responsive Grid** - Mobile-first layout system

## 🔐 Security & Privacy

- **Client-Side Processing** - PDF conversion happens in browser
- **Secure Authentication** - Puter.js handles user authentication
- **Encrypted Storage** - All files stored securely via Puter.js
- **No Data Persistence** - No local storage of sensitive resume data
- **AI Processing** - Secure Claude 3.7 Sonnet integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Puter.js** - Cloud infrastructure and AI services
- **PDF.js** - Mozilla's PDF rendering library
- **React Router** - Full-stack React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Anthropic** - Claude AI model for intelligent analysis

---

**Built with ❤️ using React Router 7, TypeScript, and AI**

For support or questions, please open an issue in the repository.
