import { useEffect, useState } from 'react';
import { fetchCategories } from '../../services/newsService';
import axios from '../../setup/axios';
import { toast } from 'react-toastify';
import './NewsAdmin.scss';
import ModalDelete from '../manageUsers/ModalDelete';

const NewsAdmin = () => {
	const [tab, setTab] = useState('category');

	const [categories, setCategories] = useState([]);
	const [catForm, setCatForm] = useState({ name: '', slug: '', parentId: '' });
	const [catEditingId, setCatEditingId] = useState(null);

	const [isShowModalDeleteCat, setIsShowModalDeleteCat] = useState(false);
	const [dataModalCat, setDataModalCat] = useState({});

	const [articles, setArticles] = useState([]);
	const [artForm, setArtForm] = useState({ title: '', slug: '', summary: '', content: '', thumbnail: '', status: 'draft', categoryId: '', publishedAt: '', authorName: '' });
	const [artEditingId, setArtEditingId] = useState(null);
	const [articleMainId, setArticleMainId] = useState('');

	const [isShowModalDeleteArticle, setIsShowModalDeleteArticle] = useState(false);
	const [dataModalArticle, setDataModalArticle] = useState({});

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

	const submitCategory = async (e) => {
		e.preventDefault();
		const payload = { ...catForm, parentId: catForm.parentId ? Number(catForm.parentId) : null };
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
		setCatForm({ name: c.name, slug: c.slug, parentId: c.parentId !== null && c.parentId !== undefined ? String(c.parentId) : '' });
	};

	const deleteCategory = async (id) => {
		const cat = categories.find(c => String(c.id) === String(id)) || { id };
		setDataModalCat(cat);
		setIsShowModalDeleteCat(true);
	};

	const handleCloseCat = () => {
		setIsShowModalDeleteCat(false);
		setDataModalCat({});
	};

	const confirmDeleteCategory = async () => {
		const id = dataModalCat.id;
		try {
			const idToSend = id !== null && id !== undefined && id !== '' && !isNaN(Number(id)) ? Number(id) : id;
			const res = await axios.delete(`/api/v1/news/category/${idToSend}`);
			if (res && res.EC === 0) {
				toast.success(res.EM || 'Xoá danh mục thành công');
				loadCategories();
				setIsShowModalDeleteCat(false);
				return;
			}
			if (res && res.EM) {
				toast.error(res.EM);
			} else {
				toast.error('Xoá danh mục thất bại');
			}
		} catch (err) {
			console.error('confirmDeleteCategory error', err);
			const hasChildren = categories.some(c => String(c.parentId) === String(id));
			if (hasChildren) {
				toast.error('Không thể xoá danh mục: vui lòng xoá chủ đề trước.');
				setIsShowModalDeleteCat(false);
				return;
			}
			toast.error('Lỗi khi xoá danh mục');
		}
	};

	const submitArticle = async (e) => {
		e.preventDefault();
		const payload = { ...artForm };
		const subs = categories.filter(c => String(c.parentId) === String(articleMainId));
		if (articleMainId && subs.length > 0 && !payload.categoryId) {
			toast.error('Vui lòng chọn danh mục trước khi lưu.');
			return;
		}
		if (!payload.categoryId) return;
		if (payload.categoryId && !isNaN(Number(payload.categoryId))) payload.categoryId = Number(payload.categoryId);
		const res = artEditingId
			? await axios.put(`/api/v1/news/article/${artEditingId}`, payload)
			: await axios.post('/api/v1/news/article', payload);
		if (res && res.EC === 0) {
			setArtForm({ title: '', slug: '', summary: '', content: '', thumbnail: '', status: 'draft', categoryId: '', publishedAt: '', authorName: '' });
			setArtEditingId(null);
			setArticleMainId('');
			loadArticles();
		}
	};

	const editArticle = (a) => {
		setArtEditingId(a.id);
		let initialMain = '';
		const cat = categories.find(c => String(c.id) === String(a.categoryId));
		if (cat) {
			initialMain = cat.parentId ? cat.parentId : cat.id;
		}
		setArticleMainId(String(initialMain));
		setArtForm({
			title: a.title || '',
			slug: a.slug || '',
			summary: a.summary || '',
			content: a.content || '',
			thumbnail: a.thumbnail || '',
			status: a.status || 'draft',
			categoryId: a.categoryId ? String(a.categoryId) : '',
			publishedAt: a.publishedAt ? a.publishedAt.substring(0, 16) : '',
			authorName: a.authorName || ''
		});
	};

	const deleteArticle = async (id) => {
		const art = articles.find(a => String(a.id) === String(id)) || { id };
		setDataModalArticle(art);
		setIsShowModalDeleteArticle(true);
	};

	const handleCloseArticle = () => {
		setIsShowModalDeleteArticle(false);
		setDataModalArticle({});
	};

	const confirmDeleteArticle = async () => {
		const id = dataModalArticle.id;
		try {
			const idToSend = id !== null && id !== undefined && id !== '' && !isNaN(Number(id)) ? Number(id) : id;
			const res = await axios.delete(`/api/v1/news/article/${idToSend}`);
			if (res && res.EC === 0) {
				toast.success(res.EM || 'Xoá bài viết thành công');
				loadArticles();
				setIsShowModalDeleteArticle(false);
				return;
			}
			if (res && res.EM) {
				toast.error(res.EM);
			} else {
				toast.error('Xoá bài viết thất bại');
			}
		} catch (err) {
			console.error('confirmDeleteArticle error', err);
			toast.error('Lỗi khi xoá bài viết');
		}
	};

	return (
		<>
			<div className="container mt-3">
				<div className="manage-news-card">
					<div className="manage-news-header">
						<div className="title">
							<h3>Quản lý Tin tức</h3>
						</div>
						<div className="manage-news-actions">
						</div>
					</div>
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
								<div className="col-12 col-md-4 mb-2 mb-md-0"><input className="form-control" placeholder="Tên danh mục" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} required /></div>
								<div className="col-12 col-md-4 mb-2 mb-md-0"><input className="form-control" placeholder="Slug" value={catForm.slug} onChange={e => setCatForm({ ...catForm, slug: e.target.value })} required /></div>
								<div className="col-12 col-md-3 mb-2 mb-md-0">
									<select className="form-select parent-select" value={catForm.parentId} onChange={e => setCatForm({ ...catForm, parentId: e.target.value })}>
										<option value="">Tạo danh mục mới</option>
										{categories.filter(c => c.parentId === null || c.parentId === undefined || String(c.parentId) === '').map(c => (<option key={c.id} value={String(c.id)}>{c.name}</option>))}
									</select>
								</div>
								<div className="col-12 col-md-1"><button className="btn btn-primary w-100" type="submit">{catEditingId ? 'Lưu' : 'Thêm'}</button></div>
							</form>
							<div className="table-responsive mt-3">
								<table className="table table-striped">
									<thead><tr><th>ID</th><th>Tên danh mục</th><th>Slug</th><th>Chủ đề</th><th>Actions</th></tr></thead>
									<tbody>
										{categories.map(c => {
											const parent = categories.find(p => String(p.id) === String(c.parentId));
											const rowClass = c.parentId ? 'child-row' : 'parent-row';
											return (
												<tr key={c.id} className={rowClass}>
													<td>{c.id}</td>
													<td>{c.name}</td>
													<td>{c.slug}</td>
													<td>{parent ? parent.name : ''}</td>
													<td data-label="Actions">
														<button className="btn btn-sm btn-outline-secondary me-2 edit" onClick={() => editCategory(c)}>Sửa</button>
														<button className="btn btn-sm btn-outline-danger delete" onClick={() => deleteCategory(c.id)}>Xóa</button>
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
								<div className="col-12 col-md-6 mb-2 mb-md-0">
									<input className="form-control"
										placeholder="Tiêu đề"
										value={artForm.title}
										onChange={e => setArtForm({ ...artForm, title: e.target.value })} required />
								</div>
								<div className="col-md-3">
									<input className="form-control"
										placeholder="Slug"
										value={artForm.slug}
										onChange={e => setArtForm({ ...artForm, slug: e.target.value })} required /></div>
								<div className="col-md-3">
									{/* Main category select */}
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
									{/* Subcategory select - shown only when there are subs for selected main */}
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
									<input
										className="form-control"
										placeholder="Tóm tắt"
										value={artForm.summary}
										onChange={e => setArtForm({ ...artForm, summary: e.target.value })} /></div>
								<div className="col-md-12">
									<textarea
										className="form-control"
										rows="6"
										placeholder="Nội dung (chèn <img src='URL'/>)"
										value={artForm.content}
										onChange={e => setArtForm({ ...artForm, content: e.target.value })}
										style={{ whiteSpace: 'pre-wrap' }}
										required /></div>
								<div className="col-md-6">
									<input
										className="form-control"
										placeholder="Ảnh URL"
										value={artForm.thumbnail}
										onChange={e => setArtForm({ ...artForm, thumbnail: e.target.value })} /></div>
								<div className="col-md-3">
									<select className="form-select" value={artForm.status} onChange={e => setArtForm({ ...artForm, status: e.target.value })}>
										<option value="draft">Nháp</option>
										<option value="published">Xuất bản</option>
									</select>
								</div>
								<div className="col-md-3">
									<input type="datetime-local" className="form-control" value={artForm.publishedAt} onChange={e => setArtForm({ ...artForm, publishedAt: e.target.value })} /></div>
								<div className="col-md-6">
									<input className="form-control" placeholder="Tác giả" value={artForm.authorName} onChange={e => setArtForm({ ...artForm, authorName: e.target.value })} /></div>
								<div className="col-md-6">
									<button className="btn btn-primary w-100" type="submit">{artEditingId ? 'Lưu' : 'Thêm'}</button></div>
							</form>

							<div className="table-responsive mt-3">
								<table className="table table-striped">
									<thead><tr><th>ID</th><th>Tiêu đề</th><th>Slug</th><th>Trạng thái</th><th>Danh mục</th><th> Actions</th></tr></thead>
									<tbody>
										{articles.map(a => (
											<tr key={a.id}>
												<td>{a.id}</td>
												<td>{a.title}</td>
												<td>{a.slug}</td>
												<td>{a.status}</td>
												<td>{a.category?.name || a.categoryId}</td>
												<td data-label="Actions">
													<button className="btn btn-sm btn-outline-secondary me-2 edit" onClick={() => editArticle(a)}>Sửa</button>
													<button className="btn btn-sm btn-outline-danger delete" onClick={() => deleteArticle(a.id)}>Xóa</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			</div>

			<ModalDelete
				show={isShowModalDeleteCat}
				handleClose={handleCloseCat}
				confirmDeleteUser={confirmDeleteCategory}
				dataModal={dataModalCat}
				title={"Xóa danh mục"}
				body={`Bạn có chắc chắn xóa danh mục này không: ${dataModalCat.name || dataModalCat.id || ''}?`}
				confirmVariant={"danger"}
			/>
			<ModalDelete
				show={isShowModalDeleteArticle}
				handleClose={handleCloseArticle}
				confirmDeleteUser={confirmDeleteArticle}
				dataModal={dataModalArticle}
				title={"Xóa bài viết"}
				body={`Bạn có chắc chắn xóa bài viết này không: ${dataModalArticle.title || dataModalArticle.id || ''}?`}
				confirmVariant={"danger"}
			/>
		</>
	);
};

export default NewsAdmin;
