import axios from 'axios';

/**
 * Internet Archive (archive.org) integration.
 *
 * Verified against the live API:
 *  - `GET https://archive.org/advancedsearch.php` answers JSON
 *    (`response: { numFound, start, docs }`) and sends
 *    `Access-Control-Allow-Origin: *`, so the browser can call it directly —
 *    no proxy / backend endpoint is required.
 *  - `GET https://archive.org/metadata/:identifier` lists the item's files and
 *    is CORS enabled too, which lets us build a lawful MP4/HLS source.
 *
 * The default query asks for openly available FEATURE FILMS. A bare
 * `mediatype:movies` returns ~17M items whose first hits are city council
 * meeting recordings, not films.
 */

export const ARCHIVE_SEARCH_URL = 'https://archive.org/advancedsearch.php';
export const ARCHIVE_METADATA_URL = 'https://archive.org/metadata';
export const ARCHIVE_DETAILS_URL = 'https://archive.org/details';
export const ARCHIVE_POSTER_URL = 'https://archive.org/services/img';
export const ARCHIVE_DOWNLOAD_URL = 'https://archive.org/download';

export const ARCHIVE_QUERY = 'mediatype:movies AND subject:"feature film"';

const SEARCH_FIELDS = [
  'identifier',
  'title',
  'description',
  'year',
  'subject',
  'creator',
  'downloads',
  'licenseurl',
  'date',
];

/** Genres we can confidently map an archive.org `subject` tag onto. */
const GENRE_TAGS = [
  'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary',
  'drama', 'family', 'fantasy', 'film-noir', 'film noir', 'history', 'horror',
  'music', 'musical', 'mystery', 'romance', 'sci-fi', 'science fiction',
  'short', 'sport', 'thriller', 'war', 'western',
];

const REQUEST_TIMEOUT = 15000;

/** Archive.org returns a string or an array for most text fields. */
const firstString = (value) => {
  if (Array.isArray(value)) return firstString(value[0]);
  return typeof value === 'string' ? value.trim() : '';
};

const toTitleCase = (text) =>
  String(text)
    .toLowerCase()
    .replace(/\b[a-z]/g, (c) => c.toUpperCase());

/**
 * Archive.org descriptions are user supplied: they often contain pasted
 * marketing blocks, link dumps and `======` separators. Keep the readable part.
 */
const cleanDescription = (raw, max = 600) => {
  let text = firstString(raw);
  if (!text) return '';

  text = text.split(/={8,}|-{8,}|\*{8,}/)[0];
  text = text.replace(/https?:\/\/\S+/g, '');
  text = text.replace(/\s+/g, ' ').trim();

  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).trim()}…`;
};

const pickGenre = (subject) => {
  // The search API returns an array; the metadata API returns one
  // semicolon-separated string ("John Wayne; Western; Feature Film;").
  const tags = (Array.isArray(subject) ? subject : String(subject || '').split(/[;,]/))
    .flatMap((tag) => String(tag).split(/[;,]/))
    .map((tag) => tag.trim())
    .filter(Boolean);

  const genre = tags.find((tag) => GENRE_TAGS.includes(tag.toLowerCase()));
  return genre ? toTitleCase(genre) : 'Feature Film';
};

/** Map one archive.org search/metadata doc onto the app's movie shape. */
export const normalizeArchiveItem = (doc = {}) => {
  const identifier = firstString(doc.identifier);
  if (!identifier) return null;

  const title = firstString(doc.title) || identifier;
  // Some items only carry `date` (e.g. "1931"), never `year`.
  const rawYear = firstString(doc.year) || firstString(doc.date);
  const year = Number(rawYear) || Number(String(rawYear).slice(0, 4)) || null;

  return {
    id: identifier,
    _id: identifier,
    identifier,
    title,
    description: cleanDescription(doc.description),
    poster: `${ARCHIVE_POSTER_URL}/${identifier}`,
    genre: pickGenre(doc.subject),
    year,
    creator: firstString(doc.creator),
    downloads: Number(doc.downloads) || 0,
    license:
      firstString(doc.licenseurl) ||
      firstString(doc.license) ||
      firstString(doc.rights) ||
      null,
    source: 'archive.org',
  };
};

/** Free text → archive.org query string. Quote multi-word terms. */
const buildQuery = (search) => {
  const term = String(search || '').trim();
  if (!term) return ARCHIVE_QUERY;

  const quoted = term.includes(' ')
    ? `"${term.replace(/"/g, '')}"`
    : term.replace(/[^\w\s'-]/g, '');
  if (!quoted) return ARCHIVE_QUERY;

  return `${ARCHIVE_QUERY} AND (title:${quoted} OR description:${quoted})`;
};

const buildSearchUrl = ({ search, page, limit, sort }) => {
  const params = new URLSearchParams();
  params.set('q', buildQuery(search));
  SEARCH_FIELDS.forEach((field) => params.append('fl[]', field));
  params.append('sort[]', sort);
  params.set('rows', String(limit));
  params.set('page', String(page));
  params.set('output', 'json');
  return `${ARCHIVE_SEARCH_URL}?${params.toString()}`;
};

const VIDEO_FILE_PATTERN = /\.(mp4|m4v|ogv|webm|m3u8)$/i;
/** Preferred playback order: native MP4 first, then HLS, then the rest. */
const FORMAT_PRIORITY = ['h.264', '512kb mpeg4', 'mpeg4', 'h.264 ia'];

const normalizeFile = (file, identifier) => {
  const name = firstString(file.name);
  if (!name || !VIDEO_FILE_PATTERN.test(name)) return null;

  const format = firstString(file.format);
  return {
    name,
    format,
    // Some items store files inside a sub folder — only flat names are safe here.
    url: `${ARCHIVE_DOWNLOAD_URL}/${encodeURIComponent(identifier)}/${name
      .split('/')
      .map(encodeURIComponent)
      .join('/')}`,
    height: Number(file.height) || 0,
    length: Number(file.length) || 0,
  };
};

const pickStream = (files) => {
  if (!files.length) return null;
  const ranked = [...files].sort((a, b) => {
    const ra = FORMAT_PRIORITY.indexOf((a.format || '').toLowerCase());
    const rb = FORMAT_PRIORITY.indexOf((b.format || '').toLowerCase());
    const pa = ra === -1 ? FORMAT_PRIORITY.length : ra;
    const pb = rb === -1 ? FORMAT_PRIORITY.length : rb;
    if (pa !== pb) return pa - pb;
    if (a.name.endsWith('.m3u8') !== b.name.endsWith('.m3u8')) {
      return a.name.endsWith('.m3u8') ? 1 : -1;
    }
    return b.height - a.height;
  });
  return ranked[0];
};

export const archiveService = {
  /**
   * Paginated list of openly available feature films.
   * @returns {{ movies: object[], page: number, limit: number, total: number, totalPages: number }}
   */
  async search({ search = '', page = 1, limit = 24, sort = 'downloads desc' } = {}) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(48, Math.max(1, Number(limit) || 24));

    const { data } = await axios.get(buildSearchUrl({ search, page: safePage, limit: safeLimit, sort }), {
      timeout: REQUEST_TIMEOUT,
    });

    const response = data?.response || {};
    const total = Number(response.numFound) || 0;
    const movies = (response.docs || []).map(normalizeArchiveItem).filter(Boolean);

    return {
      movies,
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    };
  },

  /**
   * Item metadata + playable files.
   * Returns `source: null` when the item has no video file we can lawfully play.
   */
  async getDetails(identifier) {
    const id = firstString(identifier);
    if (!id) throw new Error('archive.org identifier is required');

    const { data } = await axios.get(`${ARCHIVE_METADATA_URL}/${encodeURIComponent(id)}`, {
      timeout: REQUEST_TIMEOUT,
    });

    const metadata = data?.metadata || {};
    const item = normalizeArchiveItem({ ...metadata, identifier: id });
    if (!item) throw new Error('archive.org item not found');

    const files = (data?.files || [])
      .map((file) => normalizeFile(file, id))
      .filter(Boolean);

    const best = pickStream(files);

    return {
      ...item,
      title: firstString(metadata.title) || item.title,
      description: cleanDescription(metadata.description) || item.description,
      files,
      source: best
        ? {
            type: best.name.endsWith('.m3u8') ? 'hls' : 'mp4',
            url: best.url,
            label: best.height ? `${best.height}p` : best.format || 'Video',
            license: `Internet Archive — ${item.license || 'public domain / open access'}`,
            ageRating: 'N/A',
            movieId: id,
          }
        : null,
      detailsUrl: `${ARCHIVE_DETAILS_URL}/${encodeURIComponent(id)}`,
    };
  },
};

export default archiveService;
