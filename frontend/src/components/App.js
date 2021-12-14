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

  useEffect(() => {
    const closeByEsc = (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    };

    document.addEventListener('keydown', closeByEsc);

    const token = localStorage.getItem('jwt');

    const validateUser = (token) => {
      auth
        .validateToken(token)
        .then((user) => {
          const { email } = user.data;
          setEmail(email);
          setIsLoggedIn(true);
          history.push('/');
        })
        .then(() => {
          api
            .getAllInfo(token)
            .then(([cardArray, userInfo]) => {
              setCards(cardArray);
              setCurrentUser(userInfo);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    };

    if (token) {
      validateUser(token);
    }

    return () => document.removeEventListener('keydown', closeByEsc);
  }, [history, closeAllPopups]);

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

  // const closeAllPopups = () => {
  //   setIsEditAvatarPopupOpen(false);
  //   setIsEditProfilePopupOpen(false);
  //   setIsAddPlacePopupOpen(false);
  //   setSelectedCard({});
  //   setInfoToolTipValues({
  //     ...infoToolTipValues,
  //     isOpen: false
  //   });
  // };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteCard = (card) => {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((item) => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateUser = (userInfo) => {
    api
      .updateUserInfo(userInfo)
      .then((updateUserDetails) => {
        setCurrentUser(updateUserDetails);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateAvatar = ({ avatar }) => {
    api
      .updateUserImage(avatar)
      .then((updateUserImage) => {
        setCurrentUser(updateUserImage);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const handleAddPlaceSubmit = (place) => {
    api
      .addNewCard(place)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => console.log(err));
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
      .then(() => {
        setEmail(email);
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
  };

  return (
    <div className='page__container'>
      <main>
        <CurrentUserContext.Provider value={{ currentUser, isLoggedIn }}>
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
        </CurrentUserContext.Provider>
      </main>
    </div>
  );
}

export default App;
