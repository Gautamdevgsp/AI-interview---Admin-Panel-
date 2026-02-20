import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ApiServices from '../../../routes/ApiServices';
import axios from 'axios';

function AttemptTracking() {
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [attemptData, setAttemptData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [interviews, setInterview] = useState([]);

  const fetchAttemptedStudents = async (interviewId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://clostridial-chester-hydrostatically.ngrok-free.dev/admin/interviews/${interviewId}/attempts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,

            'ngrok-skip-browser-warning': 'true'
          }
        }
      );
       console.log("Attempts API:", res.data);
      setAttemptData(res.data);
    } catch (error) {
      console.error('❌ Failed to fetch attempted students', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttemptStatus = async (interviewId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://clostridial-chester-hydrostatically.ngrok-free.dev/admin/interviews/${interviewId}/attempt-status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
             'ngrok-skip-browser-warning': 'true'
          }
        }
      );
       console.log("Status API:", res.data);
      setStatusData(res.data.status);
    } catch (error) {
      console.error('❌ Failed to fetch attempt status', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewChange = (selectedOption) => {
    setSelectedInterview(selectedOption);
    if (selectedOption) {
      fetchAttemptedStudents(selectedOption.value);
      fetchAttemptStatus(selectedOption.value);
    } else {
      setAttemptData(null);
      setStatusData(null);
    }
  };

  const fetchInterviews = async () => {
    try {
      const res = await ApiServices.getinterviews();

      const options = res.data.interviews.map((i) => ({
        value: i.interview_id,
        label: i.interview_id
      }));

      setInterview(options);
    } catch (error) {
      console.error('❌ Fetch interviews failed', error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  return (
    <>
     <div className="card shadow mt-5">
      <div className="mt-3">
          <div className="card-body">
            <h5 className="mb-3">Track attempt status</h5>
        <Select
          options={interviews} // [{value: "react_interview", label:"React Interview"}]
          value={selectedInterview}
          onChange={handleInterviewChange}
          placeholder="Select Interview"
          isClearable
        />

            <p className="text-center text-muted mt-4">
              Select Interview Id to track it's attempt status
            </p>

          </div>
      </div>
      </div>

      {attemptData && statusData && (
        <div className="mt-5">
          <h5>Interview: {attemptData.interview_id}</h5>
          <p>Total Assigned: {attemptData.total_assigned}</p>
          <p>Total Attempted: {attemptData.total_attempted}</p>

          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Attempt Status</th>
                <th>Students</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Not Started</td>
                <td>{statusData.not_started.students.join(', ') || 'None'}</td>
              </tr>
              <tr>
                <td>In Progress</td>
                <td>{statusData.in_progress.students.join(', ') || 'None'}</td>
              </tr>
              <tr>
                <td>Completed</td>
                <td>{statusData.completed.students.join(', ') || 'None'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default AttemptTracking;
