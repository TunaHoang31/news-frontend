import React from 'react';

const CategoryForm = ({ catForm, setCatForm, submitCategory, catEditingId, categories }) => {
    return (
        <form className="row g-2" onSubmit={submitCategory}>
            <div className="col-12 col-md-4 mb-2 mb-md-0">
                <input className="form-control" placeholder="Tên danh mục" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} required />
            </div>
            <div className="col-12 col-md-4 mb-2 mb-md-0">
                <input className="form-control" placeholder="Slug" value={catForm.slug} onChange={e => setCatForm({ ...catForm, slug: e.target.value })} required />
            </div>
            <div className="col-12 col-md-3 mb-2 mb-md-0">
                <select className="form-select parent-select" value={catForm.parentId} onChange={e => setCatForm({ ...catForm, parentId: e.target.value })}>
                    <option value="">Tạo danh mục mới</option>
                    {categories.filter(c => c.parentId === null || c.parentId === undefined || String(c.parentId) === '').map(c => (<option key={c.id} value={String(c.id)}>{c.name}</option>))}
                </select>
            </div>
            <div className="col-12 col-md-1">
                <button className="btn btn-primary w-100" type="submit">{catEditingId ? 'Lưu' : 'Thêm'}</button>
            </div>
             <hr />
        </form>
        
    );
};

export default CategoryForm;
