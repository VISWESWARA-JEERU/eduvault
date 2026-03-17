# EduVault

EduVault is a comprehensive educational platform designed to manage academic resources, user accounts, and content for students and administrators. It provides a user-friendly interface for accessing PDFs, managing branches, years, semesters, subjects, and units, with role-based access control for admins and super-admins.

## Features

- **User Authentication**: Secure login with role-based access (Student, Admin, SuperAdmin).
- **Dashboard**: Personalized dashboard for students to browse and download PDFs.
- **Admin Panel**: Manage users, branches, years, semesters, subjects, units, and PDFs.
- **PDF Management**: Upload, organize, and download educational PDFs.
- **Responsive Design**: Mobile-friendly interface with hamburger navigation.
- **OTP Password Reset**: Secure password recovery via email OTP.
- **Role-Based Permissions**: SuperAdmins can create/delete admins; Admins can manage users.

## Tech Stack

- **Frontend**: React, Vite, Axios, CSS
- **Backend**: Node.js, Express.js, JWT, bcrypt
- **Database**: MySQL
- **Email**: Nodemailer (for OTP)
- **Deployment**: Ready for hosting on platforms like Vercel, Heroku, or AWS

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd eduvault-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in `eduvault-backend/` with:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=eduvault
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   EMAIL_SERVICE=gmail
   ```

4. Set up the database:
   Import `eduvalut-database.sql` into your MySQL database.

5. Start the backend server:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd eduvault-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`.

## Usage

1. **Register/Login**: Create an account or log in with existing credentials.
2. **Student Dashboard**: Select branch → year → semester → subject → unit to view and download PDFs.
3. **Admin Dashboard**: Manage academic content and user accounts based on role.
4. **Password Reset**: Use "Forgot Password" to reset via OTP.

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/register-admin` - Admin registration (SuperAdmin only)
- `POST /api/forgot-password` - Send OTP
- `POST /api/verify-otp` - Verify OTP
- `POST /api/reset-password` - Reset password

### Academic Management
- `GET /api/branches` - Get all branches
- `GET /api/years` - Get all years
- `GET /api/semesters/year/:yearId` - Get semesters by year
- `GET /api/subjects/semester/:semesterId` - Get subjects by semester
- `GET /api/units/subject/:subjectId` - Get units by subject
- `GET /api/pdfs/unit/:unitId` - Get PDFs by unit
- `GET /api/pdfs/download/:id` - Download PDF

### Admin
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/admins/:id` - Delete admin (SuperAdmin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m 'Add feature'`.
4. Push to branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, contact [your-email@example.com].