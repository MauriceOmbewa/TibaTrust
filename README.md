# TibaTrust - Healthcare Insurance Platform

A modern, blockchain-powered healthcare insurance platform designed specifically for Kenyans. TibaTrust provides affordable, transparent, and accessible medical coverage through community-driven support and innovative technology.

## 🏥 Features

### Core Functionality
- **User Registration & Authentication** - Secure account creation with Firebase
- **Insurance Plans** - Multiple coverage options tailored for different needs
- **Claims Management** - Easy claim submission and tracking system
- **M-Pesa Integration** - Seamless mobile money payments for premiums and donations
- **Multi-language Support** - Available in English and Swahili
- **Responsive Design** - Works perfectly on desktop and mobile devices

### Payment Integration
- **M-Pesa STK Push** - Direct mobile payments
- **Real-time Status Tracking** - Automatic payment confirmation
- **Donation System** - Community support through contributions

### User Experience
- **Dashboard** - Personalized user portal
- **Claims Tracking** - Monitor claim status in real-time
- **Community Features** - Connect with other members
- **Educational Content** - Learn about healthcare and insurance

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Firebase Auth
- **Payments**: M-Pesa Daraja API
- **Deployment**: Vercel (Frontend + Serverless Functions)
- **State Management**: React Context API
- **Routing**: React Router DOM

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MauriceOmbewa/TibaTrust.git
   cd TibaTrust
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MPESA_CONSUMER_KEY=your_mpesa_consumer_key
   MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
   MPESA_SHORTCODE=your_shortcode
   MPESA_PASSKEY=your_passkey
   NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   This runs both:
   - Frontend (Vite) on `http://localhost:8081`
   - M-Pesa dev server on `http://localhost:3001`

## 📱 M-Pesa Integration

### Local Development
- Uses `dev-server.js` for local M-Pesa API simulation
- Vite proxy routes `/api` calls to local server
- Test with sandbox credentials

### Production (Vercel)
- Serverless functions in `/api` directory handle M-Pesa requests
- Environment variables configured in Vercel dashboard
- Production M-Pesa API integration

### Testing M-Pesa
Use these sandbox test numbers:
- **Phone**: `254708374149` or `254714981014`
- **Amount**: Any value between 1-70000 KES

## 🏗️ Project Structure

```
├── api/                    # Vercel serverless functions
│   └── mpesa/             # M-Pesa API endpoints
├── public/                # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── layout/       # Navigation, footer
│   │   ├── payment/      # M-Pesa integration
│   │   └── ui/           # shadcn/ui components
│   ├── contexts/         # React contexts
│   ├── pages/            # Route components
│   ├── services/         # API services
│   └── utils/            # Helper functions
├── dev-server.js         # Local M-Pesa development server
└── vite.config.ts        # Vite configuration
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Import project from GitHub
   - Configure build settings (auto-detected)

2. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   MPESA_CONSUMER_KEY=your_production_key
   MPESA_CONSUMER_SECRET=your_production_secret
   MPESA_SHORTCODE=your_shortcode
   MPESA_PASSKEY=your_passkey
   NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git push origin main
   ```
   Vercel auto-deploys on push to main branch.

## 🔧 Available Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌍 Multi-language Support

TibaTrust supports both English and Swahili:
- Language switcher in navigation
- Context-based translations
- Persistent language preference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: [Your Contact Information]

## 🙏 Acknowledgments

- Safaricom for M-Pesa Daraja API
- shadcn/ui for beautiful components
- Vercel for hosting and serverless functions
- Firebase for authentication services

---

**TibaTrust** - Making healthcare accessible for every Kenyan 🇰🇪