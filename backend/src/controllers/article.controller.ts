
import { Request, Response, NextFunction } from 'express';
import Article from '../models/Article.model';

/**
 * GET /api/articles
 * Fetch all articles sorted by newest first.
 */
export const getAllArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    console.error('Error fetching all articles:', error);
    res
      .status(500)
      .json({ success: false, message: 'Lỗi server khi lấy danh sách bài viết' });
  }
};

/**
 * GET /api/articles/:slug
 * Fetch a single article by its slug.
 */
export const getArticleBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const article = await Article.findOne({ slug }).lean();

    if (!article) {
      res
        .status(404)
        .json({ success: false, message: 'Không tìm thấy bài viết' });
      return;
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    console.error(`Error fetching article with slug "${req.params.slug}":`, error);
    res
      .status(500)
      .json({ success: false, message: 'Lỗi server khi lấy bài viết' });
  }
};
