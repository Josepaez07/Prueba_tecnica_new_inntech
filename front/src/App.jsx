import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EnrutadorApp from './routes/EnrutadorApp';

const router = createBrowserRouter(EnrutadorApp);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
