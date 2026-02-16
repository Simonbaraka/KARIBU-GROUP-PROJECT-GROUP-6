const express = require('express');
const CashModel = require('../Karibu-models/cash_sales-Model');

const router = express.Router();
/**
 * @openapi
 * tags:
 *   name: CashSales
 *   description: Cash sales management
 */

/**
 * @openapi
 * /api/cashsales:
 *   get:
 *     summary: Get all cash sales
 *     tags: [CashSales]
 *     responses:
 *       200:
 *         description: Sales retrieved successfully
 *       500:
 *         description: Server error
 */

router.get('/', async (req, res, next) => {
  try {
    let sale = await CashModel.find();
    res
      .status(200)
      .json({ message: 'Sales Data collection was a success ', data: sale });
  } catch (err) {
    res.status(500).json({ message: 'Sales not found', error: err.message });
  }
});

/**
 * @openapi
 * /api/cashsales:
 *   post:
 *     summary: Create new cash sale
 *     tags: [CashSales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Buyer_name:
 *                 type: string
 *               Amount:
 *                 type: number
 *               Product:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sale created successfully
 *       500:
 *         description: Failed to save data
 */

router.post('/', async (req, res) => {
  try {
    //console.log('DATA RECEIVED:', req.body);
    let newRecord = new CashModel(req.body);
    await newRecord.save();
    res
      .status(201)
      .json({ message: 'Sales saved successfully', data: newRecord });
  } catch (err) {
    console.error('Error in /api/cashsales:', err);
    res.status(500).json({ message: 'Failed to save sales data ' });
  }
});

/**
 * @openapi
 * /api/cashsales/{id}:
 *   patch:
 *     summary: Update cash sale
 *     tags: [CashSales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Sale updated successfully
 *       404:
 *         description: Record not found
 *       500:
 *         description: Update failed
 */

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await CashModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      res.status(404).json({
        message: 'Record not found',
      });
    }

    res
      .status(200)
      .json({ message: 'Updated Sales Successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Update Failed', error: err.message });
  }
});

/**
 * @openapi
 * /api/cashsales/{id}:
 *   delete:
 *     summary: Delete cash sale
 *     tags: [CashSales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale ID
 *     responses:
 *       200:
 *         description: Sale deleted successfully
 *       404:
 *         description: Record not found
 *       500:
 *         description: Delete failed
 */

router.delete('/:id', async (req, res) => {
  try {
    let id_ = req.params.id;

    const delete_data = await CashModel.findByIdAndDelete(id_);

    if (!delete_data) {
      res.status(404).json({ message: 'Record Not found' });
    }

    res
      .status(200)
      .json({ message: 'Data deleted successfully', data: delete_data });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete data', error: err.message });
  }
});

module.exports = router;
