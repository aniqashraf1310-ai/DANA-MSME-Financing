import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        la.*,
        c.company_name,
        c.industry,
        c.monthly_revenue,
        c.business_age_years,
        u.full_name AS applicant_name
      FROM loan_applications la
      JOIN companies c
        ON c.id = la.company_id
      JOIN users u
        ON u.id = la.applicant_user_id
      ORDER BY la.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      applicantUserId,
      companyId,
      requestedAmount,
      purpose
    } = req.body;

    const amount = Number(requestedAmount);

    if (
      !Number.isInteger(Number(applicantUserId)) ||
      !Number.isInteger(Number(companyId)) ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !purpose?.trim()
    ) {
      return res.status(400).json({
        message:
          'Valid applicantUserId, companyId, requestedAmount and purpose are required.'
      });
    }

    const [[applicant]] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [applicantUserId]
    );

    if (!applicant) {
      return res.status(400).json({
        message: `Applicant user ID ${applicantUserId} does not exist in MySQL.`
      });
    }

    const [[company]] = await pool.query(
      `
        SELECT id
        FROM companies
        WHERE id = ? AND owner_user_id = ?
      `,
      [companyId, applicantUserId]
    );

    if (!company) {
      return res.status(400).json({
        message:
          `Company ID ${companyId} does not exist or does not belong to applicant ${applicantUserId}.`
      });
    }

    const applicationCode =
      `APP-${Date.now().toString().slice(-6)}`;

    const [result] = await pool.query(
      `
        INSERT INTO loan_applications (
          application_code,
          applicant_user_id,
          company_id,
          requested_amount,
          purpose,
          status
        )
        VALUES (?, ?, ?, ?, ?, 'SUBMITTED')
      `,
      [
        applicationCode,
        applicantUserId,
        companyId,
        amount,
        purpose.trim()
      ]
    );

    res.status(201).json({
      id: result.insertId,
      applicationCode,
      applicantUserId: Number(applicantUserId),
      companyId: Number(companyId),
      requestedAmount: amount,
      purpose: purpose.trim(),
      status: 'SUBMITTED'
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const allowedStatuses = [
      'DRAFT',
      'SUBMITTED',
      'UNDER_VERIFICATION',
      'BIDDING_OPEN',
      'OFFERS_RECEIVED',
      'OFFER_ACCEPTED',
      'AWAITING_DISBURSEMENT_PROOF',
      'REPAYING',
      'COMPLETED',
      'REJECTED'
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid application status.'
      });
    }

    const [result] = await pool.query(
      `
        UPDATE loan_applications
        SET status = ?
        WHERE id = ?
      `,
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Application not found.'
      });
    }

    res.json({
      message: 'Status updated successfully.',
      status
    });
  } catch (error) {
    next(error);
  }
});

export default router;