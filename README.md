# RateXpress - Store Rating & Analytics Platform

RateXpress is a secure, full-stack enterprise business evaluation platform that allows consumers to look up local businesses, submit star reviews, and dynamically modify their evaluation metrics. Simultaneously, it provides store owners with private operational telemetry consoles to monitor aggregate ratings and customer feedback trends without compromising user data privacy.

---

## 🛠️ System Architecture & Tech Stack

The application leverages a classic decoupled three-tier architectural layout built on top of high-performance modern web technologies:

- **Frontend Application Tier:** React.js, React Hooks (`useState`, `useEffect`, `useContext`), Centralized Context API State Engine, Modular Vanilla CSS Viewports.
- **Backend Application Tier:** Node.js, Express.js REST API Server, Event-Driven Route Clusters.
- **Database Storage Tier:** MySQL Relational Database Service (Structured schemas linked via clean Foreign Key indexes).
- **Security & Validation Controls:** Stateless JSON Web Tokens (JWT) Session Headers, `bcryptjs` Security Hash Engines, `express-validator` Sanitization Layers.

---

## ✨ Features Implemented

### 1. Consumer (Normal User) Terminal
- **Interactive Directory Framework:** A dynamically searchable database inventory sorting stores by business names or location parameters instantly.
- **Embedded Star Rating Systems:** Upgraded horizontal star selectors featuring unique internal numeric labels (1-5) that shift contrasting background colors based on selections.
- **Contextual Form Dispatchers:** Smart evaluation routing that automatically checks user history to cleanly switch action nodes between a fresh `Submit Rating` and an existing `Modify Rating` layout.

### 2. Store Owner Performance Console
- **Operational Data Metrics:** Real-time generation of store statistics including aggregate scores, total response rates, and descending rating distribution graphs.
- **Data Protection Evaluation Matrix:** Displays chronological customer review tables mapping the customer's name and casted rating while explicitly filtering out sensitive email markers to preserve platform trust compliance.

### 3. System Administrator Portal
- **Enterprise CRUD Interface:** Complete administration privileges enabling manual deployment, inspection, modification, or removal of store profiles and owner identity asset mapping keys.

### 4. Global Navigation & Core Security
- **Navigational Dropdown Controllers:** Reusable security panels injected into the global Navbar enabling active profiles to perform live password changes using strict multi-character validation criteria.
- **Browser History Filters:** Active token inspection blocks deployed inside routing nodes that detect active user sessions and automatically intercept browser back-arrow actions to prevent unauthenticated onboarding bypasses.

---

## 💻 Local Installation & Architecture Setup

Follow these explicit commands to quickly deploy RateXpress within your local development environment:

### Prerequisites
- **Node.js:** Runtime Environment (v16.x or higher recommended)
- **Database Engine:** MySQL Server instance actively listening on its standard native port

### 1. Database Configuration
Launch your local MySQL command line interface or workbench management portal and run your foundational schema initiation script:

```sql
CREATE DATABASE IF NOT EXISTS store_rating_platform;
USE store_rating_platform;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role ENUM('System Administrator', 'Store Owner', 'Normal User') NOT NULL DEFAULT 'Normal User'
);

CREATE TABLE IF NOT EXISTS stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id INT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating_value INT NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_store (user_id, store_id)
);