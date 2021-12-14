const ImagePopup = (props) => {
  return (
    <div
      className={`modal modal_type_image ${
        props.card.name ? 'modal_opened' : ''
      }`}
    >
      <div className='modal__container modal__container_image'>
        <button
          onClick={props.onClose}
          type='button'
          aria-label='Close button'
          className='modal__close-btn'
        />
        <img
          src={props.card.link}
          alt={props.card.name}
          className='modal__image'
        />
        <h2 className='modal__title'>{props.card.name}</h2>
      </div>
    </div>
  );
};

export default ImagePopup;
