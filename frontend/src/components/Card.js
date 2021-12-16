import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const Card = (props) => {
  const currentUserCtx = useContext(CurrentUserContext).currentUser;
  const { _id } = currentUserCtx;

  const handleClick = () => {
    props.onCardClick(props.card);
  };

  const handleLikeClick = () => {
    props.onCardLike(props.card);
  };

  const handleDeleteClick = () => {
    props.onCardDelete(props.card);
  };

  const isOwn = props.card.owner === _id;

  const isLiked = currentUserCtx && props.card.likes.includes(_id);
  // const isLiked = props.card.likes.some((i) => i._id === _id);

  const cardDeleteButtonClassName = `card__delete-button ${
    isOwn ? '' : 'card__delete-button_hidden'
  }`;
  const isLikedButtonClassName = `card__like-button ${
    isLiked ? 'card__like-button_active' : ''
  }`;

  return (
    <li className='card__container'>
      <article className='card'>
        <button
          onClick={handleDeleteClick}
          className={cardDeleteButtonClassName}
          type='button'
          aria-label='delete image'
        />
        <img
          onClick={handleClick}
          className='card__image'
          src={props.card.link}
          alt={props.card.name}
        />
        <div className='card__caption'>
          <h2 className='card__name'>{props.card.name}</h2>
          <div className='card__like-container'>
            <button
              onClick={handleLikeClick}
              className={isLikedButtonClassName}
              type='button'
              aria-label='like button'
            />
            <p className='card__likes'>{props.card.likes.length}</p>
          </div>
        </div>
      </article>
    </li>
  );
};

export default Card;
