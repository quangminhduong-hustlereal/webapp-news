
import { Request, Response, NextFunction } from 'express';
import Article from '../models/Article.model';
import slugify from 'slugify';

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
 * PUT /api/articles/:slug
 * Update an existing article by slug.
 */
export const updateArticleBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const updateData: Record<string, any> = { ...req.body };

    // If the title is being updated, regenerate slug and ensure uniqueness
    const originalSlug = slug; // slug from params represents current slug in DB
    if (updateData.title) {
      let newSlug = slugify(updateData.title, {
        lower: true,
        strict: true,
        locale: 'vi',
        trim: true,
      });

      // Only proceed if the slug will actually change
      if (newSlug !== originalSlug) {
        const conflict = await Article.findOne({ slug: newSlug }).lean();
        if (conflict) {
          console.log(`Slug conflict found for "${newSlug}". Appending timestamp.`);
          newSlug = `${newSlug}-${Date.now()}`;
        }
        updateData.slug = newSlug;
        console.log(`Slug will be updated to: ${newSlug}`);
      } else {
        // Slug remains the same — remove it from updateData for cleanliness
        delete updateData.slug;
        console.log(`Slug remains unchanged: ${originalSlug}`);
      }
    } else {
      // Ensure slug isn't modified if title isn't provided
      delete updateData.slug;
    }

    const updatedArticle = await Article.findOneAndUpdate(
      { slug },         // filter
      updateData,       // data to update
      {
        new: true,      // return the updated doc
        runValidators: true,
      }
    );

    if (!updatedArticle) {
      res
        .status(404)
        .json({ success: false, message: 'Không tìm thấy bài viết để cập nhật' });
      return;
    }

    res.status(200).json({ success: true, data: updatedArticle });
  } catch (error: any) {
    console.error('Error updating article:', error);

    if (error.code === 11000) {
      res
        .status(400)
        .json({ success: false, message: 'Slug đã tồn tại. Vui lòng đổi tiêu đề.' });
      return;
    }

    // Validation or other errors
    res
      .status(500)
      .json({ success: false, message: 'Lỗi server khi cập nhật bài viết' });
  }
};

/**
 * POST /api/articles
 * Create a new article.
 */
export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      content,
      category,
      tags = [],
      author,
      source,
      imageUrl,
      isPublished = false,
      publishedAt,
    } = req.body;

    if (!title || !content) {
      res
        .status(400)
        .json({ success: false, message: 'Thiếu tiêu đề hoặc nội dung bài viết' });
      return;
    }

    // Generate slug
    let generatedSlug = slugify(title, {
      lower: true,
      strict: true,
      locale: 'vi',
      trim: true,
    });

    // TODO: handle duplicate slug properly (e.g., loop/check); simple timestamp suffix for now
    const existing = await Article.findOne({ slug: generatedSlug }).lean();
    if (existing) {
      generatedSlug = `${generatedSlug}-${Date.now()}`;
    }

    const newArticle = new Article({
      title,
      slug: generatedSlug,
      content,
      category,
      tags,
      author,
      source,
      imageUrl,
      isPublished,
      publishedAt,
    });

    await newArticle.save();

    res.status(201).json({ success: true, data: newArticle });
  } catch (error: any) {
    console.error('Error creating article:', error);

    // Duplicate key (slug) error code
    if (error.code === 11000) {
      res
        .status(400)
        .json({ success: false, message: 'Slug đã tồn tại. Vui lòng đổi tiêu đề.' });
      return;
    }

    res
      .status(500)
      .json({ success: false, message: 'Lỗi server khi tạo bài viết' });
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
