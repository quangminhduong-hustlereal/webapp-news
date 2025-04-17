import { Schema, model, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags: string[];
  author?: string;
  source?: string;
  imageUrl?: string;
  views: number;
  publishedAt?: Date;
  isPublished: boolean;
}

/**
 * Mongoose schema definition for Article.
 */
const articleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Create an index on slug for faster lookup (optional but recommended)
articleSchema.index({ slug: 1 });

/**
 * Article model based on the schema above.
 * Mongoose will create the collection name 'articles' in lowercase plural form.
 */
const Article = model<IArticle>('Article', articleSchema);

export default Article;
