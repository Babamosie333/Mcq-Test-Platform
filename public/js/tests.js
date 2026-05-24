(async function () {
  const grid = document.getElementById('testGrid');
  const empty = document.getElementById('empty');

  try {
    const tests = await apiRequest('/api/tests?active=true&withCount=true');
    const active = tests.filter((t) => t.isActive && (t.questionCount || 0) > 0);

    if (active.length === 0) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    grid.innerHTML = active
      .map((t) => {
        const subj = t.subjectId?.name || 'General';
        return `
      <article class="test-card">
        <h3>${t.title}</h3>
        <p class="meta">
          <strong>Subject:</strong> ${subj}<br>
          <strong>Questions:</strong> ${t.questionCount}<br>
          <strong>Time:</strong> ${t.durationMinutes} minutes
        </p>
        <span class="badge badge-active">Active</span>
        <p style="margin:0.75rem 0;color:var(--muted);font-size:0.9rem;">${t.description || ''}</p>
        <a href="/test.html?id=${t._id}" class="btn btn-primary btn-block">Start Test</a>
      </article>`;
      })
      .join('');
  } catch (err) {
    document.getElementById('alert').innerHTML =
      `<div class="alert alert-error">${err.message}</div>`;
  }
})();
