import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Eye,
  Send,
  Download,
  Trash2,
  Search,
} from 'lucide-react';

export const ResultsImportManager = () => {
  const [selectedCourse, setSelectedCourse] = useState('COSE-4149');
  const [examType, setExamType] = useState('Midterm Examination (Fall 2026)');
  const [isPublished, setIsPublished] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  // Sample official result records for demonstration
  const [resultsData, setResultsData] = useState([
    { id: 1, rollNumber: 'COSC231122102', name: 'Muhammad Ajmal', quizTotal: 15, assignmentTotal: 18, midMarks: 24, finalMarks: 42, total: 99, grade: 'A' },
    { id: 2, rollNumber: 'COSC231122104', name: 'Mueeza Yaqoob Khar', quizTotal: 14, assignmentTotal: 17, midMarks: 22, finalMarks: 38, total: 91, grade: 'A' },
    { id: 3, rollNumber: 'COSC231122105', name: 'Muneeb ur Rehman', quizTotal: 13, assignmentTotal: 16, midMarks: 20, finalMarks: 36, total: 85, grade: 'B+' },
    { id: 4, rollNumber: 'COSC231122107', name: 'Syed Kumail Haider Zaidi', quizTotal: 14, assignmentTotal: 18, midMarks: 23, finalMarks: 40, total: 95, grade: 'A' },
    { id: 5, rollNumber: 'COSC231122114', name: 'Syed Asad Ali Raza Shah', quizTotal: 15, assignmentTotal: 20, midMarks: 25, finalMarks: 45, total: 105, grade: 'A+' },
    { id: 6, rollNumber: 'DEMO-STU-01', name: 'Demo Student (Zaid Khan)', quizTotal: 14, assignmentTotal: 19, midMarks: 24, finalMarks: 43, total: 100, grade: 'A+' },
    { id: 7, rollNumber: 'COSC231122120', name: 'Huzaifa Inam', quizTotal: 12, assignmentTotal: 15, midMarks: 19, finalMarks: 34, total: 80, grade: 'B' },
    { id: 8, rollNumber: 'COSC231122125', name: 'Areeba Ikram', quizTotal: 15, assignmentTotal: 19, midMarks: 24, finalMarks: 42, total: 100, grade: 'A+' },
    { id: 9, rollNumber: 'COSC231122130', name: 'Abdul Rauf', quizTotal: 13, assignmentTotal: 16, midMarks: 21, finalMarks: 37, total: 87, grade: 'B+' },
    { id: 10, rollNumber: 'COSC231122137', name: 'Aown Raza', quizTotal: 14, assignmentTotal: 17, midMarks: 22, finalMarks: 39, total: 92, grade: 'A' },
  ]);

  const handlePublishResults = () => {
    setIsPublished(true);
    setUploadMessage(`Results for ${selectedCourse} (${examType}) published successfully to all student portals!`);
    setTimeout(() => setUploadMessage(''), 5000);
  };

  const handleSimulateCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadMessage(`Imported "${file.name}" with 54 student marks records! Ready for review.`);
    setIsPublished(false);
  };

  const filteredResults = resultsData.filter(
    (r) =>
      r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.rollNumber.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(122, 31, 31, 0.1)',
              color: 'var(--eum-maroon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--eum-maroon)', marginBottom: '2px' }}>
              Academic Results Import & Review Center
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Upload spreadsheet grades, review student marks, verify roll mappings, and publish to student portals.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <label
            className="btn btn-outline"
            style={{ padding: '9px 16px', fontSize: '0.86rem', cursor: 'pointer' }}
          >
            <UploadCloud size={16} />
            <span>Upload CSV / Excel</span>
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleSimulateCSVUpload}
              style={{ display: 'none' }}
            />
          </label>

          <button
            onClick={handlePublishResults}
            disabled={isPublished}
            className="btn btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.86rem' }}
          >
            <Send size={15} />
            <span>{isPublished ? 'Published & Live' : 'Confirm & Publish Results'}</span>
          </button>
        </div>
      </div>

      {uploadMessage && (
        <div
          style={{
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{uploadMessage}</span>
        </div>
      )}

      {/* Control Bar: Course Selector + Exam Type + Search */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Target Course
            </label>
            <select
              className="form-input"
              style={{ padding: '7px 12px', fontSize: '0.86rem', width: 'auto' }}
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setIsPublished(false);
              }}
            >
              <option value="COSE-4149">COSE-4149 — Cloud Computing</option>
              <option value="COSE-3133">COSE-3133 — HCI & Computer Graphics</option>
              <option value="MATH-3181">MATH-3181 — Multivariable Calculus</option>
              <option value="COSE-3136">COSE-3136 — Parallel & Distributed Computing</option>
              <option value="BUAD-2123">BUAD-2123 — Principles of Marketing</option>
              <option value="ENGL-3184">ENGL-3184 — Technical & Business Writing</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Exam Session
            </label>
            <select
              className="form-input"
              style={{ padding: '7px 12px', fontSize: '0.86rem', width: 'auto' }}
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
            >
              <option value="Midterm Examination (Fall 2026)">Midterm Examination (Fall 2026)</option>
              <option value="Final Examination (Fall 2026)">Final Examination (Fall 2026)</option>
              <option value="Continuous Assessment Aggregate">Continuous Assessment Aggregate</option>
            </select>
          </div>

          <div style={{ paddingTop: '18px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: '700',
                padding: '5px 12px',
                borderRadius: '16px',
                backgroundColor: isPublished ? 'var(--status-success-bg)' : 'var(--status-warning-bg)',
                color: isPublished ? 'var(--status-success)' : 'var(--status-warning)',
              }}
            >
              {isPublished ? '● Published to Students' : '○ Draft Preview (Unpublished)'}
            </span>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '220px' }}>
          <input
            type="text"
            className="form-input"
            style={{ padding: '7px 12px 7px 30px', fontSize: '0.84rem' }}
            placeholder="Search student / roll..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Results Matrix Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead style={{ backgroundColor: 'var(--bg-subtle)' }}>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 16px' }}>Roll Number</th>
                <th style={{ padding: '12px 16px' }}>Student Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Quizzes (15)</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Assignments (20)</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Midterm (25)</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Final (50)</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Total Score</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Grade</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--eum-maroon)' }}>
                    {r.rollNumber}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>
                    {r.name}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>{r.quizTotal}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>{r.assignmentTotal}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600' }}>{r.midMarks}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600' }}>{r.finalMarks}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', color: 'var(--eum-green)' }}>
                    {r.total}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        backgroundColor: r.grade.startsWith('A') ? 'rgba(28, 92, 52, 0.12)' : 'rgba(201, 162, 39, 0.14)',
                        color: r.grade.startsWith('A') ? 'var(--eum-green)' : '#8C6800',
                      }}
                    >
                      {r.grade}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.74rem', color: isPublished ? 'var(--eum-green)' : 'var(--text-muted)' }}>
                      {isPublished ? '✓ Published' : 'Draft'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
