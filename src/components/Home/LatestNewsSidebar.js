import { useEffect, useState } from 'react';
import { fetchArticles } from '../../services/newsService';
import { Link } from 'react-router-dom';

const LatestNewsSidebar = ({ excludeArticleId }) => {
    const [latestArticles, setLatestArticles] = useState([]);

    useEffect(() => {
        const loadArticles = async () => {
            const latestRes = await fetchArticles({
                page: 1,
                limit: 6,
                sortBy: 'publishedAt',
                sortOrder: 'desc'
            });

            if (latestRes && latestRes.EC === 0) {
            
                const filteredLatest = excludeArticleId
                    ? latestRes.DT.items.filter(article => article.id !== excludeArticleId)
                    : latestRes.DT.items;
                setLatestArticles(filteredLatest.slice(0, 6));
            }
        };
        loadArticles();
    }, [excludeArticleId]);

    return (
        <div className="latest-news-sidebar">
            <div className="sidebar-section">
                <h4 className="section-title mb-3">Mới nhất</h4>
                {latestArticles.map(article => (
                    <Link key={article.id} to={`/news/${article.slug}`} className="sidebar-item">
                        {article.thumbnail && <img src={article.thumbnail} alt={article.title} />}
                        <div>
                            <h6 className="mb-1">{article.title}</h6>
                            <small className="text-muted">
                                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}
                            </small>
                        </div>
                    </Link>
                ))}
                {latestArticles.length === 0 && <div>Chưa có bài viết mới.</div>}
            </div>
        </div>
    );
};

export default LatestNewsSidebar;