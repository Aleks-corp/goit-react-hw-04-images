import React from 'react';
import styles from './Button.module.css';
import PropTypes from 'prop-types';

const Button = ({ type, onClick, children }) => (
  <button className={styles.Button} type={type} onClick={onClick}>
    {children}
  </button>
);

export default Button;

Button.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string,
};
