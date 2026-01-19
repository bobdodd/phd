/**
 * Complete Accessible Feed Implementation
 * Follows WAI-ARIA Authoring Practices Guide for Feed
 *
 * Key Features:
 * - role="feed" and role="article"
 * - aria-label on feed
 * - aria-setsize and aria-posinset on articles
 * - aria-busy during loading
 * - Page Up/Down navigation
 * - Ctrl+Home/End navigation
 * - Focus management
 * - tabindex="0" on articles
 * - Load more functionality
 * - Article position tracking
 */

(function() {
  'use strict';

  const feed = document.getElementById('good-feed');
  const loadMoreBtn = document.getElementById('good-load-more');
  const refreshBtn = document.getElementById('good-refresh-btn');
  const loadingIndicator = document.getElementById('good-loading');
  const statsDisplay = document.getElementById('good-stats');

  if (!feed || !loadMoreBtn) return;

  // Sample data for posts
  const samplePosts = [
    {
      author: 'Jane Doe',
      initials: 'JD',
      time: '2 hours ago',
      content: 'Just launched our new accessibility feature! Really proud of the team for making it happen. 🎉',
      hasImage: false
    },
    {
      author: 'John Smith',
      initials: 'JS',
      time: '3 hours ago',
      content: 'Check out this amazing sunset from my hike today!',
      hasImage: true,
      imageText: '🌅 Sunset Image'
    },
    {
      author: 'Alice Johnson',
      initials: 'AJ',
      time: '5 hours ago',
      content: 'Does anyone have recommendations for accessible design tools? Looking to improve our workflow.',
      hasImage: false
    },
    {
      author: 'Bob Wilson',
      initials: 'BW',
      time: '6 hours ago',
      content: 'Excited to announce our new blog post about WCAG 2.2 compliance!',
      hasImage: false
    },
    {
      author: 'Carol Davis',
      initials: 'CD',
      time: '8 hours ago',
      content: 'Learning about ARIA live regions today. So many useful applications for dynamic content!',
      hasImage: false
    },
    {
      author: 'David Lee',
      initials: 'DL',
      time: '10 hours ago',
      content: 'Our team hit 100% test coverage on the accessibility module! 🎯',
      hasImage: false
    },
    {
      author: 'Emma Brown',
      initials: 'EB',
      time: '12 hours ago',
      content: 'Beautiful day for coding outdoors!',
      hasImage: true,
      imageText: '💻 Outdoor Coding Setup'
    },
    {
      author: 'Frank Garcia',
      initials: 'FG',
      time: '14 hours ago',
      content: 'Just finished reading the WAI-ARIA Authoring Practices. Highly recommend for anyone working on accessible widgets.',
      hasImage: false
    },
    {
      author: 'Grace Martinez',
      initials: 'GM',
      time: '16 hours ago',
      content: 'Reminder: Always test with actual screen readers, not just automated tools!',
      hasImage: false
    },
    {
      author: 'Henry Taylor',
      initials: 'HT',
      time: '18 hours ago',
      content: 'Working on implementing keyboard navigation for our feed pattern. Progress looks great!',
      hasImage: false
    }
  ];

  let currentPostIndex = 0;
  let totalLoadedPosts = 0;
  const postsPerLoad = 3;

  /**
   * Create an article element with complete ARIA attributes
   */
  function createArticle(postData, position, totalSize) {
    const li = document.createElement('li');
    li.setAttribute('role', 'article');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-posinset', position);
    li.setAttribute('aria-setsize', totalSize);
    li.setAttribute('aria-labelledby', `post-${position}-author`);

    const positionIndicator = document.createElement('span');
    positionIndicator.className = 'position-indicator';
    positionIndicator.textContent = `${position} of ${totalSize}`;
    positionIndicator.setAttribute('aria-hidden', 'true');

    const header = document.createElement('div');
    header.className = 'post-header';

    const avatar = document.createElement('div');
    avatar.className = 'post-avatar';
    avatar.textContent = postData.initials;
    avatar.setAttribute('aria-hidden', 'true');

    const authorInfo = document.createElement('div');
    authorInfo.className = 'post-author-info';

    const author = document.createElement('p');
    author.className = 'post-author';
    author.id = `post-${position}-author`;
    author.textContent = postData.author;

    const time = document.createElement('p');
    time.className = 'post-time';
    time.textContent = postData.time;

    authorInfo.appendChild(author);
    authorInfo.appendChild(time);
    header.appendChild(avatar);
    header.appendChild(authorInfo);

    const content = document.createElement('div');
    content.className = 'post-content';
    content.textContent = postData.content;

    const actions = document.createElement('div');
    actions.className = 'post-actions';

    const likeBtn = createActionButton('👍 Like', `Like post by ${postData.author}`);
    const commentBtn = createActionButton('💬 Comment', `Comment on post by ${postData.author}`);
    const shareBtn = createActionButton('🔄 Share', `Share post by ${postData.author}`);

    actions.appendChild(likeBtn);
    actions.appendChild(commentBtn);
    actions.appendChild(shareBtn);

    li.appendChild(positionIndicator);
    li.appendChild(header);
    li.appendChild(content);

    if (postData.hasImage) {
      const image = document.createElement('div');
      image.className = 'post-image';
      image.textContent = postData.imageText;
      image.setAttribute('role', 'img');
      image.setAttribute('aria-label', postData.imageText);
      li.appendChild(image);
    }

    li.appendChild(actions);

    console.log('✅ Article created:', {
      position,
      totalSize,
      author: postData.author,
      ariaAttributes: {
        'aria-posinset': position,
        'aria-setsize': totalSize,
        'aria-labelledby': `post-${position}-author`
      }
    });

    return li;
  }

  /**
   * Create action button with proper ARIA label
   */
  function createActionButton(text, ariaLabel) {
    const button = document.createElement('button');
    button.className = 'post-action-btn';
    button.textContent = text;
    button.setAttribute('aria-label', ariaLabel);

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      console.log('✅ Action button clicked:', ariaLabel);
      alert(`${ariaLabel}`);
    });

    return button;
  }

  /**
   * Load more posts into the feed
   */
  async function loadMorePosts() {
    if (currentPostIndex >= samplePosts.length) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = 'No More Posts';
      return;
    }

    console.log('✅ Loading more posts...');

    // Set aria-busy
    feed.setAttribute('aria-busy', 'true');
    loadingIndicator.classList.add('active');
    loadMoreBtn.disabled = true;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Calculate how many posts to load
    const remainingPosts = samplePosts.length - currentPostIndex;
    const postsToLoad = Math.min(postsPerLoad, remainingPosts);

    // Get posts to load
    const posts = samplePosts.slice(currentPostIndex, currentPostIndex + postsToLoad);

    // Add posts to feed
    posts.forEach((post, index) => {
      const position = totalLoadedPosts + index + 1;
      const newTotalSize = totalLoadedPosts + postsToLoad;
      const article = createArticle(post, position, newTotalSize);
      feed.appendChild(article);
    });

    // Update all existing articles with new setsize
    const allArticles = feed.querySelectorAll('[role="article"]');
    const finalTotalSize = totalLoadedPosts + postsToLoad;
    allArticles.forEach((article) => {
      article.setAttribute('aria-setsize', finalTotalSize);
      const indicator = article.querySelector('.position-indicator');
      if (indicator) {
        const position = article.getAttribute('aria-posinset');
        indicator.textContent = `${position} of ${finalTotalSize}`;
      }
    });

    totalLoadedPosts += postsToLoad;
    currentPostIndex += postsToLoad;

    // Remove aria-busy
    feed.setAttribute('aria-busy', 'false');
    loadingIndicator.classList.remove('active');
    loadMoreBtn.disabled = false;

    // Update stats
    updateStats();

    // Set up keyboard navigation for new articles
    setupArticleNavigation();

    console.log('✅ Posts loaded:', {
      loaded: postsToLoad,
      total: totalLoadedPosts,
      remaining: samplePosts.length - currentPostIndex,
      'aria-busy': feed.getAttribute('aria-busy')
    });

    // Disable button if all posts loaded
    if (currentPostIndex >= samplePosts.length) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = 'All Posts Loaded';
    }
  }

  /**
   * Refresh feed (load first batch)
   */
  async function refreshFeed() {
    console.log('✅ Refreshing feed...');

    feed.setAttribute('aria-busy', 'true');
    feed.innerHTML = '';
    currentPostIndex = 0;
    totalLoadedPosts = 0;

    await new Promise(resolve => setTimeout(resolve, 500));

    feed.setAttribute('aria-busy', 'false');
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = 'Load More Posts';

    await loadMorePosts();

    console.log('✅ Feed refreshed');
  }

  /**
   * Setup keyboard navigation for articles
   */
  function setupArticleNavigation() {
    const articles = Array.from(feed.querySelectorAll('[role="article"]'));

    articles.forEach((article) => {
      // Remove old listener by cloning (clean approach)
      const newArticle = article.cloneNode(true);
      article.parentNode.replaceChild(newArticle, article);
    });

    // Get fresh article references
    const freshArticles = Array.from(feed.querySelectorAll('[role="article"]'));

    freshArticles.forEach((article) => {
      article.addEventListener('keydown', (event) => {
        const currentIndex = freshArticles.indexOf(article);

        switch (event.key) {
          case 'PageDown':
            event.preventDefault();
            // Move to next article
            if (currentIndex < freshArticles.length - 1) {
              freshArticles[currentIndex + 1].focus();
              console.log('✅ Page Down: moved to article', currentIndex + 2);
            } else {
              console.log('✅ Page Down: already at last article');
            }
            break;

          case 'PageUp':
            event.preventDefault();
            // Move to previous article
            if (currentIndex > 0) {
              freshArticles[currentIndex - 1].focus();
              console.log('✅ Page Up: moved to article', currentIndex);
            } else {
              console.log('✅ Page Up: already at first article');
            }
            break;

          case 'Home':
            if (event.ctrlKey) {
              event.preventDefault();
              // Jump to first article
              freshArticles[0].focus();
              console.log('✅ Ctrl+Home: jumped to first article');
            }
            break;

          case 'End':
            if (event.ctrlKey) {
              event.preventDefault();
              // Jump to last article
              freshArticles[freshArticles.length - 1].focus();
              console.log('✅ Ctrl+End: jumped to last article');
            }
            break;
        }
      });

      // Re-attach action button listeners
      const actionButtons = article.querySelectorAll('.post-action-btn');
      actionButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
          event.stopPropagation();
          const ariaLabel = button.getAttribute('aria-label');
          console.log('✅ Action button clicked:', ariaLabel);
          alert(ariaLabel);
        });
      });
    });
  }

  /**
   * Update stats display
   */
  function updateStats() {
    const text = `Loaded ${totalLoadedPosts} of ${samplePosts.length} posts`;
    statsDisplay.textContent = text;
    console.log('✅ Stats updated:', text);
  }

  // Event Listeners
  loadMoreBtn.addEventListener('click', loadMorePosts);
  refreshBtn.addEventListener('click', refreshFeed);

  // Initialize with first batch
  loadMorePosts();

  console.log('✅ Accessible feed initialized:', {
    feedId: feed.id,
    features: [
      'role="feed" on container',
      'role="article" on items',
      'aria-label on feed',
      'aria-setsize and aria-posinset on articles',
      'aria-busy during loading',
      'tabindex="0" on articles',
      'Page Up/Down navigation',
      'Ctrl+Home/End navigation',
      'Focus management',
      'Load more functionality',
      'Position tracking and updates'
    ]
  });
})();
