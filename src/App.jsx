// third party
import { RouterProvider } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

// project imports
import router from 'routes';

// -----------------------|| APP ||-----------------------//

export default function App() {
  return <RouterProvider router={router} />;
}
