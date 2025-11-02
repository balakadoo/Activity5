const { Comment, User } = require('../models');

// Transform comment data to match frontend expectations
const transformComment = (comment) => {
  const commentData = comment.toJSON();
  return {
    _id: commentData.id,
    id: commentData.id,
    content: commentData.content,
    createdAt: commentData.createdAt,
    updatedAt: commentData.updatedAt,
    author: {
      _id: commentData.author.id,
      id: commentData.author.id,
      username: commentData.author.username
    }
  };
};

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });

    const transformedComments = comments.map(comment => transformComment(comment));
    res.json(transformedComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create comment
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.create({
      content,
      authorId: req.user.id,
      postId: req.params.postId
    });

    // Fetch comment with author info
    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }]
    });

    res.status(201).json(transformComment(commentWithAuthor));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await comment.update({
      content: req.body.content || comment.content
    });

    // Fetch updated comment with author
    const updatedComment = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }]
    });

    res.json(transformComment(updatedComment));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};