import { createContext, useState } from "react";

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
    const [categoryId, setCategoryId] = useState('');
    const [keyword, setKeyword] = useState('');

    const updateFilters = ({ categoryId: newCategoryId, keyword: newKeyword }) => {
        if (newCategoryId !== undefined) setCategoryId(newCategoryId);
        if (newKeyword !== undefined) setKeyword(newKeyword);
    }

    return (
        <NewsContext.Provider value={{ categoryId, keyword, updateFilters }}>
            {children}
        </NewsContext.Provider>
    );
};
