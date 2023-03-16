import React, { useState, useEffect, useRef } from 'react';

import { fetchImageGallery } from './axios';
import { PER_PAGE } from './constants';
import ImageGallery from './ImageGallery';
import SearchBar from './SearchBar';
import { Loader, LoaderForMoreImage } from './Loader';
import Modal from './Modal';
import ModalImage from './ModalImage';
import Button from './Button';

export function App() {
  const [imageGalleryList, setImageGalleryList] = useState([]);

  const [shownImageInModalSrc, setShownImageInModalSrc] = useState('');
  const [shownImageInModalAlt, setShownImageInModalAlt] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const sourceAbortToken = useRef(null);

  useEffect(() => {
    sourceAbortToken.current = new AbortController();
    console.log('sourceAbortMount', sourceAbortToken.current);
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchImageGallery(sourceAbortToken);
        setImageGalleryList([...response.hits]);
        setTotalPages(Math.ceil(Number(response.totalHits) / PER_PAGE));
        setNextPage(2);
      } catch (error) {
        console.log('App ~ error', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      sourceAbortToken.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function galleryMountFilteredById(newImageList) {
    //Поиск повторяющихся картинок и их фильтр
    //Чтобы не было проблем с повторяющимися ID
    const imageList = [...imageGalleryList];
    const imageIdList = [];
    imageList.map(imageItm => imageIdList.push(imageItm.id));
    newImageList.map(
      newImageItem =>
        !imageIdList.includes(newImageItem.id) && imageList.push(newImageItem)
    );
    //Добавление в state после проверки и фильтра
    setImageGalleryList(imageList);
  }

  const loadMoreImageHandler = async () => {
    try {
      setIsLoadMore(true);
      sourceAbortToken.current.abort();
      sourceAbortToken.current = new AbortController();
      const response = await fetchImageGallery(
        sourceAbortToken,
        searchValue,
        nextPage
      );
      galleryMountFilteredById(response.hits);
      //Добавление в state без проверки повторяющихся ID
      // this.setState({
      //   imageGalleryList: [...this.state.imageGalleryList, ...response.hits],
      // });
      setNextPage(prevState => prevState + 1);
    } catch (error) {
      console.log('App ~ error', error);
    } finally {
      setIsLoadMore(false);
    }
  };

  const onSubmitForm = async e => {
    try {
      e.preventDefault();
      if (searchValue === e.target[1].value.trim()) {
        e.target[1].value = '';
        return;
      }
      setIsLoading(true);
      sourceAbortToken.current.abort();
      sourceAbortToken.current = new AbortController();
      setSearchValue(e.target[1].value.trim());
      console.log('sourceAbortFinder', sourceAbortToken.current);
      const response = await fetchImageGallery(
        sourceAbortToken,
        e.target[1].value.trim()
      );
      setImageGalleryList([...response.hits]);
      setTotalPages(Math.ceil(Number(response.totalHits) / PER_PAGE));
      setNextPage(2);

      e.target[1].value = '';
    } catch (error) {
      console.log('App ~ error', error);
    } finally {
      setIsLoading(false);
    }
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
      {showModal && (
        <Modal onClose={toggleModal}>
          <ModalImage src={shownImageInModalSrc} alt={shownImageInModalAlt} />
        </Modal>
      )}
      {imageGalleryList.length > 0 && !isLoading && (
        <ImageGallery
          onClick={openImageInModal}
          imageGalleryList={imageGalleryList}
        />
      )}
      {isLoading && <Loader />}
      {imageGalleryList.length === 0 && (
        <p>Sorry, we din't find images, please try again</p>
      )}
      {isLoadMore ? (
        <LoaderForMoreImage />
      ) : (
        nextPage <= totalPages &&
        totalPages !== null &&
        !isLoading && (
          <Button type="button" onClick={loadMoreImageHandler}>
            Load More...
          </Button>
        )
      )}
    </div>
  );
}

// export class App extends Component {
//   state = {
//     imageGalleryList: [],

//     shownImageInModalSrc: '',
//     shownImageInModalAlt: '',

//     isLoading: false,
//     isLoadMore: false,
//     searchValue: null,
//     nextPage: null,
//     totalPages: null,
//     showModal: false,
//   };

//   async componentDidMount() {
//     try {
//       this.setState({ isLoading: true });
//       const response = await fetchImageGallery();
//       this.setState({
//         imageGalleryList: [...response.hits],
//         totalPages: Math.ceil(Number(response.totalHits) / PER_PAGE),
//         nextPage: 2,
//       });
//     } catch (error) {
//       console.log('App ~ error', error);
//     } finally {
//       this.setState({ isLoading: false });
//     }
//   }

//   galleryMountFilteredById(newImageList) {
//     //Поиск повторяющихся картинок и их фильтр
//     //Чтобы не было проблем с повторяющимися ID
//     const imageList = [...this.state.imageGalleryList];
//     const imageIdList = [];
//     imageList.map(imageItm => imageIdList.push(imageItm.id));
//     newImageList.map(
//       newImageItem =>
//         !imageIdList.includes(newImageItem.id) && imageList.push(newImageItem)
//     );
//     //Добавление в state после проверки и фильтра
//     this.setState({ imageGalleryList: imageList });
//   }

//   loadMoreImageHandler = async () => {
//     try {
//       this.setState({ isLoadMore: true });
//       const response = await fetchImageGallery(
//         this.state.searchValue,
//         this.state.nextPage
//       );
//       this.galleryMountFilteredById(response.hits);
//       //Добавление в state без проверки повторяющихся ID
//       // this.setState({
//       //   imageGalleryList: [...this.state.imageGalleryList, ...response.hits],
//       // });
//       this.setState(prevState => ({ nextPage: prevState.nextPage + 1 }));
//     } catch (error) {
//       console.log('App ~ error', error);
//     } finally {
//       this.setState({ isLoadMore: false });
//     }
//   };

//   onSubmitForm = async e => {
//     try {
//       e.preventDefault();
//       if (this.state.searchValue === e.target[1].value.trim()) {
//         e.target[1].value = '';
//         return;
//       }
//       this.setState({ isLoading: true });

//       this.setState({ searchValue: e.target[1].value.trim() });

//       const response = await fetchImageGallery(e.target[1].value.trim());
//       this.setState({
//         imageGalleryList: [...response.hits],
//         totalPages: Math.ceil(Number(response.totalHits) / PER_PAGE),
//         nextPage: 2,
//       });
//       e.target[1].value = '';
//     } catch (error) {
//       console.log('App ~ error', error);
//     } finally {
//       this.setState({ isLoading: false });
//     }
//   };
//   toggleModal = () => {
//     this.setState(({ showModal }) => ({
//       showModal: !showModal,
//     }));
//   };
//   openImageInModal = id => {
//     const selectedImage = this.state.imageGalleryList.find(
//       imageOption => imageOption.id === id
//     );

//     this.setState({
//       shownImageInModalSrc: selectedImage.largeImageURL,
//       shownImageInModalAlt: selectedImage.tags,
//     });

//     this.toggleModal();
//   };

//   render() {
//     const {
//       imageGalleryList,
//       nextPage,
//       totalPages,
//       isLoading,
//       isLoadMore,
//       showModal,
//       shownImageInModalAlt,
//       shownImageInModalSrc,
//     } = this.state;
//     return (
//       <div className="App">
//         <SearchBar onSubmit={this.onSubmitForm} />
//         {showModal && (
//           <Modal onClose={this.toggleModal}>
//             <ModalImage src={shownImageInModalSrc} alt={shownImageInModalAlt} />
//           </Modal>
//         )}
//         {imageGalleryList.length > 0 && !isLoading && (
//           <ImageGallery
//             onClick={this.openImageInModal}
//             imageGalleryList={imageGalleryList}
//           />
//         )}
//         {isLoading && <Loader />}
//         {imageGalleryList.length === 0 && (
//           <p>Sorry, we din't find images, please try again</p>
//         )}
//         {isLoadMore ? (
//           <LoaderForMoreImage />
//         ) : (
//           nextPage <= totalPages &&
//           totalPages !== null &&
//           !isLoading && (
//             <Button type="button" onClick={this.loadMoreImageHandler}>
//               Load More...
//             </Button>
//           )
//         )}
//       </div>
//     );
//   }
// }
