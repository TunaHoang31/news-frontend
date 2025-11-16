import { useEffect, useState, useContext } from 'react';
import { fetchArticles, fetchCategories } from '../../services/newsService';
import { Link } from 'react-router-dom';
import { NewsContext } from '../../context/NewsContext';
import LatestNewsSidebar from './LatestNewsSidebar';
import './Home.scss';

const Home = () => {
    const { categoryId, keyword } = useContext(NewsContext);
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    const loadData = async (opts = {}) => {
        const currentPage = opts.page || page;
        const res = await fetchArticles({
            page: currentPage,
            limit,
            categoryId,
            keyword,
            sortBy: 'publishedAt',
            sortOrder: 'desc'
        });
        if (res && res.EC === 0) {
            setArticles(res.DT.items);
            setTotal(res.DT.total);
            setPage(res.DT.page);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    useEffect(() => {
        const init = async () => {
            const cat = await fetchCategories();
            if (cat && cat.EC === 0) setCategories(cat.DT || []);
        };
        init();
    }, []);

    useEffect(() => {
        loadData({ page: 1 });
    }, [categoryId, keyword]);

    useEffect(() => {
        window.scrollTo(0, 0);
        loadData({ page });
    }, [page]);

    const totalPages = Math.ceil(total / limit) || 1;

    const shuffleArray = (arr) => {
        const a = Array.isArray(arr) ? [...arr] : [];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    const shuffled = shuffleArray(articles);
    const featured = shuffled.slice(0, 4);
    const remaining = shuffled.slice(4);
    const leftList = remaining.slice(0, 10);
    const rightList = articles.slice(0, 10);

    return (
        <div className="container mt-3">
            {featured.length > 0 && (
                <div className="row featured-row mb-4">
                    <div className="col-md-6">
                        <Link to={`/news/${featured[0].slug}`} className="featured-card featured-main" style={{ backgroundImage: featured[0].thumbnail ? `url(${featured[0].thumbnail})` : 'none' }}>
                            <div className="overlay">
                                <span className="category-tag mb-2">{featured[0].category?.name}</span>
                                <h4>{featured[0].title}</h4>
                                <p className="mb-0">{featured[0].summary}</p>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-6">
                        <div className="featured-small-list">
                            {featured.slice(1, 4).map(a => (
                                <Link key={a.id} to={`/news/${a.slug}`} className="featured-small-item">
                                    <div className="small-thumb">
                                        <img src={a.thumbnail || ''} alt={a.title} />
                                    </div>
                                    <div className="small-content">
                                        <span className="category-tag mb-2">{a.category?.name}</span>
                                        <h5>{a.title}</h5>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="row">
                <div className="col-12 col-md-8">
                    <div className="article-list">
                        {leftList.map(a => (
                            <Link key={a.id} to={`/news/${a.slug}`} className="article-item">
                                <div className="article-thumb">
                                    {a.thumbnail && <img src={a.thumbnail} alt={a.title} />}
                                </div>
                                <div className="article-content">
                                    <h2>{a.title}</h2>
                                    <p>{a.summary || ''}</p>
                                    <div className="article-meta">
                                        <span className="category-tag">{a.category?.name}</span>
                                        <small className="date">{a.publishedAt ? new Date(a.publishedAt).toLocaleString() : ''}</small>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {leftList.length === 0 && <div className="list-group-item">Chưa có bài viết.</div>}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                            className="btn btn-outline-secondary"
                            disabled={page <= 1}
                            onClick={() => handlePageChange(page - 1)}
                        >
                            Trang trước
                        </button>
                        <span>Trang {page}/{totalPages}</span>
                        <button
                            className="btn btn-outline-secondary"
                            disabled={page >= totalPages}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            Trang sau
                        </button>
                    </div>
                </div>

                <div className="col-md-4">
                    <LatestNewsSidebar />
                </div>
            </div>
        </div>
    );
};

export default Home;
