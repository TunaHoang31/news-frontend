import './ArticleDetail.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticleBySlug } from '../../services/newsService';
import LatestNewsSidebar from './LatestNewsSidebar';

const ArticleDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const load = async () => {
            const res = await fetchArticleBySlug(slug);
            if (res && res.EC === 0) {
                setArticle(res.DT);
                setNotFound(false);
            } else {
                setNotFound(true);
            }
        }
        if (slug) load();
    }, [slug]);

    if (notFound) return <div className="container mt-3">Không tìm thấy bài viết.</div>;
    if (!article) return <div className="container mt-3">Đang tải...</div>;

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-8">
                    <article className="article-content">
                        <h1 className="mb-2">{article.title}</h1>
                        <div className="text-muted mb-3">
                            {article.authorName || article.author?.name || article.author?.username || 'Vô danh'} • {article.publishedAt ? new Date(article.publishedAt).toLocaleString() : ''}
                        </div>
                        {article.thumbnail && (
                            <img src={article.thumbnail}
                                alt={article.title}
                                className="article-image"
                                style={{
                                    display: 'block',
                                    margin: '20px auto',
                                    maxWidth: '100%',
                                    height: 'auto'
                                }} />
                        )}
                        <div
                            className="article-body"
                            style={{ whiteSpace: 'pre-wrap' }}
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </article>
                </div>
                <div className="col-md-4">
                    <LatestNewsSidebar excludeArticleId={article.id} />
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;


