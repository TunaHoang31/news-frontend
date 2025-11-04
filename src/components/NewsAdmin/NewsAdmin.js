import { useEffect, useState } from 'react';
import { fetchCategories } from '../../services/newsService';
import axios from '../../setup/axios';

const NewsAdmin = () => {
	const [tab, setTab] = useState('category');
	// Category state
	const [categories, setCategories] = useState([]);
	const [catForm, setCatForm] = useState({ name: '', slug: '', parentId: '' });
	const [catEditingId, setCatEditingId] = useState(null);
	// Article state
	const [articles, setArticles] = useState([]);
	const [artForm, setArtForm] = useState({ title: '', slug: '', summary: '', content: '', thumbnail: '', status: 'draft', categoryId: '', publishedAt: '', authorName: '' });
	const [artEditingId, setArtEditingId] = useState(null);

	const loadCategories = async () => {
		const res = await fetchCategories();
		if (res && res.EC === 0) setCategories(res.DT || []);
	};

	const loadArticles = async () => {
		const res = await axios.get('/api/v1/news/articles?page=1&limit=50');
		if (res && res.EC === 0) setArticles(res.DT.items || []);
	};

	useEffect(() => {
		loadCategories();
		loadArticles();
	}, []);

	// Category handlers
	const submitCategory = async (e) => {
		e.preventDefault();
		const payload = { ...catForm, parentId: catForm.parentId || null };
		const res = catEditingId
			? await axios.put(`/api/v1/news/category/${catEditingId}`, payload)
			: await axios.post('/api/v1/news/category', payload);
		if (res && res.EC === 0) {
			setCatForm({ name: '', slug: '', parentId: '' });
			setCatEditingId(null);
			loadCategories();
		}
	};

	const editCategory = (c) => {
		setCatEditingId(c.id);
		setCatForm({ name: c.name, slug: c.slug, parentId: c.parentId || '' });
	};

	const deleteCategory = async (id) => {
		const res = await axios.delete(`/api/v1/news/category/${id}`);
		if (res && res.EC === 0) loadCategories();
	};

	// Article handlers
	const submitArticle = async (e) => {
		e.preventDefault();
		const payload = { ...artForm };
		if (!payload.categoryId) return;
		const res = artEditingId
			? await axios.put(`/api/v1/news/article/${artEditingId}`, payload)
			: await axios.post('/api/v1/news/article', payload);
		if (res && res.EC === 0) {
			setArtForm({ title: '', slug: '', summary: '', content: '', thumbnail: '', status: 'draft', categoryId: '', publishedAt: '', authorName: '' });
			setArtEditingId(null);
			loadArticles();
		}
	};

	const editArticle = (a) => {
		setArtEditingId(a.id);
		setArtForm({
			title: a.title || '',
			slug: a.slug || '',
			summary: a.summary || '',
			content: a.content || '',
			thumbnail: a.thumbnail || '',
			status: a.status || 'draft',
			categoryId: a.categoryId || '',
			publishedAt: a.publishedAt ? a.publishedAt.substring(0, 16) : '',
			authorName: a.authorName || ''
		});
	};

	const deleteArticle = async (id) => {
		const res = await axios.delete(`/api/v1/news/article/${id}`);
		if (res && res.EC === 0) loadArticles();
	};

	return (
		<div className="container mt-3">
			<h2>Quản lý Tin tức</h2>
			<ul className="nav nav-tabs mt-3">
				<li className="nav-item">
					<button className={`nav-link ${tab === 'category' ? 'active' : ''}`} onClick={() => setTab('category')}>Danh mục</button>
				</li>
				<li className="nav-item">
					<button className={`nav-link ${tab === 'article' ? 'active' : ''}`} onClick={() => setTab('article')}>Bài viết</button>
				</li>
			</ul>

			{tab === 'category' && (
				<div className="mt-3">
					<form className="row g-2" onSubmit={submitCategory}>
						<div className="col-md-4"><input className="form-control" placeholder="Tên danh mục" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} required /></div>
						<div className="col-md-4"><input className="form-control" placeholder="Slug" value={catForm.slug} onChange={e => setCatForm({ ...catForm, slug: e.target.value })} required /></div>
						<div className="col-md-3">
							<select className="form-select" value={catForm.parentId} onChange={e => setCatForm({ ...catForm, parentId: e.target.value })}>
								<option value="">Danh mục</option>
								{categories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
							</select>
						</div>
						<div className="col-md-1"><button className="btn btn-primary w-100" type="submit">{catEditingId ? 'Lưu' : 'Thêm'}</button></div>
					</form>

					<div className="table-responsive mt-3">
						<table className="table table-striped">
							<thead><tr><th>ID</th><th>Tên danh mục</th><th>Slug</th><th>Chủ đề</th><th>Actions</th></tr></thead>
							<tbody>
								{categories.map(c => {
									const parent = categories.find(p => p.id === c.parentId);
									return (
										<tr key={c.id}>
											<td>{c.id}</td>
											<td>{c.name}</td>
											<td>{c.slug}</td>
											<td>{parent ? parent.name : ''}</td>
											<td>
												<button className="btn btn-sm btn-outline-secondary me-2" onClick={() => editCategory(c)}>Sửa</button>
												<button className="btn btn-sm btn-outline-danger" onClick={() => deleteCategory(c.id)}>Xóa</button>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{tab === 'article' && (
				<div className="mt-3">
					<form className="row g-2" onSubmit={submitArticle}>
						<div className="col-md-6"><input className="form-control" placeholder="Tiêu đề" value={artForm.title} onChange={e => setArtForm({ ...artForm, title: e.target.value })} required /></div>
						<div className="col-md-3"><input className="form-control" placeholder="Slug" value={artForm.slug} onChange={e => setArtForm({ ...artForm, slug: e.target.value })} required /></div>
						<div className="col-md-3">
							<select className="form-select" value={artForm.categoryId} onChange={e => setArtForm({ ...artForm, categoryId: e.target.value })} required>
								<option value="">Chọn danh mục</option>
								{categories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
							</select>
						</div>
						<div className="col-md-12"><input className="form-control" placeholder="Tóm tắt" value={artForm.summary} onChange={e => setArtForm({ ...artForm, summary: e.target.value })} /></div>
						<div className="col-md-12"><textarea className="form-control" rows="6" placeholder="Nội dung" value={artForm.content} onChange={e => setArtForm({ ...artForm, content: e.target.value })} required /></div>
						<div className="col-md-6"><input className="form-control" placeholder="Ảnh" value={artForm.thumbnail} onChange={e => setArtForm({ ...artForm, thumbnail: e.target.value })} /></div>
						<div className="col-md-3">
							<select className="form-select" value={artForm.status} onChange={e => setArtForm({ ...artForm, status: e.target.value })}>
								<option value="draft">Nháp</option>
								<option value="published">Xuất bản</option>
							</select>
						</div>
						<div className="col-md-3"><input type="datetime-local" className="form-control" value={artForm.publishedAt} onChange={e => setArtForm({ ...artForm, publishedAt: e.target.value })} /></div>
						<div className="col-md-6"><input className="form-control" placeholder="Tác giả" value={artForm.authorName} onChange={e => setArtForm({ ...artForm, authorName: e.target.value })} /></div>
						<div className="col-md-6"><button className="btn btn-primary w-100" type="submit">{artEditingId ? 'Lưu' : 'Thêm'}</button></div>
					</form>

					<div className="table-responsive mt-3">
						<table className="table table-striped">
							<thead><tr><th>ID</th><th>Tiêu đề</th><th>Slug</th><th>Trạng thái</th><th>Danh mục</th><th>Hành động</th></tr></thead>
							<tbody>
								{articles.map(a => (
									<tr key={a.id}>
										<td>{a.id}</td>
										<td>{a.title}</td>
										<td>{a.slug}</td>
										<td>{a.status}</td>
										<td>{a.category?.name || a.categoryId}</td>
										<td>
											<button className="btn btn-sm btn-outline-secondary me-2" onClick={() => editArticle(a)}>Sửa</button>
											<button className="btn btn-sm btn-outline-danger" onClick={() => deleteArticle(a.id)}>Xóa</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};

export default NewsAdmin;
