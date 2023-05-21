import React from 'react';
import styles from './ImageGalleryItem.module.css';
import PropTypes from 'prop-types';

const ImageGalleryItem = ({ imageGalleryItm }) => {
  const { webformatURL, tags } = imageGalleryItm;
  return (
    <img
      className={styles.ImageGalleryItemImage}
      src={webformatURL}
      alt={tags}
      loading="lazy"
    />
  );
};

export default ImageGalleryItem;

ImageGalleryItem.propTypes = {
  imageGalleryItm: PropTypes.shape({
    id: PropTypes.number.isRequired,
    webformatURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }),
};
