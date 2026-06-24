import { useEffect, useMemo, useRef, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../lib/firebase';
import { normalizePresskitStorageUrls } from '../lib/pdfImageResolver';
import { generateBioSectionWithAI } from '../lib/aiBio';
import { fileExistsInLibrary, addImageToLibrary } from '../lib/imageLibrary';
import Topbar from '../components/post-login/Topbar.jsx';
import Stepform from '../components/post-login/Stepform.jsx';
import LivePreview from '../components/post-login/livePreview.jsx';
import PublishModal from '../components/post-login/PublishModal.jsx';
import ImageLibraryModal from '../components/post-login/ImageLibraryModal.jsx';
import BiographyAIModal from '../components/BiographyAIModal.jsx';
import MilestoneAIModal from '../components/MilestoneAIModal.jsx';

function generatePressKitSlug(artistName) {
  const base = (artistName || 'artist')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40);
  return `music-presskit-${base || 'artist'}`;
}

function createEmptyArtistMilestones() {
  return {
    digital: [],
    live: [],
    press: [],
    collaborations: [],
  };
}

function normalizeRecognitions(value) {
  if (Array.isArray(value)) return value.slice(0, 10);
  if (typeof value === 'string' && value.trim())
    return value.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 10);
  return [];
}

function normalizeArtistMilestones(value) {
  const empty = createEmptyArtistMilestones();

  return Object.keys(empty).reduce((accumulator, key) => {
    accumulator[key] = Array.isArray(value?.[key])
      ? value[key]
          .map((item) => String(item || '').trim())
          .filter(Boolean)
          .slice(0, 3)
      : [];
    return accumulator;
  }, empty);
}

function ensureArtistMilestonesShape(value) {
  const empty = createEmptyArtistMilestones();

  return Object.keys(empty).reduce((accumulator, key) => {
    accumulator[key] = Array.isArray(value?.[key])
      ? value[key].slice(0, 3).map((item) => String(item ?? ''))
      : [];
    return accumulator;
  }, empty);
}

const gallerySlotToIndex = {
  hero: 1,
  flyer: 2,
  liveAct: 3,
  concept: 4,
  horizA: 5,
  horizB: 6,
};

const defaultCoverFrame = {
  coverImageScale: 1,
  coverImageOffsetX: 0,
  coverImageOffsetY: 0,
  coverImageAspect: 0,
};

function setGalleryImageForSlot(images, slot, imageUrl) {
  const nextImages = Array.isArray(images) ? [...images] : [];
  const index = gallerySlotToIndex[slot];
  if (typeof index !== 'number') return nextImages;
  nextImages[index] = imageUrl;
  return nextImages.slice(0, 7);
}

const initialPresskitData = {
  artistName: '',
  genre: '',
  city: '',
  ...defaultCoverFrame,
  performanceLiveLink: '',
  totalStreams: '',
  totalVideoViews: '',
  recognitions: [],
  useRecognitionImage: false,
  recognitionImage: '',
  bioStyle: 'prensa',
  twitterBio: '',
  twitterBioImage: '',
  bio: '',
  bioImage: '',
  longBio: '',
  longBioImage: '',
  interviewLink: '',
  artistMilestones: createEmptyArtistMilestones(),
  releases: [],
  releasesCtaText: 'Dale play y disfruta los videos que estan marcando el camino de Rulos.',
  images: [],
  links: {
    spotify: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    facebook: '',
    appleMusic: '',
    soundcloud: '',
  },
  linkMetrics: {
    spotify: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    facebook: '',
    appleMusic: '',
    soundcloud: '',
  },
  linkScreenshots: {
    youtube: '',
    instagram: '',
    tiktok: '',
    facebook: '',
  },
  contactArtistName: '',
  managerName: '',
  roadManagerName: '',
  contactCountryCode: '+57',
  contactPhone: '',
  whatsappPhone: '',
  contactLogo: '',
  planTier: '',
  publishedUrl: '',
  theme: 'neon',
  pressArticles: [],
  customFonts: { title: null, subtitle: null, body: null },
  coverApplyToPDF: false,
};

const steps = [
  'Portada',
  'Datos del artista',
  'Reconocimientos y Streams',
  'Biografía',
  'Hitos del Artista',
  'Releases',
  'Links',
  'Galería',
  'Artículos de Prensa',
  'Contacto',
  'Tema Visual',
  'Identidad Visual',
  'Preview y guardar',
];

function getLocalDraftKey(uid) {
  return `presskit_local_draft_${uid}`;
}

function isRemoteUrl(value) {
  return typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
}

function isAllowedImageFile(file) {
  if (!file) return false;

  const fileName = String(file.name || '').toLowerCase();
  const fileType = String(file.type || '').toLowerCase();

  if (fileType === 'image/svg+xml' || fileName.endsWith('.svg')) {
    return false;
  }

  return /\.(jpe?g|png|webp)$/i.test(fileName)
    || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(fileType);
}

function compactDraftForLocal(data) {
  return {
    ...data,
    images: (Array.isArray(data.images) ? data.images : []).filter(isRemoteUrl),
    recognitionImage: isRemoteUrl(data.recognitionImage) ? data.recognitionImage : '',
    twitterBioImage: isRemoteUrl(data.twitterBioImage) ? data.twitterBioImage : '',
    bioImage: isRemoteUrl(data.bioImage) ? data.bioImage : '',
    longBioImage: isRemoteUrl(data.longBioImage) ? data.longBioImage : '',
    contactLogo: isRemoteUrl(data.contactLogo) ? data.contactLogo : '',
    linkScreenshots: Object.fromEntries(
      Object.entries(data.linkScreenshots || {}).map(([key, value]) => [key, isRemoteUrl(value) ? value : ''])
    ),
  };
}

function validateImageFile(file) {
  if (!isAllowedImageFile(file)) {
    return 'Solo se permiten imágenes PNG, JPG o WEBP.';
  }
  return null;
}

async function uploadImageFile({ file, userId, folder }) {
  const safeName = (file?.name || 'image')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
  const imageRef = ref(storage, `presskits/${userId}/${folder}/${Date.now()}-${safeName}`);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

function getStorageSetupErrorMessage(error) {
  const raw = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '').toLowerCase();

  if (
    code.includes('storage/unknown') ||
    code.includes('storage/object-not-found') ||
    raw.includes('cors') ||
    raw.includes('not found')
  ) {
    return 'Firebase Storage no está listo en este proyecto. Ve a Firebase Console > Storage > Get started, crea el bucket y vuelve a intentar.';
  }

  return 'No se pudo subir la imagen. Intenta nuevamente en unos segundos.';
}

function clampCoverFrameValue(value, min, max, fallback) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.min(max, Math.max(min, numericValue));
}

function isFilledString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function buildPublishSummary(data) {
  const artistName = isFilledString(data.artistName);
  const coverReady = Array.isArray(data.images) && Boolean(data.images[0]);
  const bioReady = isFilledString(data.bio) || isFilledString(data.twitterBio) || isFilledString(data.longBio);
  const releasesReady = Array.isArray(data.releases) && data.releases.some((release) => isFilledString(release?.url) || isFilledString(release?.title));
  const linksReady = data.links && Object.values(data.links).some(isFilledString);
  const galleryReady = Array.isArray(data.images) && data.images.slice(1, 5).some(Boolean);
  const pressReady = Array.isArray(data.pressArticles) && data.pressArticles.some(Boolean);
  const contactReady = isFilledString(data.contactArtistName) || isFilledString(data.contactPhone) || isFilledString(data.whatsappPhone) || isFilledString(data.contactLogo);
  const milestonesReady = data.artistMilestones && Object.values(data.artistMilestones).some((items) => Array.isArray(items) && items.some(isFilledString));

  return [
    {
      label: 'Portada',
      status: coverReady ? 'completed' : 'warning',
      message: coverReady ? 'Portada lista para la publicación.' : 'No has completado la portada. ¿Quieres publicar igualmente?',
    },
    {
      label: 'Datos del artista',
      status: artistName ? 'completed' : 'warning',
      message: artistName ? 'Nombre del artista registrado.' : 'Falta el nombre del artista. ¿Quieres publicar igualmente?',
    },
    {
      label: 'Biografía',
      status: bioReady ? 'completed' : 'warning',
      message: bioReady ? 'Tienes al menos una bio cargada.' : 'No has completado la biografía. ¿Quieres publicar igualmente?',
    },
    {
      label: 'Hitos del artista',
      status: milestonesReady ? 'completed' : 'warning',
      message: milestonesReady ? 'Hay hitos cargados.' : 'No has completado los hitos del artista. ¿Quieres publicar igualmente?',
    },
    {
      label: 'Releases',
      status: releasesReady ? 'completed' : 'warning',
      message: releasesReady ? 'Tus releases están listos.' : 'No has completado los releases. ¿Quieres publicar igualmente?',
    },
    {
      label: 'Links',
      status: linksReady ? 'completed' : 'warning',
      message: linksReady ? 'Hay enlaces agregados.' : 'No has completado los links. ¿Quieres publicar igualmente?',
    },
    {
      label: 'Galería',
      status: galleryReady ? 'completed' : 'warning',
      message: galleryReady ? 'Hay fotos de galería cargadas.' : 'No has completado la galería. ¿Quieres publicar igualmente?',
    },
    {
      label: 'Artículos de prensa',
      status: pressReady ? 'completed' : 'warning',
      message: pressReady ? 'Hay artículos de prensa cargados.' : 'No has completado los artículos de prensa. ¿Quieres publicar igualmente?',
    },
    {
      label: 'Contacto',
      status: contactReady ? 'completed' : 'warning',
      message: contactReady ? 'Datos de contacto disponibles.' : 'No has completado el contacto. ¿Quieres publicar igualmente?',
    },
  ];
}

function CreatePresskit({ user, onSignOut }) {
  const [presskitData, setPresskitData] = useState({
    ...initialPresskitData,
    pressArticles: [], // hasta 3 imágenes de artículos de prensa
  });
  const [activeStep, setActiveStep] = useState(1);
  const [publishOpen, setPublishOpen] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [saveState, setSaveState] = useState('idle');
  const [permissionError, setPermissionError] = useState('');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [generatingBioSection, setGeneratingBioSection] = useState('');
  const [bioGenerationError, setBioGenerationError] = useState('');
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [currentImageType, setCurrentImageType] = useState('cover');
  const [selectedFileNames, setSelectedFileNames] = useState({ cover: '', recognition: '', gallery: {}, linkScreenshots: {}, pressArticles: {} });
  const [imageUploadError, setImageUploadError] = useState('');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalSection, setAiModalSection] = useState(null);
  const [generatedBios, setGeneratedBios] = useState({});
  const [isGeneratingMilestone, setIsGeneratingMilestone] = useState(false);
  const [generatingMilestoneKey, setGeneratingMilestoneKey] = useState('');
  const [milestoneGenerationError, setMilestoneGenerationError] = useState('');
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [milestoneModalCategory, setMilestoneModalCategory] = useState('digital');
  const [milestoneModalIndex, setMilestoneModalIndex] = useState(-1);
  const createdAtRef = useRef(null);
  const lastSavedSignatureRef = useRef('');
  const isSavingRef = useRef(false);
  const previewDockRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const goToPrevStep = () => setActiveStep((s) => Math.max(1, s - 1));
  const goToNextStep = () => setActiveStep((s) => Math.min(steps.length, s + 1));

  const handleSidebarStepClick = (stepNumber) => {
    setActiveStep(stepNumber);
    const target = document.getElementById(`presskit-step-${stepNumber}`);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const updatePreviewDockOffset = () => {
      const dock = previewDockRef.current;
      if (!dock) return;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const maxDrift = 14;
      const drift = Math.min(scrollY * 0.0045, maxDrift);
      dock.style.setProperty('--preview-dock-offset', `${drift}px`);
    };

    updatePreviewDockOffset();
    window.addEventListener('scroll', updatePreviewDockOffset, { passive: true });
    window.addEventListener('resize', updatePreviewDockOffset);

    return () => {
      window.removeEventListener('scroll', updatePreviewDockOffset);
      window.removeEventListener('resize', updatePreviewDockOffset);
    };
  }, []);

  const draftRef = useMemo(() => {
    if (!user?.uid) return null;
    return doc(db, 'presskits', user.uid);
  }, [user]);

  useEffect(() => {
    if (!user?.uid) return;

    try {
      const raw = window.localStorage.getItem(getLocalDraftKey(user.uid));
      if (!raw) return;

      const localData = JSON.parse(raw);
      setPresskitData((current) => ({
        ...current,
        artistName: localData.artistName || current.artistName,
        genre: localData.genre || current.genre,
        city: localData.city || current.city,
        coverImageScale: localData.coverImageScale ?? current.coverImageScale,
        coverImageOffsetX: localData.coverImageOffsetX ?? current.coverImageOffsetX,
        coverImageOffsetY: localData.coverImageOffsetY ?? current.coverImageOffsetY,
        coverImageAspect: localData.coverImageAspect ?? current.coverImageAspect,
        coverApplyToPDF: typeof localData.coverApplyToPDF === 'boolean' ? localData.coverApplyToPDF : current.coverApplyToPDF,
        performanceLiveLink: localData.performanceLiveLink || current.performanceLiveLink,
        totalStreams: localData.totalStreams || current.totalStreams,
        totalVideoViews: localData.totalVideoViews || current.totalVideoViews,
        recognitions: normalizeRecognitions(localData.recognitions ?? current.recognitions),
        useRecognitionImage: typeof localData.useRecognitionImage === 'boolean' ? localData.useRecognitionImage : current.useRecognitionImage,
        recognitionImage: localData.recognitionImage || current.recognitionImage,
        bioStyle: localData.bioStyle || current.bioStyle,
        twitterBio: localData.twitterBio || current.twitterBio,
        twitterBioImage: localData.twitterBioImage || current.twitterBioImage,
        bio: localData.bio || current.bio,
        bioImage: localData.bioImage || current.bioImage,
        longBio: localData.longBio || current.longBio,
        longBioImage: localData.longBioImage || current.longBioImage,
        interviewLink: localData.interviewLink || current.interviewLink,
        artistMilestones: normalizeArtistMilestones(localData.artistMilestones || current.artistMilestones),
        releases: Array.isArray(localData.releases) ? localData.releases : current.releases,
        releasesCtaText: localData.releasesCtaText ?? current.releasesCtaText,
        images: Array.isArray(localData.images) && localData.images.length ? localData.images : current.images,
        links: {
          ...current.links,
          ...(localData.links || {}),
        },
        linkMetrics: {
          ...current.linkMetrics,
          ...(localData.linkMetrics || {}),
        },
        linkScreenshots: {
          ...current.linkScreenshots,
          ...(localData.linkScreenshots || {}),
        },
        contactArtistName: localData.contactArtistName || current.contactArtistName,
        managerName: localData.managerName || current.managerName,
        roadManagerName: localData.roadManagerName || current.roadManagerName,
        contactCountryCode: localData.contactCountryCode || current.contactCountryCode,
        contactPhone: localData.contactPhone || current.contactPhone,
        whatsappPhone: localData.whatsappPhone || current.whatsappPhone,
        contactLogo: localData.contactLogo || current.contactLogo,
        planTier: localData.planTier || current.planTier,
        theme: localData.theme || current.theme,
        pressArticles: Array.isArray(localData.pressArticles) ? localData.pressArticles.slice(0, 3) : current.pressArticles,
        customFonts: localData.customFonts || current.customFonts,
      }));
    } catch (error) {
      console.warn('No se pudo recuperar borrador local:', error);
    }
  }, [user?.uid]);

  useEffect(() => {
    let isMounted = true;

    const loadDraft = async () => {
      if (!draftRef) return;

      setLoadingDraft(true);
      try {
        if (!auth.currentUser) {
          setPermissionError('Esperando autenticación...');
          return;
        }
        await auth.currentUser.getIdToken();

        const snapshot = await getDoc(draftRef);
        setPermissionError('');
        if (snapshot.exists() && isMounted) {
          const data = snapshot.data();
          createdAtRef.current = data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt || null;
          setPresskitData((current) => ({
            ...current,
            artistName: data.artistName || current.artistName,
            genre: data.genre || current.genre,
            city: data.city || current.city,
            coverImageScale: data.coverImageScale ?? current.coverImageScale,
            coverImageOffsetX: data.coverImageOffsetX ?? current.coverImageOffsetX,
            coverImageOffsetY: data.coverImageOffsetY ?? current.coverImageOffsetY,
            coverImageAspect: data.coverImageAspect ?? current.coverImageAspect,
            coverApplyToPDF: typeof data.coverApplyToPDF === 'boolean' ? data.coverApplyToPDF : current.coverApplyToPDF,
            performanceLiveLink: data.performanceLiveLink || current.performanceLiveLink,
            totalStreams: data.totalStreams || current.totalStreams,
            totalVideoViews: data.totalVideoViews || current.totalVideoViews,
            recognitions: normalizeRecognitions(data.recognitions ?? current.recognitions),
            useRecognitionImage: typeof data.useRecognitionImage === 'boolean' ? data.useRecognitionImage : current.useRecognitionImage,
            recognitionImage: data.recognitionImage || current.recognitionImage,
            bioStyle: data.bioStyle || current.bioStyle,
            twitterBio: data.twitterBio || current.twitterBio,
            twitterBioImage: data.twitterBioImage || current.twitterBioImage,
            bio: data.bio || current.bio,
            bioImage: data.bioImage || current.bioImage,
            longBio: data.longBio || current.longBio,
            longBioImage: data.longBioImage || current.longBioImage,
            interviewLink: data.interviewLink || current.interviewLink,
            artistMilestones: normalizeArtistMilestones(data.artistMilestones || current.artistMilestones),
            releases: Array.isArray(data.releases) ? data.releases : current.releases,
            releasesCtaText: data.releasesCtaText ?? current.releasesCtaText,
            images: Array.isArray(data.images) && data.images.length ? data.images : current.images,
            links: {
              ...current.links,
              ...(data.links || {}),
            },
            linkMetrics: {
              ...current.linkMetrics,
              ...(data.linkMetrics || {}),
            },
            linkScreenshots: {
              ...current.linkScreenshots,
              ...(data.linkScreenshots || {}),
            },
            contactArtistName: data.contactArtistName || current.contactArtistName,
            managerName: data.managerName || current.managerName,
            roadManagerName: data.roadManagerName || current.roadManagerName,
            contactCountryCode: data.contactCountryCode || current.contactCountryCode,
            contactPhone: data.contactPhone || current.contactPhone,
            whatsappPhone: data.whatsappPhone || current.whatsappPhone,
            contactLogo: data.contactLogo || current.contactLogo,
            planTier: data.planTier || current.planTier,
            theme: data.theme || current.theme || 'neon',
            pressArticles: Array.isArray(data.pressArticles) ? data.pressArticles.slice(0, 3) : current.pressArticles,
            customFonts: data.customFonts || current.customFonts,
          }));
        }
      } catch (error) {
        const code = error?.code || '';
        if (code === 'permission-denied') {
          setPermissionError('Firestore rechazó permisos. Revisa tus reglas del proyecto.');
        }
        console.warn('No se pudo cargar el borrador:', error);
      } finally {
        if (isMounted) setLoadingDraft(false);
      }
    };

    loadDraft();

    return () => {
      isMounted = false;
    };
  }, [draftRef]);

  useEffect(() => {
    if (!draftRef || loadingDraft) return;

    const timeout = window.setTimeout(async () => {
      const savePayload = {
        userId: user.uid,
        artistName: presskitData.artistName,
        performanceLiveLink: presskitData.performanceLiveLink,
        totalStreams: presskitData.totalStreams,
        totalVideoViews: presskitData.totalVideoViews,
        recognitions: presskitData.recognitions,
        useRecognitionImage: presskitData.useRecognitionImage,
        recognitionImage: presskitData.recognitionImage,
        bioStyle: presskitData.bioStyle,
        twitterBio: presskitData.twitterBio,
        twitterBioImage: presskitData.twitterBioImage,
        bio: presskitData.bio,
        bioImage: presskitData.bioImage,
        longBio: presskitData.longBio,
        longBioImage: presskitData.longBioImage,
        interviewLink: presskitData.interviewLink,
        artistMilestones: presskitData.artistMilestones,
        releases: presskitData.releases,
        releasesCtaText: presskitData.releasesCtaText,
        theme: presskitData.theme,
        genre: presskitData.genre,
        city: presskitData.city,
        coverImageScale: presskitData.coverImageScale,
        coverImageOffsetX: presskitData.coverImageOffsetX,
        coverImageOffsetY: presskitData.coverImageOffsetY,
          coverImageAspect: presskitData.coverImageAspect,
        coverApplyToPDF: presskitData.coverApplyToPDF ?? false,
        images: presskitData.images,
        links: presskitData.links,
        linkMetrics: presskitData.linkMetrics,
        linkScreenshots: presskitData.linkScreenshots,
        contactArtistName: presskitData.contactArtistName,
        managerName: presskitData.managerName,
        roadManagerName: presskitData.roadManagerName,
        contactCountryCode: presskitData.contactCountryCode,
        contactPhone: presskitData.contactPhone,
        whatsappPhone: presskitData.whatsappPhone,
        contactLogo: presskitData.contactLogo,
        planTier: presskitData.planTier,
        pressArticles: presskitData.pressArticles,
        customFonts: presskitData.customFonts || null,
        status: 'draft',
      };

      setSaveState('saving');
      isSavingRef.current = true;

      try {
        if (!auth.currentUser) {
          setSaveState('error');
          isSavingRef.current = false;
          return;
        }
        await auth.currentUser.getIdToken();

        const normalizedSavePayload = await normalizePresskitStorageUrls(savePayload);
        const signature = JSON.stringify(normalizedSavePayload);

        if (signature === lastSavedSignatureRef.current) {
          isSavingRef.current = false;
          setSaveState('idle');
          return;
        }

        const now = new Date();
        if (!createdAtRef.current) {
          createdAtRef.current = now;
        }

        await setDoc(
          draftRef,
          {
            ...normalizedSavePayload,
            createdAt: createdAtRef.current,
            updatedAt: now,
          },
          { merge: true },
        );

        lastSavedSignatureRef.current = signature;
        setSaveState('saved');
        setPermissionError('');
        window.setTimeout(() => setSaveState('idle'), 1400);
      } catch (error) {
        const code = error?.code || '';
        if (code === 'permission-denied') {
          setPermissionError('No hay permisos para guardar en Firestore.');
        }
        setSaveState('error');
      } finally {
        isSavingRef.current = false;
      }
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [draftRef, loadingDraft, presskitData, user]);

  useEffect(() => {
    if (!user?.uid) return;

    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(getLocalDraftKey(user.uid), JSON.stringify(compactDraftForLocal(presskitData)));
      } catch (error) {
        if (error?.name === 'QuotaExceededError') {
          try {
            const minimalDraft = {
              ...presskitData,
              images: [],
              recognitionImage: '',
              coverImageScale: presskitData.coverImageScale,
              coverImageOffsetX: presskitData.coverImageOffsetX,
              coverImageOffsetY: presskitData.coverImageOffsetY,
          coverImageAspect: presskitData.coverImageAspect,
              coverApplyToPDF: presskitData.coverApplyToPDF ?? false,
            };
            window.localStorage.setItem(getLocalDraftKey(user.uid), JSON.stringify(minimalDraft));
            return;
          } catch {}
        }
        console.warn('No se pudo guardar borrador local:', error);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [presskitData, user?.uid]);

  const updateField = (field, value) => {
    const normalizedValue = field === 'contactPhone' ? String(value).replace(/\D/g, '') : value;
    setPresskitData((current) => ({ ...current, [field]: normalizedValue }));
  };

  const updateLink = (field, value) => {
    setPresskitData((current) => ({
      ...current,
      links: {
        ...current.links,
        [field]: value,
      },
    }));
  };

  const updateLinkMetric = (field, value) => {
    setPresskitData((current) => ({
      ...current,
      linkMetrics: {
        ...current.linkMetrics,
        [field]: value,
      },
    }));
  };

  const handleCoverFrameChange = (nextFrame) => {
    setPresskitData((current) => ({
      ...current,
      coverImageScale: clampCoverFrameValue(nextFrame?.scale, 0.3, 3, current.coverImageScale ?? 1),
      coverImageOffsetX: clampCoverFrameValue(nextFrame?.offsetX, -1, 1, current.coverImageOffsetX ?? 0),
      coverImageOffsetY: clampCoverFrameValue(nextFrame?.offsetY, -1, 1, current.coverImageOffsetY ?? 0),
      coverImageAspect: clampCoverFrameValue(nextFrame?.imageAspect, 0, 100, current.coverImageAspect ?? 0),
    }));
  };

  const handleResetCoverFrame = () => {
    setPresskitData((current) => ({
      ...current,
      ...defaultCoverFrame,
    }));
  };

  const handleAddRelease = (releaseData) => {
    setPresskitData((current) => ({
      ...current,
      releases: [...(current.releases || []), releaseData].slice(0, 8),
    }));
  };

  const handleDeleteRelease = (index) => {
    setPresskitData((current) => ({
      ...current,
      releases: (current.releases || []).filter((_, i) => i !== index),
    }));
  };

  const handleUpdateRelease = (index, releaseData) => {
    setPresskitData((current) => ({
      ...current,
      releases: (current.releases || []).map((r, i) => (i === index ? releaseData : r)),
    }));
  };

  const handleMoveRelease = (index, direction) => {
    setPresskitData((current) => {
      const list = [...(current.releases || [])];
      const target = index + direction;
      if (target < 0 || target >= list.length) return current;
      [list[index], list[target]] = [list[target], list[index]];
      return { ...current, releases: list };
    });
  };

  const handleDeletePressArticle = (index) => {
    setPresskitData((current) => {
      const next = Array.isArray(current.pressArticles) ? [...current.pressArticles] : [];
      next[index] = "";
      return { ...current, pressArticles: next };
    });
    setSelectedFileNames((current) => {
      const nextPress = { ...(current.pressArticles || {}) };
      delete nextPress[index];
      return { ...current, pressArticles: nextPress };
    });
  };

  // Handler para subir imágenes de artículos de prensa (máx 3)
  const handlePressArticleUpload = async (event, index) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    setImageUploadError('');
    const svgError = validateImageFile(file);
    if (svgError) { setImageUploadError(svgError); event.target.value = ''; return; }

    try {
      await auth.currentUser?.getIdToken(true);

      const exists = await fileExistsInLibrary({ userId: user.uid, fileName: file.name });
      if (exists) {
        setImageUploadError(`El archivo "${file.name}" ya está subido. Selecciona uno diferente o elige de tu biblioteca.`);
        event.target.value = '';
        return;
      }

      const imageUrl = await uploadImageFile({ file, userId: user.uid, folder: 'press-articles' });
      await addImageToLibrary({ userId: user.uid, imageUrl, fileName: file.name, type: 'press-article' });

      setPresskitData((current) => {
        const next = Array.isArray(current.pressArticles) ? [...current.pressArticles] : [];
        next[index] = imageUrl;
        return { ...current, pressArticles: next.slice(0, 3) };
      });

      setSelectedFileNames((current) => ({
        ...current,
        pressArticles: { ...(current.pressArticles || {}), [index]: file.name },
      }));
    } catch (error) {
      setPermissionError(getStorageSetupErrorMessage(error));
      console.warn('No se pudo subir imagen de artículo de prensa:', error);
    }
  };

  const handleCustomFontUpload = async (role, file) => {
    if (!file || !user?.uid) return;
    const allowed = ['.ttf', '.otf', '.woff', '.woff2'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) { setImageUploadError('Solo se aceptan archivos .ttf, .otf, .woff o .woff2'); return; }
    try {
      await auth.currentUser?.getIdToken(true);
      const fontRef = ref(storage, `presskits/${user.uid}/fonts/${role}-${Date.now()}-${file.name}`);
      await uploadBytes(fontRef, file);
      const url = await getDownloadURL(fontRef);
      setPresskitData((current) => ({
        ...current,
        customFonts: { ...(current.customFonts || {}), [role]: { name: file.name, url } },
      }));
    } catch (error) {
      setPermissionError(getStorageSetupErrorMessage(error));
      console.warn('No se pudo subir la fuente personalizada:', error);
    }
  };

  const handleRemoveCustomFont = (role) => {
    setPresskitData((current) => ({
      ...current,
      customFonts: { ...(current.customFonts || {}), [role]: null },
    }));
  };

  const handleAddMilestone = (category) => {
    setPresskitData((current) => {
      const currentMilestones = ensureArtistMilestonesShape(current.artistMilestones);
      const items = currentMilestones[category] || [];

      if (items.length >= 3) {
        return current;
      }

      return {
        ...current,
        artistMilestones: {
          ...currentMilestones,
          [category]: [...items, ''],
        },
      };
    });
    setActiveStep(5);
  };

  const handleUpdateMilestone = (category, index, value) => {
    setPresskitData((current) => {
      const currentMilestones = ensureArtistMilestonesShape(current.artistMilestones);

      return {
        ...current,
        artistMilestones: {
          ...currentMilestones,
          [category]: (currentMilestones[category] || []).map((item, itemIndex) => (itemIndex === index ? value : item)),
        },
      };
    });
  };

  const handleDeleteMilestone = (category, index) => {
    setPresskitData((current) => {
      const currentMilestones = ensureArtistMilestonesShape(current.artistMilestones);

      return {
        ...current,
        artistMilestones: {
          ...currentMilestones,
          [category]: (currentMilestones[category] || []).filter((_, itemIndex) => itemIndex !== index),
        },
      };
    });
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    setImageUploadError('');
    const svgError = validateImageFile(file);
    if (svgError) { setImageUploadError(svgError); event.target.value = ''; return; }

    try {
      // Refrescar el token de autenticación para asegurar permisos válidos
      await auth.currentUser?.getIdToken(true);

      // Verificar si el archivo ya existe en la biblioteca
      const exists = await fileExistsInLibrary({ userId: user.uid, fileName: file.name });
      if (exists) {
        setImageUploadError(`El archivo "${file.name}" ya está subido. Selecciona uno diferente o elige de tu biblioteca.`);
        event.target.value = '';
        return;
      }

      const imageUrl = await uploadImageFile({ file, userId: user.uid, folder: 'cover' });

      // Guardar en la biblioteca de imágenes
      await addImageToLibrary({ userId: user.uid, imageUrl, fileName: file.name, type: 'cover' });

      setPresskitData((current) => ({
        ...current,
        images: [imageUrl, ...current.images.slice(1)],
        ...defaultCoverFrame,
      }));

      setSelectedFileNames((current) => ({ ...current, cover: file.name }));
    } catch (error) {
      if (error.message?.includes('archivo')) {
        setImageUploadError(error.message);
      } else {
        setPermissionError(getStorageSetupErrorMessage(error));
      }
      console.warn('No se pudo subir la portada:', error);
    }
  };

  const handleGalleryUpload = async (event, gallerySlot) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid || !gallerySlotToIndex[gallerySlot]) return;

    setImageUploadError('');
    const svgError = validateImageFile(file);
    if (svgError) { setImageUploadError(svgError); event.target.value = ''; return; }

    try {
      // Refrescar el token de autenticación para asegurar permisos válidos
      await auth.currentUser?.getIdToken(true);

      const exists = await fileExistsInLibrary({ userId: user.uid, fileName: file.name });
      if (exists) {
        setImageUploadError(`El archivo "${file.name}" ya está subido. Selecciona uno diferente o elige de tu biblioteca.`);
        event.target.value = '';
        return;
      }

      const imageUrl = await uploadImageFile({ file, userId: user.uid, folder: `gallery/${gallerySlot}` });
      await addImageToLibrary({ userId: user.uid, imageUrl, fileName: file.name, type: `gallery-${gallerySlot}` });

      setPresskitData((current) => ({
        ...current,
        images: setGalleryImageForSlot(current.images, gallerySlot, imageUrl),
      }));

      setSelectedFileNames((current) => ({
        ...current,
        gallery: {
          ...(current.gallery || {}),
          [gallerySlot]: file.name,
        },
      }));
    } catch (error) {
      setPermissionError(getStorageSetupErrorMessage(error));
      console.warn('No se pudieron subir imágenes de galería:', error);
    }
  };

  const handleRecognitionImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    setImageUploadError('');
    const svgError = validateImageFile(file);
    if (svgError) { setImageUploadError(svgError); event.target.value = ''; return; }

    try {
      // Refrescar el token de autenticación para asegurar permisos válidos
      await auth.currentUser?.getIdToken(true);

      // Verificar si el archivo ya existe en la biblioteca
      const exists = await fileExistsInLibrary({ userId: user.uid, fileName: file.name });
      if (exists) {
        setImageUploadError(`El archivo "${file.name}" ya está subido. Selecciona uno diferente o elige de tu biblioteca.`);
        event.target.value = '';
        return;
      }

      const imageUrl = await uploadImageFile({ file, userId: user.uid, folder: 'recognitions' });

      // Guardar en la biblioteca de imágenes
      await addImageToLibrary({ userId: user.uid, imageUrl, fileName: file.name, type: 'recognition' });

      setPresskitData((current) => ({
        ...current,
        recognitionImage: imageUrl,
        useRecognitionImage: true,
      }));

      setSelectedFileNames((current) => ({ ...current, recognition: file.name }));
    } catch (error) {
      if (error.message?.includes('archivo')) {
        setImageUploadError(error.message);
      } else {
        setPermissionError(getStorageSetupErrorMessage(error));
      }
      console.warn('No se pudo subir imagen de reconocimientos:', error);
    }
  };

  const handleBioImageUpload = async (event, bioType) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    setImageUploadError('');
    const svgError = validateImageFile(file);
    if (svgError) { setImageUploadError(svgError); event.target.value = ''; return; }

    try {
      await auth.currentUser?.getIdToken(true);

      const exists = await fileExistsInLibrary({ userId: user.uid, fileName: file.name });
      if (exists) {
        setImageUploadError(`El archivo "${file.name}" ya está subido.`);
        event.target.value = '';
        return;
      }

      const imageUrl = await uploadImageFile({ file, userId: user.uid, folder: 'bios' });

      await addImageToLibrary({ userId: user.uid, imageUrl, fileName: file.name, type: 'bio' });

      const fieldMap = {
        twitterBio: 'twitterBioImage',
        shortBio: 'bioImage',
        longBio: 'longBioImage',
      };

      const field = fieldMap[bioType];
      if (field) {
        setPresskitData((current) => ({
          ...current,
          [field]: imageUrl,
        }));
      }

      setSelectedFileNames((current) => ({ ...current, [bioType]: file.name }));
    } catch (error) {
      if (error.message?.includes('archivo')) {
        setImageUploadError(error.message);
      } else {
        setPermissionError(getStorageSetupErrorMessage(error));
      }
      console.warn(`No se pudo subir imagen de biografía (${bioType}):`, error);
    }
  };

  const handleContactLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    setImageUploadError('');
    const svgError = validateImageFile(file);
    if (svgError) { setImageUploadError(svgError); event.target.value = ''; return; }

    try {
      await auth.currentUser?.getIdToken(true);

      const exists = await fileExistsInLibrary({ userId: user.uid, fileName: file.name });
      if (exists) {
        setImageUploadError(`El archivo "${file.name}" ya está subido. Selecciona uno diferente o elige de tu biblioteca.`);
        event.target.value = '';
        return;
      }

      const imageUrl = await uploadImageFile({ file, userId: user.uid, folder: 'contact' });
      await addImageToLibrary({ userId: user.uid, imageUrl, fileName: file.name, type: 'contactLogo' });

      setPresskitData((current) => ({
        ...current,
        contactLogo: imageUrl,
      }));

      setSelectedFileNames((current) => ({ ...current, contactLogo: file.name }));
    } catch (error) {
      if (error.message?.includes('archivo')) {
        setImageUploadError(error.message);
      } else {
        setPermissionError(getStorageSetupErrorMessage(error));
      }
      console.warn('No se pudo subir logo de contacto:', error);
    }
  };

  const handleLinkScreenshotUpload = async (event, platform) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    setImageUploadError('');
    const svgError = validateImageFile(file);
    if (svgError) { setImageUploadError(svgError); event.target.value = ''; return; }

    try {
      await auth.currentUser?.getIdToken(true);

      const exists = await fileExistsInLibrary({ userId: user.uid, fileName: file.name });
      if (exists) {
        setImageUploadError(`El archivo "${file.name}" ya está subido.`);
        event.target.value = '';
        return;
      }

      const imageUrl = await uploadImageFile({ file, userId: user.uid, folder: 'links' });
      await addImageToLibrary({ userId: user.uid, imageUrl, fileName: file.name, type: `link-${platform}` });

      setPresskitData((current) => ({
        ...current,
        linkScreenshots: {
          ...current.linkScreenshots,
          [platform]: imageUrl,
        },
      }));

      setSelectedFileNames((current) => ({
        ...current,
        linkScreenshots: {
          ...(current.linkScreenshots || {}),
          [platform]: file.name,
        },
      }));
    } catch (error) {
      if (error.message?.includes('archivo')) {
        setImageUploadError(error.message);
      } else {
        setPermissionError(getStorageSetupErrorMessage(error));
      }
      console.warn(`No se pudo subir captura de red (${platform}):`, error);
    }
  };

  const generateBioField = async (section) => {
    const fieldBySection = {
      twitterBio: 'twitterBio',
      shortBio: 'bio',
      longBio: 'longBio',
      releaseCta: 'releasesCtaText',
    };

    const targetField = fieldBySection[section];
    if (!targetField) return;

    setIsGeneratingBio(true);
    setGeneratingBioSection(section);
    setBioGenerationError('');

    try {
      const generatedText = await generateBioSectionWithAI({
        artistName: presskitData.artistName,
        genre: presskitData.genre,
        city: presskitData.city,
        recognitions: presskitData.recognitions,
        style: presskitData.bioStyle,
        section,
      });

      setPresskitData((current) => ({
        ...current,
        [targetField]: generatedText || current[targetField],
      }));
      setActiveStep(4);
    } catch (error) {
      console.warn('No se pudo generar la biografia con IA:', error);
      setBioGenerationError(error?.message || 'No se pudo generar con IA. Intenta nuevamente.');
    } finally {
      setGeneratingBioSection('');
      setIsGeneratingBio(false);
    }
  };

  const handleOpenBioModal = (section) => {
    setAiModalSection(section);
    setAiModalOpen(true);
    setActiveStep(section === 'releaseCta' ? 6 : 4);
  };

  const handleGenerateMilestone = (category, index) => {
    setMilestoneGenerationError('');
    setMilestoneModalCategory(category);
    setMilestoneModalIndex(index);
    setMilestoneModalOpen(true);
    setActiveStep(5);
  };

  const handleUseMilestone = (text) => {
    if (milestoneModalIndex < 0) return;

    setPresskitData((current) => {
      const currentMilestones = ensureArtistMilestonesShape(current.artistMilestones);
      const categoryItems = currentMilestones[milestoneModalCategory] || [];

      return {
        ...current,
        artistMilestones: {
          ...currentMilestones,
          [milestoneModalCategory]: categoryItems.map((item, itemIndex) => (itemIndex === milestoneModalIndex ? text : item)),
        },
      };
    });

    setMilestoneModalOpen(false);
    setMilestoneModalIndex(-1);
  };

  const handleUseBio = (generatedText) => {
    const fieldBySection = {
      twitterBio: 'twitterBio',
      shortBio: 'bio',
      longBio: 'longBio',
      releaseCta: 'releasesCtaText',
    };

    const targetField = fieldBySection[aiModalSection];
    if (!targetField || !generatedText) return;

    setPresskitData((current) => ({
      ...current,
      [targetField]: generatedText,
    }));

    setGeneratedBios((current) => ({
      ...current,
      [aiModalSection]: true,
    }));

    setAiModalOpen(false);
    setAiModalSection(null);
  };

  const handleOpenImageLibrary = (imageType) => {
    setCurrentImageType(imageType);
    setLibraryModalOpen(true);
  };

  const handleSelectFromLibrary = (image) => {
    setImageUploadError('');

    if (currentImageType === 'cover') {
      setPresskitData((current) => ({
        ...current,
        images: [image.url, ...current.images.slice(1)],
        ...defaultCoverFrame,
      }));
      setSelectedFileNames((current) => ({ ...current, cover: image.fileName }));
    } else if (currentImageType === 'recognition') {
      setPresskitData((current) => ({
        ...current,
        recognitionImage: image.url,
        useRecognitionImage: true,
      }));
      setSelectedFileNames((current) => ({ ...current, recognition: image.fileName }));
    } else if (currentImageType?.startsWith('gallery:')) {
      const gallerySlot = currentImageType.split(':')[1];
      if (!gallerySlotToIndex[gallerySlot]) return;

      setPresskitData((current) => ({
        ...current,
        images: setGalleryImageForSlot(current.images, gallerySlot, image.url),
      }));
      setSelectedFileNames((current) => ({
        ...current,
        gallery: {
          ...(current.gallery || {}),
          [gallerySlot]: image.fileName,
        },
      }));
    } else if (currentImageType === 'contactLogo') {
      setPresskitData((current) => ({
        ...current,
        contactLogo: image.url,
      }));
      setSelectedFileNames((current) => ({ ...current, contactLogo: image.fileName }));
    } else if (currentImageType?.startsWith('pressArticles:')) {
      const idx = parseInt(currentImageType.split(':')[1], 10);
      setPresskitData((current) => {
        const next = Array.isArray(current.pressArticles) ? [...current.pressArticles] : [];
        next[idx] = image.url;
        return { ...current, pressArticles: next.slice(0, 3) };
      });
      setSelectedFileNames((current) => ({
        ...current,
        pressArticles: {
          ...(current.pressArticles || {}),
          [idx]: image.fileName,
        },
      }));
    }
  };

  const handlePublish = async () => {
    if (!draftRef) return;

    try {
      if (!auth.currentUser) {
        setSaveState('error');
        return;
      }
      await auth.currentUser.getIdToken();

      const now = new Date();
      const slug = generatePressKitSlug(presskitData.artistName);
      const productionOrigin = import.meta.env.VITE_APP_URL || 'https://music-presskit-generator.com';
      const publishedUrl = `${productionOrigin}/presskit/${slug}`;
      if (!createdAtRef.current) {
        createdAtRef.current = now;
      }

      await setDoc(
        draftRef,
        {
          userId: user.uid,
          artistName: presskitData.artistName,
          performanceLiveLink: presskitData.performanceLiveLink,
          totalStreams: presskitData.totalStreams,
          totalVideoViews: presskitData.totalVideoViews,
          recognitions: presskitData.recognitions,
          useRecognitionImage: presskitData.useRecognitionImage,
          recognitionImage: presskitData.recognitionImage,
          bioStyle: presskitData.bioStyle,
          twitterBio: presskitData.twitterBio,
          bio: presskitData.bio,
          longBio: presskitData.longBio,
          interviewLink: presskitData.interviewLink,
          artistMilestones: presskitData.artistMilestones,
          releases: presskitData.releases,
          releasesCtaText: presskitData.releasesCtaText,
          theme: presskitData.theme,
          genre: presskitData.genre,
          city: presskitData.city,
          coverImageScale: presskitData.coverImageScale,
          coverImageOffsetX: presskitData.coverImageOffsetX,
          coverImageOffsetY: presskitData.coverImageOffsetY,
          coverImageAspect: presskitData.coverImageAspect,
          images: presskitData.images,
          links: presskitData.links,
          linkMetrics: presskitData.linkMetrics,
          linkScreenshots: presskitData.linkScreenshots,
          contactArtistName: presskitData.contactArtistName,
          managerName: presskitData.managerName,
          roadManagerName: presskitData.roadManagerName,
          contactCountryCode: presskitData.contactCountryCode,
          contactPhone: presskitData.contactPhone,
        whatsappPhone: presskitData.whatsappPhone,
          contactLogo: presskitData.contactLogo,
          planTier: presskitData.planTier,
          publishedUrl,
          publishedSlug: slug,
          createdAt: createdAtRef.current,
          updatedAt: now,
          status: 'published',
          publishedAt: now,
        },
        { merge: true },
      );

      // Índice público slug → uid para resolución de URLs personalizadas
      await setDoc(doc(db, 'presskit_slugs', slug), { uid: user.uid }, { merge: true });

      setPublishOpen(false);
      setPermissionError('');
      window.location.assign('/dashboard');
    } catch (error) {
      const code = error?.code || '';
      if (code === 'permission-denied') {
        setPermissionError('No hay permisos para publicar en Firestore.');
      }
      console.warn('No se pudo publicar el presskit:', error);
      setSaveState('error');
    }
  };

  const saveLabel =
    saveState === 'saving' ? 'Guardando...' : saveState === 'saved' ? 'Guardado' : saveState === 'error' ? 'Error al guardar' : 'Autoguardado activo';

  const saveDraftForPreview = async () => {
    setSaveState('saving');

    if (!auth.currentUser) {
      alert('Debes estar autenticado para ver el preview');
      setSaveState('error');
      return null;
    }

    const savePayload = {
      userId: auth.currentUser.uid,
      artistName: presskitData.artistName,
      performanceLiveLink: presskitData.performanceLiveLink,
      totalStreams: presskitData.totalStreams,
      totalVideoViews: presskitData.totalVideoViews,
      recognitions: presskitData.recognitions,
      useRecognitionImage: presskitData.useRecognitionImage,
      recognitionImage: presskitData.recognitionImage,
      bioStyle: presskitData.bioStyle,
      twitterBio: presskitData.twitterBio,
      twitterBioImage: presskitData.twitterBioImage,
      bio: presskitData.bio,
      bioImage: presskitData.bioImage,
      longBio: presskitData.longBio,
      longBioImage: presskitData.longBioImage,
      interviewLink: presskitData.interviewLink,
      artistMilestones: presskitData.artistMilestones,
      releases: presskitData.releases,
      releasesCtaText: presskitData.releasesCtaText,
      theme: presskitData.theme,
      genre: presskitData.genre,
      city: presskitData.city,
      coverImageScale: presskitData.coverImageScale,
      coverImageOffsetX: presskitData.coverImageOffsetX,
      coverImageOffsetY: presskitData.coverImageOffsetY,
          coverImageAspect: presskitData.coverImageAspect,
      images: presskitData.images,
      links: presskitData.links,
      linkMetrics: presskitData.linkMetrics,
      linkScreenshots: presskitData.linkScreenshots,
      contactArtistName: presskitData.contactArtistName,
      managerName: presskitData.managerName,
      roadManagerName: presskitData.roadManagerName,
      contactCountryCode: presskitData.contactCountryCode,
      contactPhone: presskitData.contactPhone,
      contactLogo: presskitData.contactLogo,
      status: 'draft',
    };

    await setDoc(doc(db, 'presskits', auth.currentUser.uid), savePayload, { merge: true });
    setSaveState('saved');
    return auth.currentUser.uid;
  };

  return (
    <section className="mx-auto min-h-screen w-full max-w-400 px-6 py-8 lg:px-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1">
          <Topbar user={user} onSignOut={onSignOut} />
        </div>
        <button
          type="button"
          onClick={() => window.location.assign('/dashboard')}
          className="hidden rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-white/40 hover:bg-white/10 hover:text-white lg:inline-flex"
        >
          Guardar y terminar después
        </button>
      </div>

      <div className={`grid gap-6 ${isMobile ? '' : 'xl:grid-cols-[280px_minmax(0,1.25fr)_minmax(360px,0.9fr)]'}`}>
        {!isMobile && (
          <aside className="sticky top-6 self-start max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Pasos</p>
            <h2 className="mt-2 text-xl font-bold text-white">Constructor de presskit</h2>
            <div className="mt-6 space-y-2">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = activeStep === stepNumber;
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => handleSidebarStepClick(stepNumber)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                      isActive
                        ? 'border-cyan-300/40 bg-cyan-300/10 text-white shadow-[0_0_30px_rgba(34,211,238,0.15)]'
                        : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${isActive ? 'bg-cyan-300 text-zinc-950' : 'bg-white/10 text-white'}`}>
                      {stepNumber}
                    </span>
                    <span className="text-sm font-semibold">{step}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        <div className="space-y-6">
          {isMobile && (
            <div className="max-h-[35vh] min-h-[200px] overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-3">
              <LivePreview data={presskitData} />
            </div>
          )}

          {isMobile && (
            <style>{`
              .mobile-step-view > div > div > div[id^="presskit-step-"] {
                display: none;
              }
              .mobile-step-view > div > div > div[id="presskit-step-${activeStep}"] {
                display: block;
              }
            `}</style>
          )}

          <div className={isMobile ? 'mobile-step-view' : ''}>
            <Stepform
            data={presskitData}
            onFieldChange={updateField}
            onLinkChange={updateLink}
            onLinkMetricChange={updateLinkMetric}
            onCoverUpload={handleCoverUpload}
            onCoverFrameChange={handleCoverFrameChange}
            onResetCoverFrame={handleResetCoverFrame}
            onToggleCoverApplyToPDF={() => setPresskitData(c => ({ ...c, coverApplyToPDF: !c.coverApplyToPDF }))}
            onGalleryUpload={handleGalleryUpload}
            onRecognitionImageUpload={handleRecognitionImageUpload}
            onBioImageUpload={handleBioImageUpload}
            onContactLogoUpload={handleContactLogoUpload}
            onLinkScreenshotUpload={handleLinkScreenshotUpload}
            onGenerateTwitterBio={() => handleOpenBioModal('twitterBio')}
            onGenerateShortBio={() => handleOpenBioModal('shortBio')}
            onGenerateLongBio={() => handleOpenBioModal('longBio')}
            onGenerateReleaseCta={() => handleOpenBioModal('releaseCta')}
            milestones={presskitData.artistMilestones || createEmptyArtistMilestones()}
            onAddMilestone={handleAddMilestone}
            onUpdateMilestone={handleUpdateMilestone}
            onDeleteMilestone={handleDeleteMilestone}
            onGenerateMilestone={handleGenerateMilestone}
            isGeneratingMilestone={isGeneratingMilestone}
            generatingMilestoneKey={generatingMilestoneKey}
            milestoneGenerationError={milestoneGenerationError}
            onAddRelease={handleAddRelease}
            onDeleteRelease={handleDeleteRelease}
            onUpdateRelease={handleUpdateRelease}
            onMoveRelease={handleMoveRelease}
            onOpenPublish={() => setPublishOpen(true)}
            onOpenImageLibrary={handleOpenImageLibrary}
            onPressArticleUpload={handlePressArticleUpload}
            onDeletePressArticle={handleDeletePressArticle}
            onCustomFontUpload={handleCustomFontUpload}
            onRemoveCustomFont={handleRemoveCustomFont}
            saveLabel={saveLabel}
            isGeneratingBio={isGeneratingBio}
            generatingBioSection={generatingBioSection}
            bioGenerationError={bioGenerationError}
            selectedFileNames={selectedFileNames}
            imageUploadError={imageUploadError}
            generatedBios={generatedBios}
          />

          {permissionError ? (
            <div className="rounded-2xl border border-amber-300/40 bg-amber-100/95 p-4 text-sm text-zinc-900">
              {permissionError}
            </div>
          ) : null}
          {isMobile && (
            <>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                {activeStep > 1 ? (
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/10"
                  >
                    ← Atrás
                  </button>
                ) : (
                  <div />
                )}
                <span className="text-xs font-semibold text-zinc-300">
                  Paso <span className="text-cyan-300">{activeStep}</span>/{steps.length}
                </span>
                {activeStep < steps.length ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="rounded-lg border border-cyan-300/40 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-300/10"
                  >
                    Siguiente →
                  </button>
                ) : (
                  <div />
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const tab = window.open('', '_blank');
                    try {
                      const uid = await saveDraftForPreview();
                      if (!uid) { tab?.close(); return; }
                      setTimeout(() => {
                        if (tab) tab.location.href = `/presskit/${uid}`;
                        else window.open(`/presskit/${uid}`, '_blank');
                      }, 200);
                    } catch (error) {
                      tab?.close();
                      console.error('Error al guardar para previsualizar EPK:', error);
                      setSaveState('error');
                    }
                  }}
                  className="flex-1 rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-300/20"
                >
                  Previsualizar EPK
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const tab = window.open('', '_blank');
                    try {
                      const uid = await saveDraftForPreview();
                      if (!uid) { tab?.close(); return; }
                      setTimeout(() => {
                        if (tab) tab.location.href = '/presskitPDF';
                        else window.open('/presskitPDF', '_blank');
                      }, 200);
                    } catch (error) {
                      tab?.close();
                      console.error('Error al guardar para previsualizar PDF:', error);
                      setSaveState('error');
                    }
                  }}
                  className="flex-1 rounded-xl border border-fuchsia-300/40 bg-fuchsia-300/10 px-3 py-2 text-xs font-semibold text-fuchsia-300 transition hover:bg-fuchsia-300/20"
                >
                  Previsualizar PDF
                </button>
              </div>
            </>
          )}
        </div>
        </div>

        {!isMobile ? (
          <div
            ref={previewDockRef}
            className="sticky top-2 max-h-[calc(100vh-1rem)] space-y-6 overflow-y-auto pr-1 h-fit transition-transform duration-300 ease-out will-change-transform"
            style={{ transform: 'translateY(calc(var(--preview-dock-offset, 0px) * -1))' }}
          >
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={async () => {
                  const tab = window.open('', '_blank');
                  try {
                    const uid = await saveDraftForPreview();
                    if (!uid) {
                      tab?.close();
                      return;
                    }
                    setTimeout(() => {
                      if (tab) tab.location.href = `/presskit/${uid}`;
                      else window.open(`/presskit/${uid}`, '_blank');
                    }, 200);
                  } catch (error) {
                    tab?.close();
                    console.error('Error al guardar para previsualizar EPK:', error);
                    setSaveState('error');
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-300/20"
              >
                Previsualizar EPK
              </button>

              <button
                type="button"
                onClick={async () => {
                  const tab = window.open('', '_blank');
                  try {
                    const uid = await saveDraftForPreview();
                    if (!uid) {
                      tab?.close();
                      return;
                    }
                    setTimeout(() => {
                      if (tab) tab.location.href = '/presskitPDF';
                      else window.open('/presskitPDF', '_blank');
                    }, 200);
                  } catch (error) {
                    tab?.close();
                    console.error('Error al guardar para previsualizar PDF:', error);
                    setSaveState('error');
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/40 bg-fuchsia-300/10 px-4 py-2 text-sm font-semibold text-fuchsia-300 transition hover:bg-fuchsia-300/20"
              >
                Previsualizar PDF
              </button>
            </div>

            <LivePreview data={presskitData} />
          </div>
        ) : null}
      </div>

      <PublishModal
        isOpen={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublish={handlePublish}
        summary={buildPublishSummary(presskitData)}
      />
      <ImageLibraryModal
        userId={user?.uid}
        isOpen={libraryModalOpen}
        onClose={() => setLibraryModalOpen(false)}
        onSelectImage={handleSelectFromLibrary}
        imageType={currentImageType}
      />
      {aiModalOpen && aiModalSection && (
        <BiographyAIModal
          isOpen={aiModalOpen}
          section={aiModalSection}
          artistData={presskitData}
          currentValue={presskitData[aiModalSection === 'twitterBio' ? 'twitterBio' : aiModalSection === 'shortBio' ? 'bio' : aiModalSection === 'releaseCta' ? 'releasesCtaText' : 'longBio']}
          onUseBio={handleUseBio}
          onClose={() => {
            setAiModalOpen(false);
            setAiModalSection(null);
          }}
        />
      )}
      {milestoneModalOpen && milestoneModalIndex >= 0 ? (
        <MilestoneAIModal
          isOpen={milestoneModalOpen}
          category={milestoneModalCategory}
          artistData={presskitData}
          currentValue={presskitData.artistMilestones?.[milestoneModalCategory]?.[milestoneModalIndex] || ''}
          onUseMilestone={handleUseMilestone}
          onClose={() => {
            setMilestoneModalOpen(false);
            setMilestoneModalIndex(-1);
          }}
        />
      ) : null}
    </section>
  );
}

export default CreatePresskit;
