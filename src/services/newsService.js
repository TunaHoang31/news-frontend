import axios from '../setup/axios';

export const fetchCategories = () => {
    return axios.get('/api/v1/news/categories');
}

export const fetchArticles = (params = {}) => {
    const { page = 1, limit = 10, categoryId, keyword, sortBy, sortOrder } = params;
    const query = new URLSearchParams({ page, limit });
    if (categoryId) query.set('categoryId', categoryId);
    if (keyword) query.set('keyword', keyword);
    if (sortBy) query.set('sortBy', sortBy);
    if (sortOrder) query.set('sortOrder', sortOrder);
    return axios.get(`/api/v1/news/articles?${query.toString()}`);
}

export const fetchArticleBySlug = (slug) => {
    return axios.get(`/api/v1/news/articles/${slug}`);
}


