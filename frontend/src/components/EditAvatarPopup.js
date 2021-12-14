import { useRef } from 'react';
import PopupWithForm from './PopupWithForm';

const EditAvatarPopup = (props) => {
  const avatar = useRef('');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.onUpdateAvatar({
      avatar: avatar.current.value,
    });
  };

  return (
    <PopupWithForm
      name='edit-image'
      title='Change profile picture'
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        ref={avatar}
        type='url'
        name='avatar'
        id='avatar'
        placeholder='Add image url'
        className='form__text-input form__text-input_type_avatar'
        required
      />
      <span className='form__validation-error form__validation-error_type_avatar'></span>
    </PopupWithForm>
  );
};

export default EditAvatarPopup;
