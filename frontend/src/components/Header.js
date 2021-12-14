import { useState, useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Link, useLocation } from 'react-router-dom';

import logo from '../images/logo.svg';
import HamburgerButton from './HamburgerButton';

const Header = ({ email, onSignout }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const loginUserCtx = useContext(CurrentUserContext).isLoggedIn;

  const menuHandler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={isMenuOpen ? 'header header__open' : 'header'}>
      <div className={isMenuOpen ? 'logo__container' : ''}>
        <img src={logo} alt='Around the U.S logo' className='logo' />
        {isMenuOpen && (
          <button
            onClick={menuHandler}
            type='button'
            aria-label='Close button'
            className='modal__close-btn menu__close-btn'
          />
        )}
      </div>
      {!isMenuOpen && <HamburgerButton toggleMenu={menuHandler} />}
      <ul className={!isMenuOpen ? 'nav' : 'nav nav__open'}>
        {loginUserCtx ? (
          <>
            <li className='nav__item nav__item_email'>{email}</li>
            <li>
              <button
                className='nav__item nav__item_button'
                onClick={onSignout}
              >
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                className='nav__item'
                to={location.pathname === '/register' ? '/login' : '/register'}
              >
                {location.pathname === '/register' ? 'Log in' : 'Sign up'}
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
};

export default Header;
