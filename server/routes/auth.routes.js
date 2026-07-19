import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

const router = Router();

/**
 * POST /api/auth/register
 * Creates a pending applicant account and its company profile.
 */
router.post('/register', async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const {
      username,
      password,
      fullName,
      companyName,
      email,
      phone,
      industry,
      revenue,
      ageYears
    } = req.body;

    const normalizedUsername = username?.trim().toLowerCase();
    const normalizedEmail = email?.trim().toLowerCase();
    const monthlyRevenue = Number(revenue);
    const businessAgeYears = Number(ageYears);

    if (
      !normalizedUsername ||
      normalizedUsername.length < 3 ||
      !password ||
      password.length < 6 ||
      !fullName?.trim() ||
      !companyName?.trim() ||
      !normalizedEmail
    ) {
      return res.status(400).json({
        message:
          'Username, password, full name, company name and email are required.'
      });
    }

    if (
      !Number.isFinite(monthlyRevenue) ||
      monthlyRevenue < 0 ||
      !Number.isInteger(businessAgeYears) ||
      businessAgeYears < 0
    ) {
      return res.status(400).json({
        message: 'Revenue and business age must be valid numbers.'
      });
    }

    const [existingAccounts] = await connection.query(
      `
        SELECT id
        FROM users
        WHERE username = ? OR email = ?
        LIMIT 1
      `,
      [normalizedUsername, normalizedEmail]
    );

    if (existingAccounts.length > 0) {
      return res.status(409).json({
        message: 'That username or email is already registered.'
      });
    }

    await connection.beginTransaction();

    const passwordHash = await bcrypt.hash(password, 12);

    const [userResult] = await connection.query(
      `
        INSERT INTO users (
          role_id,
          username,
          full_name,
          email,
          phone,
          password_hash,
          account_status
        )
        VALUES (1, ?, ?, ?, ?, ?, 'PENDING')
      `,
      [
        normalizedUsername,
        fullName.trim(),
        normalizedEmail,
        phone?.trim() || null,
        passwordHash
      ]
    );

    const generatedRegistrationNumber =
      `DANA-${Date.now().toString().slice(-8)}`;

    const [companyResult] = await connection.query(
      `
        INSERT INTO companies (
          owner_user_id,
          company_name,
          registration_number,
          industry,
          monthly_revenue,
          business_age_years,
          verification_status
        )
        VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
      `,
      [
        userResult.insertId,
        companyName.trim(),
        generatedRegistrationNumber,
        industry?.trim() || 'Not specified',
        monthlyRevenue,
        businessAgeYears
      ]
    );

    await connection.commit();

    res.status(201).json({
      message:
        'Registration submitted successfully and is awaiting administrator approval.',
      user: {
        id: userResult.insertId,
        companyId: companyResult.insertId,
        username: normalizedUsername,
        fullName: fullName.trim(),
        email: normalizedEmail,
        role: 'Applicant',
        accountStatus: 'PENDING'
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

export default router;