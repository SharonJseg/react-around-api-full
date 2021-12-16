import PopupWithForm from './PopupWithForm';
import { useEffect, useState } from 'react';

const AddPlacePopup = (props) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    setTitle('');
    setLink('');
  }, [props.isOpen]);

  const handleTitleChange = (evt) => {
    setTitle(evt.target.value);
  };

  const handleLinkChange = (evt) => {
    setLink(evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.onAddPlaceSubmit({
      title,
      url: link,
    });
  };

  return (
    <PopupWithForm
      name='add-place'
      title='New Place'
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        onChange={handleTitleChange}
        type='text'
        name='title'
        id='title'
        value={title}
        placeholder='Title'
        className='form__text-input form__text-input_type_title'
        minLength='1'
        maxLength='30'
        required
        pattern='.*\S.*'
      />
      <span className='form__validation-error form__validation-error_type_title'></span>
      <input
        onChange={handleLinkChange}
        type='url'
        name='link'
        id='url'
        value={link}
        placeholder='Image link'
        className='form__text-input form__text-input_type_url'
        required
      />
      <span className='form__validation-error form__validation-error_type_url'></span>
    </PopupWithForm>
  );
};

export default AddPlacePopup;
