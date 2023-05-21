import React, { useState, useEffect } from 'react';
import { BiArrowToTop } from 'react-icons/bi';
import styles from './ScrollButton.module.css';

export default function ScrollButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);

    return () => {
      window.removeEventListener('scroll', toggleVisible);
    };
  }, []);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 250) {
      setVisible(true);
    } else if (scrolled <= 250) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
      /* you can also use 'auto' behaviour
               in place of 'smooth' */
    });
  };
  return (
    <button
      className={styles.ScrollButtonToTop}
      style={{ display: visible ? 'inline' : 'none' }}
    >
      <BiArrowToTop
        onClick={scrollToTop}
        style={{ display: visible ? 'inline' : 'none' }}
      />
    </button>
  );
}
