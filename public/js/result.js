(async function () {
  const card = document.getElementById('resultCard');
  const attemptId = getQueryParam('attemptId');

  let result = null;
  const cached = sessionStorage.getItem('lastResult');
  if (cached) {
    try {
      result = JSON.parse(cached);
    } catch {
      /* ignore */
    }
  }

  if (!result && attemptId) {
    try {
      const attempt = await apiRequest(`/api/attempts/${attemptId}`);
      result = {
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        correctCount: attempt.correctCount,
        wrongCount: attempt.wrongCount,
        percentage: attempt.percentage,
      };
    } catch (err) {
      card.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
      return;
    }
  }

  if (!result) {
    card.innerHTML = '<p>No result found. Please complete a test first.</p>';
    return;
  }

  card.innerHTML = `
    <h2>Test Completed</h2>
    <div class="result-score">${result.percentage}%</div>
    <p>Score: <strong>${result.score}</strong> / ${result.totalMarks}</p>
    <div class="result-stats">
      <div><span>Correct</span><strong>${result.correctCount}</strong></div>
      <div><span>Wrong / Skipped</span><strong>${result.wrongCount}</strong></div>
      <div><span>Total Marks</span><strong>${result.totalMarks}</strong></div>
      <div><span>Your Score</span><strong>${result.score}</strong></div>
    </div>
    <p style="color:var(--muted);font-size:0.9rem;">Result saved locally in MongoDB.</p>`;
})();
