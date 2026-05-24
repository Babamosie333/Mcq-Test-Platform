(async function () {
  await requireAuth();
  const subjectFilter = document.getElementById('subjectFilter');
  const testFilter = document.getElementById('testFilter');
  const tableBody = document.getElementById('tableBody');

  const subjects = await apiRequest('/api/subjects');
  subjectFilter.innerHTML +=
    subjects.map((s) => `<option value="${s._id}">${s.name}</option>`).join('');

  const tests = await apiRequest('/api/tests');
  testFilter.innerHTML +=
    tests.map((t) => `<option value="${t._id}">${t.title}</option>`).join('');

  async function load() {
    let url = '/api/admin/results?';
    if (subjectFilter.value) url += `subjectId=${subjectFilter.value}&`;
    if (testFilter.value) url += `testId=${testFilter.value}&`;

    const results = await apiRequest(url);
    tableBody.innerHTML =
      results.length > 0
        ? results
            .map((r) => {
              const subj = r.subjectId?.name || '-';
              const test = r.testId?.title || '-';
              return `
        <tr>
          <td>${r.studentName}</td>
          <td>${r.studentMobile}</td>
          <td>${subj}</td>
          <td>${test}</td>
          <td>${r.score}/${r.totalMarks}</td>
          <td>${r.percentage}%</td>
          <td>${r.correctCount}</td>
          <td>${r.wrongCount}</td>
          <td>${formatDate(r.submittedAt)}</td>
        </tr>`;
            })
            .join('')
        : '<tr><td colspan="9">No results found</td></tr>';
  }

  subjectFilter.addEventListener('change', load);
  testFilter.addEventListener('change', load);
  load();
})();
