# PulsePro Design Document

## Overview

The Employee Management App aims to provide organizations with a comprehensive tool to manage their employees effectively. The application will include features such as user authentication, department management, employee profiles, performance management, leave management, payroll, time tracking, and reporting.

## Requirements & Features

### 1. User Authentication & Authorization

- **Authentication:**

  - Login
  - Register
  - Forgot Password
  - Reset Password

- **Authorization:**
  - Role-based access control with roles like Super Admin, Admin, HR Manager, Department Manager, Team Lead, and Employee.

### 2. Organizations

- **Organization Management:**

  - Create and manage organizations.

- **Organization Assignment:**
  - Assign departments to an organization.

### 3. Advanced Department Management

- **Department Hierarchy:**

  - Create a tree-like structure to represent the organization's structure.

- **Department Details:**

  - Manage details like name, manager, and number of employees.

- **Department Assignments:**
  - Assign employees to departments.

### 4. Advanced Employee Management

- **Employee Profiles:**

  - Manage personal details, job title, contact information.

- **Employee Assignments:**

  - Assign employees to departments and organizations.

- **Employee Documents:**
  - Upload and manage employee-related documents.

### 5. Employee Performance Management

- **Goal Setting:**

  - Set and track individual and departmental goals.

- **Performance Reviews:**

  - Conduct periodic performance reviews.

- **Feedback System:**
  - Provide a platform for feedback from managers and peers.

### 6. User Dashboard

- **Overview:**

  - Provide an overview of key metrics like the number of employees, departments, and recent activities.

- **Notifications:**
  - Alerts for upcoming performance reviews, pending approvals, etc.

### 7. Leave Management

- **Leave Requests:**

  - Employees can request leave.

- **Leave Approval:**

  - Managers can approve or reject leave requests.

- **Leave Tracking:**
  - Track the leave balance for employees.

### 8. Payroll Management

- **Salary Management:**

  - Manage employee salaries and payroll.

- **Payroll Reports:**

  - Generate and download payroll reports.

- **Tax Calculations:**
  - Automatically calculate taxes and deductions.

### 9. Time Tracking

- **Attendance:**

  - Track employee check-in and check-out times.

- **Timesheets:**
  - Employees can submit timesheets for approval.

### 10. Training and Development

- **Training Programs:**

  - Manage training programs and schedules.

- **Skill Development:**

  - Track employee skills and development progress.

- **Certifications:**
  - Manage and verify employee certifications.

### 11. Reporting & Analytics

- **Custom Reports:**

  - Generate custom reports based on various criteria.

- **Analytics Dashboard:**
  - Visualize data with charts and graphs.

## Design Considerations

### User Interface

- **Navigation:**

  - Implement a sidebar or top navigation bar for easy access to different sections.

- **Theme:**
  - Use a consistent color scheme and typography for a professional look.

### Responsive Design

- **Mobile-Friendly:**

  - Ensure the layout adapts to different screen sizes.

- **Touch Support:**
  - Optimize for touch interactions on mobile devices.

### Accessibility

- **Keyboard Navigation:**

  - Ensure all functionalities can be accessed via keyboard.

- **Screen Reader Support:**

  - Use ARIA roles and attributes for screen reader compatibility.

- **Contrast and Font Size:**
  - Ensure adequate contrast and adjustable font sizes for readability.

## Data Modeling

### Entities

- **Organizations:**

  - ID, Name, Description, etc.

- **Departments:**

  - ID, Name, OrganizationID, ParentDepartmentID, ManagerID, etc.

- **Employees:**

  - ID, Name, Email, DepartmentID, Role, ContactInfo, etc.

- **Performance Goals:**

  - ID, EmployeeID, Title, Description, Deadline, Status, etc.

- **Performance Reviews:**

  - ID, EmployeeID, ReviewerID, Date, Rating, Comments, etc.

- **Leave Requests:**

  - ID, EmployeeID, StartDate, EndDate, LeaveType, Status, Comments.

- **Payroll:**

  - ID, EmployeeID, Salary, Bonus, Deductions, Tax, NetPay, PayDate.

- **Timesheets:**

  - ID, EmployeeID, Date, HoursWorked, ApprovedBy, Status, Comments.

- **Training Programs:**
  - ID, Title, Description, StartDate, EndDate, Participants.

## Technical Architecture

### Frontend

- **Framework:**

  - Angular with Angular Material for UI components.

- **State Management:**

  - Use NgRx for state management.

- **Routing:**

  - Implement Angular Router for navigation.

- **Forms:**
  - Use Reactive Forms for form handling and validation.

### Backend

- **Framework:**

  - NestJS with TypeORM for database interaction.

- **API:**

  - Use GraphQL for flexible and efficient data fetching.

- **Authentication:**
  - Implement JWT for authentication and role-based access control.

### Database

- **Schema Design:**

  - Normalize the database schema to avoid redundancy.

- **Indexes:**

  - Use indexes for frequently queried fields to improve performance.

- **Backup:**
  - Implement regular database backups and recovery plans.

### Deployment

- **CI/CD Pipeline:**

  - Set up a CI/CD pipeline using GitHub Actions or another CI tool.

- **Cloud Provider:**

  - Use AWS for hosting, with services like EC2 for servers, RDS for PostgreSQL, and S3 for file storage.

- **Monitoring:**
  - Implement monitoring and logging using AWS CloudWatch or a similar service.

## Employee Roles and Responsibilities

### Roles

1. **Super Admin**

   - **Responsibilities:**
     - Automatically assigned upon registration.
     - Can create organizations and assign roles to other users.
     - Full access to all organizational actions such as creating departments, assigning employees, and deleting employees.
     - Each organization can have only one Super Admin.

2. **Admin**

   - **Responsibilities:**
     - Can perform all actions within the organization, including creating departments, assigning employees, and deleting employees with roles below Admin.
     - Multiple Admins can exist within a single organization.

3. **HR Manager**

   - **Responsibilities:**
     - Manage employee records and profiles.
     - Conduct and manage performance reviews.
     - Handle leave requests and approvals.
     - Oversee recruitment and onboarding processes.
     - Manage payroll and benefits.

4. **Department Manager**

   - **Responsibilities:**
     - Manage department-specific settings.
     - Oversee department employees and their assignments.
     - Conduct performance reviews for department employees.
     - Set and track departmental goals.
     - Approve timesheets and leave requests.

5. **Team Lead**

   - **Responsibilities:**
     - Lead a team within a department.
     - Assign tasks and monitor team performance.
     - Provide feedback and support to team members.
     - Assist in setting and tracking team goals.
     - Report to the Department Manager.

6. **Employee**
   - **Responsibilities:**
     - Access personal profile and update details.
     - View assigned tasks and goals.
     - Submit timesheets and leave requests.
     - Participate in performance reviews.
     - Provide feedback to managers and peers.

### Role-Based Access Control

Each role will have specific permissions associated with it, defining what actions users in that role can perform. This helps in maintaining a secure and well-organized system.

#### Example Role Permissions

1. **Super Admin:**

   - Full access to all modules and settings.
   - Can create, read, update, and delete any record within their organization.

2. **Admin:**

   - Full access to all modules and settings within the organization.
   - Can create, read, update, and delete records, except for those related to the Super Admin.

3. **HR Manager:**

   - Access to employee profiles, performance reviews, leave management, payroll, and recruitment modules.
   - Can create, read, update, and delete employee records.

4. **Department Manager:**

   - Access to department-specific data and settings.
   - Can manage department employees and their tasks/goals.

5. **Employee:**
   - Limited access to personal profile, tasks, timesheets, and leave requests.
   - Can view and update personal records.

## Handling App Entry Points

### Simplified Design

- **Entities:**
  - Only use `Organization` and `Employee` entities.
  - Remove the `User` entity.

### Workflow

1. **Registration:**

   - When an employee registers, they create an organization and an employee profile is automatically created for them using their provided details.

2. **Login:**

   - Employees log in using their organization-specific email and password.
   - Upon login, the system retrieves the employee's associated organization and displays the organization's dashboard.

3. **Organization Switch:**
   - Employees can only be part of one organization per account.
   - To join another organization, employees must register separately with a different email specific to that organization.

### Advantages

- **Simplifies User Management:**

  - Each employee has a unique email for each organization, aligning with real-world practices.
  - No need for additional user management layers, making the system more straightforward.

- **Streamlined Notifications:**
  - Notifications are sent to organization-specific emails, ensuring employees check the correct email for organizational updates.
