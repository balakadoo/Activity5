import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getPost(id);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getComments(id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await commentsAPI.createComment(id, commentText);
      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentsAPI.deleteComment(commentId);
        fetchComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="post-detail-container">
      <article className="post-detail">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By {post.author.username}</span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        
        {post.tags.length > 0 && (
          <div className="tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="post-content">{post.content}</div>

        {user && user.id === post.author._id && (
          <div className="post-actions">
            <button onClick={() => navigate(`/edit-post/${post._id}`)} className="btn-edit">
              Edit
            </button>
            <button onClick={handleDeletePost} className="btn-delete">
              Delete
            </button>
          </div>
        )}
      </article>

      <section className="comments-section">
        <h2>Comments ({comments.length})</h2>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
              required
            />
            <button type="submit" className="btn-primary">Post Comment</button>
          </form>
        ) : (
          <p className="login-prompt">Please login to comment</p>
        )}

        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment">
              <div className="comment-header">
                <strong>{comment.author.username}</strong>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-content">{comment.content}</p>
              {user && user.id === comment.author._id && (
                <button 
                  onClick={() => handleDeleteComment(comment._id)}
                  className="btn-delete-small"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;