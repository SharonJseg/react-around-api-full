import '../index.css';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { useCallback, useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';

import api from '../utils/api';
import * as auth from '../utils/auth';

function App() {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState({});
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [infoToolTipValues, setInfoToolTipValues] = useState({
    isOpen: false,
    success: true,
  });
  const [email, setEmail] = useState('');

  const closeAllPopups = useCallback(() => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
    setInfoToolTipValues({
      ...infoToolTipValues,
      isOpen: false,
    });
  }, [infoToolTipValues]);
  const [token, setToken] = useState(localStorage.getItem('jwt'));

  const handleAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (props) => {
    setSelectedCard(props);
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked, token)
      .then((newCard) => {
        const { data } = newCard;
        setCards((cards) => cards.map((c) => (c._id === card._id ? data : c)));
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteCard = (card) => {
    api
      .deleteCard(card._id, token)
      .then(() => {
        setCards(cards.filter((item) => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateUser = (userInfo) => {
    api
      .updateUserInfo(userInfo, token)
      .then((updateUserDetails) => {
        setCurrentUser(updateUserDetails.data);
      })
      .catch((err) => console.log(err));

    closeAllPopups();
  };

  const handleUpdateAvatar = ({ avatar }) => {
    api
      .updateUserImage(avatar, token)
      .then((updateUserImage) => {
        setCurrentUser(updateUserImage.data);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const handleAddPlaceSubmit = (place) => {
    api
      .addNewCard(place, token)
      .then((newCard) => {
        setCards([newCard.data, ...cards]);
      })
      .catch((err) => console.log(err));
    closeAllPopups();
  };

  const handleSuccessTooltip = () => {
    setInfoToolTipValues({
      success: true,
      isOpen: true,
    });
  };

  const handleFailureTooltip = () => {
    setInfoToolTipValues({
      success: false,
      isOpen: true,
    });
  };

  const handleRegister = (email, password) => {
    auth
      .register(email, password)
      .then(() => {
        handleSuccessTooltip();
        history.push('/login');
      })
      .catch((err) => {
        handleFailureTooltip();
        console.log(err);
      });
  };

  const handleLogin = ({ email, password }) => {
    auth
      .login({ email, password })
      .then((res) => {
        // setEmail(email);
        setToken(res.token);
        setIsLoggedIn(true);
        history.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSignout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('jwt');
    history.push('/');
    setEmail('');
    // resets currrent User
    setCurrentUser({});
  };

  useEffect(() => {
    if (token) {
      auth
        .validateToken(token)
        .then((res) => {
          const { email } = res.data;
          setIsLoggedIn(true);
          setEmail(email);
          history.push('/');
        })
        .catch((err) => console.log(err));
    } else {
      setIsLoggedIn(false);
    }
  }, [token, history]);

  useEffect(() => {
    if (token) {
      api
        .getUserInfo(token)
        .then((res) => {
          setCurrentUser(res.data);
          api
            .getInitialCards(token)
            .then((cards) => {
              setCards(cards.data);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  }, [token]);

  useEffect(() => {
    // closing all popups with the esc
    const closeByEsc = (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    };
    document.addEventListener('keydown', closeByEsc);
    return () => document.removeEventListener('keydown', closeByEsc);
  }, [closeAllPopups]);

  return (
    <CurrentUserContext.Provider value={{ currentUser, isLoggedIn }}>
      <div className='page__container'>
        <main>
          <Header email={email} onSignout={handleSignout} />
          <Switch>
            <ProtectedRoute
              path='/'
              exact
              component={Main}
              onEditAvatarClick={handleAvatarClick}
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleDeleteCard}
            />
            <Route path='/login'>
              <Login onLogin={handleLogin} />
            </Route>
            <Route path='/register'>
              <Register onRegister={handleRegister} />
            </Route>
            <Route path='/'>
              {isLoggedIn ? <Redirect to='/' /> : <Redirect to='/login' />}
            </Route>
          </Switch>
          {isLoggedIn && <Footer />}
          <PopupWithForm
            name='delete-card'
            title='Are you sure?'
            titleModifier='form__heading_type_delete-card'
            submitModifier='form__submit-btn_type_delete-card'
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleAddPlaceSubmit}
          />

          <InfoTooltip
            isOpen={infoToolTipValues.isOpen}
            success={infoToolTipValues.success}
            onClose={closeAllPopups}
          />

          {selectedCard && (
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          )}
        </main>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
