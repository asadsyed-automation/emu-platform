import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({
    status: 'online',
    system: 'EMU Platform API',
    institution: 'Emerson University Multan - BS(CS) 7th Semester',
    timestamp: new Date().toISOString(),
  });
});

export default router;
