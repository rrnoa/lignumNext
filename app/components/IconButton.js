import React, { useState } from 'react';
//import './IconButton.css'; // Asegúrate de crear este archivo CSS con los estilos necesarios

const IconButton = ({ icon, activeIcon, onClick, isActive }) => {
  //const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    // Llama a la función onClick pasada como prop si existe
    if (onClick) {
      onClick();
    }
    //setIsActive(!isActive);
  };

  return (
    <button className={`icon-btn ${isActive ? 'active' : ''}`} onClick={handleClick}>
      <img className='btn-icons' src={isActive ? activeIcon : icon} alt="Icon" />
    </button>
  );
};

export default IconButton;
