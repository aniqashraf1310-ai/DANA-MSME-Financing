import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();
router.get('/application/:applicationId', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM loan_offers WHERE application_id=? ORDER BY created_at DESC', [req.params.applicationId]);
    res.json(rows);
  } catch (error) { next(error); }
});
router.post('/', async (req, res, next) => {
  try {
    const { applicationId, institutionId, amount, interestRate, tenureMonths, specialConditions } = req.body;
    const [result] = await pool.query(
      `INSERT INTO loan_offers (application_id,institution_id,amount,interest_rate,tenure_months,special_conditions,status)
       VALUES (?,?,?,?,?,?,'PENDING')`,
      [applicationId,institutionId,amount,interestRate,tenureMonths,specialConditions || null]
    );
    await pool.query("UPDATE loan_applications SET status='OFFERS_RECEIVED' WHERE id=?", [applicationId]);
    res.status(201).json({ id: result.insertId, status: 'PENDING' });
  } catch (error) { next(error); }
});
router.post('/:id/accept', async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[offer]] = await connection.query('SELECT * FROM loan_offers WHERE id=? FOR UPDATE', [req.params.id]);
    if (!offer) { await connection.rollback(); return res.status(404).json({ message: 'Offer not found' }); }
    await connection.query("UPDATE loan_offers SET status='REJECTED' WHERE application_id=?", [offer.application_id]);
    await connection.query("UPDATE loan_offers SET status='ACCEPTED' WHERE id=?", [offer.id]);
    await connection.query("UPDATE loan_applications SET status='AWAITING_DISBURSEMENT_PROOF', accepted_offer_id=? WHERE id=?", [offer.id, offer.application_id]);
    await connection.commit();
    res.json({ message: 'Offer accepted', applicationStatus: 'AWAITING_DISBURSEMENT_PROOF' });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally { connection.release(); }
});
export default router;
