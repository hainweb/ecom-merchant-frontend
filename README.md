# Merchant Frontend | Multi-Role E-Commerce Platform

This is the **Merchant Panel Frontend** of the Multi-Role E-Commerce Platform.  
Approved merchants can **manage products**, **track orders**, **analyze performance**, and handle **authentication** through a secure, responsive dashboard.

---

## Features

### Authentication
- Merchant **login** and **logout**
- **Forgot password** flow with OTP verification and reset
- **Send OTP** and **verify merchant** during registration
- **Mark intro seen** (for skipping tutorial after first login)
- Auto-session handling via JWT (integrated with backend)

### Product Management
- **Add, edit, delete, and view** products
- **Upload images** using Multer (via backend API)
- **Filter and sort** products dynamically
- **View all products** and merchant-specific listings
- Real-time **stock and price tracking**

### Orders & Analytics
- View **order history** and status updates
- Track **total revenue** and **revenue trends**
- Analyze **products by category**
- Monitor **shipping status analytics**

### UI / UX
- Responsive dashboard built with **TailwindCSS**
- Interactive charts using **Recharts**
- Toast and modal notifications for user feedback
- Intuitive navigation with **React Router DOM**
- Protected routes for authenticated merchants

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, TailwindCSS, Axios, React Router DOM |
| **Charts & Data Viz** | Recharts |
| **Authentication** | Express-session (handled via backend) |
| **File Upload** | Multer (server-side integration) |

---

## Environment Variables

Create a `.env` file in the **root directory** of the project with the following variables:

```env
# Base URL of your backend API
# Use full URL in development (e.g., localhost), and '/api' in production
# Example for development:
REACT_APP_BASE_URL=http://localhost:7000/admin
# Example for production:
# REACT_APP_BASE_URL=/api


```

---

## Setup Instructions

```bash
# Clone the repository
git clone https://github.com/hainweb/ecom-merchant-frontend.git

# Navigate to project directory
cd ecom-merchant-frontend

# Install dependencies
npm install

# Start the development server
npm start

