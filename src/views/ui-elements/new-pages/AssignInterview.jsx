import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Select from 'react-select';
import ApiServices from '../../../routes/ApiServices';

const AssignInterview = () => {
  // STATES
  const [assignments, setAssignments] = useState([]);
  const [assignableInterviews, setAssignableInterviews] = useState([]);

  const [studentEmail, setStudentEmail] = useState('');
  // const [interviewId, setInterviewId] = useState('');
  const [editingEmail, setEditingEmail] = useState(null);
  const [isUnassignMode, setIsUnassignMode] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);


  useEffect(() => {
    if (selectedInterview) {
      fetchStudentsForInterview(selectedInterview.value);
    }
  }, [selectedInterview]);


  // ALERT MODAL (same as CreateInterview)
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: 'Something went wrong. May be your interview is blocked',
    type: 'info' // success | danger | warning | info
  });

  const openAlertModal = (title, message, type = 'info') => {
    setAlertModal({
      show: true,
      title,
      message,
      type
    });
  };

  const closeAlertModal = () => {
    setAlertModal((prev) => ({ ...prev, show: false }));
  };


  const fetchInterviews = async () => {
    try {
      const res = await ApiServices.getinterviews();

      const options = res.data.interviews.map((i) => ({
        value: i.interview_id,
        label: ` ${i.interview_id} `,
      }));

      setInterviews(options);

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

  const fetchAssignableInterviews = async () => {
    try {
      const res = await axios.get(
        'https://interview.ksesystem.com/admin/interviews/assignable',
        {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        }
      );

      const options = res.data.interviews.map((i) => ({
        value: i.interview_id,
        label: i.title || i.interview_id
      }));

      setAssignableInterviews(options);
    } catch (error) {
      console.error('Failed to fetch assignable interviews', error);
    }
  };

  const fetchRegisteredStudents = async () => {
    try {
      const res = await ApiServices.getRegisteredStudents(); // <-- your API
      const options = res.data.students.map((s) => ({
        value: s.email,
        label: s.email
      }));
      setRegisteredStudents(options);
    } catch (err) {
      console.error('Failed to fetch registered students', err);
    }
  };

  const interviewId = selectedInterview?.value;

  const saveInterview = async () => {
    console.log(studentEmail, interviewId);
    try {
      const res = await axios.post(
        'https://interview.ksesystem.com/admin/assign-interview',
        {
          student_email: selectedStudent.value,
          interview_id: selectedInterview.value
        },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      setShowModal(false);
      setSelectedStudent(null);
      console.log(res.data);

      fetchStudentsForInterview(selectedInterview.value);
    } catch (error) {
      console.error(error);
      openAlertModal(
        'Assignment Failed',
        error?.response?.data?.message ||
        'Something went wrong while assigning the interview. Please try again.',
        'danger'
      );
    }
  };

  const handleInterviewChange = (option) => {
    setSelectedInterview(option);
    if (option) {
      fetchStudentsForInterview(option.value);
    } else {
      setStudents([]);
      setTotal(0);
    }
  };

  // FETCH STUDENTS
  const fetchStudentsForInterview = async (interviewId) => {
    try {
      setLoading(true);
      console.log('Fetching students for:', interviewId);
      const res = await ApiServices.fetchStudents(interviewId);

      console.log('Students API response:', res.data);
      setStudents(res.data.students || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  // UNASSIGN
  const unassignInterview = async (email) => {
    try {
      await ApiServices.unassignInterview(email, selectedInterview.value);

      // Remove from UI
      setStudents((prev) => prev.filter((s) => s !== email));
      setTotal((prev) => prev - 1);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to unassign interview');
    }
  };

  const toggleStatus1 = async (email) => {
    try {
      // await axios.patch(`${API_URL}/assign/status`, { email });

      setAssignments((prev) => prev.map((item) => (item.studentEmail === email ? { ...item, isActive: !item.isActive } : item)));
    } catch (error) {
      console.error(error);
    }
  };

  //  OPEN MODALS
  const openAddModal = () => {
    setStudentEmail('');
    // setInterviewId('');
    setEditingEmail(null);
    setMessage('');
    setShowModal(true);
    setSelectedStudent(null);
    setShowModal(true);
    fetchRegisteredStudents();
    fetchAssignableInterviews();
  };

  const openUnassignModal = (item) => {
    setStudentEmail(item.studentEmail);
    // setInterviewId(item.interviewId);
    setEditingEmail(item.studentEmail);
    setIsUnassignMode(true);
    setMessage('');
    setShowModal(true);
  };

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Assign Interview</h4>

          <div className="d-flex gap-2 align-items-center">
            <Select
              options={interviews}
              value={selectedInterview}
              onChange={handleInterviewChange}
              placeholder="Choose Interview"
              isClearable
            />
            <button className="btn btn-primary btn-sm" onClick={openAddModal}>
              <i className="bi bi-plus "></i>
            </button>
          </div>
        </div>

        {message && <div className="alert alert-info text-center">{message}</div>}

        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card-body">
                {/* FLEX HEADER: dropdown left, badge right */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
                  {/* LEFT: Dropdown */}
                  <div className="" style={{ maxWidth: '300px' }}>
                    <h6 className="mb-1"></h6>
                  </div>
                </div>

                {/* STATUS MESSAGES */}

                {/* STUDENTS TABLE */}
                <div className="table-responsive mt-3">
                  <table className="table table-bordered text-center">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Student Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* No interview selected */}
                      {!selectedInterview && (
                        <tr>
                          <td colSpan="3" className="text-center text-muted">
                            Please select an interview
                          </td>
                        </tr>
                      )}

                      {/* Loading */}
                      {selectedInterview && loading && (
                        <tr>
                          <td colSpan="3" className="text-center text-muted">
                            Loading students...
                          </td>
                        </tr>
                      )}

                      {/* No students */}
                      {selectedInterview && !loading && students.length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center text-muted">
                            No students assigned
                          </td>
                        </tr>
                      )}

                      {/* Students list */}
                      {!loading &&
                        students.map((email, index) => (
                          <tr key={email}>
                            <td>{index + 1}</td>
                            <td>{email}</td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm rounded"
                                onClick={() => unassignInterview(email)}
                              >
                                Unassign
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL*/}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{isUnassignMode ? 'Unassign Interview' : 'Assign Interview'}</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)} />
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Select Interview</label>
                    <Select
                      options={assignableInterviews}
                      value={selectedInterview}
                      onChange={handleInterviewChange}
                      placeholder="Select Interview ID"
                      isClearable
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Select Student</label>
                    <Select
                      options={registeredStudents}
                      value={selectedStudent}
                      onChange={setSelectedStudent}
                      placeholder="Select Student Email"
                      isClearable
                    />
                  </div>

                  {isUnassignMode && (
                    <p className="text-danger text-center fw-semibold">Are you sure you want to unassign this interview?</p>
                  )}
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>

                  {isUnassignMode ? (
                    <button className="btn btn-danger" onClick={unassignInterview}>
                      Confirm Unassign
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={saveInterview}>
                      Assign
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}


      {alertModal.show && (
        <>
          <div
            className="position-fixed top-0 end-0 p-3"
            style={{
              zIndex: 2000,
              pointerEvents: 'none'
            }}
          >
            <div
              className={`toast show fade`}
              style={{
                minWidth: '250px',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transform: 'translateX(0)' // initial position
              }}
            >
              <div className={`toast-header bg-${alertModal.type} text-white`}>
                <strong className="me-auto py-1">{alertModal.title}</strong>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeAlertModal}
                ></button>
              </div>

              <div className="toast-body">
                Something went wrong. May be your interview is blocked
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050, opacity: 0.5 }}></div>
        </>
      )}


    </>

    // <div className="container-fluid mt-4">
    //   <div className="row">
    //     {/* LEFT PANEL */}
    //     <div className="col-md-3">
    //       <div className="card shadow-sm">
    //         <div className="card-body">
    //           <h5 className="mb-3">Select Interview</h5>

    //           <Select
    //             options={interviews}
    //             value={selectedInterview}
    //             onChange={handleInterviewChange}
    //             placeholder="Choose Interview ID"
    //             isClearable
    //           />
    //         </div>
    //       </div>
    //     </div>

    //     {/* RIGHT PANEL */}
    //     <div className="col-md-9">
    //       <div className="card shadow-sm">
    //         <div className="card-body">
    //           <h5 className="mb-3">
    //             Assigned Students {selectedInterview && <span className="badge bg-primary ms-2">Total: {total}</span>}
    //           </h5>

    //           {!selectedInterview && <p className="text-muted">Please select an interview</p>}

    //           {loading && <p>Loading students...</p>}

    //           {selectedInterview && !loading && students.length === 0 && <p className="text-muted">No students assigned</p>}

    //           {students.length > 0 && (
    //             <div className="table-responsive">
    //               <table className="table table-bordered text-center">
    //                 <thead className="table-dark">
    //                   <tr>
    //                     <th>#</th>
    //                     <th>Student Email</th>
    //                     <th>Action</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //                   {students.map((email, index) => (
    //                     <tr key={email}>
    //                       <td>{index + 1}</td>
    //                       <td>{email}</td>
    //                       <td>
    //                         <button className="btn btn-danger btn-sm" onClick={() => unassignInterview(email)}>
    //                           Unassign
    //                         </button>
    //                       </td>
    //                     </tr>
    //                   ))}
    //                 </tbody>
    //               </table>
    //             </div>
    //           )}

    //           {message && <div className="alert alert-danger mt-3">{message}</div>}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default AssignInterview;
