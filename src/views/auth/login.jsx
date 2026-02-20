import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { Card, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import axios from 'axios';
import logoDark from 'assets/images/logo-dark.svg';

// -----------------------|| SIGNIN 1 ||-----------------------//

export default function SignIn1() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  // const handleLogin = async () => {
  //   setLoading(true);
  //   setError('');

  //   try {
  //     // Dummy API: replace this with your real API endpoint later
  //     const response = await axios.post('http://127.0.0.1:8000/admin/login', {
  //       username: email,
  //       password: password
  //     });

  //     // Dummy API response simulation
  //     // Example response: { id: 1, username: "admin", token: "abc123", role: "admin" }
  //     const data = response.data;

  //     // Role-based validation
  //     if (data.role !== 'admin') {
  //       setError('Access denied. Admins only.');
  //       setLoading(false);
  //       return;
  //     }

  //     // Save token to localStorage (session/token-based auth)
  //     localStorage.setItem('authToken', data.token);
  //     localStorage.setItem('userRole', data.role);

  //     // Redirect to admin dashboard
  //     navigate('/createinterview');
  //   } catch (err) {
  //     setError('Invalid email or password.');
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   setError('');
  //   if (!email || !password) {
  //     setError('Please enter email and password');
  //     return;
  //   }
  //   if (email === "admin@gmail.com" && password === "123") {
  //     const token = "ADMIN_STATIC_TOKEN";
  //     localStorage.setItem("authToken", token);
  //     localStorage.setItem("userRole", "admin");
  //     navigate("/dashboard");
  //   } else {
  //     setError("Invalid email or password");
  //   }
  // };


// const handleLogin = async (e) => {
//   e.preventDefault();
//   setError("");

//   if (!email || !password) {
//     setError("Please enter email and password");
//     return;
//   }

//   try {
//     const response = await axios.post(
//       "https://interview.ksesystem.com//admin/login",
//       {
//         email: email,
//         password: password,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // If login successful
//     if (response.data.success) {
//       const token = response.data.token; // adjust if token key is different

//       localStorage.setItem("authToken", token);
//       localStorage.setItem("userRole", "admin");

//       navigate("/dashboard");
//     } else {
//       setError(response.data.message || "Invalid email or password");
//     }
//   } catch (error) {
//     if (error.response && error.response.data) {
//       setError(error.response.data.message || "Login failed");
//     } else {
//       setError("Server error. Please try again.");
//     }
//   }
// };


const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  if (!email || !password) {
    setError("Please enter email and password");
    setLoading(false);
    return;
  }

  try {
    const response = await axios.post(
      "https://interview.ksesystem.com/admin/login",
      { email, password }
    );

    console.log("LOGIN RESPONSE:", response.data);

    const { status, access_token, admin } = response.data;

    if (status === "login_success") {
      localStorage.setItem("authToken", access_token);
      localStorage.setItem("userRole", admin.role);
      localStorage.setItem("adminData", JSON.stringify(admin));

      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  } catch (error) {
    console.log("ERROR:", error.response?.data);
    setError(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
      }}
    >
      <Card
        className="p-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "20px",
          border: "none",
          boxShadow: "0 10px 10px rgba(0,0,0,0.2)",
        }}
      >
        <Card.Body>
          <Form onSubmit={handleLogin}>
            {/* Logo / Title */}
            <div className="text-center mb-4">
              <h2 style={{ fontWeight: "700", color: "#7167EF" }}>
                Admin Panel
              </h2>
              <p className="text-muted mb-0">Welcome back</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 text-center">
                {error}
              </div>
            )}

            {/* Email */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ background: "#f1f1f1" }}>
                <FeatherIcon icon="mail" size={16} />
              </InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ height: "45px" }}
              />
            </InputGroup>

            {/* Password */}
            <InputGroup className="mb-4">
              <InputGroup.Text style={{ background: "#f1f1f1" }}>
                <FeatherIcon icon="lock" size={16} />
              </InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ height: "45px" }}
              />
            </InputGroup>

            {/* Button */}
            <Button
              className="w-100"
              type="submit"
              disabled={loading}
              style={{
                height: "45px",
                borderRadius: "10px",
                background: "#7167EF",
                border: "none",
                fontWeight: "600",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Footer */}
            <div className="text-center mt-4">
              <small className="text-muted">
                © {new Date().getFullYear()} Interview Admin
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );

}
