import axios from 'axios';

import { PER_PAGE, API_KEY } from './constants';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export const fetchImageGallery = async (
  source,
  searchValue = null,
  page = 1
) => {
  const response = await axios.get('', {
    params: {
      key: API_KEY,
      q: searchValue,
      image_type: 'photo',
      orientation: 'horizontal',
      per_page: PER_PAGE,
      page: page,
    },
    cancelToken: source.token,
  });

  return response.data;
};
