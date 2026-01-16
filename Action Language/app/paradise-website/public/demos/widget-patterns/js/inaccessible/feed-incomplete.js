/**
 * Incomplete Feed Implementation (Inaccessible)
 * Demonstrates common mistakes and what Paradise detects
 *
 * Missing Features (7 issues):
 * 1. No role="feed" on container
 * 2. No role="article" on items
 * 3. No aria-label on feed
 * 4. No aria-setsize/aria-posinset on articles
 * 5. No aria-busy during loading
 * 6. No keyboard navigation (Page Up/Down, Ctrl+Home/End)
 * 7. No focus management (articles not focusable)
 */

(function() {
  'use strict';

  const feed = document.getElementById('bad-feed');
  const loadMoreBtn = document.getElementById('bad-load-more');
  const refreshBtn = document.getElementById('bad-refresh-btn');
  const loadingIndicator = document.getElementById('bad-loading');
  const statsDisplay = document.getElementById('bad-stats');

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
   * Create an article element (INCOMPLETE - missing ARIA)
   * ❌ No role="article"
   * ❌ No tabindex="0"
   * ❌ No aria-posinset
   * ❌ No aria-setsize
   * ❌ No aria-labelledby
   */
  function createArticle(postData, position) {
    const li = document.createElement('li');
    li.className = 'bad-post';
    // ❌ MISSING: role="article"
    // ❌ MISSING: tabindex="0"
    // ❌ MISSING: aria-posinset
    // ❌ MISSING: aria-setsize
    // ❌ MISSING: aria-labelledby

    const header = document.createElement('div');
    header.className = 'post-header';

    const avatar = document.createElement('div');
    avatar.className = 'post-avatar';
    avatar.textContent = postData.initials;

    const authorInfo = document.createElement('div');
    authorInfo.className = 'post-author-info';

    const author = document.createElement('p');
    author.className = 'post-author';
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

    const likeBtn = createActionButton('👍 Like');
    const commentBtn = createActionButton('💬 Comment');
    const shareBtn = createActionButton('🔄 Share');

    actions.appendChild(likeBtn);
    actions.appendChild(commentBtn);
    actions.appendChild(shareBtn);

    li.appendChild(header);
    li.appendChild(content);

    if (postData.hasImage) {
      const image = document.createElement('div');
      image.className = 'post-image';
      image.textContent = postData.imageText;
      li.appendChild(image);
    }

    li.appendChild(actions);

    console.log('⚠️ Article created without ARIA:', {
      position,
      author: postData.author,
      missingAttributes: [
        'role="article"',
        'tabindex="0"',
        'aria-posinset',
        'aria-setsize',
        'aria-labelledby'
      ]
    });

    return li;
  }

  /**
   * Create action button (missing aria-label)
   */
  function createActionButton(text) {
    const button = document.createElement('button');
    button.className = 'post-action-btn';
    button.textContent = text;
    // ❌ MISSING: aria-label

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      console.log('⚠️ Action button clicked (no aria-label):', text);
      alert(`Action: ${text}`);
    });

    return button;
  }

  /**
   * Load more posts (INCOMPLETE - no aria-busy)
   * ❌ No aria-busy="true" during loading
   * ❌ No keyboard navigation setup
   */
  async function loadMorePosts() {
    if (currentPostIndex >= samplePosts.length) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = 'No More Posts';
      return;
    }

    console.log('⚠️ Loading more posts (no aria-busy)...');

    // ❌ MISSING: feed.setAttribute('aria-busy', 'true');
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
      const article = createArticle(post, position);
      feed.appendChild(article);
    });

    totalLoadedPosts += postsToLoad;
    currentPostIndex += postsToLoad;

    // ❌ MISSING: feed.setAttribute('aria-busy', 'false');
    loadingIndicator.classList.remove('active');
    loadMoreBtn.disabled = false;

    // Update stats
    updateStats();

    // ❌ MISSING: setupArticleNavigation() - no keyboard navigation

    console.log('⚠️ Posts loaded without ARIA updates:', {
      loaded: postsToLoad,
      total: totalLoadedPosts,
      remaining: samplePosts.length - currentPostIndex,
      missingFeatures: [
        'aria-busy state management',
        'aria-posinset on articles',
        'aria-setsize on articles',
        'Page Up/Down navigation',
        'Ctrl+Home/End navigation',
        'Focus management'
      ]
    });

    // Disable button if all posts loaded
    if (currentPostIndex >= samplePosts.length) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = 'All Posts Loaded';
    }
  }

  /**
   * Refresh feed
   */
  async function refreshFeed() {
    console.log('⚠️ Refreshing feed (no aria-busy)...');

    // ❌ MISSING: feed.setAttribute('aria-busy', 'true');
    feed.innerHTML = '';
    currentPostIndex = 0;
    totalLoadedPosts = 0;

    await new Promise(resolve => setTimeout(resolve, 500));

    // ❌ MISSING: feed.setAttribute('aria-busy', 'false');
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = 'Load More Posts';

    await loadMorePosts();

    console.log('⚠️ Feed refreshed without ARIA state updates');
  }

  /**
   * Update stats display
   */
  function updateStats() {
    const text = `Loaded ${totalLoadedPosts} of ${samplePosts.length} posts`;
    statsDisplay.textContent = text;
  }

  // Event Listeners
  loadMoreBtn.addEventListener('click', loadMorePosts);
  refreshBtn.addEventListener('click', refreshFeed);

  // Initialize with first batch
  loadMorePosts();

  console.log('⚠️ Inaccessible feed initialized with 7 issues:', {
    feedId: feed.id,
    missingFeatures: [
      'No role="feed" on container',
      'No role="article" on items',
      'No aria-label on feed',
      'No aria-setsize/aria-posinset',
      'No aria-busy during loading',
      'No Page Up/Down navigation',
      'No Ctrl+Home/End navigation',
      'No focus management (articles not focusable)'
    ]
  });
})();
