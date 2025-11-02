const { Post, User } = require('../models');

// Transform post data to match frontend expectations
const transformPost = (post) => {
  const postData = post.toJSON();
  return {
    _id: postData.id,
    id: postData.id,
    title: postData.title,
    content: postData.content,
    tags: postData.tags,
    createdAt: postData.createdAt,
    updatedAt: postData.updatedAt,
    author: {
      _id: postData.author.id,
      id: postData.author.id,
      username: postData.author.username
    }
  };
};

// Get all posts with pagination
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: posts } = await Post.findAndCountAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const transformedPosts = posts.map(post => transformPost(post));

    res.json({
      posts: transformedPosts,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalPosts: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }]
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(transformPost(post));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create post
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const post = await Post.create({
      title,
      content,
      tags: tags || [],
      authorId: req.user.id
    });

    // Fetch the post with author info
    const postWithAuthor = await Post.findByPk(post.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }]
    });

    res.status(201).json(transformPost(postWithAuthor));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is the author
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { title, content, tags } = req.body;

    await post.update({
      title: title || post.title,
      content: content || post.content,
      tags: tags || post.tags
    });

    // Fetch updated post with author
    const updatedPost = await Post.findByPk(post.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }]
    });

    res.json(transformPost(updatedPost));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is the author
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};