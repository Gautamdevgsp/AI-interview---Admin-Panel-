import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import ApiServices from '../../../routes/ApiServices';

const CreateInterview = () => {
  // STATES
  const [interviews, setInterviews] = useState([]);
  const [interviewId, setInterviewId] = useState('');
  const [title, setTitle] = useState('');
  const [editingInterviewId, setEditingInterviewId] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [description, setDescription] = useState('');
  const [showResult, setShowResult] = useState(false);

  const [isBlocked, setIsBlocked] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInterviewId, setDeleteInterviewId] = useState(null);

  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'info' // success | danger | warning | info
  });

  //OPEN MODALS
  const openAddModal = () => {
    setInterviewId('');
    setTitle('');

    setEditingInterviewId(null);
    setIsBlocked(false);

    setShowModal(true);
    setDescription('');
    setShowResult(false);
  };

  const openEditModal = (interview) => {
    setInterviewId(interview.interview_id);
    setTitle(interview.title);
    setDescription(interview.description);

    // Direct mapping from API
    setShowResult(interview.show_result_to_user === true);

    // optional: map status -> isBlocked
    setIsBlocked(interview.status === 'blocked');

    setEditingInterviewId(interview.interview_id);
    setShowModal(true);
  };

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

  const blockInterview = async (id) => {
    console.log(' BLOCK API CALLED for interview:', id);

    const res = await axios.post(`https://clostridial-chester-hydrostatically.ngrok-free.dev/admin/interviews/${id}/block`);

    console.log('BLOCK API RESPONSE:', res);
    return res;
  };

  const unblockInterview = async (id) => {
    console.log(' UNBLOCK API CALLED for interview:', id);

    const res = await axios.post(`https://clostridial-chester-hydrostatically.ngrok-free.dev/admin/interviews/${id}/unblock`);

    console.log(' UNBLOCK API RESPONSE:', res);
    return res;
  };

  const toggleBlockStatus = async (interview) => {
    try {
      if (interview.isBlocked) {
        // Unblock
        await unblockInterview(interview.interview_id);
      } else {
        // Block
        await blockInterview(interview.interview_id);
      }

      // Update UI
      setInterviews((prev) =>
        prev.map((item) => (item.interview_id === interview.interview_id ? { ...item, isBlocked: !item.isBlocked } : item))
      );
    } catch (error) {
      console.error('Block/Unblock failed', error);
      alert('Failed to update interview status');
    }
  };

  // DELETE
  const deleteInterview = async (id) => {
    try {
      console.log(' Deleting interview:', id);

      const res = await ApiServices.deleteInterviews(id);

      console.log(' Delete response:', res.data);
      fetchInterviews();
    } catch (error) {
      console.error(' Delete failed:', error);
    }
  };

  //  FETCH ALL INTERVIEWS
  const fetchInterviews = async () => {
    try {
      const res = await ApiServices.getinterviews();

      const normalized = res.data.interviews.map((item) => ({
        ...item,
        isBlocked: item.status === 'blocked' // ✅ THIS IS KEY
      }));

      setInterviews(normalized);
    } catch (error) {
      console.error(' Fetch failed:', error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const saveInterview = async () => {
    if (!interviewId || !title || !description) {
      openAlertModal('Missing Fields', 'Please fill Interview ID, Title and Description.', 'warning');
      return;
    }

    try {
      if (!editingInterviewId) {
        console.log(' Sending request...');
        // CREATE
        const res = await ApiServices.createInterview({
          interview_id: interviewId,
          title,
          description,
          show_result_to_user: showResult
        });

        console.log('RESPONSE DATA:', res.data);

        // setInterviews((prev) => [...prev, res.data]);
      } else {
        // UPDATE
        const res = await ApiServices.updateInterview(editingInterviewId, { title, description, show_result_to_user: showResult });
        console.log(res);
      }

      setShowModal(false);
      setInterviewId('');
      setTitle('');
      setDescription('');
      setEditingInterviewId(null);

      fetchInterviews();
    } catch (error) {
      console.error(error);
      openAlertModal('Operation Failed', 'Something went wrong. Please try again.', 'danger');
    }
  };

  const confirmDelete = async () => {
    if (!deleteInterviewId) return;

    await deleteInterview(deleteInterviewId);

    setShowDeleteModal(false);
    setDeleteInterviewId(null);
  };

  //  UI
  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Interview Manager</h4>
          <button className="btn btn-sm btn-primary" onClick={openAddModal}>
            <i className="bi bi-plus"></i>
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Interview ID</th>
                <th>Interview Title</th>
                <th>Description</th>
                <th className="text-center">Result Visibility</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(interviews) &&
                interviews.map((interview, index) => (
                  <tr key={interview.interview_id}>
                    <td>{index + 1}</td>
                    <td>{interview.interview_id}</td>
                    <td>{interview.title}</td>
                    <td>{interview.description}</td>

                    <td className="text-center">
                      <span className={`badge ${interview.show_result_to_user ? 'bg-success' : 'bg-secondary'}`}>
                        {interview.show_result_to_user ? 'Visible' : 'Hidden'}
                      </span>
                    </td>

                    <td className="text-center">
                      <div className="d-flex flex-column align-items-center">
                        {/* Toggle Switch */}
                        <div className="form-check form-switch">
                          <input
                            className={`form-check-input ${interview.isBlocked ? 'bg-white' : 'bg-primary'}`}
                            type="checkbox"
                            checked={!interview.isBlocked}
                            onChange={() => toggleBlockStatus(interview)}
                            style={{
                              width: '2.5rem',
                              height: '1.4rem',
                              cursor: 'pointer'
                            }}
                          />
                        </div>

                      </div>
                    </td>

                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-warning btn-sm "
                          onClick={() => openEditModal(interview)}
                        >
                          <i className='bi bi-pencil'></i>
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            setDeleteInterviewId(interview.interview_id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <i className='bi bi-trash'></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingInterviewId ? 'Edit Interview' : 'Add Interview'}</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)} />
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Interview ID</label>
                    <input
                      className="form-control"
                      placeholder="e.g. ml_interview"
                      value={interviewId}
                      onChange={(e) => setInterviewId(e.target.value)}
                      disabled={!!editingInterviewId}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Interview Title</label>
                    <input
                      className="form-control"
                      placeholder="e.g. Machine Learning Interview"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter interview description"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>

                  <div className="form-check mt-3 mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={showResult}
                      onChange={(e) => setShowResult(e.target.checked)}
                      id="showResultCheck"
                    />
                    <label className="form-check-label" htmlFor="showResultCheck">
                      Show result to student
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary btn-sm " style={{padding: '6px 8px'}} onClick={saveInterview}>
                    {editingInterviewId ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {showDeleteModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-danger">Confirm Delete</h5>
                  <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                </div>

                <div className="modal-body">
                  <p className="mb-0">Are you sure you want to delete this interview?</p>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={confirmDelete}>
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BACKDROP */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      {/* 
    {alertModal.show && (
  <div
    className="position-fixed top-0 end-0 p-3"
    style={{ zIndex: 1055 }}
  >
    <div className="toast show">
      <div className={`toast-header bg-${alertModal.type} text-white`}>
        <strong className="me-auto">{alertModal.title}</strong>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={closeAlertModal}
        ></button>
      </div>

      <div className="toast-body">
        {alertModal.message}
      </div>
    </div>
  

   <div className="modal-backdrop fade show"></div></div>
)} */}

      {alertModal.show && (
        <>
          {/* Toast Container */}
          <div
            className="position-fixed top-0 end-0 p-3"
            style={{
              zIndex: 2000,
              pointerEvents: 'none' // Allows click through backdrop if you want
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
              <div className={`toast-header bg-danger text-white`}>
                <strong className="me-auto py-1">{alertModal.title}</strong>
                <button type="button" className="btn-close btn-close-white" onClick={closeAlertModal}></button>
              </div>

              <div className="toast-body">{alertModal.message}</div>
            </div>
          </div>

          {/* Fade backdrop */}
          <div className="modal-backdrop fade show" style={{ zIndex: 1050, opacity: 0.5 }}></div>
        </>
      )}
    </>
  );
};

export default CreateInterview;
