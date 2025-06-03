# Hanif Awol Seid - Portfolio Website

A modern, responsive portfolio website showcasing the skills and services of Hanif Awol Seid, a 15-year-old programmer, video editor, and forex trader.

## Features

- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Mode**: Toggle between themes
- **Contact Form**: Firebase integration for message storage
- **News System**: Admin panel for posting news with images
- **Modern UI**: Clean and professional design
- **Fast Loading**: Optimized for performance

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome icons
- Responsive CSS Grid and Flexbox
- CSS Custom Properties for theming

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- Multer for file uploads
- CORS for cross-origin requests

### Services
- Firebase Firestore (contact form)
- MongoDB (news storage)

## Project Structure

\`\`\`
hanif-portfolio/
├── public/                 # Frontend files
│   ├── index.html         # Home page
│   ├── about.html         # About page
│   ├── services.html      # Services page
│   ├── skills.html        # Skills page
│   ├── contact.html       # Contact page
│   ├── news.html          # News page
│   ├── admin.html         # Admin panel
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   └── js/
│       ├── main.js        # Main JavaScript
│       ├── news.js        # News functionality
│       └── admin.js       # Admin functionality
├── backend/               # Backend files
│   ├── server.js          # Express server
│   └── uploads/           # Image uploads
├── package.json           # Dependencies
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # This file
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Firebase account (for contact form)

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd hanif-portfolio
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configurations
nano .env
\`\`\`

### 4. Configure Environment Variables
Edit the `.env` file with your settings:

\`\`\`env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/hanif-portfolio

# Server Port
PORT=3000

# Firebase Configuration (optional, for contact form)
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=your-app-id
\`\`\`

### 5. Firebase Setup (Contact Form)
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Get your Firebase configuration
4. Update the Firebase config in `public/contact.html`

### 6. Start the Application

#### Development Mode
\`\`\`bash
npm run dev
\`\`\`

#### Production Mode
\`\`\`bash
npm start
\`\`\`

The application will be available at:
- Frontend: `http://localhost:3000` (served by Express)
- API: `http://localhost:3000/api`

## Usage

### Frontend Pages
- **Home**: Introduction and quick stats
- **About**: Detailed background information
- **Services**: List of offered services
- **Skills**: Technical skills with experience levels
- **Contact**: Contact form with Firebase integration
- **News**: Display of news posts
- **Admin**: Admin panel for managing news posts

### Admin Panel
1. Navigate to `/admin.html`
2. Fill in the news post form:
   - Title
   - Description
   - Featured Image
3. Click "Publish Post" to save to MongoDB

### API Endpoints
- `GET /api/news` - Get all news posts
- `POST /api/news` - Create new news post (with image upload)
- `GET /api/news/:id` - Get single news post
- `DELETE /api/news/:id` - Delete news post
- `GET /api/health` - Health check

## Customization

### Changing Personal Information
Edit the HTML files in the `public/` directory to update:
- Name and tagline
- About information
- Services offered
- Skills and experience
- Contact information

### Styling
Modify `public/css/style.css` to customize:
- Colors (CSS custom properties in `:root`)
- Fonts
- Layout
- Animations

### Adding New Features
1. Add new HTML pages in `public/`
2. Update navigation in all pages
3. Add corresponding JavaScript if needed
4. Create API endpoints in `backend/server.js` if required

## Deployment

### Local Development
The project is ready to run locally with the setup instructions above.

### Production Deployment
1. Set up MongoDB (MongoDB Atlas recommended)
2. Configure environment variables for production
3. Deploy to platforms like:
   - Heroku
   - Vercel
   - DigitalOcean
   - AWS

### Environment Variables for Production
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hanif-portfolio
PORT=3000
NODE_ENV=production
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please contact:
- Email: hanif.awol@example.com
- GitHub: [Create an issue](https://github.com/username/hanif-portfolio/issues)

## Acknowledgments

- Font Awesome for icons
- Firebase for backend services
- MongoDB for database
- Express.js for server framework
