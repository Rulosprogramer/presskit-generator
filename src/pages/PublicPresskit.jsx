import { useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import PresskitWeb from '../components/post-login/PresskitWeb.jsx';
import { db } from '../lib/firebase';

const initialPresskitData = {
  artistName: '',
  genre: '',
  city: '',
  performanceLiveLink: '',
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
  artistMilestones: {
    digital: [],
    live: [],
    press: [],
    collaborations: [],
  },
  releases: [],
  releasesCtaText: '',
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
  contactLogo: '',
  planTier: '',
  theme: 'neon',
};

function PublicPresskit({ presskitId = '' }) {
  const [presskitData, setPresskitData] = useState(initialPresskitData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const presskitRef = useMemo(() => {
    if (!presskitId) return null;
    return doc(db, 'presskits', presskitId);
  }, [presskitId]);

  useEffect(() => {
    if (!presskitRef) {
      setLoading(false);
      setError('No se encontró el enlace publicado.');
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      presskitRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setPresskitData((current) => ({
            ...current,
            artistName: data.artistName || '',
            genre: data.genre || '',
            city: data.city || '',
            performanceLiveLink: data.performanceLiveLink || '',
            totalStreams: data.totalStreams || '',
            totalVideoViews: data.totalVideoViews || '',
            recognitions: data.recognitions || '',
            useRecognitionImage: Boolean(data.useRecognitionImage),
            recognitionImage: data.recognitionImage || '',
            bioStyle: data.bioStyle || 'prensa',
            twitterBio: data.twitterBio || '',
            twitterBioImage: data.twitterBioImage || '',
            bio: data.bio || '',
            bioImage: data.bioImage || '',
            longBio: data.longBio || '',
            longBioImage: data.longBioImage || '',
            interviewLink: data.interviewLink || '',
            artistMilestones: data.artistMilestones || current.artistMilestones,
            releases: Array.isArray(data.releases) ? data.releases : [],
            releasesCtaText: data.releasesCtaText || '',
            images: Array.isArray(data.images) ? data.images : [],
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
            contactArtistName: data.contactArtistName || '',
            managerName: data.managerName || '',
            roadManagerName: data.roadManagerName || '',
            contactCountryCode: data.contactCountryCode || '+57',
            contactPhone: data.contactPhone || '',
            contactLogo: data.contactLogo || '',
            planTier: data.planTier || '',
            theme: data.theme || 'neon',
          }));
          setError('');
        } else {
          setError('Este presskit publicado no existe o ya no está disponible.');
        }
        setLoading(false);
      },
      () => {
        setError('No se pudo cargar el presskit publicado.');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [presskitRef]);

  if (loading) {
    return <div className="px-6 py-8 text-sm text-zinc-300">Cargando presskit publicado...</div>;
  }

  if (error) {
    return (
      <div className="px-6 py-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-200">{error}</div>
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-400 px-6 py-8 lg:px-12">
      <PresskitWeb presskitData={presskitData} mode="full" />
    </main>
  );
}

export default PublicPresskit;