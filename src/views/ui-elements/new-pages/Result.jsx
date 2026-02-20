import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApiServices, { SERVER_URL } from '../../../routes/ApiServices';
import { useParams } from 'react-router-dom';

const Result = () => {
  // STATES

  const [activeSessionIndex, setActiveSessionIndex] = useState(0);

  const [interviews, setInterviews] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedInterviewId, setSelectedInterviewId] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedImage, setSelectedImage] = useState(null);

  const { interviewId, email } = useParams();


  const sessionsArray = data ? Object.values(data.sessions || {}) : [];
  const activeSession = sessionsArray[activeSessionIndex];


  //API DETAILS
  const BASE_URL = `https://interview.ksesystem.com/admin/interviews/${selectedInterviewId}/students/${selectedEmail}/detailed-result`;

  //FETCH INTERVIEWS
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await axios.get('https://interview.ksesystem.com/admin/interviews', {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        // assuming response is array of interviews
        setInterviews(res.data.interviews || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load interviews');
      }
    };

    fetchInterviews();
  }, []);

  // FETCH STUDENTS (DEPENDENT)
  useEffect(() => {
    if (!selectedInterviewId) {
      setStudents([]);
      setSelectedEmail('');
      return;
    }

    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `https://interview.ksesystem.com/admin/interviews/${selectedInterviewId}/students`,
          {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          }
        );

        setStudents(res.data.students);
      } catch (err) {
        console.error(err);
        setError('Failed to load students');
      }
    };

    fetchStudents();
  }, [selectedInterviewId]);

  //   const fetchResult = async () => {
  //   if (!selectedInterviewId || !selectedEmail) return;

  //   setLoading(true);
  //   setError("");
  //   setData(null);

  //   try {
  //     const res = await axios.get(
  //       `https://interview.ksesystem.com/admin/interviews/${selectedInterviewId}/students/${selectedEmail}/detailed-result`,
  //       {
  //         headers: { "ngrok-skip-browser-warning": "true" }
  //       }
  //     );

  //     setData(res.data);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to fetch interview result");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (!interviewId || !email) return;

    const fetchResult = async () => {
      setLoading(true);
      setError('');
      setData(null);

      try {
        const res = await axios.get(
          `https://interview.ksesystem.com/admin/interviews/${interviewId}/students/${email}/detailed-result`,
          {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          }
        );

        setData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch interview result');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [interviewId, email]);

  //  LOADING
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-2">Loading interview result...</p>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container pt-2">
        <div className="card shadow">
          <div className="card-body">
            <h5 className="mb-3">Filter Interview Result</h5>

            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Interview ID</label>
                <select className="form-select" value={selectedInterviewId} onChange={(e) => setSelectedInterviewId(e.target.value)}>
                  <option value="">Select Interview</option>
                  {interviews.map((intv) => (
                    <option key={intv.interview_id} value={intv.interview_id}>
                      {intv.interview_id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Student Email</label>
                <select
                  className="form-select"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  disabled={!students.length}
                >
                  <option value="">Select Email</option>
                  {students.map((email) => (
                    <option key={email} value={email}>
                      {email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <button
                  className="btn btn-primary w-100"
                  // onClick={fetchResult}
                  disabled={!selectedInterviewId || !selectedEmail}
                >
                  Fetch Result
                </button>
              </div>
            </div>

            <p className="text-center text-muted mt-4">Select Interview & Student to view result</p>
          </div>
        </div>
      </div>
    );
  }

  // ================= SAFE DESTRUCTURING =================
  if (!activeSession) return null;

  const {
    session_id,
    overall_result,
    metrics_breakdown,
    question_wise_results,
    evidence_files = [],
    total_questions,
    manual_review_status
  } = activeSession;



  const { student_email, interview_id } = data;

  //RESULT UI
  return (
    <div className="container pt-1 my-1">

      {/* SESSION TABS */}
      {sessionsArray.length > 1 && (
        <ul className="nav nav-tabs mb-3">
          {sessionsArray.map((session, index) => (
            <li className="nav-item" key={session.session_id}>
              <button
                className={`nav-link ${activeSessionIndex === index ? 'active' : ''}`}
                onClick={() => setActiveSessionIndex(index)}
              >
                Attempt {index + 1}
              </button>
            </li>
          ))}
        </ul>
      )}


      {/* BASIC INFO */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h3>Interview Information</h3>
          <p>
            <strong>Email:</strong> {student_email}
          </p>
          <p>
            <strong>Interview ID:</strong> {interview_id}
          </p>
        </div>
      </div>

      {/* OVERALL RESULT */}
      {/* <div className="card mb-4 shadow">
        <div className="card-body">
          <h4>Overall Result</h4>
          <span className="badge bg-warning text-dark">
            {overall_result.decision}
          </span>
        </div>
      </div> */}

      {/*OVERALL RESULT*/}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h4 className="card-title mb-4">Overall Result</h4>

          <div className="row text-center">
            {/* Decision */}
            <div className="col-md-3 mb-3">
              <h6>Decision</h6>
              <span className="badge bg-warning text-dark  px-3 py-2">{overall_result.decision}</span>
            </div>

            {/* Confidence */}
            <div className="col-md-3 mb-3">
              <h6>Confidence</h6>
              <div className="progress">
                <div className="progress-bar bg-success" style={{ width: `${overall_result.confidence * 100}%` }}>
                  {(overall_result.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Nervousness */}
            <div className="col-md-3 mb-3">
              <h6>Nervousness</h6>
              <div className="progress">
                <div className="progress-bar bg-danger" style={{ width: `${overall_result.nervousness * 100}%` }}>
                  {(overall_result.nervousness * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Average Accuracy */}
            <div className="col-md-3 mb-3">
              <h6>Avg. Accuracy</h6>
              <div className="progress">
                <div className="progress-bar bg-info" style={{ width: `${overall_result.average_accuracy * 100}%` }}>
                  {(overall_result.average_accuracy * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5>Metrics Breakdown</h5>
          <div className="row">
            {Object.entries(metrics_breakdown).map(([key, value]) => (
              <div className="col-md-4 mb-3" key={key}>
                <small className="text-muted">{key.replace(/_/g, ' ')}</small>
                <div className="progress">
                  <div className="progress-bar bg-primary" style={{ width: `${value * 100}%` }}>
                    {(value * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUESTIONS */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5>Question-wise Results ({total_questions})</h5>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Answer</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {question_wise_results.map((q, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{q.question}</td>
                  <td>{q.answer_submitted}</td>
                  <td>{(q.scores.final_score * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*EVIDENCE IMAGES*/}


      {evidence_files.length > 0 && (
        <div className="card mb-4 shadow">
          <div className="card-body">
            <h5 className="mb-3">Cheating Evidence ({evidence_files.length})</h5>

            <div className="row g-3">
              {evidence_files.map((file, index) => (
                <div className="col-md-3 col-sm-4 col-6" key={index}>
                  <div className="card shadow-sm h-100">
                    <img
                      src={`${SERVER_URL}${file.url}`}
                      alt={file.filename}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk8RLjeIEybu1xwZigumVersvGJXzhmG8-0Q&s';
                      }}
                      className="img-fluid rounded"
                      style={{
                        height: '180px',
                        width: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div className="card-body p-2 text-center">
                      <small className="text-muted">{file.filename.replace(/_/g, ' ')}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
