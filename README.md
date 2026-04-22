# LifeLink - Blood Bank Management System

LifeLink is a comprehensive, full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to bridge the gap between blood donors, hospitals, and those in need. It provides a robust platform for managing blood donations, tracking inventory, and facilitating quick responses during medical emergencies.

## 🚀 Features

### For Users (Donors & Receivers)
- **User Authentication:** Secure registration and login using JWT.
- **Blood Donation:** Easily register to donate blood and track your donation history.
- **Request Blood:** Submit urgent blood requests and find matching donors in your area.
- **Real-time Notifications:** Get instantly notified about blood requests and updates using Socket.io.
- **Profile Management:** Update personal details, blood group, and availability status.

### For Hospitals & Admins
- **Inventory Management:** Track blood stock levels across different groups in real-time.
- **Dashboard Analytics:** Visual representation of blood bank statistics using Recharts.
- **Manage Requests:** Approve, reject, or fulfill blood requests efficiently.
- **Donor Directory:** Access a secure directory of available donors.

## 🛠️ Tech Stack

### Frontend
- **React.js** (built with Vite for faster development)
- **Tailwind CSS** for responsive, modern styling
- **Framer Motion** for smooth UI animations
- **React Router Dom** for seamless navigation
- **React Query** for efficient data fetching and caching
- **Axios** for making HTTP requests
- **Recharts** for interactive data visualization

### Backend
- **Node.js & Express.js** for a robust, scalable server architecture
- **MongoDB & Mongoose** for flexible NoSQL database management
- **Socket.io** for real-time, bidirectional communication
- **JSON Web Tokens (JWT)** for secure, stateless authentication
- **Bcrypt.js** for password hashing
- **Nodemailer** for email notifications
- **Cloudinary** for image and media uploads

## ⚙️ Installation & Setup

To get a local copy up and running, follow these simple steps:

### Prerequisites
- Node.js installed on your machine
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/gautamsharma16/LifeLink.git
cd BloodBank-2
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup Frontend
Open a new terminal window/tab:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```
Start the frontend development server:
```bash
npm run dev
```

The frontend will usually be accessible at `http://localhost:5173`.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the ISC License. See `LICENSE` for more information.
