import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthDetails';
import { db } from '../../firebase';
import {
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, deleteDoc
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import axios from 'axios';
import './Community.css';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { currentUser } = useAuth();

  const tags = ['Anxiety', 'Depression', 'Self-Care', 'Motivation', 'Recovery', 'Support', 'Mindfulness', 'Stress'];

  const fetchUserName = async (uid, fallbackName = 'Anonymous') => {
    try {
      const response = await axios.get(`http://localhost:5000/getUser?uid=${uid}`);
      return response.data.name || fallbackName;
    } catch (error) {
      console.error('❌ Error fetching user name:', error);
      return fallbackName;
    }
  };

  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const postData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const userName = await fetchUserName(data.userId, data.userName);
            return { id: docSnap.id, ...data, userName };
          })
        );
        setPosts(postData);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const userName = await fetchUserName(currentUser.uid, currentUser.displayName || 'Anonymous');
      const userPhoto = currentUser.photoURL || 'https://www.example.com/default-profile-photo.jpg';

      await addDoc(collection(db, 'posts'), {
        content: newPost,
        userId: currentUser.uid,
        userName: userName,
        userPhoto: userPhoto,
        timestamp: serverTimestamp(),
        tags: selectedTags,
        likes: [],
        comments: [],
      });
      setNewPost('');
      setSelectedTags([]);
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleLike = async (postId) => {
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    const likes = Array.isArray(post.likes) ? post.likes : [];
    const updatedLikes = likes.includes(currentUser.uid)
      ? likes.filter(id => id !== currentUser.uid)
      : [...likes, currentUser.uid];

    // Update the local state immediately
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = { ...post, likes: updatedLikes };
    setPosts(updatedPosts);

    // Then, update Firestore
    const postRef = doc(db, 'posts', postId);
    try {
      await updateDoc(postRef, { likes: updatedLikes });
    } catch (err) {
      console.error("❌ Error updating likes:", err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !selectedPost) return;

    const postIndex = posts.findIndex(p => p.id === selectedPost.id);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    const userName = await fetchUserName(currentUser.uid, currentUser.displayName || 'Anonymous');
    
    // Update the local state immediately with the new comment
    const updatedComments = [
      ...(post.comments || []),
      {
        userName: userName,
        content: commentText,
        timestamp: new Date().toISOString(),
      },
    ];

    const updatedPosts = [...posts];
    updatedPosts[postIndex] = { ...post, comments: updatedComments };
    setPosts(updatedPosts);

    // Then, update Firestore
    const postRef = doc(db, 'posts', selectedPost.id);
    try {
      await updateDoc(postRef, {
        comments: updatedComments,
      });
      setCommentText('');
      setSelectedPost(null);
    } catch (err) {
      console.error("❌ Error adding comment:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      // Optionally, remove the deleted post from local state as well
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('❌ Error deleting post:', error);
    }
  };

  const handleEditPost = (postId, newContent) => {
    const postRef = doc(db, 'posts', postId);
    updateDoc(postRef, { content: newContent })
      .then(() => {
        setPosts(posts.map(post => (post.id === postId ? { ...post, content: newContent } : post)));
      })
      .catch((error) => console.error('❌ Error editing post:', error));
  };

  const handleCancelPost = () => {
    setNewPost('');
    setSelectedTags([]);
    setShowCreatePost(false);
  };

  return (
    <div className="community-page">
      <div className="create-post-section">
        {!showCreatePost ? (
          <button className="create-post-button" onClick={() => setShowCreatePost(true)}>
            Create a Post
          </button>
        ) : (
          <motion.div
            className="create-post-card"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="create-post-title">Community Support</h2>
            <p className="create-post-subtitle">Share your journey and connect with others</p>
            <form onSubmit={handlePostSubmit}>
              <textarea
                className="create-post-textarea"
                rows="3"
                placeholder="Share your thoughts..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="create-post-tags">
                {tags.map(tag => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() =>
                      setSelectedTags(prev =>
                        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                      )
                    }
                    className={`tag-button ${selectedTags.includes(tag) ? 'tag-selected' : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="create-post-actions">
                <button type="submit" className="share-post-btn">Share Post</button>
                <button type="button" className="cancel-post-btn" onClick={handleCancelPost}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Posts Section */}
      {posts.map(post => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="post-card"
        >
          <div className="post-user">
            <p className="user-name">{post.userName || 'Anonymous'}</p>
          </div>
          <p className="post-content">{post.content}</p>
          <div className="post-tags">
            {post.tags?.map(tag => (
              <span key={tag} className="tag-item">{tag}</span>
            ))}
          </div>
          <div className="post-actions">
            <button onClick={() => handleLike(post.id)}>
              {post.likes?.includes(currentUser.uid) ? '💖' : '❤️'} {post.likes?.length || 0}
            </button>
            <button onClick={() => setSelectedPost(post)}>
              💬 {post.comments?.length || 0}
            </button>
            {currentUser.uid === post.userId && (
              <div className="post-edit-delete">
                <button onClick={() => handleEditPost(post.id, prompt("Edit your post:", post.content))}>
                  Edit
                </button>
                <button onClick={() => handleDeletePost(post.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>

          {selectedPost?.id === post.id && (
            <div className="comment-section">
              <h3 className="comment-title">Comments</h3>
              <div className="comment-list">
                {post.comments?.map((comment, index) => (
                  <div key={index} className="comment">
                    <p className="comment-user">{comment.userName}</p>
                    <p className="comment-content">{comment.content}</p>
                    <p className="comment-meta">{new Date(comment.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <textarea
                className="comment-box"
                rows="2"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="comment-actions">
                <button onClick={() => setSelectedPost(null)} className="cancel-btn">Cancel</button>
                <button onClick={handleComment} className="primary-btn">Post</button>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default Community;
