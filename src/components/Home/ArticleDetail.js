import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticleBySlug } from '../../services/newsService';

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
            <h1 className="mb-2">{article.title}</h1>
            <div className="text-muted mb-3">
                {article.category?.name} • {article.publishedAt ? new Date(article.publishedAt).toLocaleString() : ''}
            </div>
            {article.thumbnail && (
                <img src={article.thumbnail} alt={article.title} style={{ maxWidth: '100%', marginBottom: 16 }} />
            )}
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
    );
};

export default ArticleDetail;


