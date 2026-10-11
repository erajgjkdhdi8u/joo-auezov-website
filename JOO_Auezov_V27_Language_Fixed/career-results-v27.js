(() => {
  const search = document.getElementById('grantSearch');
  const grid = document.getElementById('granteeGrid');
  if (!search || !grid) return;
  const rows = [...grid.querySelectorAll('.grantee')];
  const count = document.getElementById('granteeCount');
  const empty = document.getElementById('grantEmpty');
  function apply() {
    const term = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    rows.forEach(row => {
      const matched = !term || (row.dataset.grantee || '').includes(term);
      row.hidden = !matched;
      if (matched) visible++;
    });
    if (count) count.textContent = `${visible} нәтиже`;
    if (empty) empty.hidden = visible !== 0;
  }
  search.addEventListener('input', apply);
})();