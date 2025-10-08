# SoundCloud Clone App

A full-stack music streaming application built with modern web technologies, featuring Next.js 14 frontend and NestJS backend.

## 📝 Description (Updated)

This project includes Next.js 14 with Server Actions support. Next.js is a JavaScript framework specialized for frontend development, with built-in React library integration for efficient UI development. The advantage of Next.js over pure React is providing a framework structure that solves common React issues we previously handled manually, such as routing, nested routes, etc.

Additionally, with server-side advantages, Next.js can pre-render interfaces, helping websites load faster and providing SEO benefits compared to traditional React client-side rendering.

In this project, you'll learn the latest Next.js features from scratch (using TypeScript) through a practical SoundCloud clone website.

## ✨ Key Features

### 1. Main Project Features:

- **Authentication**: Support for Google/GitHub login and local backend account login. Capable of supporting login with various platforms listed at: https://next-auth.js.org/providers/

- **Music Playback**:
  - Audio track in footer
  - Audio as waveform/wavetrack for detailed view (clone of SoundCloud concept)

- **Interactive Features**:
  - Time-based comments displayed on wavetrack
  - Create playlists/Like tracks
  - Search/Find tracks by display name

- **Admin Interface**: CRUD operations for users/tracks/comments...

### 2. Technology Stack

#### Frontend:
- **Client**: Next.js, MUI (TypeScript). Login with Next-auth (supports Google/GitHub login and Credential Provider from backend)
- **Admin**: Vite, Antd (TypeScript)

#### Backend:
- **NestJS** (provided)

## 🚀 Technologies & Learning Objectives

### React Knowledge (TypeScript with Vite)
Beyond basic knowledge, additional topics covered:
- React Children, React Fragment, React Context
- Suspense/Lazy loading
- Hooks: useRef, useCallback, useMemo

### Next.js Knowledge
- **Next.js 13 with App Router** (TypeScript)
- Master the changes in Next.js 13 compared to older versions (breaking changes):
  - **Routing** (dynamic routes, route groups)
  - **Data Fetching** (Server component vs Client component with "use client")
  - **Authentication** with Next-auth (using Session/JWT/Refresh Token)
  - **SEO** (basic level, testing with built-in lighthouse extension)
  - **Rendering**: Client Side Rendering (CSR), Server Side Rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR)

### End of Course Updates
- **Next.js 14 Upgrade** guide and Server Actions usage
- **Build Mode**:
  - Build application with Docker
  - Update interface after build (with revalidateTag)
- **MUI** for base components

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)

### Backend Setup
```bash
cd soundcloud-nestjs-backend
npm install
npm run start:dev
```

### Frontend Setup
```bash
# Client application
npm install
npm run dev

# Admin application (if separate)
cd admin
npm install
npm run dev
```

## 📂 Project Structure

```
soundcloud-app/
├── README.md
├── soundcloud-nestjs-backend/          # NestJS Backend
│   ├── package.json
│   ├── postman/                        # API Collection
│   ├── public/                         # Static Assets
│   │   ├── css/
│   │   ├── images/                     # User uploaded images
│   │   └── tracks/                     # Audio files
│   └── views/
└── [frontend-folders]                  # Next.js Frontend (to be added) -> Development!
```

## 🎯 Target Audience

This course/project is suitable for those who:
- Have a need to learn about React
- Want to know how React is used in practice
- Want to create a website that ensures performance combined with SEO to improve Google search results
- Are interested in modern full-stack development with TypeScript
- Want to understand the differences between client-side and server-side rendering

## 🚢 Deployment

### Docker Deployment
```bash
# Build Docker image
...
# Run container
...
```

### Production Build
```bash
...
```

## 📊 Performance & SEO

The application is optimized for:
- Fast loading times with Next.js pre-rendering
- SEO-friendly with server-side rendering
- Lighthouse performance testing
- Efficient image and audio loading

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by SoundCloud's design and functionality
- Built with modern web development best practices
- Educational project for learning Next.js and full-stack development

---

**Note**: This is an educational project created for learning purposes. It demonstrates modern web development practices and is not intended for commercial use.
