import { useState, useEffect } from 'react';
import axios from 'axios';
import ApiServices from '../../../routes/ApiServices';
import Select from 'react-select';
export default function QuestionAnswerTable() {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [questions, setQuestions] = useState([]);

  /* MODAL STATE */
  const [showModal, setShowModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [keywords, setKeywords] = useState(['']);

  const BASE_URL = 'https://interview.ksesystem.com/';

  /* ================= MODAL HANDLERS ================= */

  const openAddModal = () => {
    setEditingQuestionId(null);
    setQuestionText('');
    setAnswerText('');
    setShowModal(true);
  };

  const openEditModal = (q) => {
    setEditingQuestionId(q.id);
    setQuestionText(q.question);
    setKeywords([...q.keywords]);
    setShowModal(true);
  };

  const fetchInterviews = async () => {
  try {
    const res = await ApiServices.getinterviews();

    const options = res.data.interviews.map((i) => ({
      value: i.interview_id,
      label: `${i.title}`,
    }));

    setInterviews(options);

    if (options.length > 0) {
      setSelectedInterview(options[0]);

      fetchQuestions(options[0].value);
    } else {
      setSelectedInterview(null);
      setQuestions([]);
    }

  } catch (error) {
    console.error('Fetch interviews failed', error);
  }
};


  useEffect(() => {
    fetchInterviews();
  }, []);

  const deleteQuestion = (id) => {
    if (!window.confirm('Delete this question?')) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // useEffect(() => {
  //   fetchQuestions();
  // }, []);

  const fetchQuestions = async (interviewId) => {
    try {
      if (!interviewId) {
        console.error('❌ Interview ID missing');
        return;
      }
      const res = await ApiServices.fetchquestions(interviewId);

      console.log('📥 QUESTIONS:', res.data);
      setQuestions(res.data.questions || res.data);
    } catch (error) {
      console.error('❌ Failed to fetch questions', error);
    }
  };

  const handleInterviewChange = (selectedOption) => {
    setSelectedInterview(selectedOption);
    fetchQuestions(selectedOption.value);
  };

  const saveQuestionWithAnswer = async () => {
    if (!questionText.trim()) return;

    const filteredKeywords = keywords.filter((k) => k.trim() !== '');
    if (filteredKeywords.length === 0) return;

    const payload = {
      question: questionText,
      keywords: filteredKeywords
    };

    try {
      if (editingQuestionId) {
        // UPDATE
        await ApiServices.updateQuestion(selectedInterview.value, editingQuestionId, payload);

      } else {
        // CREATE
        await ApiServices.addQuestion(selectedInterview.value, payload);
      }

      fetchQuestions(selectedInterview.value);
      setShowModal(false);
      setQuestionText('');
      setKeywords(['']);
      setEditingQuestionId(null);
    } catch (error) {
      console.error('Save failed', error);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}admin/interviews/${selectedInterview.value}/questions/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      fetchQuestions(selectedInterview.value);
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  const handleKeywordChange = (index, value) => {
    const updated = [...keywords];
    updated[index] = value;
    setKeywords(updated);
  };

  const addKeywordField = () => {
    setKeywords((prev) => [...prev, '']);
    // Optional: focus new input after a tiny delay
    setTimeout(() => {
      const inputs = document.querySelectorAll('input[placeholder^="Keyword"]');
      inputs[inputs.length - 1].focus();
    }, 0);
  };

  const removeKeywordField = (index) => {
    const updated = keywords.filter((_, i) => i !== index);
    setKeywords(updated);
  };

  //  TOGGLE BLOCK / UNBLOCK
  const toggleBlockStatus = async (question) => {
    if (!selectedInterview) return;

    const interviewId = selectedInterview.value;
    const questionId = question.id;

    try {
      if (question.isBlocked) {
        // Unblock API
        await axios.post(
          `${BASE_URL}admin/interviews/${interviewId}/questions/${questionId}/unblock`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          }
        );
      } else {
        // Block API
        await axios.post(
          `${BASE_URL}admin/interviews/${interviewId}/questions/${questionId}/block`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          }
        );
      }

      // Update UI state
      setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, isBlocked: !q.isBlocked } : q)));
    } catch (error) {
      console.error('Failed to toggle block status', error);
    }
  };

  /* UI */

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h4 className="mb-2 mb-md-0">Question & Answer Manager</h4>
        <div className="d-flex gap-2 align-items-center">
          <Select
            options={interviews}
            value={selectedInterview}
            onChange={handleInterviewChange}
            placeholder="Select Interview ID"
            isClearable
            className="w-auto"
            styles={{ container: (provided) => ({ ...provided, minWidth: '200px' }) }}
          />

          <button className="btn btn-primary btn-sm" onClick={openAddModal}>
            <i className="bi bi-plus "></i>
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark text-center align-middle">
            <tr>
              <th>#</th>
              <th>Questions</th>
              <th>Keywords</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {questions.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No questions added
                </td>
              </tr>
            )}

            {questions.map((q, index) => (
              <tr className="text-center align-middle" key={q.id}>
                <td>{index + 1}</td>

                <td className='text-start'>{q.question}</td>

                <td>
                  {q.keywords.map((keyword, i) => (
                    <span key={i} className=" badge bg-light text-dark border rounded px-3 py-2 fs-6 me-2 mb-2">
                      {keyword}
                    </span>
                  ))}
                </td>

                <td className="text-center">
                  <div className="d-flex flex-column align-items-center">
                    {/* Toggle Switch */}
                    <div className="form-check form-switch">
                      <input
                        className={`form-check-input ${q.isBlocked ? 'bg-white' : 'bg-primary'} ellipses`}
                        type="checkbox"
                        checked={!q.isBlocked}
                        onChange={() => toggleBlockStatus(q)}
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
                      className="btn btn-warning btn-sm"
                      style={{ width: '2.5rem', height: '2rem' }}
                      onClick={() => openEditModal(q)}
                    >
                      <i className='bi bi-pencil'></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ width: '2.5rem', height: '2rem' }}
                      //   onClick={() => deleteQuestion(q.id)}
                      onClick={() => openDeleteModal(q.id)}
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

      {/*MODAL*/}

      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-md">
              <div className="modal-content">
                {/* HEADER */}
                <div className="modal-header">
                  <h5 className="modal-title">{editingQuestionId ? 'Edit Question & Keywords' : 'Add Question & Keywords'}</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>

                {/* BODY */}
                <div className="modal-body">
                  <label className="form-label">Select Interview</label>

                  <Select
                    options={interviews}
                    value={selectedInterview}
                    onChange={handleInterviewChange}
                    placeholder="Select Interview ID"
                    isClearable
                  />

                  {/* QUESTION */}
                  <div className="mb-3">
                    <label className="form-label">Question</label>
                    <input
                      className="form-control"
                      placeholder="Enter question..."
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                    />
                  </div>

                  {/* KEYWORDS */}
                  <label className="form-label">Keywords</label>

                  {keywords.map((keyword, index) => (
                    <div className="d-flex align-items-center mb-2" key={index}>
                      <input
                        className="form-control me-2"
                        placeholder={`Keyword ${index + 1}`}
                        value={keyword}
                        onChange={(e) => handleKeywordChange(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault(); // prevent form submission
                            // Only add a new field if this is the last input
                            if (index === keywords.length - 1) {
                              addKeywordField();
                            }
                          }

                          if (e.key === 'Backspace' && keyword === '') {
                            e.preventDefault();
                            if (keywords.length > 1) {
                              removeKeywordField(index);

                              // Optional: focus the previous input after deletion
                              setTimeout(() => {
                                const inputs = document.querySelectorAll('input[placeholder^="Keyword"]');
                                if (index > 0) inputs[index - 1].focus();
                              }, 0);
                            }
                          }
                        }}
                      />

                      {/* ADD BUTTON */}
                      {index === keywords.length - 1 && (
                        <button
                          className="btn btn-outline-success d-flex align-items-center justify-content-center"
                          style={{ height: '2.5rem', width: '2rem' }}
                          onClick={addKeywordField}
                        >
                          <i className="bi bi-plus-lg" style={{ fontWeight: '900' }}></i>
                        </button>
                      )}

                      {/* REMOVE BUTTON */}
                      {keywords.length > 1 && (
                        <button
                          className="btn btn-outline-danger ms-2 d-flex align-items-center justify-content-center"
                          style={{ height: '2.5rem', width: '2rem' }}
                          onClick={() => removeKeywordField(index)}
                        >
                          <i class="bi bi-dash" style={{ fontWeight: '900' }}></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>

                  <button className="btn btn-primary" onClick={saveQuestionWithAnswer}>
                    {editingQuestionId ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BACKDROP */}
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
                  <p className="mb-0">Are you sure you want to delete this question?</p>
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
    </div>
  );
}
