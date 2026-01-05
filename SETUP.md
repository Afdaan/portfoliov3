# Portfolio Website - Setup Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account
- Vercel account (for deployment)

## 1. Supabase Setup

### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

### Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. This will create all necessary tables and RLS policies

### Get API Credentials
1. Go to **Project Settings** → **API**
2. Copy your **Project URL** (this is `VITE_SUPABASE_URL`)
3. Copy your **anon/public key** (this is `VITE_SUPABASE_ANON_KEY`)

### Create Admin User
1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter your email and password
4. This will be your admin login credentials

## 2. Local Development Setup

### Install Dependencies
```bash
cd portfoliov3
npm install
```

### Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Run Development Server
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

## 3. Using the Admin Panel

### Access Admin Panel
1. Navigate to `http://localhost:5173/admin/login`
2. Login with the email/password you created in Supabase
3. You'll be redirected to the admin dashboard

### Managing Content

#### Profile
- Edit your name, role, description, email, and location
- This appears in the About section

#### Work Experience & Education
- Add, edit, or delete work experiences
- Add, edit, or delete education entries
- Set dates (leave end date empty for current positions)

#### Tech Stack
- Add technologies with categories (Frontend, Backend, DevOps, Tools)
- Set proficiency level (1-5)
- Use react-icons names (e.g., `SiReact`, `SiNodedotjs`) or image URLs for icons
- Find icon names at [react-icons.github.io/react-icons](https://react-icons.github.io/react-icons/search?q=)

#### Projects
- Add portfolio projects with descriptions
- Set status (Completed, In Progress, Planning)
- Add tech stack (comma-separated)
- Add image URLs (comma-separated)
- Add demo and GitHub links
- Mark projects as featured

## 4. Deploying to Vercel

### Connect to Vercel
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **New Project**
4. Import your GitHub repository

### Configure Environment Variables
1. In Vercel project settings, go to **Environment Variables**
2. Add the following variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

### Deploy
1. Click **Deploy**
2. Vercel will automatically build and deploy your site
3. Your portfolio will be live at `your-project.vercel.app`

## 5. Performance Optimization Tips

### Images
- Use optimized images (WebP format recommended)
- Keep image sizes under 500KB
- Use image CDNs or Supabase Storage for hosting

### Loading Speed
- The site uses code splitting for faster initial load
- Lazy loading is enabled for images
- Framer Motion animations are GPU-accelerated

### Responsive Design
- All components are fully responsive
- Test on mobile devices using browser dev tools
- Breakpoints: 768px (tablet), 480px (mobile)

## 6. Customization

### Colors (Catppuccin Mocha Theme)
Edit `src/index.css` to customize colors:
- `--ctp-mauve`: Primary accent color
- `--ctp-blue`: Secondary accent color
- `--ctp-peach`: Tertiary accent color

### Social Links
Edit `src/components/Hero.jsx` and `src/components/Contact.jsx` to update social media links

### Contact Form
The contact form currently shows a success message. To integrate with an email service:
1. Use services like EmailJS, SendGrid, or Resend
2. Update the `handleSubmit` function in `src/components/Contact.jsx`

## Troubleshooting

### "Supabase credentials not found" warning
- Make sure `.env` file exists and contains valid credentials
- Restart the dev server after adding environment variables

### Admin login not working
- Verify you created a user in Supabase Authentication
- Check that RLS policies are enabled
- Ensure environment variables are correct

### Images not displaying
- Check that image URLs are accessible
- Verify CORS settings if using external image hosts
- Use Supabase Storage for reliable image hosting

## Support

For issues or questions:
1. Check the Supabase documentation
2. Review the implementation plan in `brain/implementation_plan.md`
3. Check browser console for error messages
