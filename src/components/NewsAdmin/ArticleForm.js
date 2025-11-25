import React from 'react';

const ArticleForm = ({ artForm, setArtForm, categories, articleMainId, setArticleMainId, submitArticle, artEditingId }) => {
    return (
        <form className="row g-2" onSubmit={submitArticle}>
            <div className="col-12 col-md-6 mb-2 mb-md-0">
                <input className="form-control" placeholder="Tiêu đề" value={artForm.title} onChange={e => setArtForm({ ...artForm, title: e.target.value })} required />
            </div>
            <div className="col-md-3">
                <input className="form-control" placeholder="Slug" value={artForm.slug} onChange={e => setArtForm({ ...artForm, slug: e.target.value })} required />
            </div>
            <div className="col-md-3">
                <select className="form-select parent-select" value={articleMainId} onChange={e => {
                    const mainId = e.target.value;
                    setArticleMainId(mainId);
                    const subs = categories.filter(c => String(c.parentId) === String(mainId));
                    if (subs && subs.length > 0) {
                        setArtForm({ ...artForm, categoryId: '' });
                    } else {
                        setArtForm({ ...artForm, categoryId: mainId });
                    }
                }}>
                    <option value="">Chọn danh mục</option>
                    {categories.filter(c => !c.parentId).map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>

                {(() => {
                    const subs = categories.filter(c => String(c.parentId) === String(articleMainId));
                    if (!articleMainId) return null;
                    if (!subs || subs.length === 0) return null;
                    return (
                        <select className="form-select mt-2" value={artForm.categoryId} onChange={e => setArtForm({ ...artForm, categoryId: e.target.value })} required>
                            <option value="">Chọn chủ đề</option>
                            {subs.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                        </select>
                    )
                })()}
            </div>
            <div className="col-md-12">
                <input className="form-control" placeholder="Tóm tắt" value={artForm.summary} onChange={e => setArtForm({ ...artForm, summary: e.target.value })} />
            </div>
            <div className="col-md-12">
                <textarea className="form-control" rows="6" placeholder="Nội dung (chèn <img src='URL'/>)" value={artForm.content} onChange={e => setArtForm({ ...artForm, content: e.target.value })} style={{ whiteSpace: 'pre-wrap' }} required />
            </div>
            <div className="col-md-6">
                <input className="form-control" placeholder="Ảnh URL" value={artForm.thumbnail} onChange={e => setArtForm({ ...artForm, thumbnail: e.target.value })} />
            </div>
            <div className="col-md-3">
                <select className="form-select" value={artForm.status} onChange={e => setArtForm({ ...artForm, status: e.target.value })}>
                    <option value="draft">Nháp</option>
                    <option value="published">Xuất bản</option>
                </select>
            </div>
            <div className="col-md-3">
                <input type="datetime-local" className="form-control" value={artForm.publishedAt} onChange={e => setArtForm({ ...artForm, publishedAt: e.target.value })} />
            </div>
            <div className="col-md-6">
                <input className="form-control" placeholder="Tác giả" value={artForm.authorName} onChange={e => setArtForm({ ...artForm, authorName: e.target.value })} />
            </div>
            <div className="col-md-6">
                <button className="btn btn-primary w-100" type="submit">{artEditingId ? 'Lưu' : 'Thêm'}</button>
            </div>
             <hr />
        </form>
    );
};

export default ArticleForm;
