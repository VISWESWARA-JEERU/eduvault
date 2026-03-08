SELECT * FROM admins;
use eduvault;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin', 'user') NOT NULL
);

CREATE TABLE branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(100) NOT NULL
);
CREATE TABLE years (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year_name VARCHAR(50) NOT NULL,
    branch_id INT NOT NULL,

    FOREIGN KEY (branch_id) REFERENCES branches(id) 
    ON DELETE CASCADE,

    UNIQUE (branch_id, year_name)
);

CREATE TABLE semesters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    semester_name VARCHAR(50) NOT NULL,
    year_id INT NOT NULL,

    FOREIGN KEY (year_id) REFERENCES years(id)
    ON DELETE CASCADE,

    UNIQUE (year_id, semester_name)
);
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(150) NOT NULL,
    semester_id INT NOT NULL,

    FOREIGN KEY (semester_id) REFERENCES semesters(id)
    ON DELETE CASCADE,

    UNIQUE (semester_id, subject_name)
);
CREATE TABLE units (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit_name VARCHAR(100) NOT NULL,
    subject_id INT NOT NULL,

    FOREIGN KEY (subject_id) REFERENCES subjects(id)
    ON DELETE CASCADE,

    UNIQUE (subject_id, unit_name)
);
CREATE TABLE pdfs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    unit_id INT NOT NULL,
    download_count INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);
