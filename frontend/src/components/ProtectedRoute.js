import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, loggedIn, ...props }) => {
  const loginUserCtx = useContext(CurrentUserContext).isLoggedIn;

  return (
    <Route {...props}>
      {() =>
        loginUserCtx ? <Component {...props} /> : <Redirect to='/login' />
      }
    </Route>
  );
};

export default ProtectedRoute;
