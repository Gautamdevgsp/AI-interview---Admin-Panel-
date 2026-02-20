import axios from "axios";

const BASE_URL =
  "https://interview.ksesystem.com/";

export const SERVER_URL = "https://interview.ksesystem.com/";

// const INTERVIEW_ID = '123';
class APIService {

  getinterviews() {
    return axios.get(
      `${BASE_URL}admin/interviews`,
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    );
  }

  // CREATE interview
  createInterview(data) {
    return axios.post(
      `${BASE_URL}admin/interviews/create`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
  }

  deleteInterviews(id) {
    return axios.delete(
      `${BASE_URL}admin/interviews/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'ngrok-skip-browser-warning': 'true'
        }
      }
    );
  }

  updateInterview(id, data) {
    return axios.put(
      `${BASE_URL}admin/interviews/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
  }

  fetchquestions(interviewId) {
    return axios.get(
      `${BASE_URL}admin/interviews/${interviewId}/questions`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'ngrok-skip-browser-warning': 'true'
        }
      }
    );
  }

  // Add a new question to an interview
  addQuestion(interviewId, data) {
    return axios.post(
      `${BASE_URL}admin/interviews/${interviewId}/questions`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    );
  }

  // Update an existing question of an interview
  updateQuestion(interviewId, questionId, data) {
    return axios.put(
      `${BASE_URL}admin/interviews/${interviewId}/questions/${questionId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    );
  }

  fetchStudents(interviewId) {
    return axios.get(
      `${BASE_URL}admin/interviews/${interviewId}/students`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // if needed
          'ngrok-skip-browser-warning': 'true'
        }
      }
    );
  }


  unassignInterview(studentEmail, interviewId) {
    return axios.post(
      `${BASE_URL}admin/unassign-interview`,
      {
        student_email: studentEmail,
        interview_id: interviewId
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'ngrok-skip-browser-warning': 'true'
        }
      }
    );
  }
  getRegisteredStudents() {
    return axios.get(
      `${BASE_URL}admin/students`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'ngrok-skip-browser-warning': 'true'
        }
      }
    );
  }

}

export default new APIService();
