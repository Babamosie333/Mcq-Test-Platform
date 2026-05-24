const express = require('express');
const Subject = require('../models/Subject');
const Test = require('../models/Test');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/admin/stats', authMiddleware, async (req, res) => {
  try {
    const [totalSubjects, totalTests, totalQuestions, totalAttempts] = await Promise.all([
      Subject.countDocuments(),
      Test.countDocuments(),
      Question.countDocuments(),
      Attempt.countDocuments({ status: 'submitted' }),
    ]);

    const subjectWiseAttempts = await Attempt.aggregate([
      { $match: { status: 'submitted' } },
      { $group: { _id: '$subjectId', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subject',
        },
      },
      { $unwind: { path: '$subject', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          subjectId: '$_id',
          subjectName: { $ifNull: ['$subject.name', 'Unknown'] },
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    const testWiseAttempts = await Attempt.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: '$testId',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
          avgPercentage: { $avg: '$percentage' },
          highestScore: { $max: '$score' },
          lowestScore: { $min: '$score' },
        },
      },
      {
        $lookup: {
          from: 'tests',
          localField: '_id',
          foreignField: '_id',
          as: 'test',
        },
      },
      { $unwind: { path: '$test', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          testId: '$_id',
          testTitle: { $ifNull: ['$test.title', 'Unknown'] },
          count: 1,
          avgScore: { $round: ['$avgScore', 2] },
          avgPercentage: { $round: ['$avgPercentage', 2] },
          highestScore: 1,
          lowestScore: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    const recentAttempts = await Attempt.find({ status: 'submitted' })
      .sort({ submittedAt: -1 })
      .limit(10)
      .populate('testId', 'title')
      .populate('subjectId', 'name')
      .select(
        'studentName studentMobile score totalMarks percentage correctCount wrongCount submittedAt testId subjectId'
      );

    res.json({
      totalSubjects,
      totalTests,
      totalQuestions,
      totalAttempts,
      subjectWiseAttempts,
      testWiseAttempts,
      recentAttempts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/admin/results', authMiddleware, async (req, res) => {
  try {
    const filter = { status: 'submitted' };
    if (req.query.testId) filter.testId = req.query.testId;
    if (req.query.subjectId) filter.subjectId = req.query.subjectId;

    const results = await Attempt.find(filter)
      .sort({ submittedAt: -1 })
      .populate('testId', 'title')
      .populate('subjectId', 'name');

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
