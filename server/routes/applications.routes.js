import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT la.*, c.company_name, u.full_name AS applicant_name
      FROM loan_applications la
      JOIN companies c ON c.id = la.company_id
      JOIN users u ON u.id = la.applicant_user_id
      ORDER BY la.created_at DESC
    `);
    res.json(rows);
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const { applicantUserId, companyId, requestedAmount, purpose } = req.body;
    if (!applicantUserId || !companyId || !requestedAmount || !purpose) {
      return res.status(400).json({ message: 'applicantUserId, companyId, requestedAmount and purpose are required' });
    }
    const applicationCode = `APP-${Date.now().toString().slice(-6)}`;
    const [result] = await pool.query(
      `INSERT INTO loan_applications
       (application_code, applicant_user_id, company_id, requested_amount, purpose, status)
       VALUES (?, ?, ?, ?, ?, 'SUBMITTED')`,
      [applicationCode, applicantUserId, companyId, requestedAmount, purpose]
    );
    res.status(201).json({ id: result.insertId, applicationCode, status: 'SUBMITTED' });
  } catch (error) { next(error); }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const allowed = ['DRAFT','SUBMITTED','UNDER_VERIFICATION','BIDDING_OPEN','OFFERS_RECEIVED','OFFER_ACCEPTED','AWAITING_DISBURSEMENT_PROOF','REPAYING','COMPLETED','REJECTED'];
    const { status } = req.body;
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const [result] = await pool.query('UPDATE loan_applications SET status=? WHERE id=?', [status, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Status updated', status });
  } catch (error) { next(error); }
});

export default router;
