import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ApiServices from '../../../routes/ApiServices';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DetailResult() {
  const [interviews, setInterview] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [attemptStatusMap, setAttemptStatusMap] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');


  const [assignedStudents, setAssignedStudents] = useState([]);

  const navigate = useNavigate();

  const fetchInterviews = async () => {
    try {
      const res = await ApiServices.getinterviews();

      const options = res.data.interviews.map((i) => ({
        value: i.interview_id,
        label: i.title
      }));
      setInterview(options);
      if (options.length > 0) {
        setSelectedInterview(options[0]);
      }

    } catch (error) {
      console.error('❌ Fetch interviews failed', error);
    }
  };


  useEffect(() => {
    fetchInterviews();
  }, []);

  //   useEffect(() => {
  //     if (!selectedInterview) {
  //       setStudents([]);
  //     //   setSelectedEmail('');
  //       return;
  //     }

  //     const fetchStudents = async () => {
  //       try {
  //         const res = await axios.get(
  //           `https://clostridial-chester-hydrostatically.ngrok-free.dev/admin/interviews/${selectedInterview.value}/students`,
  //           {
  //             headers: { 'ngrok-skip-browser-warning': 'true' }
  //           }
  //         );

  //         console.log(res.data.students);
  //         setStudents(res.data.students);
  //       } catch (err) {
  //         console.error(err);
  //         setError('Failed to load students');
  //       }
  //     };

  //     fetchStudents();
  //   }, [selectedInterview]);

  /*FETCH ASSIGNED STUDENTS */
  useEffect(() => {
    if (!selectedInterview) {
      setAssignedStudents([]);
      return;
    }

    const fetchAssignedStudents = async () => {
      try {
        const res = await axios.get(
          `https://clostridial-chester-hydrostatically.ngrok-free.dev/admin/interviews/${selectedInterview.value}/students`
        );
        setAssignedStudents(res.data.students);
      } catch (err) {
        console.error('❌ Failed to fetch assigned students', err);
      }
    };

    fetchAssignedStudents();
  }, [selectedInterview]);

  useEffect(() => {
    if (!selectedInterview) {
      setAttemptStatusMap({});
      return;
    }

    const fetchAttemptStatus = async () => {
      try {
        const res = await axios.get(
          `https://clostridial-chester-hydrostatically.ngrok-free.dev/admin/interviews/${selectedInterview.value}/attempt-status`,
          {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          }
        );

        const status = res.data.status;
        const map = {};

        status.not_started.students.forEach((email) => {
          map[email] = 'Not Started';
        });

        status.in_progress.students.forEach((email) => {
          map[email] = 'In Progress';
        });

        status.completed.students.forEach((email) => {
          map[email] = 'Completed';
        });

        setAttemptStatusMap(map);
      } catch (err) {
        console.error('Failed to fetch attempt status', err);
      }
    };

    fetchAttemptStatus();
  }, [selectedInterview]);

  useEffect(() => {
    if (!selectedInterview) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await axios.get(`https://clostridial-chester-hydrostatically.ngrok-free.dev/admin/interviews/${selectedInterview.value}/results`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          });

        setResults(res.data.results);
      } catch (err) {
        console.error('Failed to fetch results', err);
      }
    };

    fetchResults();
  }, [selectedInterview]);

  const handleInterviewChange = (selectedOption) => {
    setSelectedInterview(selectedOption);
  };

  const mergedStudents = Object.keys(attemptStatusMap).map((email) => {
    const result = results.find((r) => r.student_email === email);

    return {
      student_email: email,
      percentage: result?.percentage ?? '-',
      average_accuracy: result?.average_accuracy ?? null,
      cheating: result?.cheating ?? false,
      decision: result?.decision ?? '—',
      session_id: result?.session_id ?? email,
      status: attemptStatusMap[email],
      interview_datetime: result?.interview_datetime ?? null
    };
  });

  const filteredResults = mergedStudents.filter((row) => {
    if (statusFilter === 'all') return true;
    return row.status === statusFilter;
    // const studentStatus = attemptStatusMap[row.student_email] || 'Not Started';
    // return studentStatus === statusFilter;
  });

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '—';

    const dateObj = new Date(dateTime);

    const time = dateObj.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const date = dateObj.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    return `${time} (${date})`;
  };

  return (
    <>

      <div className="card shadow">
        <div >
          <div className="card-body">
            <h5 className="mb-3">Student Result Report</h5>

            <div className="row align-items-end">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Select Interview</label>
                <Select
                  options={interviews}
                  value={selectedInterview}
                  onChange={handleInterviewChange}
                  placeholder="Select Interview"
                  isClearable
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Filter by Status</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  disabled={!selectedInterview}
                >
                  <option value="all">All Students</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Not Started">Not Started</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive px-4">
          <table className="table table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Nervousness</th>
                <th>Confidence</th>
                <th>Cheating</th>
                <th>Decision</th>
                <th>Attempted on</th>
                <th>Attempt Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-muted">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredResults.map((row, index) => (
                  <tr key={row.session_id}>
                    <td>{index + 1}</td>
                    <td>{row.student_email}</td>
                    <td>{row.percentage}%</td>
                    <td>
                      {row.average_accuracy !== null
                        ? `${Math.round(row.average_accuracy * 100)}%`
                        : '—'}
                    </td>
                    <td className={row.cheating ? 'text-danger fw-semibold' : 'text-success fw-semibold'}>
                      {row.cheating ? 'Detected' : 'Not Detected'}
                    </td>
                    <td className={row.decision === 'Hire' ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>{row.decision}</td>

                    <td>{formatDateTime(row.interview_datetime)}</td>

                    <td
                      className={
                        attemptStatusMap[row.student_email] === 'Completed'
                          ? 'text-success fw-semibold'
                          : attemptStatusMap[row.student_email] === 'In Progress'
                            ? 'text-warning fw-semibold'
                            : 'text-secondary fw-semibold'
                      }
                    >
                      {attemptStatusMap[row.student_email] || 'Not Started'}
                    </td>

                    <td className="text-center">
                      <button
                        className="btn btn-sm "
                        title="View Details"
                        onClick={() => navigate(`/interviews/${selectedInterview.value}/students/${row.student_email}/details`)}
                      >
                        <i className="bi bi-eye-fill text-secondary" style={{ fontSize: '1.3rem' }}></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default DetailResult;
