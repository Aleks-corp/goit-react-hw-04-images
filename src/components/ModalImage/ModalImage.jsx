import React from 'react';
import styles from './ModalImage.module.css';
import PropTypes from 'prop-types';
// import { CgClose } from 'react-icons/cg';

const ModalImage = ({ src, alt }) => (
  <img className={styles.ModalImage} src={src} alt={alt} loading="lazy" />
);

export default ModalImage;

ModalImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};
