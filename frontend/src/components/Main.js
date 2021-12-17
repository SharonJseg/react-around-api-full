import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';
import addIcn from '../images/add.svg';
import imagePlaceHolder from '../images/profile_image.png';

const Main = (props) => {
  const currentUserCtx = useContext(CurrentUserContext).currentUser;
  const { name, about, avatar } = currentUserCtx;

  return (
    <>
      <section className='profile'>
        <div className='profile__image-container'>
          <button
            onClick={props.onEditAvatarClick}
            type='button'
            aria-label='edit image button'
            className='profile__image-edit'
          />
          <img
            src={avatar ? avatar : imagePlaceHolder}
            alt={`Profile of ${name} - ${about}`}
            className='profile__image'
          />
        </div>
        <div className='profile__info'>
          <div className='profile__info-edit'>
            <h1 className='profile__name'>{name}</h1>
            <button
              onClick={props.onEditProfileClick}
              type='button'
              aria-label='edit profile button'
              className='profile__edit-btn'
            />
          </div>
          <p className='profile__job'>{about}</p>
        </div>
        <button
          onClick={props.onAddPlaceClick}
          className='profile__add-element-btn'
          type='button'
          aria-label='add picture button'
        >
          <img className='profile-icon' src={addIcn} alt='add element button' />
        </button>
      </section>
      {props.cards.length === 0 && (
        <section className='cards'>
          <div className='no-cards__container'>
            <h2 className='no-cards__title'>
              Wow it seems nobody has added any cards yet, be the first and
              click here
            </h2>
            <button
              onClick={props.onAddPlaceClick}
              className='profile__add-element-btn no-cards__button-centered'
              type='button'
              aria-label='add picture button'
            >
              <img
                className='profile-icon'
                src={addIcn}
                alt='add element button'
              />
            </button>
          </div>
        </section>
      )}
      <section className='cards'>
        <ul className='cards__container'>
          {props.cards.map((cardElement) => (
            <Card
              key={cardElement._id}
              card={cardElement}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          ))}
        </ul>
      </section>
    </>
  );
};

export default Main;
