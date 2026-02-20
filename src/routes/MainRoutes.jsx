import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import AdminLayout from 'layouts/AdminLayout';
import GuestLayout from 'layouts/GuestLayout';
import CreateInterview from '../views/ui-elements/new-pages/CreateInterview';
import AssignInterview from '../views/ui-elements/new-pages/AssignInterview';
import Result from '../views/ui-elements/new-pages/Result';
import AttemptTracking from '../views/ui-elements/new-pages/AttemptTracking';
import DetailResult from '../views/ui-elements/new-pages/DetailResult';
import RegisterUser from '../views/ui-elements/new-pages/RegisterUser';
import DashSales from '../views/dashboard/DashSales'; 

const Typography = lazy(() => import('../views/ui-elements/basic/BasicTypography'));
const Color = lazy(() => import('../views/ui-elements/basic/BasicColor'));

const FeatherIcon = lazy(() => import('../views/ui-elements/icons/Feather'));
const FontAwesome = lazy(() => import('../views/ui-elements/icons/FontAwesome'));
const MaterialIcon = lazy(() => import('../views/ui-elements/icons/Material'));

const Login = lazy(() => import('../views/auth/login'));
const Register = lazy(() => import('../views/auth/register'));

const Mngques = lazy(() => import('../views/ui-elements/new-pages/Mngques'));

// const MainRoutes = {
//   path: '/',
//   children: [
//     {
//       path: '/',
//       element: <AdminLayout />,
//       children: [
//         {
//           path: '/createinterview',
//           element: <CreateInterview />
//         },
//         {
//           path: '/mngques',
//           element: <Mngques />
//         },
//         {
//           path: '/assigninterview',
//           element: <AssignInterview />
//         },
//         {
//           path: '/admin/interviews/:interviewId/students/:email/details',
//           element: <Result />
//         },
//         {
//           path: '/attempttrack',
//           element: <AttemptTracking />
//         },
//         {
//           path: '/detailedResult',
//           element: <DetailResult/>
//         },
//         {
//           path: '/registeruser',
//           element: <RegisterUser/>
//         },
//         {
//           path: '/typography',
//           element: <Typography />
//         },
//         {
//           path: '/color',
//           element: <Color />
//         },
//         {
//           path: '/icons/Feather',
//           element: <FeatherIcon />
//         },
//         {
//           path: '/icons/font-awesome-5',
//           element: <FontAwesome />
//         },
//         {
//           path: '/icons/material',
//           element: <MaterialIcon />
//         }
//       ]
//     },
//     {
//       path: '/',
//       element: <GuestLayout />,
//       children: [
//         {
//           path: '/login',
//           element: <Login />
//         },
//         {
//           path: '/register',
//           element: <Register />
//         }
//       ]
//     }
//   ]
// };

// const MainRoutes = {
//   path: '/',
//   children: [
//     // LOGIN FIRST
//     {
//       index: true,
//       element: <Login />
//     },

//     //  LOGIN ROUTE
//     {
//       path: 'login',
//       element: (
   
//           <Login />
       
//       )
//     },

//     //  ADMIN ROUTES (after login)
//     {
//       path: '/',
//       element: <AdminLayout />,
//       children: [
//         { path: 'createinterview', element: <CreateInterview /> },
//         { path: 'assigninterview', element: <AssignInterview /> },
//         { path: 'attempttrack', element: <AttemptTracking /> },
//         { path: 'detailedResult', element: <DetailResult /> },
//         { path: 'registeruser', element: <RegisterUser /> },
//         { path: 'mngques', element: <Mngques/> },
//         { path: 'admin/interviews/:interviewId/students/:email/details', element: <Result /> }
//       ]
//     }
//   ]
// };


const isAuthenticated = () => !!localStorage.getItem('authToken');

// ✅ PROTECTED ROUTE WRAPPER
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

const MainRoutes = [
  // ----------------- LANDING PAGE -----------------
  {
    path: '/',
    element: <Login />
  },

  // ----------------- GUEST PAGES -----------------
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      { path: 'register', element: <Register /> }
    ]
  },

  // ADMIN PAGES 
  {
    path: '/',
    element: (
     <ProtectedRoute>
        <AdminLayout />
     </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element:<DashSales/> },
      { path: 'createinterview', element: <CreateInterview /> },
      { path: 'assigninterview', element: <AssignInterview /> },
      { path: 'attempttrack', element: <AttemptTracking /> },
      { path: 'detailedResult', element: <DetailResult /> },
      { path: 'registeruser', element: <RegisterUser /> },
      { path: 'mngques', element: <Mngques /> },
      { path: 'interviews/:interviewId/students/:email/details', element: <Result /> },
      { path: '', element: <Navigate to="createinterview" replace /> } // default admin page
    ]
  }
];

export default MainRoutes;
