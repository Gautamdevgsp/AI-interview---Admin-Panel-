import React, { useState, useEffect } from 'react';
import { ListGroup, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import navigation from 'menu-items';
import { BASE_TITLE } from 'config/constant';

export default function Breadcrumb() {
  const [main, setMain] = useState({});
  const [item, setItem] = useState({});
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');

    setTimeout(() => {
      navigate('/', { replace: true });
    }, 10);

  };


  useEffect(() => {
    let found = false;

    const findItem = (items) => {
      items.forEach((group) => {
        if (group.type === 'group' && group.children) {
          group.children.forEach((child) => {
            if (
              child.type === 'item' &&
              location.pathname.startsWith(child.url)
            ) {
              setMain(group);
              setItem(child);
              found = true;
            }
          });
        }
      });
    };

    findItem(navigation.items);

    // ✅ HANDLE INTERVIEW DETAILS PAGE
    if (
      location.pathname.includes('/interviews/') &&
      location.pathname.includes('/details')
    ) {
      setMain({ title: '' });
      setItem({
        title: 'Details',
        parent: 'Results'
      });
      found = true;
    }

    // Dashboard fallback
    if (!found && location.pathname === '/dashboard') {
      setMain({ title: '' });
      setItem({ title: 'Dashboard' });
    }

  }, [location.pathname]);


  //   useEffect(() => {
  //   if (item?.title) {
  //     document.title = item.title + BASE_TITLE;
  //   }
  // }, [item]);


  return (
    <div className="page-header" style={{ zIndex: '1', top: '0' }}>
      <div className="page-block">
        <Row className="align-items-center">
          <Col xs={8} md={8}>
            <div className="page-header-title">
              <h5 className="m-b-10">{item.title}</h5>
            </div>
            <ListGroup as="ul" bsPrefix=" " className="breadcrumb">
              <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
                <Link to="/dashboard">Home</Link>
              </ListGroup.Item>
              {/* Results (parent) */}
              {item.parent && (
                <ListGroup.Item as="li" className="breadcrumb-item">
                  <Link to="/detailedresult">{item.parent}</Link>
                </ListGroup.Item>
              )}
              {main.title && (
                <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
                  <Link to="#">{main.title}</Link>
                </ListGroup.Item>
              )}
              <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
                <Link to="#">{item.title}</Link>
              </ListGroup.Item>
            </ListGroup>

          </Col>
          {main.title === 'Layouts' && (
            <Col md={4} className="text-md-end action_button">
              <Button variant="secondary" size="sm" className="rounded-pill">
                Action
              </Button>
              <div className="btn-group ms-2">
                <Dropdown>
                  <Dropdown.Toggle variant="primary" size="sm" className="arrow-none rounded-pill">
                    <FeatherIcon icon="plus" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-end">
                    <Dropdown.Item as={Link} to="#">
                      Action
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="#">
                      Another action
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="#">
                      Something else here
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
          )}

          {/* <Col md={4} className="d-flex justify-content-end align-items-center">
            <Button variant="danger" size="sm" className="rounded" onClick={handleLogout}>
              <FeatherIcon icon="log-out" className="me-1" />
              Logout
            </Button>
          </Col> */}

          <Col
            xs={4}
            md={4}
            className="d-flex justify-content-md-end justify-content-end mt-2 mt-md-0"
          >
            <Button variant="danger" size="sm" className="rounded" onClick={handleLogout}>
              <FeatherIcon icon="log-out" className="me-1" />
              Logout
            </Button>
          </Col>

        </Row>
      </div>
    </div>
  );
}
