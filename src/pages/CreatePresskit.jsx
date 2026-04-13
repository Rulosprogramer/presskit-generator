import { useEffect, useMemo, useRef, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../lib/firebase';
import { generateBioSectionWithAI } from '../lib/aiBio';
import { fileExistsInLibrary, addImageToLibrary } from '../lib/imageLibrary';
import Topbar from '../components/post-login/Topbar.jsx';
import Stepform from '../components/post-login/Stepform.jsx';
import LivePreview from '../components/post-login/livePreview.jsx';
import PublishModal from '../components/post-login/PublishModal.jsx';
import ImageLibraryModal from '../components/post-login/ImageLibraryModal.jsx';
import BiographyAIModal from '../components/BiographyAIModal.jsx';

const initialPresskitData = {
  artistName: '',
  genre: '',
  city: '',
  totalStreams: '',
  totalVideoViews: '',
  recognitions: '',
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
  releases: [],
  images: [],
  links: {
    spotify: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    youtubeVideo: '',
    facebook: '',
    appleMusic: '',
    soundcloud: '',
  },
  contactArtistName: '',
  managerName: '',
  roadManagerName: '',
  contactCountryCode: '+57',
  contactPhone: '',
  contactLogo: '',
  planTier: '',
  publishedUrl: '',
  theme: 'neon',
  typeface: 'neutral',
};

const steps = [
  'Portada',
  'Datos del artista',
  'Reconocimientos y Streams',
  'Biografía',
  'Releases',
  'Links',
  'Galería',
  'Contacto',
  'Tema Visual',
  'Tipografía',
  'Preview y guardar',
];

function getLocalDraftKey(uid) {
  return `presskit_local_draft_${uid}`;
}

function isRemoteUrl(value) {
  return typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
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
  };
}

async function uploadImageFile({ file, userId, folder }) {
  const safeName = (file?.name || 'image').replace(/[^a-zA-Z0-9._-]/g, '_');
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

function CreatePresskit({ user, onSignOut }) {
  const [presskitData, setPresskitData] = useState(initialPresskitData);
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
  const [selectedFileNames, setSelectedFileNames] = useState({ cover: '', recognition: '', gallery: [] });
  const [imageUploadError, setImageUploadError] = useState('');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalSection, setAiModalSection] = useState(null);
  const [generatedBios, setGeneratedBios] = useState({});
  const createdAtRef = useRef(null);
  const lastSavedSignatureRef = useRef('');
  const isSavingRef = useRef(false);

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
        totalStreams: localData.totalStreams || current.totalStreams,
        totalVideoViews: localData.totalVideoViews || current.totalVideoViews,
        recognitions: localData.recognitions || current.recognitions,
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
        releases: Array.isArray(localData.releases) ? localData.releases : current.releases,
        images: Array.isArray(localData.images) && localData.images.length ? localData.images : current.images,
        links: {
          ...current.links,
          ...(localData.links || {}),
        },
        contactArtistName: localData.contactArtistName || current.contactArtistName,
        managerName: localData.managerName || current.managerName,
        roadManagerName: localData.roadManagerName || current.roadManagerName,
        contactCountryCode: localData.contactCountryCode || current.contactCountryCode,
        contactPhone: localData.contactPhone || current.contactPhone,
        contactLogo: localData.contactLogo || current.contactLogo,
        planTier: localData.planTier || current.planTier,
        theme: localData.theme || current.theme,
        typeface: localData.typeface || current.typeface,
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
            totalStreams: data.totalStreams || current.totalStreams,
            totalVideoViews: data.totalVideoViews || current.totalVideoViews,
            recognitions: data.recognitions || current.recognitions,
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
            releases: Array.isArray(data.releases) ? data.releases : current.releases,
            images: Array.isArray(data.images) && data.images.length ? data.images : current.images,
            links: {
              ...current.links,
              ...(data.links || {}),
            },
            contactArtistName: data.contactArtistName || current.contactArtistName,
            managerName: data.managerName || current.managerName,
            roadManagerName: data.roadManagerName || current.roadManagerName,
            contactCountryCode: data.contactCountryCode || current.contactCountryCode,
            contactPhone: data.contactPhone || current.contactPhone,
            contactLogo: data.contactLogo || current.contactLogo,
            planTier: data.planTier || current.planTier,
            theme: data.theme || current.theme || 'neon',
            typeface: data.typeface || current.typeface || 'neutral',
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
        releases: presskitData.releases,
        theme: presskitData.theme,
        typeface: presskitData.typeface,
        genre: presskitData.genre,
        city: presskitData.city,
        images: presskitData.images,
        links: presskitData.links,
        contactArtistName: presskitData.contactArtistName,
        managerName: presskitData.managerName,
        roadManagerName: presskitData.roadManagerName,
        contactCountryCode: presskitData.contactCountryCode,
        contactPhone: presskitData.contactPhone,
        contactLogo: presskitData.contactLogo,
        planTier: presskitData.planTier,
        status: 'draft',
      };

      const signature = JSON.stringify(savePayload);
      if (signature === lastSavedSignatureRef.current || isSavingRef.current) {
        return;
      }

      setSaveState('saving');
      isSavingRef.current = true;

      try {
        if (!auth.currentUser) {
          setSaveState('error');
          isSavingRef.current = false;
          return;
        }
        await auth.currentUser.getIdToken();

        const now = new Date();
        if (!createdAtRef.current) {
          createdAtRef.current = now;
        }

        await setDoc(
          draftRef,
          {
            ...savePayload,
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

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    setImageUploadError('');

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

  const handleGalleryUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length || !user?.uid) return;

    setImageUploadError('');

    try {
      // Refrescar el token de autenticación para asegurar permisos válidos
      await auth.currentUser?.getIdToken(true);

      const duplicates = [];
      const newFiles = [];

      // Verificar duplicados
      for (const file of files) {
        const exists = await fileExistsInLibrary({ userId: user.uid, fileName: file.name });
        if (exists) {
          duplicates.push(file.name);
        } else {
          newFiles.push(file);
        }
      }

      if (duplicates.length > 0) {
        setImageUploadError(
          `${duplicates.length} archivo(s) ya existen: ${duplicates.join(', ')}. Se subirán solo los nuevos.`
        );
      }

      if (newFiles.length === 0) {
        event.target.value = '';
        return;
      }

      const imageUrls = await Promise.all(
        newFiles.map((file) => uploadImageFile({ file, userId: user.uid, folder: 'gallery' }))
      );

      // Guardar nuevas imágenes en la biblioteca
      await Promise.all(
        newFiles.map((file, idx) =>
          addImageToLibrary({ userId: user.uid, imageUrl: imageUrls[idx], fileName: file.name, type: 'gallery' })
        )
      );

      setPresskitData((current) => ({
        ...current,
        images: [...current.images, ...imageUrls].slice(0, 8),
      }));

      setSelectedFileNames((current) => ({
        ...current,
        gallery: [...(current.gallery || []), ...newFiles.map((f) => f.name)],
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

  const generateBioField = async (section) => {
    const fieldBySection = {
      twitterBio: 'twitterBio',
      shortBio: 'bio',
      longBio: 'longBio',
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
    setActiveStep(4);
  };

  const handleUseBio = (generatedText) => {
    const fieldBySection = {
      twitterBio: 'twitterBio',
      shortBio: 'bio',
      longBio: 'longBio',
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
      }));
      setSelectedFileNames((current) => ({ ...current, cover: image.fileName }));
    } else if (currentImageType === 'recognition') {
      setPresskitData((current) => ({
        ...current,
        recognitionImage: image.url,
        useRecognitionImage: true,
      }));
      setSelectedFileNames((current) => ({ ...current, recognition: image.fileName }));
    } else if (currentImageType === 'gallery') {
      setPresskitData((current) => ({
        ...current,
        images: [...current.images, image.url].slice(0, 8),
      }));
      setSelectedFileNames((current) => ({
        ...current,
        gallery: [...(current.gallery || []), image.fileName],
      }));
    } else if (currentImageType === 'contactLogo') {
      setPresskitData((current) => ({
        ...current,
        contactLogo: image.url,
      }));
      setSelectedFileNames((current) => ({ ...current, contactLogo: image.fileName }));
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
      const publishedUrl = `${window.location.origin}/presskit/${user.uid}`;
      if (!createdAtRef.current) {
        createdAtRef.current = now;
      }

      await setDoc(
        draftRef,
        {
          userId: user.uid,
          artistName: presskitData.artistName,
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
          releases: presskitData.releases,
          theme: presskitData.theme,
          genre: presskitData.genre,
          city: presskitData.city,
          images: presskitData.images,
          links: presskitData.links,
          contactArtistName: presskitData.contactArtistName,
          managerName: presskitData.managerName,
          roadManagerName: presskitData.roadManagerName,
          contactCountryCode: presskitData.contactCountryCode,
          contactPhone: presskitData.contactPhone,
          contactLogo: presskitData.contactLogo,
          planTier: presskitData.planTier,
          publishedUrl,
          createdAt: createdAtRef.current,
          updatedAt: now,
          status: 'published',
          publishedAt: now,
        },
        { merge: true },
      );

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

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1.25fr)_minmax(360px,0.9fr)]">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
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
                  onClick={() => setActiveStep(stepNumber)}
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

        <div className="space-y-6">
          <Stepform
            data={presskitData}
            onFieldChange={updateField}
            onLinkChange={updateLink}
            onCoverUpload={handleCoverUpload}
            onGalleryUpload={handleGalleryUpload}
            onRecognitionImageUpload={handleRecognitionImageUpload}
            onBioImageUpload={handleBioImageUpload}
            onContactLogoUpload={handleContactLogoUpload}
            onGenerateTwitterBio={() => handleOpenBioModal('twitterBio')}
            onGenerateShortBio={() => handleOpenBioModal('shortBio')}
            onGenerateLongBio={() => handleOpenBioModal('longBio')}
            onAddRelease={handleAddRelease}
            onDeleteRelease={handleDeleteRelease}
            onUpdateRelease={handleUpdateRelease}
            onOpenPublish={() => setPublishOpen(true)}
            onOpenImageLibrary={handleOpenImageLibrary}
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
        </div>

        <div className="sticky top-6 space-y-6 h-fit">
          <button
            type="button"
            onClick={async () => {
              // Esperar a que se guarden los datos en Firestore
              setSaveState('saving');
              try {
                if (!auth.currentUser) {
                  alert('Debes estar autenticado para ver el preview');
                  return;
                }

                // Crear payload con todos los datos
                const savePayload = {
                  userId: auth.currentUser.uid,
                  artistName: presskitData.artistName,
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
                  releases: presskitData.releases,
                  theme: presskitData.theme,
                  typeface: presskitData.typeface,
                  genre: presskitData.genre,
                  city: presskitData.city,
                  images: presskitData.images,
                  links: presskitData.links,
                  contactArtistName: presskitData.contactArtistName,
                  managerName: presskitData.managerName,
                  roadManagerName: presskitData.roadManagerName,
                  contactCountryCode: presskitData.contactCountryCode,
                  contactPhone: presskitData.contactPhone,
                  contactLogo: presskitData.contactLogo,
                  status: 'draft',
                };

                // Guardar en Firestore
                await setDoc(doc(db, 'presskits', auth.currentUser.uid), savePayload, { merge: true });

                setSaveState('saved');
                // Navegar después de un pequeño delay para asegurar sincronización
                setTimeout(() => {
                  window.location.href = '/presskitPDF';
                }, 300);
              } catch (error) {
                console.error('Error al guardar:', error);
                setSaveState('error');
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-300/20"
          >
            Previsualizar y descargar PDF
          </button>

          <LivePreview data={presskitData} />
          <PublishModal
            isOpen={publishOpen}
            onClose={() => setPublishOpen(false)}
            onPublish={handlePublish}
            data={presskitData}
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
              currentValue={presskitData[aiModalSection === 'twitterBio' ? 'twitterBio' : aiModalSection === 'shortBio' ? 'bio' : 'longBio']}
              onUseBio={handleUseBio}
              onClose={() => {
                setAiModalOpen(false);
                setAiModalSection(null);
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default CreatePresskit;
