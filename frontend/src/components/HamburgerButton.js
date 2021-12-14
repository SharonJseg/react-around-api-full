const HamburgerButton = (props) => {
  const toggleMenuHandler = () => {
    props.toggleMenu();
  };

  return (
    <div className='hamburger' onClick={toggleMenuHandler}>
      <div className='hamburger__line'></div>
      <div className='hamburger__line'></div>
      <div className='hamburger__line'></div>
    </div>
  );
};

export default HamburgerButton;
