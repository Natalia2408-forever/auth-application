import { Outlet } from 'react-router-dom';

export const App = () => (
  <>
    <h1 hidden>TodoApp</h1>
    <Outlet />
  </>
);
