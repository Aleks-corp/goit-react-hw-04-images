import React, { useState, useEffect } from 'react';

import { fetchImageGallery } from './axios';
import { PER_PAGE } from './constants';
import ImageGallery from './ImageGallery';
import SearchBar from './SearchBar';
import { Loader, LoaderForMoreImage } from './Loader';
import Modal from './Modal';
import ModalImage from './ModalImage';
import Button from './Button';
import ScrollButton from './ScrollButton';

export function App() {
  const [imageGalleryList, setImageGalleryList] = useState([]);

  const [shownImageInModalSrc, setShownImageInModalSrc] = useState('');
  const [shownImageInModalAlt, setShownImageInModalAlt] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  //New search by VALUE
  useEffect(() => {
    if (!searchValue) {
      return;
    }
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await fetchImageGallery(searchValue);
        setImageGalleryList([...response.hits]);
        setTotalPages(Math.ceil(Number(response.totalHits) / PER_PAGE));
        setPage(1);
      } catch (error) {
        console.log('App ~ error', error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [searchValue]);

  //New request for next page
  useEffect(() => {
    if (page === 1) {
      return;
    }
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setIsLoadMore(true);
        setError('');
        const response = await fetchImageGallery(searchValue, page);
        //Search for duplicate images and their filter
        galleryListFilteredById(response.hits);
        //Add to state without checking repeated images by ID
        // setImageGalleryList(
        //    [...imageGalleryList, ...response.hits]
        // );
      } catch (error) {
        console.log('App ~ error', error.message);
        setError(error.message);
      } finally {
        setIsLoadMore(false);
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  //Search for duplicate images and their filter
  //So that there are no problems with duplicate IDs
  function galleryListFilteredById(newImageList) {
    const imageList = [...imageGalleryList];
    const imageIdList = [];
    imageList.map(imageItm => imageIdList.push(imageItm.id));
    newImageList.map(
      newImageItem =>
        !imageIdList.includes(newImageItem.id) && imageList.push(newImageItem)
    );
    //Adding to state after validation and filter
    setImageGalleryList(imageList);
  }

  const loadMoreImageHandler = () => {
    setPage(page + 1);
  };

  const onSubmitForm = e => {
    e.preventDefault();
    if (searchValue === e.target[1].value.trim()) {
      e.target[1].value = '';
      return;
    }
    setSearchValue(e.target[1].value.trim());
    e.target[1].value = '';
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const openImageInModal = id => {
    const selectedImage = imageGalleryList.find(
      imageOption => imageOption.id === id
    );
    setShownImageInModalSrc(selectedImage.largeImageURL);
    setShownImageInModalAlt(selectedImage.tags);
    toggleModal();
  };

  return (
    <div className="App">
      <SearchBar onSubmit={onSubmitForm} />

      {imageGalleryList.length > 0 && !isLoading && (
        <ImageGallery
          onClick={openImageInModal}
          imageGalleryList={imageGalleryList}
        />
      )}

      {isLoading && <Loader />}

      {imageGalleryList.length === 0 && searchValue && !isLoading && (
        <p
          style={{
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          Sorry, we din't find any images for "{searchValue}" request, please
          try again...
        </p>
      )}

      {error && <p className="Notification">{error}</p>}

      {isLoadMore ? (
        <LoaderForMoreImage />
      ) : (
        page < totalPages &&
        totalPages !== 0 &&
        !isLoading && (
          <Button type="button" onClick={loadMoreImageHandler}>
            Load More...
          </Button>
        )
      )}

      {showModal && (
        <Modal onClose={toggleModal}>
          <ModalImage src={shownImageInModalSrc} alt={shownImageInModalAlt} />
        </Modal>
      )}

      <ScrollButton />
    </div>
  );
}
