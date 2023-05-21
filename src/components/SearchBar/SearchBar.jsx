import React from 'react';
import { BiSearch } from 'react-icons/bi';
import styles from './SearchBar.module.css';
import PropTypes from 'prop-types';

const SearchBar = ({ onSubmit }) => (
  <header className={styles.Searchbar}>
    <form className={styles.SearchForm} onSubmit={e => onSubmit(e)}>
      <button type="submit" className={styles.SearchFormButton}>
        <BiSearch className={styles.SearchFormIcon} />
      </button>

      <input
        className={styles.SearchFormInput}
        type="text"
        autoComplete="off"
        autoFocus
        placeholder="Search images and photos"
      />
    </form>
  </header>
);

export default SearchBar;

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
