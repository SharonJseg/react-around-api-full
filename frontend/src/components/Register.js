import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = (props) => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const onChangeHandler = (evt) => {
    const { name, value } = evt.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.onRegister(values);
  };

  return (
    <div className='form-page'>
      <form className='form-page__container' onSubmit={handleSubmit}>
        <h1 className='form-page__title'>Sign up</h1>
        <input
          className='form-page__input'
          type='email'
          name='email'
          placeholder='Email'
          value={values.email}
          onChange={onChangeHandler}
        />
        <input
          className='form-page__input'
          type='password'
          name='password'
          value={values.password}
          placeholder='Password'
          onChange={onChangeHandler}
        />
        <button type='submit' className='form-page__button'>
          Sign up
        </button>
        <Link className='form-page__link' to='/login'>
          Already a member? log in here!
        </Link>
      </form>
    </div>
  );
};

export default Register;
