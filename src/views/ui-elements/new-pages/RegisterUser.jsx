import { useState, useEffect } from 'react';
import axios from 'axios';

import ApiServices from '../../../routes/ApiServices';

function RegisterUser() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await ApiServices.getRegisteredStudents();
      setStudents(res.data.students || []);
    } catch (error) {
      console.error('API FAILED:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post('https://interview.ksesystem.com/students/register', formData);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '' });
      fetchStudents();
    } catch (error) {
      console.error('Registration failed', error);
    } finally {
      setLoading(false);
    }
  };

  // const deleteStudent = async (email) => {
  //   if (!window.confirm('Are you sure you want to delete this student?')) return;

  //   try {
  //     setLoading(true);
  //     const encodedEmail = encodeURIComponent(email);

  //     await axios.delete(`https://interview.ksesystem.com/admin/students/by-email/${encodedEmail}`);

  //     fetchStudents();
  //   } catch (error) {
  //     console.error('Delete failed:', error);
  //     alert('Failed to delete student');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const confirmDelete = async () => {
    if (!selectedEmail) return;

    try {
      setLoading(true);

      const encodedEmail = encodeURIComponent(selectedEmail);

      await axios.delete(`https://interview.ksesystem.com/admin/students/by-email/${encodedEmail}`);

      setShowDeleteModal(false);
      setSelectedEmail(null);
      fetchStudents();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  return (
    //     <div className="auth-wrapper mt-5 align-items-start" style={{minheight:"60vh"}}>
    //       <div className="auth-content text-center">
    //         <Card className="borderless" style={{boxShadow: "1px 1px 7px #d7d7d7", marginTop:"5rem"}}>
    //           <Row className="align-items-start text-center">
    //             <Col>
    //               <Card.Body className="card-body">

    //                 <h4 className="mb-3 f-w-400">Register student</h4>
    //                 <InputGroup className="mb-3">
    //                   <InputGroup.Text>
    //                     <FeatherIcon icon="user" />
    //                   </InputGroup.Text>
    //                   <Form.Control type="text" name='name' placeholder="Username"   onChange={handleChange}
    // />
    //                 </InputGroup>
    //                 <InputGroup className="mb-3">
    //                   <InputGroup.Text>
    //                     <FeatherIcon icon="mail" />
    //                   </InputGroup.Text>
    //                   <Form.Control type="email" name='email' placeholder="Email address"  onChange={handleChange} />
    //                 </InputGroup>
    //                 <InputGroup className="mb-4">
    //                   <InputGroup.Text>
    //                     <FeatherIcon icon="lock" />
    //                   </InputGroup.Text>
    //                   <Form.Control type="password" name='password' placeholder="Password"  onChange={handleChange} />
    //                 </InputGroup>
    //                 <Button className="btn-block mb-4" onClick={handleSubmit}>Register</Button>
    //                 <p className="mb-2">
    //                 </p>
    //               </Card.Body>
    //             </Col>
    //           </Row>
    //         </Card>
    //       </div>

    // <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
    //   <Modal.Header closeButton>
    //     <Modal.Title>Success </Modal.Title>
    //   </Modal.Header>
    //   <Modal.Body>
    //     Student registered successfully!
    //   </Modal.Body>
    //   <Modal.Footer>
    //     <Button variant="success" onClick={() => setShowSuccess(false)}>
    //       OK
    //     </Button>
    //   </Modal.Footer>
    // </Modal>

    // <Modal show={showError} onHide={() => setShowError(false)} centered>
    //   <Modal.Header closeButton>
    //     <Modal.Title>Error </Modal.Title>
    //   </Modal.Header>
    //   <Modal.Body>
    //     {errorMessage}
    //   </Modal.Body>
    //   <Modal.Footer>
    //     <Button variant="danger" onClick={() => setShowError(false)}>
    //       Close
    //     </Button>
    //   </Modal.Footer>
    // </Modal>

    //     </div>
    <div className="container">
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <h4 className="mb-2 mb-md-0">Register Student</h4>
        <div className="d-flex gap-2 align-items-center">
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus"></i>
          </button>
        </div>
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.email}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>

                  <td className="text-center">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setSelectedEmail(student.email);
                        setShowDeleteModal(true);
                      }}
                    >
                      <i className='bi bi-trash'></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Register Student</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)} />
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      name="name"
                      placeholder="Enter student name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      name="email"
                      type="email"
                      placeholder="Enter student email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      className="form-control"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>

                  <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
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
                  <p className="mb-0">Are you sure you want to delete this student?</p>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={confirmDelete} disabled={loading}>
                    {loading ? 'Deleting...' : 'Yes, Delete'}
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

export default RegisterUser;
