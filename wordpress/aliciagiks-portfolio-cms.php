/**
 * Plugin Name: Aliciagiks4art Portfolio CMS
 * Description: Headless Projects CPT + REST API for aliciagiks4art.netlify.app
 * Version: 1.0.0
 * Author: Aliciagiks4art
 */

if (!defined('ABSPATH')) exit;

class AliciaGiks_Portfolio_CMS {
  const CPT = 'projects';
  const TAX = 'project_category';
  const ALLOWED_ORIGINS = [
    'https://aliciagiks4art.netlify.app',
    'http://localhost:8888',
    'http://127.0.0.1:5500',
    'http://localhost:5500',
  ];

  public static function init() {
    add_action('init', [__CLASS__, 'register_cpt']);
    add_action('init', [__CLASS__, 'register_taxonomy']);
    add_action('init', [__CLASS__, 'register_meta']);
    add_action('rest_api_init', [__CLASS__, 'register_rest_fields']);
    add_filter('rest_prepare_' . self::CPT, [__CLASS__, 'prepare_rest_response'], 10, 3);
    add_filter('rest_pre_serve_request', [__CLASS__, 'send_cors_headers'], 10, 4);
    add_action('init', [__CLASS__, 'seed_default_terms'], 20);
  }

  public static function register_cpt() {
    register_post_type(self::CPT, [
      'labels' => [
        'name' => 'Projects',
        'singular_name' => 'Project',
        'add_new_item' => 'Add New Project',
        'edit_item' => 'Edit Project',
        'menu_name' => 'Projects',
      ],
      'public' => true,
      'show_in_rest' => true,
      'rest_base' => 'projects',
      'menu_icon' => 'dashicons-portfolio',
      'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'],
      'has_archive' => false,
      'rewrite' => ['slug' => 'projects'],
    ]);
  }

  public static function register_taxonomy() {
    register_taxonomy(self::TAX, self::CPT, [
      'labels' => [
        'name' => 'Categories',
        'singular_name' => 'Category',
      ],
      'public' => true,
      'show_in_rest' => true,
      'hierarchical' => false,
      'rewrite' => ['slug' => 'project-category'],
    ]);
  }

  public static function register_meta() {
    $fields = [
      'client' => 'string',
      'role' => 'string',
      'project_date' => 'string',
      'video_url' => 'string',
      'featured' => 'boolean',
      'process_stills' => 'array',
    ];

    foreach ($fields as $key => $type) {
      register_post_meta(self::CPT, $key, [
        'type' => $type,
        'single' => true,
        'show_in_rest' => true,
        'auth_callback' => function () { return current_user_can('edit_posts'); },
      ]);
    }
  }

  public static function register_rest_fields() {
    register_rest_field(self::CPT, 'portfolio', [
      'get_callback' => [__CLASS__, 'get_portfolio_payload'],
      'schema' => [
        'description' => 'Normalized portfolio payload for the headless frontend',
        'type' => 'object',
      ],
    ]);
  }

  private static function media_payload($attachment_id) {
    if (!$attachment_id) return null;

    $src = wp_get_attachment_image_url($attachment_id, 'full');
    if (!$src) return null;

    $meta = wp_get_attachment_metadata($attachment_id);
    $alt = get_post_meta($attachment_id, '_wp_attachment_image_alt', true);

    return [
      'id' => (int) $attachment_id,
      'src' => $src,
      'alt' => $alt ?: '',
      'width' => isset($meta['width']) ? (int) $meta['width'] : null,
      'height' => isset($meta['height']) ? (int) $meta['height'] : null,
      'aspect_ratio' => (!empty($meta['width']) && !empty($meta['height']))
        ? round($meta['width'] / $meta['height'], 4)
        : null,
    ];
  }

  public static function get_portfolio_payload($post) {
    $post_id = $post['id'];
    $thumb_id = get_post_thumbnail_id($post_id);
    $featured = self::media_payload($thumb_id);
    $video_url = get_post_meta($post_id, 'video_url', true);
    $process_ids = get_post_meta($post_id, 'process_stills', true);
    $process_stills = [];

    if (is_array($process_ids)) {
      foreach ($process_ids as $id) {
        $payload = self::media_payload((int) $id);
        if ($payload) $process_stills[] = $payload;
      }
    }

    $terms = wp_get_post_terms($post_id, self::TAX, ['fields' => 'names']);
    $category = !empty($terms) ? $terms[0] : 'Graphic';

    return [
      'slug' => $post['slug'],
      'title' => get_the_title($post_id),
      'category' => $category,
      'brief' => get_the_excerpt($post_id) ?: wp_trim_words(wp_strip_all_tags(get_post_field('post_content', $post_id)), 40),
      'client' => get_post_meta($post_id, 'client', true) ?: 'Personal / Freelance',
      'role' => get_post_meta($post_id, 'role', true) ?: 'Graphic Designer & Motion Artist',
      'year' => get_post_meta($post_id, 'project_date', true) ?: get_the_date('Y', $post_id),
      'featured' => (bool) get_post_meta($post_id, 'featured', true),
      'type' => $video_url ? 'video' : 'image',
      'src' => $video_url ?: ($featured['src'] ?? ''),
      'poster' => $featured['src'] ?? '',
      'alt' => $featured['alt'] ?? get_the_title($post_id),
      'width' => $featured['width'] ?? null,
      'height' => $featured['height'] ?? null,
      'aspect_ratio' => $featured['aspect_ratio'] ?? null,
      'process_stills' => $process_stills,
      'date' => get_the_date('c', $post_id),
    ];
  }

  public static function prepare_rest_response($response, $post, $request) {
    $data = $response->get_data();
    $thumb_id = get_post_thumbnail_id($post->ID);

    if ($thumb_id) {
      $meta = wp_get_attachment_metadata($thumb_id);
      $data['featured_media_details'] = [
        'src' => wp_get_attachment_image_url($thumb_id, 'full'),
        'alt' => get_post_meta($thumb_id, '_wp_attachment_image_alt', true),
        'width' => isset($meta['width']) ? (int) $meta['width'] : null,
        'height' => isset($meta['height']) ? (int) $meta['height'] : null,
        'aspect_ratio' => (!empty($meta['width']) && !empty($meta['height']))
          ? round($meta['width'] / $meta['height'], 4)
          : null,
      ];
    }

    $response->set_data($data);
    return $response;
  }

  public static function send_cors_headers($served, $result, $request, $server) {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    if (in_array($origin, self::ALLOWED_ORIGINS, true)) {
      header('Access-Control-Allow-Origin: ' . $origin);
      header('Vary: Origin', false);
    }
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
      status_header(204);
      exit;
    }

    return $served;
  }

  public static function seed_default_terms() {
    if (get_option('aliciagiks_portfolio_terms_seeded')) return;

    $terms = ['Branding', 'Motion', 'Illustration', 'Graphic'];
    foreach ($terms as $term) {
      if (!term_exists($term, self::TAX)) {
        wp_insert_term($term, self::TAX, ['slug' => sanitize_title($term)]);
      }
    }

    update_option('aliciagiks_portfolio_terms_seeded', 1);
  }
}

AliciaGiks_Portfolio_CMS::init();
