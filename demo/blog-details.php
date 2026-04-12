<?php

declare(strict_types=1);

require __DIR__ . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'mail' . DIRECTORY_SEPARATOR . 'db.php';

session_start();

$postSlug = 'ui-ux-designers';
$postFile = 'blog-details.php';
$postTitle = 'Top 10 UI/UX Designers To Follow For Better Product Thinking';
$postCategory = 'Tutorial';
$postDate = 'Feb 14, 2025';
$previousPost = [
   'file' => 'blog-graphic-design.php',
   'title' => 'Learn Graphic Design Free With Smarter Practice Habits',
   'image' => 'assets/img/blog/3.jpg',
];
$nextPost = [
   'file' => 'blog-app-development.php',
   'title' => 'App Development Guides For Teams Building Better Products',
   'image' => 'assets/img/blog/2.jpg',
];

$commentError = '';
$commentStatus = '';
$commentForm = [
   'author' => trim((string) ($_POST['author'] ?? '')),
   'email' => trim((string) ($_POST['email'] ?? '')),
   'url' => trim((string) ($_POST['url'] ?? '')),
   'comment' => trim((string) ($_POST['comment'] ?? '')),
];
$comments = [];
$isAdmin = isset($_SESSION['contact_messages_authenticated']) && $_SESSION['contact_messages_authenticated'] === true;

function comment_initials(string $name): string
{
   $parts = preg_split('/\s+/', trim($name)) ?: [];
   $initials = '';

   foreach ($parts as $part) {
      if ($part !== '') {
         $initials .= strtoupper(substr($part, 0, 1));
      }
      if (strlen($initials) >= 2) {
         break;
      }
   }

   return $initials !== '' ? $initials : 'U';
}

try {
   $pdo = mail_mysql_connection();

   if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_comment_id'])) {
      $deleteCommentId = (int) $_POST['delete_comment_id'];

      if (!$isAdmin) {
         $commentError = 'Admin login is required to delete comments.';
      } elseif ($deleteCommentId > 0) {
         $delete = $pdo->prepare('DELETE FROM blog_comments WHERE id = :id');
         $delete->execute([':id' => $deleteCommentId]);
         header('Location: ' . $postFile . '?comment=deleted');
         exit;
      }
   } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['comment'])) {
      if ($commentForm['author'] === '') {
         $commentError = 'Name is required.';
      } elseif ($commentForm['email'] === '' || !filter_var($commentForm['email'], FILTER_VALIDATE_EMAIL)) {
         $commentError = 'A valid email is required.';
      } elseif ($commentForm['comment'] === '') {
         $commentError = 'Comment text is required.';
      } else {
         $insert = $pdo->prepare(
            'INSERT INTO blog_comments (post_slug, author, email, website, comment)
             VALUES (:post_slug, :author, :email, :website, :comment)'
         );
         $insert->execute([
            ':post_slug' => $postSlug,
            ':author' => $commentForm['author'],
            ':email' => $commentForm['email'],
            ':website' => $commentForm['url'] !== '' ? $commentForm['url'] : null,
            ':comment' => $commentForm['comment'],
         ]);

         header('Location: ' . $postFile . '?comment=success');
         exit;
      }
   }

   if (isset($_GET['comment']) && $_GET['comment'] === 'success') {
      $commentStatus = 'Comment posted successfully.';
      $commentForm = ['author' => '', 'email' => '', 'url' => '', 'comment' => ''];
   } elseif (isset($_GET['comment']) && $_GET['comment'] === 'deleted') {
      $commentStatus = 'Comment deleted successfully.';
   }

   $commentsStatement = $pdo->prepare(
      'SELECT id, author, email, website, comment, created_at
       FROM blog_comments
       WHERE post_slug = :post_slug
       ORDER BY id DESC'
   );
   $commentsStatement->execute([':post_slug' => $postSlug]);
   $comments = $commentsStatement->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $exception) {
   mail_log_failure('Failed to load blog comments.', $exception);
   $commentError = 'Comments are temporarily unavailable.';
}
?>
<!DOCTYPE html>
<html class="no-js" lang="en">

	<head>
   <meta charset="utf-8">
   <meta http-equiv="x-ua-compatible" content="ie=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <meta name="description" content="">

   <!-- Site Title -->
   <title>Blog Details - Gerold - Personal Portfolio HTML5 Template</title>

   <!-- Place favicon.ico in the root directory -->
   <link rel="apple-touch-icon" href="assets/img/favicon.png">
   <link rel="shortcut icon" type="image/png" href="assets/img/favicon.png">

   <!-- CSS here -->
   <link rel="stylesheet" href="assets/css/animate.min.css">
   <link rel="stylesheet" href="assets/css/bootstrap.min.css">
   <link rel="stylesheet" href="assets/css/font-awesome-pro.min.css">
   <link rel="stylesheet" href="assets/css/flaticon_gerold.css">
   <link rel="stylesheet" href="assets/css/nice-select.css">
   <link rel="stylesheet" href="assets/css/backToTop.css">
   <link rel="stylesheet" href="assets/css/owl.carousel.min.css">
   <link rel="stylesheet" href="assets/css/swiper.min.css">
   <link rel="stylesheet" href="assets/css/odometer-theme-default.css">
   <link rel="stylesheet" href="assets/css/magnific-popup.css">
   <link rel="stylesheet" href="assets/css/main.css">
   <link rel="stylesheet" href="assets/css/light-mode.css">
	   <link rel="stylesheet" href="assets/css/responsive.css">
      <style>
         .admin-indicator {
            position: fixed;
            right: 24px;
            bottom: 24px;
            z-index: 999;
            padding: 10px 16px;
            border-radius: 999px;
            background: linear-gradient(90deg, #14532d, #22c55e);
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.04em;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
         }

         .comment__avatar {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #6f42ff, #9d6bff);
            color: #fff;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            overflow: hidden;
         }

         .comment__avatar img {
            display: none;
         }
      </style>
	</head>

	<body class="absolute_header">
      <?php if ($isAdmin): ?>
         <div class="admin-indicator">Admin mode active</div>
      <?php endif; ?>

	   <!-- Preloader Area Start -->
   <div class="preloader">
      <svg viewbox="0 0 1000 1000" preserveaspectratio="none">
         <path id="preloaderSvg" d="M0,1005S175,995,500,995s500,5,500,5V0H0Z"></path>
      </svg>

      <div class="preloader-heading">
         <div class="load-text">
            <span>L</span>
            <span>o</span>
            <span>a</span>
            <span>d</span>
            <span>i</span>
            <span>n</span>
            <span>g</span>
         </div>
      </div>
   </div>
   <!-- Preloader Area End -->

   <!-- start: Back To Top -->
   <div class="progress-wrap" id="scrollUp">
      <svg class="progress-circle svg-content" width="100%" height="100%" viewbox="-1 -1 102 102">
         <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"></path>
      </svg>
   </div>
   <!-- end: Back To Top -->

   <!-- HEADER START -->
   <header class="tj-header-area header-absolute">
      <div class="container">
         <div class="row">
            <div class="col-12 d-flex flex-wrap align-items-center">
               <div class="logo-box">
                  <a href="index.htm">
                     <img src="assets/img/logo/logo.png" alt="">
                  </a>
               </div>

               <div class="header-info-list d-none d-md-inline-block">
                  <ul class="ul-reset">
                     <li><a href="mailto:Kartiksoni48226@gmail.com">Kartiksoni48226@gmail.com</a></li>
                  </ul>
               </div>

               <div class="header-menu">
                  <nav>
                     <ul>
                        <li><a href="index.htm#services-section">Services</a></li>
                        <li><a href="index.htm#works-section">Works</a></li>
                        <li><a href="index.htm#resume-section">Resume</a></li>
                        <li><a href="index.htm#skills-section">Skills</a></li>
                        <li><a href="index.htm#testimonials-section">Testimonials</a></li>
                        <li><a href="index.htm#contact-section">Contact</a></li>
                     </ul>
                  </nav>
               </div>

               <div class="header-button">
                  <a href="#" class="btn tj-btn-primary">Hire me!</a>
               </div>

               <div class="menu-bar d-lg-none">
                  <button>
                     <span></span>
                     <span></span>
                     <span></span>
                     <span></span>
                  </button>
               </div>
            </div>
         </div>
      </div>
   </header>
   <header class="tj-header-area header-2 header-sticky sticky-out">
      <div class="container">
         <div class="row">
            <div class="col-12 d-flex flex-wrap align-items-center">
               <div class="logo-box">
                  <a href="index.htm">
                     <img src="assets/img/logo/logo.png" alt="">
                  </a>
               </div>

               <div class="header-info-list d-none d-md-inline-block">
                  <ul class="ul-reset">
                     <li><a href="mailto:Kartiksoni48226@gmail.com">Kartiksoni48226@gmail.com</a></li>
                  </ul>
               </div>

               <div class="header-menu">
                  <nav>
                     <ul>
                        <li><a href="index.htm#services-section">Services</a></li>
                        <li><a href="index.htm#works-section">Works</a></li>
                        <li><a href="index.htm#resume-section">Resume</a></li>
                        <li><a href="index.htm#skills-section">Skills</a></li>
                        <li><a href="index.htm#testimonials-section">Testimonials</a></li>
                        <li><a href="index.htm#contact-section">Contact</a></li>
                     </ul>
                  </nav>
               </div>

               <div class="header-button">
                  <a href="#" class="btn tj-btn-primary">Hire me!</a>
               </div>

               <div class="menu-bar d-lg-none">
                  <button>
                     <span></span>
                     <span></span>
                     <span></span>
                     <span></span>
                  </button>
               </div>
            </div>
         </div>
      </div>
   </header>
   <!-- HEADER END -->

   <main class="site-content" id="content">
      <!-- START: Breadcrumb Area -->
      <section class="breadcrumb_area" data-bg-image="./assets/img/breadcrumb/breadcrumb-bg.jpg" data-bg-color="#140C1C">
         <div class="container">
            <div class="row">
               <div class="col">
                  <div class="breadcrumb_content d-flex flex-column align-items-center">
                     <h2 class="title wow fadeInUp" data-wow-delay=".3s"><?= htmlspecialchars($postTitle, ENT_QUOTES, 'UTF-8') ?></h2>
                     <div class="breadcrumb_navigation wow fadeInUp" data-wow-delay=".5s">
                        <span><a href="index.htm">Home</a></span>
                        <i class="far fa-long-arrow-right"></i>
                        <span class="current-item"><?= htmlspecialchars($postTitle, ENT_QUOTES, 'UTF-8') ?></span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
      <!-- END: Breadcrumb Area -->

      <!-- START: Blog Section -->
      <section class="full-width tj-post-details__area">
         <div class="container">
            <div class="row justify-content-center">
               <div class="col-lg-8">
                  <div class="tj-post-details__container">
                     <article class="tj-single__post">
                        <div class="tj-post__thumb">
                           <img src="assets/img/blog/1.jpg" alt="">

                           <a href="#" class="category"><?= htmlspecialchars($postCategory, ENT_QUOTES, 'UTF-8') ?></a>
                        </div>

                        <div class="tj-post__content">
                           <div class="tj-post__meta entry-meta">
                              <span><i class="fa-light fa-user"></i> <a href="#">By Admin</a></span>
                              <span><i class="fa-light fa-calendar-days"></i> <?= htmlspecialchars($postDate, ENT_QUOTES, 'UTF-8') ?></span>
                              <span><i class="fa-light fa-comments"></i><a href="#comments"><?= 'Comments (' . count($comments) . ')' ?></a></span>
                           </div>
                           <h3 class="tj-post__title entry-title"><?= htmlspecialchars($postTitle, ENT_QUOTES, 'UTF-8') ?></h3>

                           <div class="tj-post__content">
                              <p>
                                 Following exceptional UI/UX designers is one of the fastest ways to improve your design
                                 judgment and product taste.
                              </p>

                              <p>
                                 The best designers teach through systems, user flows, and thoughtful decision-making,
                                 not only through polished final screens.
                              </p>

                              <p>
                                 Watching how they frame problems, simplify interfaces, and guide attention helps teams
                                 build stronger digital experiences with more confidence.
                              </p>

                              <blockquote class="wp-block-quote">
                                 <p>
                                    “Welcome to our blog, where we celebrate our achievement as an AWS SaaS Competency
                                    Partner and share insights
                                    on how we accomplished this significant milestone. As businesses unlock growth
                                    opportunities in the digital
                                    age, harnessing the power of cloud computing has become essential. Amazon Web
                                    Services (AWS) offers the AWS
                                    SaaS Competency.”
                                 </p>
                                 <p><cite>Design Note</cite></p>
                              </blockquote>

                              <h4>Why Strong UI/UX Designers Are Worth Following</h4>
                              <p>
                                 Great designers show how to translate product complexity into interfaces that feel calm,
                                 clear, and purposeful.
                              </p>

                              <p>
                                 Their case studies usually reveal more than visual taste. They expose hierarchy, spacing,
                                 onboarding logic, and the reasoning behind every interaction.
                              </p>

                              <p>
                                 That makes them valuable references for anyone designing dashboards, landing pages,
                                 mobile products, or content-heavy experiences.
                              </p>
                              <p>
                                 Instead of copying outcomes, study how they think. That is where the biggest design
                                 improvement usually happens.
                              </p>

                              <h6>Key Points</h6>
                              <ul>
                                 <li>Study systems, not isolated screens</li>
                                 <li>Focus on hierarchy and interaction clarity</li>
                                 <li>Observe how strong portfolios explain decisions</li>
                                 <li>Use inspiration to improve judgment, not copy outputs</li>
                              </ul>

                              <h4>Conclusion</h4>
                              <p>
                                 Emphasize the long-term benefits of integrating sustainable practices into logistics
                                 operations, both for the
                                 planet and a company's reputation.
                              </p>

                              <p>
                                 These outlines can be expanded into comprehensive blog posts, each providing valuable
                                 insights and information on
                                 the respective topics.
                              </p>
                           </div>
                        </div>
                     </article>

                     <!-- post tags & social share -->
                     <div class="single-post_tag_share">
                        <!-- post tags -->
                        <div class="tj_tag">
                           <h4 class="tag__title">Tags:</h4>
                           <div class="tagcloud">
                              <a href="#" rel="tag">Business</a>
                              <a href="#" rel="tag">Analysis</a>
                              <a href="#" rel="tag">Technology</a>
                              <a href="#" rel="tag">Design</a>
                              <a href="#" rel="tag">Strategy</a>
                              <a href="#" rel="tag">Tips</a>
                           </div>
                        </div>
                        <div class="share_link">
                           <a href="#" target="_blank" class="facebook" title="Share this on Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                           <a href="#" class="twitter" title="Share this on Twitter" target="_blank"><i class="fa-brands fa-x-twitter"></i></a>
                           <a href="#" class="linkedin" title="Share this on Linkedin" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a>
                           <a href="#" class="pinterest" title="Pin this Post" target="_blank"><i class="fa-brands fa-pinterest-p"></i></a>
                        </div>
                     </div>

                     <!-- post navigation -->
                     <div class="single-post__navigation">
                        <!-- previous post -->
                        <div class="tj-navigation_post previous">
                           <div class="tj-navigation-post_inner prev_post">
                              <div class="navigation-post_img">
                                 <a href="<?= htmlspecialchars($previousPost['file'], ENT_QUOTES, 'UTF-8') ?>"> <img src="<?= htmlspecialchars($previousPost['image'], ENT_QUOTES, 'UTF-8') ?>" alt=""> </a>
                              </div>
                              <div class="tj-content">
                                 <div class="post_pagination_nav"><i class="fa-regular fa-angle-double-left"></i>previous</div>
                                 <div class="post_pagination_title">
                                    <h5 class="title">
                                       <a href="<?= htmlspecialchars($previousPost['file'], ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($previousPost['title'], ENT_QUOTES, 'UTF-8') ?></a>
                                    </h5>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <!-- next post -->

                        <div class="tj-navigation_post next">
                           <div class="tj-navigation-post_inner next_post">
                              <div class="tj-content">
                                 <div class="post_pagination_nav">Next<i class="fa-regular fa-angle-double-right"></i>
                                 </div>
                                 <div class="post_pagination_title">
                                    <h5 class="title">
                                       <a href="<?= htmlspecialchars($nextPost['file'], ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($nextPost['title'], ENT_QUOTES, 'UTF-8') ?></a>
                                    </h5>
                                 </div>
                              </div>
                              <div class="navigation-post_img">
                                 <a href="<?= htmlspecialchars($nextPost['file'], ENT_QUOTES, 'UTF-8') ?>"> <img src="<?= htmlspecialchars($nextPost['image'], ENT_QUOTES, 'UTF-8') ?>" alt=""> </a>
                              </div>
                           </div>
                        </div>
                     </div>

                     <!-- comments area -->
                     <div class="tj-comments__container">
                        <div class="tj-comments__wrap">
                           <div class="tj-comment__title">
                              <h3><?= count($comments) ?> Comment<?= count($comments) === 1 ? '' : 's' ?></h3>
                           </div>

                           <div class="tj-latest__comments">
                              <?php if ($commentStatus !== ''): ?>
                                 <p style="color:#22c55e; margin-bottom: 20px;"><?= htmlspecialchars($commentStatus, ENT_QUOTES, 'UTF-8') ?></p>
                              <?php endif; ?>
                              <?php if ($commentError !== ''): ?>
                                 <p style="color:#ef4444; margin-bottom: 20px;"><?= htmlspecialchars($commentError, ENT_QUOTES, 'UTF-8') ?></p>
                              <?php endif; ?>
                              <ul>
                                 <?php if ($comments === []): ?>
                                    <li class="tj__comment">
                                       <div class="tj-comment__wrap">
                                          <div class="comment__text">
                                             <div class="avatar__name">
                                                <h5><a href="">No comments yet</a></h5>
                                                <span>Be the first to comment on this post.</span>
                                             </div>
                                          </div>
                                       </div>
                                    </li>
                                 <?php else: ?>
                                    <?php foreach ($comments as $commentItem): ?>
                                       <li class="tj__comment">
                                          <div class="tj-comment__wrap">
                                             <div class="comment__avatar">
                                                <span><?= htmlspecialchars(comment_initials((string) $commentItem['author']), ENT_QUOTES, 'UTF-8') ?></span>
                                             </div>
                                             <div class="comment__text">
                                                <div class="avatar__name">
                                                   <h5><a href="<?= htmlspecialchars((string) ($commentItem['website'] ?: '#'), ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars((string) $commentItem['author'], ENT_QUOTES, 'UTF-8') ?></a></h5>
                                                   <span><?= htmlspecialchars(date('F j, Y', strtotime((string) $commentItem['created_at'])), ENT_QUOTES, 'UTF-8') ?></span>
                                                </div>
                                                <p><?= nl2br(htmlspecialchars((string) $commentItem['comment'], ENT_QUOTES, 'UTF-8')) ?></p>
                                                <div class="comment__reply" style="display:flex; gap:12px; align-items:center;">
                                                   <a class="comment-reply-link" href="#comment">Reply</a>
                                                   <?php if ($isAdmin): ?>
                                                      <form action="<?= htmlspecialchars($postFile, ENT_QUOTES, 'UTF-8') ?>" method="post" onsubmit="return confirm('Delete this comment?');" style="margin:0;">
                                                         <input type="hidden" name="delete_comment_id" value="<?= (int) $commentItem['id'] ?>">
                                                         <button type="submit" style="border:0; background:none; color:#ff6b6b; padding:0;">Delete</button>
                                                      </form>
                                                   <?php endif; ?>
                                                </div>
                                             </div>
                                          </div>
                                       </li>
                                    <?php endforeach; ?>
                                 <?php endif; ?>
                              </ul>
                           </div>
                        </div>

                        <div class="comment-respond">
                           <h3 class="comment-reply-title">
                              <span class="tj-comment__title">Leave a Reply</span>
                           </h3>

                           <form action="<?= htmlspecialchars($postFile, ENT_QUOTES, 'UTF-8') ?>" method="post" class="tj-post-comment__form">
                              <p class="comment-notes">
                                 <span id="email-notes">Your email address will not be published.</span>
                                 <span class="required-field-message">Required fields are marked <span class="required">*</span></span>
                              </p>

                              <div class="row">
                                 <div class="col-md-6">
                                    <div class="form_group">
                                       <input placeholder="Enter Name" id="author" name="author" type="text" aria-required="true" value="<?= htmlspecialchars($commentForm['author'], ENT_QUOTES, 'UTF-8') ?>">
                                    </div>
                                 </div>
                                 <div class="col-md-6">
                                    <div class="form_group">
                                       <input placeholder="Enter Email" id="email" name="email" type="email" aria-required="true" value="<?= htmlspecialchars($commentForm['email'], ENT_QUOTES, 'UTF-8') ?>">
                                    </div>
                                 </div>
                                 <div class="col-md-12">
                                    <div class="form_group">
                                       <input placeholder="Enter Website" id="url" name="url" type="url" value="<?= htmlspecialchars($commentForm['url'], ENT_QUOTES, 'UTF-8') ?>">
                                    </div>
                                 </div>
                              </div>

                              <div class="row">
                                 <div class="col-md-12">
                                    <div class="form_group">
                                       <textarea class="msg-box" placeholder="Enter Your Comments" id="comment" name="comment" cols="45" rows="8"><?= htmlspecialchars($commentForm['comment'], ENT_QUOTES, 'UTF-8') ?></textarea>
                                    </div>
                                 </div>
                                 <div class="clearfix"></div>
                              </div>

                              <p class="comment-form-cookies-consent">
                                 <input id="wp-comment-cookies-consent" name="wp-comment-cookies-consent" type="checkbox" value="yes">
                                 <label for="wp-comment-cookies-consent">Save my name, email, and website in this
                                    browser for the next time I comment.</label>
                              </p>
                              <button class="tj-btn-primary submit" type="submit">Post Comment</button>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="col-lg-4">
                  <div class="tj_main_sidebar">
                     <div class="sidebar_widget widget_search wow fadeInUp" data-wow-delay=".3s">
                        <div class="tj-widget__search form_group">
                           <form class="search-form" action="#" method="get">
                              <input type="search" id="search" name="search" placeholder="Search...">
                              <button class="search-btn" type="submit"><i class="fa-light fa-magnifying-glass"></i></button>
                           </form>
                        </div>
                     </div>

                     <div class="sidebar_widget widget_categories wow fadeInUp" data-wow-delay=".3s">
                        <div class="widget_title">
                           <h3 class="title">Categories</h3>
                        </div>

                        <ul>
                           <li><a href="#">Business</a> (4)</li>
                           <li><a href="#">Analysis</a> (0)</li>
                           <li><a href="#">Technology</a> (1)</li>
                           <li><a href="#">Technology</a> (10)</li>
                        </ul>
                     </div>

                     <div class="sidebar_widget tj_recent_posts wow fadeInUp" data-wow-delay=".3s">
                        <div class="widget_title">
                           <h3 class="title">Recent post</h3>
                        </div>

                        <ul>
                           <li>
                              <div class="recent-post_thumb">
                                 <a href="blog-details.php">
                                    <img src="assets/img/blog/post-thumb-1.jpg" alt="">
                                 </a>
                              </div>

                              <div class="recent-post_content">
                                 <div class="tj-post__meta entry-meta">
                                    <span><i class="fa-light fa-calendar-days"></i>Jan 2024</span>
                                    <span><i class="fa-light fa-comments"></i><a href="#"> (3)</a></span>
                                 </div>
                                 <h4 class="recent-post_title">
                                    <a href="blog-details.php">Top 10 UI/UX Designers To Follow For Better Product Thinking</a>
                                 </h4>
                              </div>
                           </li>
                           <li>
                              <div class="recent-post_thumb">
                                 <a href="blog-app-development.php">
                                    <img src="assets/img/blog/post-thumb-2.jpg" alt="">
                                 </a>
                              </div>

                              <div class="recent-post_content">
                                 <div class="tj-post__meta entry-meta">
                                    <span><i class="fa-light fa-calendar-days"></i>Jan 2024</span>
                                    <span><i class="fa-light fa-comments"></i><a href="#"> (3)</a></span>
                                 </div>
                                 <h4 class="recent-post_title">
                                    <a href="blog-app-development.php">App Development Guides For Teams Building Better Products</a>
                                 </h4>
                              </div>
                           </li>
                           <li>
                              <div class="recent-post_thumb">
                                 <a href="blog-graphic-design.php">
                                    <img src="assets/img/blog/post-thumb-3.jpg" alt="">
                                 </a>
                              </div>

                              <div class="recent-post_content">
                                 <div class="tj-post__meta entry-meta">
                                    <span><i class="fa-light fa-calendar-days"></i>Jan 2024</span>
                                    <span><i class="fa-light fa-comments"></i><a href="#"> (3)</a></span>
                                 </div>
                                 <h4 class="recent-post_title">
                                    <a href="blog-graphic-design.php">Learn Graphic Design Free With Smarter Practice Habits</a>
                                 </h4>
                              </div>
                           </li>
                        </ul>
                     </div>

                     <div class="sidebar_widget widget_tag_cloud wow fadeInUp" data-wow-delay=".3s">
                        <div class="widget_title">
                           <h3 class="title">Popular tag</h3>
                        </div>

                        <div class="tagcloud">
                           <a href="#">Business</a>
                           <a href="#">Analysis</a>
                           <a href="#">Technology</a>
                           <a href="#">Finance</a>
                           <a href="#">Design</a>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
      <!-- END: Blog Section -->
   </main>

   <!-- FOOTER AREA START -->
   <footer class="tj-footer-area footer-rich">
      <div class="container">
         <div class="footer-rich-inner">
            <div class="row gy-5">
               <div class="col-lg-3 col-md-6">
                  <div class="footer-widget">
                     <div class="footer-brand">
                        <div class="footer-logo-box">
                           <a href="index.htm"><img src="assets/img/logo/logo.png" alt="Kartik Soni logo"></a>
                        </div>
                        <h3 class="footer-widget-title">Kartik Soni</h3>
                     </div>
                     <p class="footer-brand-copy">Turning ideas into focused work that leaves a lasting impression.</p>
                     <ul class="footer-social">
                        <li><a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a></li>
                        <li><a href="https://x.com/kartiksoni2605" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a></li>
                        <li><a href="https://www.instagram.com/__kartiksoni__/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a></li>
                        <li><a href="https://www.linkedin.com/in/kartik-soni-596b31291" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="https://github.com/kartiksoni543" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="fa-brands fa-github"></i></a></li>
                     </ul>
                  </div>
               </div>
               <div class="col-lg-3 col-md-6">
                  <div class="footer-widget">
                     <h3 class="footer-widget-title">Links</h3>
                     <ul class="footer-links">
                        <li><a href="index.htm#services-section">Services</a></li>
                        <li><a href="index.htm#works-section">Works</a></li>
                        <li><a href="index.htm#resume-section">Resume</a></li>
                        <li><a href="index.htm#skills-section">Skills</a></li>
                        <li><a href="index.htm#testimonials-section">Testimonials</a></li>
                        <li><a href="index.htm#contact-section">Contact</a></li>
                     </ul>
                  </div>
               </div>
               <div class="col-lg-3 col-md-6">
                  <div class="footer-widget">
                     <h3 class="footer-widget-title">Services</h3>
                     <ul class="footer-service-list">
                        <li><a href="index.htm#services-section">Web Design</a></li>
                        <li><a href="index.htm#services-section">Web Development</a></li>
                        <li><a href="index.htm#services-section">Business Strategy</a></li>
                        <li><a href="index.htm#services-section">Data Analysis</a></li>
                        <li><a href="index.htm#services-section">Graphic Design</a></li>
                     </ul>
                  </div>
               </div>
               <div class="col-lg-3 col-md-6">
                  <div class="footer-widget">
                     <h3 class="footer-widget-title">Have a Questions?</h3>
                     <ul class="footer-contact-list">
                        <li>
                           <i class="fa-solid fa-location-dot"></i>
                           <span>Mandi(HP),India</span>
                        </li>
                        <li>
                           <i class="fa-solid fa-phone"></i>
                           <a href="tel:+919816748226">+91 9816748226</a>
                        </li>
                        <li>
                           <i class="fa-solid fa-envelope"></i>
                           <a href="mailto:Kartiksoni48226@gmail.com">Kartiksoni48226@gmail.com</a>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </footer>
   <!-- FOOTER AREA END -->

   <!-- CSS here -->
   <script src="assets/js/jquery.min.js"></script>
   <script src="assets/js/bootstrap.bundle.min.js"></script>
   <script src="assets/js/nice-select.min.js"></script>
   <script src="assets/js/backToTop.js"></script>
   <script src="assets/js/smooth-scroll.js"></script>
   <script src="assets/js/appear.min.js"></script>
   <script src="assets/js/wow.min.js"></script>
   <script src="assets/js/gsap.min.js"></script>
   <script src="assets/js/one-page-nav.js"></script>
   <script src="assets/js/lightcase.js"></script>
   <script src="assets/js/owl.carousel.min.js"></script>
   <script src="assets/js/swiper.min.js"></script>
   <script src="assets/js/imagesloaded-pkgd.js"></script>
   <script src="assets/js/isotope.pkgd.min.js"></script>
   <script src="assets/js/odometer.min.js"></script>
   <script src="assets/js/magnific-popup.js"></script>
   <script src="assets/js/main.js"></script>
</body>

</html>
