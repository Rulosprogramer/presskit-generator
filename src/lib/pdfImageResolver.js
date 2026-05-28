import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from './firebase';

const VALID_PDF_IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)$/i;

function isFirebaseStorageRestUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const parsed = new URL(value);
    return parsed.hostname.includes('firebasestorage.googleapis.com') && parsed.pathname.includes('/o/');
  } catch {
    return false;
  }
}

function extractStoragePath(value) {
  try {
    const parsed = new URL(value);
    const encodedPath = parsed.pathname.split('/o/')[1] || '';
    return decodeURIComponent(encodedPath);
  } catch {
    return '';
  }
}

export function isValidPdfImage(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('data:')) {
    return /^data:image\/(png|jpe?g|webp);base64,/i.test(url);
  }

  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname || '';
    if (!VALID_PDF_IMAGE_EXTENSIONS.test(pathname)) return false;
    const hasFirebaseToken = parsed.hostname.includes('firebasestorage.googleapis.com')
      ? parsed.searchParams.has('token') && parsed.searchParams.get('alt') === 'media'
      : true;
    return hasFirebaseToken;
  } catch {
    return VALID_PDF_IMAGE_EXTENSIONS.test(url.split('?')[0].split('#')[0]);
  }
}

async function resolveStorageUrl(value) {
  if (!isFirebaseStorageRestUrl(value)) return typeof value === 'string' ? value : '';

  const storagePath = extractStoragePath(value);
  if (!storagePath) return '';

  try {
    return await getDownloadURL(ref(storage, storagePath));
  } catch {
    return '';
  }
}

export async function normalizePresskitStorageUrls(data) {
  const source = data || {};

  const resolvedImages = await Promise.all((Array.isArray(source.images) ? source.images : []).map(resolveStorageUrl));
  const resolvedPressArticles = await Promise.all((Array.isArray(source.pressArticles) ? source.pressArticles : []).map(resolveStorageUrl));

  const resolvedLinkScreenshots = {};
  for (const [key, value] of Object.entries(source.linkScreenshots || {})) {
    resolvedLinkScreenshots[key] = await resolveStorageUrl(value);
  }

  const resolvedRecognitionImage = await resolveStorageUrl(source.recognitionImage);
  const resolvedTwitterBioImage = await resolveStorageUrl(source.twitterBioImage);
  const resolvedBioImage = await resolveStorageUrl(source.bioImage);
  const resolvedLongBioImage = await resolveStorageUrl(source.longBioImage);
  const resolvedContactLogo = await resolveStorageUrl(source.contactLogo);

  return {
    ...source,
    images: resolvedImages.filter(isValidPdfImage),
    recognitionImage: isValidPdfImage(resolvedRecognitionImage) ? resolvedRecognitionImage : '',
    twitterBioImage: isValidPdfImage(resolvedTwitterBioImage) ? resolvedTwitterBioImage : '',
    bioImage: isValidPdfImage(resolvedBioImage) ? resolvedBioImage : '',
    longBioImage: isValidPdfImage(resolvedLongBioImage) ? resolvedLongBioImage : '',
    contactLogo: isValidPdfImage(resolvedContactLogo) ? resolvedContactLogo : '',
    pressArticles: resolvedPressArticles.filter(isValidPdfImage),
    linkScreenshots: Object.fromEntries(
      Object.entries(resolvedLinkScreenshots).filter(([, value]) => isValidPdfImage(value))
    ),
  };
}

export async function resolvePdfPresskitData(data) {
  return normalizePresskitStorageUrls(data);
}
