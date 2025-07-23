/* ----- helpers ----- */
const $ = s => document.querySelector(s);
const show = id => {
  ['login', 'choice', 'submit', 'view'].forEach(p => $('#page-' + p).style.display = 'none');
  $('#page-' + id).style.display = 'block';
};

/* ----- login ----- */
$('#btnLogin').onclick = () => {
  const email = $('#loginEmail').value.trim().toLowerCase();
  if (!email.endsWith('@student.tce.edu')) {
    alert('Only @student.tce.edu emails are allowed.');
    return;
  }
  show('choice');
  $('#loginEmail').value = '';
  $('#loginPass').value = '';
};

$('#logout').onclick = () => show('login');

$('#forgotPassword').onclick = () => {
  alert("A password reset link has been sent to your college email (mocked functionality).");
};

/* ----- navigation ----- */
$('#goSubmit').onclick = () => show('submit');
$('#goView').onclick = () => { render(); show('view'); };
$('#back1').onclick = $('#back2').onclick = () => show('choice');

/* ----- local data store ----- */
const KEY = 'crackup_experiences';
const getData = () => JSON.parse(localStorage.getItem(KEY) || '[]');
const saveData = d => localStorage.setItem(KEY, JSON.stringify(d));

/* ----- submit form ----- */
$('#submitForm').onsubmit = e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const exp = {
    name: fd.get('name'),
    branch: fd.get('branch'),
    batch: fd.get('batch'),
    email: fd.get('email'),
    company: fd.get('company'),
    package: fd.get('package'),
    role: fd.get('role'),
    offerType: fd.get('offerType'),
    domain: fd.get('domain'),
    date: fd.get('date'),
    eligibility: fd.get('eligibility'),
    rounds: +fd.get('rounds'),
    roundDetails: fd.get('roundDetails'),
    difficulty: fd.get('difficulty'),
    mode: fd.get('mode'),
    questions: fd.get('questions'),
    time: Date.now()
  };
  const all = getData();
  all.push(exp);
  saveData(all);
  alert('Experience submitted successfully!');
  e.target.reset();
  show('choice');
};

/* ----- search & render ----- */
$('#btnSearch').onclick = () => render();
$('#btnReset').onclick = () => {
  ['fBatch', 'fCompany', 'fBranch'].forEach(id => $('#' + id).value = '');
  $('#fMode').value = '';
  $('#fDiff').value = '';
  $('#fDomain').value = '';
  $('#fOfferType').value = '';
  render();
};

function render() {
  const list = $('#list');
  const data = getData();
  const batch = $('#fBatch').value.toLowerCase();
  const comp = $('#fCompany').value.toLowerCase();
  const branch = $('#fBranch').value.toLowerCase();
  const mode = $('#fMode').value;
  const diff = $('#fDiff').value;
  const domain = $('#fDomain').value;
  const offerType = $('#fOfferType').value;

  const res = data.filter(x =>
    (!batch || (x.batch || '').toLowerCase().includes(batch)) &&
    (!comp || (x.company || '').toLowerCase().includes(comp)) &&
    (!branch || (x.branch || '').toLowerCase().includes(branch)) &&
    (!mode || x.mode === mode) &&
    (!diff || x.difficulty === diff) &&
    (!domain || x.domain === domain) &&
    (!offerType || x.offerType === offerType)
  ).reverse();

  list.innerHTML = res.length
    ? res.map(card).join('')
    : '<p style="text-align:center">No matches found.</p>';
}

const card = x => `
  <div class="exp">
    <h3>${x.company}</h3>
    <div class="meta">
      <b>${x.name}</b> | ${x.branch} • ${x.batch}<br/>
      ${x.role} | ${x.offerType} | ${x.domain} | ${x.package}<br/>
      ${x.date ? `Date: ${x.date} | ` : ''}Mode: ${x.mode} | Difficulty: <em>${x.difficulty}</em>
    </div>
    <div class="block"><strong>Round-wise Experience:</strong>\n${x.roundDetails}</div>
    ${x.questions ? `<div class="block"><strong>Questions Faced:</strong>\n${x.questions}</div>` : ''}
    ${x.eligibility ? `<div class="block"><strong>Eligibility Criteria:</strong>\n${x.eligibility}</div>` : ''}
  </div>`;
