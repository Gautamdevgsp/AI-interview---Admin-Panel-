// react-bootstrap
import { Row, Col, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';

// third party
import Chart from 'react-apexcharts';

// charts
import { SalesCustomerSatisfactionChartData } from './chart/sales-customer-satisfication-chart';
import { SalesAccountChartData } from './chart/sales-account-chart';
import { SalesSupportChartData } from './chart/sales-support-chart';
import { SalesSupportChartData1 } from './chart/sales-support-chart1';

import { FaClipboardList, FaPlayCircle, FaBan, FaUserGraduate, FaTasks, FaChartLine } from 'react-icons/fa';

// function SummaryCard({ title, value, color, icon: Icon }) {
//   return (
//     <Card className="shadow-sm border-0 h-100">
//       <Card.Body className="text-center">
//         <h6 className="text-muted">{title}</h6>
//         <h2 className={`fw-bold text-${color}`}>{value}</h2>

//         <div className={`mb-2 text-${color}`} style={{ fontSize: '28px' }}>
//           {Icon && <Icon />}
//         </div>
//       </Card.Body>
//     </Card>
//   );
// }


// const SummaryCard = ({ title, value, color, icon: Icon }) => {
//   return (
//     <Card className="shadow-sm border-0 h-100">
//       <Card.Body className="d-flex justify-content-between align-items-start">

//         <div>
//           <h6 className="text-muted mb-1">{title}</h6>
//           <h3 className="fw-bold mb-0">{value}</h3>
//         </div>

//         <div className={`bg-${color} bg-opacity-10 p-3 rounded-circle`}>
//           <Icon size={24} className={`text-${color}`} />
//         </div>

//       </Card.Body>
//     </Card>
//   );
// };


const SummaryCard = ({ title, value, color, icon: Icon }) => {
  return (
    <Card className="summary-card border-0 h-100">
      <Card.Body className="d-flex flex-column justify-content-between">

        {/* Title */}
        <h6 className="summary-title">{title}</h6>

        {/* Value + Icon */}
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="summary-value">{value}</h2>

          <div className={`summary-icon text-${color}`}>
            <Icon size={20} />
          </div>
        </div>

      </Card.Body>
    </Card>
  );
};



// ---------------- DASHBOARD ----------------
export default function DashSales() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    axios
      .get('https://interview.ksesystem.com/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'ngrok-skip-browser-warning': 'true'
        }
      })
      .then((res) => {
        console.log('Dashboard API response:', res.data);
        setDashboardData(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!dashboardData) return <p>Loading dashboard...</p>;

  const summary = dashboardData?.summary;

  return (
    <>
      {/*  SUMMARY BOXES  */}
      <Row className="mb-4 g-4 " style={{ paddingTop: '0' }}>
        <Col md={6} xl={3}>
          <SummaryCard title="Total Interviews" value={summary.total_interviews} color="primary" icon={FaClipboardList} />
        </Col>
        <Col md={6} xl={3}>
          <SummaryCard title="Active Interviews" value={summary.active_interviews} color="success" icon={FaPlayCircle} />
        </Col>
        <Col md={6} xl={3}>
          <SummaryCard title="Blocked Interviews" value={summary.blocked_interviews} color="danger" icon={FaBan} />
        </Col>
        <Col md={6} xl={3}>
          <SummaryCard title="Students" value={summary.total_students} color="info" icon={FaUserGraduate} />
        </Col>
        <Col md={6} xl={3}>
          <SummaryCard title="Assignments" value={summary.total_assignments} color="warning" icon={FaTasks} />
        </Col>
        <Col md={6} xl={3}>
          <SummaryCard title="Completion Rate" value={summary.completion_rate} color="secondary" icon={FaChartLine} />
        </Col>
      </Row>

      {/* CHART SECTION */}
      <Row className="g-4">
        <Col md={12} xl={6}>
          <Card className="metric-card border-0 h-75">
            <Card.Body>
              <div className="metric-top">
                <h2 className="metric-value">
                  {summary.completion_rate}
                </h2>
                <span className="metric-label">Completion Rate</span>
              </div>

              <p className="metric-desc">
                Completed interview attempts vs total assignments.
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12} xl={6}>
          <Card className="metric-card border-0 h-75">
            <Card.Body>
              <div className="metric-top">
                <h2 className="metric-value">
                  {summary.total_attempts}
                </h2>
                <span className="metric-label">Total Attempts</span>
              </div>

              <p className="metric-desc">
                Total interview attempts by students.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>


      {/* ================= SALES / PIE ================= */}
    </>
  );
}
