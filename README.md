# Baby Photo Album Guestbook / 小寶成長日記

Welcome! This is a personal project created for my newborn son and my family. It serves as a digital photo album and guestbook where we can capture and share precious moments of our baby's growth journey. The application allows family and friends to view photos, leave messages, and interact with content in a meaningful way.

## Folder Structure

```
src
 ┣ components
 ┃ ┣ Footer.tsx
 ┃ ┣ navbar.tsx
 ┃ ┣ NoSSR.tsx
 ┃ ┣ photoDetail.tsx
 ┃ ┣ photoModal.tsx
 ┃ ┗ rawTable.tsx
 ┣ hooks
 ┃ ┗ useGetUserId.tsx
 ┣ pages
 ┃ ┣ api
 ┃ ┃ ┣ auth
 ┃ ┃ ┃ ┗ [...nextauth].ts
 ┃ ┃ ┣ photo
 ┃ ┃ ┃ ┣ [photoId].ts
 ┃ ┃ ┃ ┗ recommendations.ts
 ┃ ┃ ┣ user
 ┃ ┃ ┃ ┗ [userId].ts
 ┃ ┃ ┣ dash.ts
 ┃ ┃ ┣ loading.ts
 ┃ ┃ ┗ submit.ts
 ┃ ┣ _app.tsx
 ┃ ┣ _document.tsx
 ┃ ┣ index.tsx
 ┃ ┣ login.tsx
 ┃ ┣ message.tsx
 ┃ ┣ profile.tsx
 ┃ ┣ register.tsx
 ┃ ┣ savedPhoto.tsx
 ┃ ┗ writePhoto.tsx
 ┣ styles
 ┃ ┗ globals.css
 ┗ utils
 ┃ ┗ cloudinaryUploader.ts
```

## Tech Stack

- **Next.js 13.2.4**: Framework for server-side rendering and building React applications
- **React 18.2.0**: JavaScript library for building user interfaces
- **TypeScript**: Strongly typed programming language for safer code
- **Tailwind CSS**: Utility-first CSS framework for styling
- **MongoDB with Mongoose**: Database for storing user data and photo metadata
- **NextAuth**: Authentication library for user login and registration
- **Cloudinary**: Service for image upload and management
- **Recharts**: Library for data visualization in dashboards
- **React Table**: Library for creating dynamic tables
- **Google Sheets API**: Integration for external data management
- **OpenAI**: Potential integration for AI-driven features like photo recommendations or captions

## Features

- **Photo Gallery**: Browse a collection of baby photos in a visually appealing grid
- **Image Slides**: View photos in a slideshow format for an immersive experience
- **User Authentication**: Secure login and registration system for family and friends
- **Save to Favorites**: Ability to save favorite photos to a personal collection
- **Photo Uploads**: Upload photos with titles and descriptions using Cloudinary
- **Dynamic Dashboard**: Visualize data and statistics with interactive charts
- **Dynamic Tables**: Display data in structured, sortable tables
- **Message Board**: Leave messages and well-wishes for the baby and family
- **Photo Interactions**: Comment on and like photos to engage with content
- **User Profiles**: Personalized profiles for each user with their activity and uploads

## Feedback

If you are interested in me or have comments for my projects, feel free to send me an email at 30sboynote@gmail.com.

## 🚀 About Me

- A Frontend Engineer proficient with Next.js and React.
- Experienced in leveraging AI tools to optimize development workflows, with proven skills in integrating diverse API services into web applications.
- 10 years of experience in B2B software sales at global companies and startups, prior to transitioning into engineering.

## 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://joshhong.vercel.app/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/josh-hong-163644102/)
