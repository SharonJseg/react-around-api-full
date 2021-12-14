import successIcon from '../images/success.svg';
import errorIcon from '../images/failure.svg';

const InfoTooltip = (props) => {
  let src, alt, title;

  if (props.success === true) {
    src = successIcon;
    alt = 'success icon';
    title = 'Success! You have now been registered.';
  } else {
    src = errorIcon;
    alt = 'failure icon';
    title = 'Oops, something went wrong! Please try again.';
  }

  return (
    <div className={`modal ${props.isOpen ? 'modal_opened' : ''}`}>
      <div className='modal__container modal__container_tooltip'>
        <button
          onClick={props.onClose}
          type='button'
          aria-label='Close button'
          className='modal__close-btn tooltip__close-btn'
        />
        <img src={src} alt={alt} className='tooltip__icon' />
        <h2 className='tooltip__text'>{title}</h2>
      </div>
    </div>
  );
};

export default InfoTooltip;
