import { Router } from 'express';
import { getAllArticles, getArticleBySlug, createArticle } from '../controllers/article.controller';
import { updateArticleBySlug } from '../controllers/article.controller';

const router = Router();

// GET /api/articles        -> danh sách tất cả bài viết
router.get('/', getAllArticles);

// GET /api/articles/:slug  -> chi tiết bài viết theo slug
router.get('/:slug', getArticleBySlug);

// POST /api/articles       -> Tạo bài viết mới
router.post('/', createArticle);

// PUT /api/articles/:slug  -> Cập nhật bài viết theo slug
router.put('/:slug', updateArticleBySlug);

export default router;
