import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { fetchCategories, fetchArticles } from '../../services/newsService';
import axios from '../../setup/axios';
import { toast } from 'react-toastify';
import './NewsAdmin.scss';
import ModalDeleteCategory from './ModalDeleteCategory';
import ModalDeleteArticle from './ModalDeleteArticle';
import CategoryForm from './CategoryForm';
import ArticleForm from './ArticleForm';

const NewsAdmin = () => {
	const [tab, setTab] = useState('category');

	const [categories, setCategories] = useState([]);
	const [catForm, setCatForm] = useState({ name: '', slug: '', parentId: '' });
	const [catEditingId, setCatEditingId] = useState(null);

	const [isShowModalDeleteCat, setIsShowModalDeleteCat] = useState(false);
	const [dataModalCat, setDataModalCat] = useState({});

	const [articles, setArticles] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentLimit] = useState(25);
	
	const [totalPages, setTotalPages] = useState(0);
	const [artForm, setArtForm] = useState({ title: '', slug: '', summary: '', content: '', thumbnail: '', status: 'draft', categoryId: '', publishedAt: '', authorName: '' });
	const [artEditingId, setArtEditingId] = useState(null);
	const [articleMainId, setArticleMainId] = useState('');

	const [isShowModalDeleteArticle, setIsShowModalDeleteArticle] = useState(false);
	const [dataModalArticle, setDataModalArticle] = useState({});

	const loadCategories = async () => {
		const res = await fetchCategories();
		if (res && res.EC === 0) setCategories(res.DT || []);
	};

	const loadArticles = async (page = 1) => {
		const res = await fetchArticles({ page, limit: currentLimit });
		if (res && res.EC === 0) {
			setArticles(res.DT.items || []);
			const total = res.DT.total || 0;
			const returnedPage = res.DT.page || page;
			setTotalPages(total ? Math.ceil(total / currentLimit) : 0);
			setCurrentPage(returnedPage);
		}
	};
	useEffect(() => {
		loadCategories();
	}, []);

	useEffect(() => {
		loadArticles(currentPage);
	}, [currentPage]);

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
			loadArticles(currentPage);
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

	const handlePageClick = (event) => {
		setCurrentPage(+event.selected + 1);
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
				loadArticles(currentPage);
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
							<CategoryForm
								catForm={catForm}
								setCatForm={setCatForm}
								submitCategory={submitCategory}
								catEditingId={catEditingId}
								categories={categories}
							/>
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
							<ArticleForm
								artForm={artForm}
								setArtForm={setArtForm}
								categories={categories}
								articleMainId={articleMainId}
								setArticleMainId={setArticleMainId}
								submitArticle={submitArticle}
								artEditingId={artEditingId}
							/>
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
							{totalPages > 1 && (
								<div className="news-footer mt-3">
									<ReactPaginate
										nextLabel=">>>"
										onPageChange={handlePageClick}
										pageRangeDisplayed={3}
										marginPagesDisplayed={2}
										pageCount={totalPages}
										previousLabel="<<<"
										pageClassName="page-item"
										pageLinkClassName="page-link"
										previousClassName="page-item"
										previousLinkClassName="page-link"
										nextClassName="page-item"
										nextLinkClassName="page-link"
										breakLabel="..."
										breakClassName="page-item"
										breakLinkClassName="page-link"
										containerClassName="pagination"
										activeClassName="active"
										forcePage={currentPage > 0 ? currentPage - 1 : 0}
										renderOnZeroPageCount={null}
									/>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			<ModalDeleteCategory
				show={isShowModalDeleteCat}
				handleClose={handleCloseCat}
				confirmDeleteCategory={confirmDeleteCategory}
				dataModal={dataModalCat}
			/>
			<ModalDeleteArticle
				show={isShowModalDeleteArticle}
				handleClose={handleCloseArticle}
				confirmDeleteArticle={confirmDeleteArticle}
				dataModal={dataModalArticle}
			/>
		</>
	);
};

export default NewsAdmin;
