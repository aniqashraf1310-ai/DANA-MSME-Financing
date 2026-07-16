CREATE DATABASE IF NOT EXISTS dana_esd;
USE dana_esd;

CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE companies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  owner_user_id INT NOT NULL,
  company_name VARCHAR(180) NOT NULL,
  registration_number VARCHAR(80) UNIQUE,
  industry VARCHAR(100),
  monthly_revenue DECIMAL(14,2) DEFAULT 0,
  business_age_years INT DEFAULT 0,
  verification_status ENUM('PENDING','VERIFIED','REJECTED') DEFAULT 'PENDING',
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE TABLE financial_institutions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institution_name VARCHAR(180) NOT NULL UNIQUE
);

CREATE TABLE loan_products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institution_id INT NOT NULL,
  product_name VARCHAR(180) NOT NULL,
  min_amount DECIMAL(14,2) NOT NULL,
  max_amount DECIMAL(14,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  tenure_months INT NOT NULL,
  min_revenue DECIMAL(14,2) DEFAULT 0,
  min_business_age_years INT DEFAULT 0,
  requirements TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (institution_id) REFERENCES financial_institutions(id)
);

CREATE TABLE loan_applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_code VARCHAR(30) NOT NULL UNIQUE,
  applicant_user_id INT NOT NULL,
  company_id INT NOT NULL,
  requested_amount DECIMAL(14,2) NOT NULL,
  purpose TEXT NOT NULL,
  status ENUM('DRAFT','SUBMITTED','UNDER_VERIFICATION','BIDDING_OPEN','OFFERS_RECEIVED','OFFER_ACCEPTED','AWAITING_DISBURSEMENT_PROOF','REPAYING','COMPLETED','REJECTED') DEFAULT 'DRAFT',
  accepted_offer_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (applicant_user_id) REFERENCES users(id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE loan_offers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL,
  institution_id INT NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  tenure_months INT NOT NULL,
  special_conditions TEXT,
  status ENUM('PENDING','ACCEPTED','REJECTED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES loan_applications(id),
  FOREIGN KEY (institution_id) REFERENCES financial_institutions(id)
);

ALTER TABLE loan_applications
  ADD CONSTRAINT fk_accepted_offer FOREIGN KEY (accepted_offer_id) REFERENCES loan_offers(id);

CREATE TABLE documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL,
  document_type VARCHAR(80) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  verification_status ENUM('PENDING','VERIFIED','REJECTED') DEFAULT 'PENDING',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES loan_applications(id)
);

CREATE TABLE disbursements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL UNIQUE,
  amount DECIMAL(14,2) NOT NULL,
  receipt_file_path VARCHAR(500) NOT NULL,
  transferred_at DATETIME NOT NULL,
  verification_status ENUM('PENDING','VERIFIED','REJECTED') DEFAULT 'PENDING',
  FOREIGN KEY (application_id) REFERENCES loan_applications(id)
);

CREATE TABLE repayments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL,
  installment_number INT NOT NULL,
  principal_amount DECIMAL(14,2) NOT NULL,
  platform_fee DECIMAL(14,2) NOT NULL,
  total_paid DECIMAL(14,2) NOT NULL,
  payment_status ENUM('PENDING','PAID','FAILED','OVERDUE') DEFAULT 'PENDING',
  paid_at DATETIME NULL,
  FOREIGN KEY (application_id) REFERENCES loan_applications(id)
);

CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(80),
  entity_id VARCHAR(80),
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT IGNORE INTO roles (id, role_name) VALUES (1,'APPLICANT'),(2,'LOAN_OFFICER'),(3,'ADMINISTRATOR');
INSERT IGNORE INTO financial_institutions (id, institution_name) VALUES (1,'Maybank Islamic'),(2,'SME Bank Malaysia'),(3,'Bank Rakyat'),(4,'MARA');
