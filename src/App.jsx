import { useState, useEffect } from "react";


const callClaude = async (systemPrompt, userMessage) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Request failed");
  }

  const data = await response.json();
  if (data.choices) {
    return data.choices[0].message.content;
  }
  return data.content[0].text;
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #0a0a0a; }

  .app {
    min-height: 100vh;
    background: #0d0d0d;
    color: #f0ece2;
    font-family: 'DM Mono', monospace;
    font-weight: 300;
    position: relative;
    overflow-x: hidden;
  }

  .app::before {
    content: '';
    position: fixed;
    top: -40%;
    right: -20%;
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(194,154,80,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .app::after {
    content: '';
    position: fixed;
    bottom: -30%;
    left: -15%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(194,154,80,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .header {
    border-bottom: 1px solid rgba(194,154,80,0.2);
    padding: 24px 40px;
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
    z-index: 1;
  }

  .header-icon {
    width: 36px;
    height: 36px;
    border: 1.5px solid #c29a50;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #f0ece2;
  }

  .header-title span {
    color: #c29a50;
  }

  .header-tag {
    margin-left: auto;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(240,236,226,0.3);
    border: 1px solid rgba(194,154,80,0.2);
    padding: 4px 10px;
  }

  .main {
    max-width: 760px;
    margin: 0 auto;
    padding: 60px 24px;
    position: relative;
    z-index: 1;
  }

  /* STAGE 1: Entry */
  .entry-section {
    animation: fadeUp 0.6s ease forwards;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .section-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #c29a50;
    margin-bottom: 16px;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 900;
    line-height: 1.05;
    margin-bottom: 20px;
    color: #f0ece2;
  }

  .hero-title em {
    font-style: italic;
    color: #c29a50;
  }

  .hero-sub {
    font-size: 13px;
    line-height: 1.8;
    color: rgba(240,236,226,0.5);
    max-width: 480px;
    margin-bottom: 48px;
  }

  .input-row {
    display: flex;
    gap: 12px;
    align-items: stretch;
    margin-bottom: 20px;
  }

  .role-input {
    flex: 1;
    background: rgba(240,236,226,0.04);
    border: 1px solid rgba(194,154,80,0.25);
    color: #f0ece2;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    padding: 16px 20px;
    outline: none;
    transition: border-color 0.2s;
  }

  .role-input::placeholder { color: rgba(240,236,226,0.25); }
  .role-input:focus { border-color: #c29a50; }

  .btn-primary {
    background: #c29a50;
    color: #0d0d0d;
    border: none;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 16px 28px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    white-space: nowrap;
  }

  .btn-primary:hover { background: #d4aa62; }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary:disabled { background: rgba(194,154,80,0.3); cursor: not-allowed; color: rgba(13,13,13,0.5); }

  .btn-ghost {
    background: transparent;
    color: rgba(240,236,226,0.5);
    border: 1px solid rgba(240,236,226,0.15);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 10px 18px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: #c29a50; color: #c29a50; }

  .examples {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .example-chip {
    font-size: 11px;
    border: 1px solid rgba(194,154,80,0.2);
    padding: 6px 12px;
    cursor: pointer;
    color: rgba(240,236,226,0.45);
    transition: all 0.2s;
    letter-spacing: 0.05em;
    background: transparent;
    font-family: 'DM Mono', monospace;
  }
  .example-chip:hover { border-color: #c29a50; color: #c29a50; background: rgba(194,154,80,0.05); }

  /* Divider */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(194,154,80,0.3), transparent);
    margin: 48px 0;
  }

  /* STAGE 2: Questions */
  .questions-section { animation: fadeUp 0.5s ease forwards; }

  .session-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(240,236,226,0.08);
  }

  .session-role {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-style: italic;
    color: #c29a50;
  }

  .session-count {
    font-size: 11px;
    color: rgba(240,236,226,0.3);
    letter-spacing: 0.1em;
  }

  .q-list { display: flex; flex-direction: column; gap: 2px; margin-bottom: 32px; }

  .q-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 18px 20px;
    background: rgba(240,236,226,0.02);
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
  }

  .q-item:hover { background: rgba(194,154,80,0.05); border-color: rgba(194,154,80,0.2); }
  .q-item.active { background: rgba(194,154,80,0.08); border-color: rgba(194,154,80,0.35); }
  .q-item.answered { border-left: 2px solid #c29a50; }

  .q-num {
    font-size: 10px;
    color: #c29a50;
    letter-spacing: 0.1em;
    min-width: 24px;
    margin-top: 2px;
  }

  .q-type-badge {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 2px 7px;
    border: 1px solid rgba(194,154,80,0.3);
    color: rgba(194,154,80,0.7);
    white-space: nowrap;
    margin-top: 1px;
  }

  .q-text { font-size: 13px; line-height: 1.7; color: rgba(240,236,226,0.8); flex: 1; }
  .q-check { color: #c29a50; font-size: 14px; }

  /* STAGE 3: Answer */
  .answer-section { animation: fadeUp 0.4s ease forwards; }

  .active-q-box {
    background: rgba(194,154,80,0.06);
    border: 1px solid rgba(194,154,80,0.25);
    padding: 24px;
    margin-bottom: 24px;
  }

  .active-q-meta {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 12px;
  }

  .active-q-text {
    font-size: 15px;
    line-height: 1.7;
    color: #f0ece2;
    font-family: 'Playfair Display', serif;
  }

  .answer-textarea {
    width: 100%;
    min-height: 140px;
    background: rgba(240,236,226,0.03);
    border: 1px solid rgba(240,236,226,0.12);
    color: #f0ece2;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    line-height: 1.8;
    padding: 18px;
    outline: none;
    resize: vertical;
    transition: border-color 0.2s;
    margin-bottom: 14px;
  }
  .answer-textarea:focus { border-color: rgba(194,154,80,0.4); }
  .answer-textarea::placeholder { color: rgba(240,236,226,0.2); }

  .answer-actions { display: flex; gap: 10px; align-items: center; }

  .char-count { font-size: 11px; color: rgba(240,236,226,0.25); margin-left: auto; letter-spacing: 0.05em; }

  /* Feedback */
  .feedback-box {
    background: rgba(13,13,13,0.6);
    border: 1px solid rgba(194,154,80,0.2);
    padding: 28px;
    margin-top: 28px;
    animation: fadeUp 0.4s ease forwards;
  }

  .feedback-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(194,154,80,0.15);
  }

  .feedback-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #c29a50;
  }

  .score-display {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .score-num {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 900;
    color: #c29a50;
    line-height: 1;
  }

  .score-denom { font-size: 13px; color: rgba(194,154,80,0.5); }

  .score-bar-bg {
    width: 100%;
    height: 3px;
    background: rgba(240,236,226,0.08);
    margin-bottom: 24px;
    position: relative;
  }

  .score-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #c29a50, #f0c060);
    transition: width 1s ease;
  }

  .feedback-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }

  .feedback-card {
    background: rgba(240,236,226,0.03);
    border: 1px solid rgba(240,236,226,0.07);
    padding: 16px;
  }

  .feedback-card-title {
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(240,236,226,0.35);
    margin-bottom: 10px;
  }

  .feedback-card-text { font-size: 12px; line-height: 1.7; color: rgba(240,236,226,0.7); }

  .model-answer-box {
    background: rgba(194,154,80,0.05);
    border-left: 2px solid #c29a50;
    padding: 16px 20px;
  }

  .model-answer-title {
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #c29a50;
    margin-bottom: 10px;
  }

  .model-answer-text { font-size: 12px; line-height: 1.8; color: rgba(240,236,226,0.65); }

  /* Report */
  .report-section { animation: fadeUp 0.5s ease forwards; }

  .report-header {
    text-align: center;
    margin-bottom: 48px;
    padding: 40px;
    border: 1px solid rgba(194,154,80,0.2);
    position: relative;
  }

  .report-header::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(194,154,80,0.08);
    pointer-events: none;
  }

  .report-score-big {
    font-family: 'Playfair Display', serif;
    font-size: 80px;
    font-weight: 900;
    color: #c29a50;
    line-height: 1;
    margin-bottom: 8px;
  }

  .report-role-label {
    font-size: 12px;
    color: rgba(240,236,226,0.4);
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }

  .report-role {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-style: italic;
    color: #f0ece2;
  }

  .report-blocks { display: flex; flex-direction: column; gap: 16px; }

  .report-block {
    background: rgba(240,236,226,0.02);
    border: 1px solid rgba(240,236,226,0.07);
    padding: 24px;
  }

  .report-block-title {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #c29a50;
    margin-bottom: 14px;
  }

  .report-block-text { font-size: 13px; line-height: 1.8; color: rgba(240,236,226,0.65); }

  /* Loader */
  .loader {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: rgba(240,236,226,0.35);
    letter-spacing: 0.1em;
    padding: 20px 0;
  }

  .loader-dots {
    display: flex;
    gap: 4px;
  }

  .loader-dot {
    width: 5px;
    height: 5px;
    background: #c29a50;
    border-radius: 50%;
    animation: pulse 1.2s ease-in-out infinite;
  }

  .loader-dot:nth-child(2) { animation-delay: 0.2s; }
  .loader-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes pulse {
    0%, 100% { opacity: 0.2; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1); }
  }

  .progress-strip {
    display: flex;
    gap: 4px;
    margin-bottom: 32px;
  }

  .progress-pip {
    flex: 1;
    height: 3px;
    background: rgba(240,236,226,0.08);
    transition: background 0.3s;
  }

  .progress-pip.done { background: #c29a50; }
  .progress-pip.active { background: rgba(194,154,80,0.4); }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: rgba(240,236,226,0.3);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    cursor: pointer;
    margin-bottom: 36px;
    padding: 0;
    transition: color 0.2s;
  }
  .back-btn:hover { color: #c29a50; }

  .bottom-actions {
    display: flex;
    gap: 12px;
    margin-top: 32px;
    flex-wrap: wrap;
  }

  @media (max-width: 600px) {
    .feedback-grid { grid-template-columns: 1fr; }
    .input-row { flex-direction: column; }
    .hero-title { font-size: 36px; }
    .header { padding: 18px 20px; }
    .main { padding: 40px 16px; }
  }
`;

const QUESTION_TYPES = ["Behavioural", "Technical", "Situational", "Motivational", "Competency"];

function Loader({ text = "Processing" }) {
  return (
    <div className="loader">
      <div className="loader-dots">
        <div className="loader-dot" />
        <div className="loader-dot" />
        <div className="loader-dot" />
      </div>
      {text}
    </div>
  );
}

function ScoreBar({ score }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setTimeout(() => setWidth((score / 10) * 100), 100);
  }, [score]);
  return (
    <div className="score-bar-bg">
      <div className="score-bar-fill" style={{ width: `${width}%` }} />
    </div>
  );
}

function parseFeedback(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const result = { score: null, strengths: '', improvements: '', modelAnswer: '' };

  let section = null;
  const blocks = { strengths: [], improvements: [], modelAnswer: [] };

  for (const line of lines) {
    const l = line.trim();
    if (/^score:/i.test(l)) {
      const match = l.match(/(\d+(\.\d+)?)/);
      if (match) result.score = parseFloat(match[1]);
    } else if (/strengths?:/i.test(l)) { section = 'strengths'; }
    else if (/improvements?:|areas? to improve:/i.test(l)) { section = 'improvements'; }
    else if (/model answer:|better answer:/i.test(l)) { section = 'modelAnswer'; }
    else if (section && l) { blocks[section].push(l.replace(/^[-•*]\s*/, '')); }
  }

  result.strengths = blocks.strengths.join(' ') || 'Good attempt at the question.';
  result.improvements = blocks.improvements.join(' ') || 'Consider adding more specific examples.';
  result.modelAnswer = blocks.modelAnswer.join(' ') || '';
  if (!result.score) result.score = 7;
  return result;
}

function parseReport(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const result = { overallScore: null, summary: [], strengths: [], gaps: [], tips: [] };
  let section = null;

  for (const line of lines) {
    const l = line.trim();
    if (/overall score:/i.test(l)) {
      const match = l.match(/(\d+(\.\d+)?)/);
      if (match) result.overallScore = parseFloat(match[1]);
    } else if (/overall summary|executive summary/i.test(l)) section = 'summary';
    else if (/key strength/i.test(l)) section = 'strengths';
    else if (/gap|weakness|area/i.test(l)) section = 'gaps';
    else if (/tip|recommendation|next step/i.test(l)) section = 'tips';
    else if (section && l) result[section].push(l.replace(/^[-•*\d.]\s*/, ''));
  }

  if (!result.overallScore) result.overallScore = 7;
  return result;
}

export default function App() {
  const [stage, setStage] = useState('entry'); // entry | questions | answering | report
  const [role, setRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [activeQ, setActiveQ] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const examples = ['Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer', 'Marketing Lead'];

  const generateQuestions = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setLoadingMsg('Generating questions');
    try {
      const systemPrompt = `You are an expert interview coach. Generate exactly 5 interview questions for the given job role. 
Format each question as:
[TYPE]: question text
Where TYPE is one of: Behavioural, Technical, Situational, Motivational, Competency.
Return exactly 5 lines, one per question.`;
      const res = await callClaude(systemPrompt, `Generate 5 interview questions for: ${role}`);
      const lines = res.split('\n').filter(l => l.trim() && l.includes(':'));
      const parsed = lines.slice(0, 5).map((l, i) => {
        const colonIdx = l.indexOf(':');
        const type = l.slice(0, colonIdx).trim();
        const text = l.slice(colonIdx + 1).trim();
        return { id: i, type: QUESTION_TYPES.includes(type) ? type : QUESTION_TYPES[i % 5], text };
      });
      setQuestions(parsed);
      setStage('questions');
    } catch (e) {
      alert('Error generating questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!currentAnswer.trim()) return;
    setLoading(true);
    setLoadingMsg('Evaluating your answer');
    try {
      const systemPrompt = `You are a senior interview coach providing concise, structured feedback. 
Evaluate the answer and respond in this exact format:
Score: X/10
Strengths: [2-3 sentences on what was good]
Improvements: [2-3 sentences on what to improve]
Model Answer: [A better, concise example answer in 3-5 sentences]`;
      const res = await callClaude(systemPrompt, `Job Role: ${role}\nQuestion (${activeQ.type}): ${activeQ.text}\nCandidate Answer: ${currentAnswer}`);
      const parsed = parseFeedback(res);
      setFeedbacks(prev => ({ ...prev, [activeQ.id]: { ...parsed, raw: res } }));
      setAnswers(prev => ({ ...prev, [activeQ.id]: currentAnswer }));
    } catch (e) {
      alert('Error evaluating answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    setLoadingMsg('Generating your report');
    setStage('report');
    try {
      const qa = Object.entries(answers).map(([id, ans]) => {
        const q = questions[parseInt(id)];
        const fb = feedbacks[parseInt(id)];
        return `Q (${q.type}): ${q.text}\nA: ${ans}\nScore: ${fb.score}/10`;
      }).join('\n\n');

      const systemPrompt = `You are a senior interview coach writing a post-session performance report.
Respond in this exact format:
Overall Score: X/10
Overall Summary: [3-4 sentences describing overall performance]
Key Strengths: [2-3 bullet points starting with -]
Gaps: [2-3 bullet points starting with -]
Tips: [3 actionable next steps starting with -]`;
      const res = await callClaude(systemPrompt, `Role: ${role}\n\nSession data:\n${qa}`);
      const parsed = parseReport(res);
      setReport(parsed);
    } catch (e) {
      setReport({ overallScore: 7, summary: ['Session complete.'], strengths: [], gaps: [], tips: [] });
    } finally {
      setLoading(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const canReport = answeredCount >= 2;

  const selectQuestion = (q) => {
    setActiveQ(q);
    setCurrentAnswer(answers[q.id] || '');
    setStage('answering');
  };

  const resetAll = () => {
    setStage('entry'); setRole(''); setQuestions([]); setActiveQ(null);
    setAnswers({}); setFeedbacks({}); setCurrentAnswer(''); setReport(null);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <header className="header">
          <div className="header-icon">◈</div>
          <div className="header-title">Prep<span>Coach</span></div>
          <div className="header-tag">AI Interview Assistant</div>
        </header>

        <main className="main">

          {/* STAGE: ENTRY */}
          {stage === 'entry' && (
            <div className="entry-section">
              <div className="section-label">— Stage 01 / Role Selection</div>
              <h1 className="hero-title">
                Ace your<br /><em>next interview</em>
              </h1>
              <p className="hero-sub">
                Enter a job role and receive tailored interview questions. Answer them, get AI-powered feedback, and walk away ready.
              </p>

              <div className="input-row">
                <input
                  className="role-input"
                  placeholder="e.g. Software Engineer, Product Manager..."
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !loading && generateQuestions()}
                />
                <button className="btn-primary" onClick={generateQuestions} disabled={loading || !role.trim()}>
                  {loading ? '...' : 'Generate →'}
                </button>
              </div>

              <div className="examples">
                {examples.map(ex => (
                  <button key={ex} className="example-chip" onClick={() => setRole(ex)}>{ex}</button>
                ))}
              </div>

              {loading && <><div className="divider" /><Loader text={loadingMsg} /></>}
            </div>
          )}

          {/* STAGE: QUESTIONS */}
          {stage === 'questions' && (
            <div className="questions-section">
              <button className="back-btn" onClick={resetAll}>← New Session</button>

              <div className="progress-strip">
                {questions.map((q, i) => (
                  <div key={i} className={`progress-pip ${answers[i] !== undefined ? 'done' : ''}`} />
                ))}
              </div>

              <div className="session-bar">
                <div>
                  <div className="section-label">— Active Session</div>
                  <div className="session-role">{role}</div>
                </div>
                <div className="session-count">{answeredCount} / {questions.length} answered</div>
              </div>

              <div className="q-list">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className={`q-item ${answers[q.id] !== undefined ? 'answered' : ''}`}
                    onClick={() => selectQuestion(q)}
                  >
                    <div className="q-num">0{q.id + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                        <div className="q-type-badge">{q.type}</div>
                        {feedbacks[q.id] && <span style={{ fontSize: 11, color: '#c29a50' }}>{feedbacks[q.id].score}/10</span>}
                      </div>
                      <div className="q-text">{q.text}</div>
                    </div>
                    {answers[q.id] !== undefined && <div className="q-check">✓</div>}
                  </div>
                ))}
              </div>

              {canReport && (
                <button className="btn-primary" onClick={generateReport} disabled={loading}>
                  {loading ? '...' : `Generate Full Report (${answeredCount} answered) →`}
                </button>
              )}
              {!canReport && (
                <p style={{ fontSize: 11, color: 'rgba(240,236,226,0.25)', letterSpacing: '0.05em' }}>
                  Answer at least 2 questions to unlock your session report
                </p>
              )}
            </div>
          )}

          {/* STAGE: ANSWERING */}
          {stage === 'answering' && activeQ && (
            <div className="answer-section">
              <button className="back-btn" onClick={() => setStage('questions')}>← Back to Questions</button>

              <div className="section-label">— Stage 02 / Your Response</div>

              <div className="active-q-box">
                <div className="active-q-meta">
                  <div className="q-type-badge">{activeQ.type}</div>
                  <span style={{ fontSize: 11, color: 'rgba(240,236,226,0.25)' }}>Question {activeQ.id + 1} of {questions.length}</span>
                </div>
                <div className="active-q-text">{activeQ.text}</div>
              </div>

              <textarea
                className="answer-textarea"
                placeholder="Type your answer here. Be specific — use examples and the STAR method where appropriate..."
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
              />

              <div className="answer-actions">
                <button className="btn-primary" onClick={evaluateAnswer} disabled={loading || !currentAnswer.trim()}>
                  {loading ? '...' : 'Evaluate Answer →'}
                </button>
                {answers[activeQ.id] && (
                  <button className="btn-ghost" onClick={() => setStage('questions')}>Back to List</button>
                )}
                <div className="char-count">{currentAnswer.length} chars</div>
              </div>

              {loading && <Loader text={loadingMsg} />}

              {feedbacks[activeQ.id] && !loading && (
                <div className="feedback-box">
                  <div className="feedback-header">
                    <div className="feedback-label">AI Feedback</div>
                    <div className="score-display">
                      <div className="score-num">{feedbacks[activeQ.id].score}</div>
                      <div className="score-denom">/10</div>
                    </div>
                  </div>

                  <ScoreBar score={feedbacks[activeQ.id].score} />

                  <div className="feedback-grid">
                    <div className="feedback-card">
                      <div className="feedback-card-title">✦ Strengths</div>
                      <div className="feedback-card-text">{feedbacks[activeQ.id].strengths}</div>
                    </div>
                    <div className="feedback-card">
                      <div className="feedback-card-title">◈ Areas to Improve</div>
                      <div className="feedback-card-text">{feedbacks[activeQ.id].improvements}</div>
                    </div>
                  </div>

                  {feedbacks[activeQ.id].modelAnswer && (
                    <div className="model-answer-box">
                      <div className="model-answer-title">— Model Answer</div>
                      <div className="model-answer-text">{feedbacks[activeQ.id].modelAnswer}</div>
                    </div>
                  )}

                  <div className="bottom-actions">
                    <button className="btn-ghost" onClick={() => setStage('questions')}>← Back to Questions</button>
                    {canReport && <button className="btn-primary" onClick={generateReport}>Generate Full Report →</button>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STAGE: REPORT */}
          {stage === 'report' && (
            <div className="report-section">
              <div className="section-label">— Stage 03 / Session Report</div>

              {loading && <Loader text={loadingMsg} />}

              {report && !loading && (
                <>
                  <div className="report-header">
                    <div className="report-role-label">Performance Report — {role}</div>
                    <div className="report-score-big">{report.overallScore}<span style={{ fontSize: 32, color: 'rgba(194,154,80,0.5)' }}>/10</span></div>
                    <div style={{ fontSize: 11, color: 'rgba(240,236,226,0.3)', letterSpacing: '0.1em', marginTop: 8 }}>{answeredCount} QUESTIONS ANSWERED</div>
                  </div>

                  <div className="report-blocks">
                    {report.summary.length > 0 && (
                      <div className="report-block">
                        <div className="report-block-title">— Overall Assessment</div>
                        <div className="report-block-text">{report.summary.join(' ')}</div>
                      </div>
                    )}
                    {report.strengths.length > 0 && (
                      <div className="report-block">
                        <div className="report-block-title">✦ Key Strengths</div>
                        <div className="report-block-text">
                          {report.strengths.map((s, i) => <div key={i} style={{ marginBottom: 6 }}>— {s}</div>)}
                        </div>
                      </div>
                    )}
                    {report.gaps.length > 0 && (
                      <div className="report-block">
                        <div className="report-block-title">◈ Gaps to Address</div>
                        <div className="report-block-text">
                          {report.gaps.map((g, i) => <div key={i} style={{ marginBottom: 6 }}>— {g}</div>)}
                        </div>
                      </div>
                    )}
                    {report.tips.length > 0 && (
                      <div className="report-block">
                        <div className="report-block-title">→ Action Plan</div>
                        <div className="report-block-text">
                          {report.tips.map((t, i) => <div key={i} style={{ marginBottom: 6 }}>{i + 1}. {t}</div>)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bottom-actions" style={{ marginTop: 40 }}>
                    <button className="btn-ghost" onClick={() => setStage('questions')}>← Back to Questions</button>
                    <button className="btn-primary" onClick={resetAll}>Start New Session →</button>
                  </div>
                </>
              )}
            </div>
          )}

        </main>
      </div>
    </>
  );
}
