function calculateScore(questions, answersMap) {
  let score = 0;
  let totalMarks = 0;
  let correctCount = 0;
  let wrongCount = 0;

  for (const q of questions) {
    const marks = q.marks || 0;
    totalMarks += marks;
    const qId = q._id.toString();
    const given = answersMap.get ? answersMap.get(qId) : answersMap[qId];

    if (given && given === q.correctOption) {
      score += marks;
      correctCount += 1;
    } else if (given) {
      wrongCount += 1;
    } else {
      wrongCount += 1;
    }
  }

  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 10000) / 100 : 0;

  return { score, totalMarks, correctCount, wrongCount, percentage };
}

module.exports = { calculateScore };
