# Modern Portfolio Website

A stunning, fully-featured portfolio website built with React, featuring a beautiful Catppuccin Mocha theme, smooth animations, and a complete admin panel for content management.

## ✨ Features

### Public Portfolio
- **Responsive Design**: Fully responsive across all devices
- **Catppuccin Mocha Theme**: Beautiful, modern color scheme
- **Smooth Animations**: Framer Motion powered animations
- **Optimized Performance**: Code splitting and lazy loading for fast load times
- **SEO Friendly**: Proper meta tags and semantic HTML

### Sections
- 🏠 **Hero**: Animated gradient background with social links
- 👤 **About**: Personal description with stats and attributes
- 💼 **Experience**: Timeline view of work history and education
- ⚡ **Skills**: Categorized tech stack with proficiency indicators
- 🚀 **Projects**: Showcase of portfolio projects with images and links
- 📧 **Contact**: Contact form and information

### Admin Panel
- 🔐 **Secure Authentication**: Supabase Auth integration
- ✏️ **Profile Management**: Edit about section and personal info
- 📝 **Experience CRUD**: Manage work experience and education
- 🛠️ **Tech Stack CRUD**: Add/edit technologies with icons
- 🎨 **Projects CRUD**: Full project management with images
- 📊 **Real-time Updates**: Changes reflect immediately on the public site

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Supabase** - PostgreSQL database, authentication, and storage
- **Row Level Security** - Secure data access

### Deployment
- **Vercel** - Hosting and deployment

## 📦 Installation

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfoliov3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a Supabase project
   - Run the SQL schema from `supabase-schema.sql`
   - Create an admin user in Supabase Authentication

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Access the site**
   - Portfolio: `http://localhost:5173`
   - Admin: `http://localhost:5173/admin/login`

## 🎨 Customization

### Theme Colors
Edit `src/index.css` to customize the Catppuccin Mocha colors:
- `--ctp-mauve`: Primary accent (#cba6f7)
- `--ctp-blue`: Secondary accent (#89b4fa)
- `--ctp-peach`: Tertiary accent (#fab387)

### Social Links
Update social media links in:
- `src/components/Hero.jsx`
- `src/components/Contact.jsx`

### Content
All content is managed through the admin panel at `/admin`

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🔒 Security

- Row Level Security (RLS) enabled on all Supabase tables
- Public read access for portfolio data
- Authenticated write access for admin users only
- Environment variables for sensitive credentials

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## 📝 Admin Panel Usage

1. Navigate to `/admin/login`
2. Login with your Supabase credentials
3. Manage content through the dashboard:
   - **Profile**: Edit personal information
   - **Experience**: Add work history and education
   - **Tech Stack**: Manage technologies and skills
   - **Projects**: Showcase your work

## 🎯 Performance Optimizations

- ✅ Code splitting for smaller initial bundle
- ✅ Lazy loading for images
- ✅ GPU-accelerated animations
- ✅ Optimized Supabase queries
- ✅ Responsive images with proper sizing

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**Muhammad Alif Ardiansyah (Afdaan)**
- Portfolio: [Your Portfolio URL]
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourusername)

---

Built with ❤️ using React, Supabase, and Catppuccin Mocha theme
