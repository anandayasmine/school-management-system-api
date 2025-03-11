# School Management System

This API provides endpoints for managing teacher-student relationships, suspending students, and sending notifications.

## Database Schema

The database consists of three tables:

### `teachers` Table
| Column  | Type          | Constraints       |
|---------|--------------|-------------------|
| `id`    | INT          | PRIMARY KEY, AUTO_INCREMENT |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL |

### `students` Table
| Column    | Type          | Constraints       |
|-----------|--------------|-------------------|
| `id`      | INT          | PRIMARY KEY, AUTO_INCREMENT |
| `email`   | VARCHAR(255) | UNIQUE, NOT NULL |
| `suspended` | BOOLEAN      | DEFAULT FALSE    |

### `teacher_student` Table (Many-to-Many Relationship)
| Column       | Type | Constraints |
|-------------|------|-------------|
| `teacher_id` | INT  | FOREIGN KEY REFERENCES `teachers(id)` |
| `student_id` | INT  | FOREIGN KEY REFERENCES `students(id)` |

## Database Query

```sql
CREATE DATABASE school_db;

USE school_db;

CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    suspended BOOLEAN DEFAULT FALSE
);

CREATE TABLE teacher_student (
    teacher_id INT,
    student_id INT,
    PRIMARY KEY (teacher_id, student_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
```

## Dummy Data

Run the following SQL queries to populate the database with dummy data:

```sql
-- Insert dummy teachers
INSERT INTO teachers (email) VALUES
('teacher1@example.com'),
('teacher2@example.com'),
('teacher3@example.com');

-- Insert dummy students
INSERT INTO students (email, suspended) VALUES
('student1@example.com', FALSE),
('student2@example.com', FALSE),
('student3@example.com', TRUE),  -- Suspended student
('student4@example.com', FALSE),
('student5@example.com', FALSE);

-- Assign students to teachers (many-to-many relationship)
INSERT INTO teacher_student (teacher_id, student_id) VALUES
(1, 1),  -- teacher1 → student1
(1, 2),  -- teacher1 → student2
(2, 2),  -- teacher2 → student2
(2, 3),  -- teacher2 → student3 (suspended)
(3, 4),  -- teacher3 → student4
(3, 5);  -- teacher3 → student5
```


## Running the API

### Prerequisites
Ensure you have the following installed:
- Node.js (>= 16.x)
- MySQL Server
- npm (Node Package Manager)

### Installation and Setup

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure the `.env` file:
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```env
     PORT=running_api_port
     DB_PORT=running_db_port
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=school_db
     ```

4. Run database migrations (if applicable):
   ```sh
   npm run migrate
   ```

5. Start the API server:
   ```sh
   npm start
   ```
   The server should now be running at `http://localhost:3000` or any of the port you set on .env.

### Running in Development Mode
To run the API with hot-reloading:
```sh
npm run dev
```

### Running Tests
Run unit tests with:
```sh
npm test
```

## Postman Collection
To simplify API testing, import the provided Postman collection (`postman_collection.json`).

