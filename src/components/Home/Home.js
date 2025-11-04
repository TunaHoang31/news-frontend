import { useEffect, useState } from 'react';
import { fetchCategories, fetchArticles } from '../../services/newsService';
import { Link } from 'react-router-dom';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [articles, setArticles] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [childCategoryId, setChildCategoryId] = useState('');
    const [keyword, setKeyword] = useState('');

    const loadData = async (opts = {}) => {
        const currentPage = opts.page || page;
        const currentCategory = opts.categoryId !== undefined ? opts.categoryId : (childCategoryId || parentCategoryId);
        const currentKeyword = opts.keyword !== undefined ? opts.keyword : keyword;
        const res = await fetchArticles({ page: currentPage, limit, categoryId: currentCategory || undefined, keyword: currentKeyword || undefined });
        if (res && res.EC === 0) {
            setArticles(res.DT.items);
            setTotal(res.DT.total);
            setPage(res.DT.page);
        }
    }

    useEffect(() => {
        const init = async () => {
            const cat = await fetchCategories();
            if (cat && cat.EC === 0) setCategories(cat.DT || []);
            await loadData({ page: 1 });
        }
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalPages = Math.ceil(total / limit) || 1;

    const parents = categories.filter(c => !c.parentId);
    const children = categories.filter(c => c.parentId === Number(parentCategoryId));

    return (
        <div className="container mt-3">
            <h1 className="mb-3"></h1>

            <div className="row mb-3">
                <div className="col-md-3 mb-2">
                    <select className="form-select" value={parentCategoryId} onChange={(e) => { const v = e.target.value; setParentCategoryId(v); setChildCategoryId(''); loadData({ page: 1, categoryId: v }); }}>
                        <option value="">Tất cả danh mục</option>
                        {parents.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3 mb-2">
                    <select className="form-select" value={childCategoryId} onChange={(e) => { const v = e.target.value; setChildCategoryId(v); loadData({ page: 1, categoryId: v || parentCategoryId }); }} disabled={!parentCategoryId}>
                        <option value="">Tất cả</option>
                        {children.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6 mb-2">
                    <input className="form-control" placeholder="Tìm kiếm tiêu đề..." value={keyword} onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') loadData({ page: 1, keyword }); }} />
                </div>
                <div className="col-md-3 mb-2">
                    <button className="btn btn-primary w-100" onClick={() => loadData({ page: 1, keyword })}>Tìm kiếm</button>
                </div>
            </div>

            <div className="list-group">
                {articles.map(a => (
                    <Link key={a.id} to={`/news/${a.slug}`} className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{a.title}</h5>
                            <small>{a.publishedAt ? new Date(a.publishedAt).toLocaleString() : ''}</small>
                        </div>
                        <p className="mb-1">{a.summary || ''}</p>
                        <small>{a.category?.name}</small>
                    </Link>
                ))}
                {articles.length === 0 && (
                    <div className="list-group-item">Chưa có bài viết.</div>
                )}
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
                <button className="btn btn-outline-secondary" disabled={page <= 1} onClick={() => loadData({ page: page - 1 })}>Trang trước</button>
                <span>Trang {page}/{totalPages}</span>
                <button className="btn btn-outline-secondary" disabled={page >= totalPages} onClick={() => loadData({ page: page + 1 })}>Trang sau</button>
            </div>
        </div>
    );
};

export default Home;