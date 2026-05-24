(async function () {
  const admin = await requireAuth();
  if (!admin) return;
  document.getElementById('adminUser').textContent = admin.username;
  document.getElementById('logoutBtn').addEventListener('click', logout);

  const stats = await apiRequest('/api/admin/stats');

  document.getElementById('statsGrid').innerHTML = [
    { label: 'Total Subjects', value: stats.totalSubjects },
    { label: 'Total Tests', value: stats.totalTests },
    { label: 'Total Questions', value: stats.totalQuestions },
    { label: 'Total Attempts', value: stats.totalAttempts },
  ]
    .map(
      (s) => `
    <div class="stat-card">
      <div class="value">${s.value}</div>
      <div class="label">${s.label}</div>
    </div>`
    )
    .join('');

  const testBody = document.querySelector('#testStatsTable tbody');
  testBody.innerHTML =
    stats.testWiseAttempts?.length > 0
      ? stats.testWiseAttempts
          .map(
            (t) => `
      <tr>
        <td>${t.testTitle}</td>
        <td>${t.count}</td>
        <td>${t.avgScore ?? '-'}</td>
        <td>${t.avgPercentage ?? '-'}%</td>
        <td>${t.highestScore ?? '-'}</td>
        <td>${t.lowestScore ?? '-'}</td>
      </tr>`
          )
          .join('')
      : '<tr><td colspan="6">No attempts yet</td></tr>';

  const recentBody = document.querySelector('#recentTable tbody');
  recentBody.innerHTML =
    stats.recentAttempts?.length > 0
      ? stats.recentAttempts
          .map((a) => {
            const subj = a.subjectId?.name || '-';
            const test = a.testId?.title || '-';
            return `
      <tr>
        <td>${a.studentName}</td>
        <td>${a.studentMobile}</td>
        <td>${subj}</td>
        <td>${test}</td>
        <td>${a.score}/${a.totalMarks}</td>
        <td>${a.percentage}%</td>
        <td>${formatDate(a.submittedAt)}</td>
      </tr>`;
          })
          .join('')
      : '<tr><td colspan="7">No attempts yet</td></tr>';
})();
