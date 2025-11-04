import axios from '../setup/axios';

export const fetchCategories = () => {
    return axios.get('/api/v1/news/categories');
}

export const fetchArticles = (params = {}) => {
    const { page = 1, limit = 10, categoryId, keyword } = params;
    const query = new URLSearchParams({ page, limit });
    if (categoryId) query.set('categoryId', categoryId);
    if (keyword) query.set('keyword', keyword);
    return axios.get(`/api/v1/news/articles?${query.toString()}`);
}

export const fetchArticleBySlug = (slug) => {
    return axios.get(`/api/v1/news/articles/${slug}`);
}


