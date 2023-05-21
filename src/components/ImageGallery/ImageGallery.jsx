import ImageGalleryItem from 'components/ImageGalleryItem';
import React from 'react';
import styles from './ImageGallery.module.css';
import PropTypes from 'prop-types';

const ImageGallery = ({ imageGalleryList, onClick }) => (
  <ul className={styles.ImageGallery}>
    {imageGalleryList.map(imageGalleryItm => (
      <li
        className={styles.ImageGalleryItem}
        key={imageGalleryItm.id}
        onClick={() => onClick(imageGalleryItm.id)}
      >
        <ImageGalleryItem imageGalleryItm={imageGalleryItm} />
      </li>
    ))}
  </ul>
);
export default ImageGallery;

ImageGallery.propTypes = {
  imageGalleryList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      webformatURL: PropTypes.string.isRequired,
      tags: PropTypes.string.isRequired,
    })
  ),
  onClick: PropTypes.func.isRequired,
};
