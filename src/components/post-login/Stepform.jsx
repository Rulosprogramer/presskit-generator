import { useEffect, useRef, useState } from 'react';
import {
  coverFrameImageStyle,
  coverScaleFor,
  clampOffset,
  COVER_SCALE_MIN,
  COVER_SCALE_MAX,
} from '../../lib/coverFrame.js';
import ReleaseStep from './ReleaseStep.jsx';
import ArtistMilestonesStep from './ArtistMilestonesStep.jsx';
import ThemePickerStep from './ThemePickerStep.jsx';
import Step12GenreIdentity from '../steps/Step12GenreIdentity.jsx';


const latamCountryCodes = [
  { code: '+52', label: 'Mexico (+52)' },
  { code: '+54', label: 'Argentina (+54)' },
  { code: '+591', label: 'Bolivia (+591)' },
  { code: '+55', label: 'Brasil (+55)' },
  { code: '+56', label: 'Chile (+56)' },
  { code: '+57', label: 'Colombia (+57)' },
  { code: '+506', label: 'Costa Rica (+506)' },
  { code: '+53', label: 'Cuba (+53)' },
  { code: '+593', label: 'Ecuador (+593)' },
  { code: '+503', label: 'El Salvador (+503)' },
  { code: '+502', label: 'Guatemala (+502)' },
  { code: '+504', label: 'Honduras (+504)' },
  { code: '+505', label: 'Nicaragua (+505)' },
  { code: '+507', label: 'Panama (+507)' },
  { code: '+595', label: 'Paraguay (+595)' },
  { code: '+51', label: 'Peru (+51)' },
  { code: '+1', label: 'Republica Dominicana (+1)' },
  { code: '+598', label: 'Uruguay (+598)' },
  { code: '+58', label: 'Venezuela (+58)' },
];

const galleryPhotoSlots = [
  {
    id: 'hero',
    index: 1,
    title: 'La Foto "Hero" (Vertical - Retrato)',
    hint: 'Tu mejor cara. Esta es la foto que te define hoy.',
  },
  {
    id: 'flyer',
    index: 2,
    title: 'La Foto "Flyer" (Con Espacio Negativo)',
    hint: 'Foto con un fondo unicolor para eliminar background.',
  },
  {
    id: 'liveAct',
    index: 3,
    title: 'La Foto "Live Act" (En Acción)',
    hint: 'Energía pura en el escenario. Demuestra que sabes dar un show.',
  },
  {
    id: 'concept',
    index: 4,
    title: 'La Foto "Concepto/Estilo de Vida" (Atmósfera)',
    hint: 'Tu vibra fuera del escenario. Muestra tu estilo de vida y estética.',
  },
];

const horizontalPhotoSlots = [
  {
    id: 'horizA',
    index: 5,
    title: 'Foto Horizontal 1 (Paisaje)',
    hint: 'Foto apaisada. Se mostrará en una página propia dentro del PDF.',
  },
  {
    id: 'horizB',
    index: 6,
    title: 'Foto Horizontal 2 (Paisaje)',
    hint: 'Segunda foto apaisada. Aparece junto a la primera en la misma página.',
  },
];

function clampNumber(value, min, max, fallback) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.min(max, Math.max(min, numericValue));
}

function ImagePreviewThumb({ src, alt, emptyLabel = 'Sin imagen seleccionada' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60">
      {src ? (
        <img src={src} alt={alt} className="h-28 w-full object-cover sm:h-32" />
      ) : (
        <div className="flex h-28 w-full items-center justify-center px-4 text-center text-xs text-zinc-400 sm:h-32">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}

const COVER_FRAME_ASPECT = 4 / 5; // ancho / alto del marco

export function CoverFrameEditor({ src, alt, scale, offsetX, offsetY, imageAspect, onChange, onReset, appliedToPDF, onTogglePDF }) {
  const previewRef = useRef(null);
  const dragStateRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imgAspect, setImgAspect] = useState(Number(imageAspect) || 0);

  const s = clampNumber(scale, COVER_SCALE_MIN, COVER_SCALE_MAX, 1);
  const ox = clampNumber(offsetX, -1, 1, 0);
  const oy = clampNumber(offsetY, -1, 1, 0);
  // base = escala de cobertura; "ver foto completa" corresponde a scale = 1/base.
  const base = imgAspect > 0 ? coverScaleFor(imgAspect, COVER_FRAME_ASPECT) : 1;

  const emitChange = (next) => {
    const nextScale = clampNumber(next.scale, COVER_SCALE_MIN, COVER_SCALE_MAX, 1);
    onChange?.({
      scale: nextScale,
      offsetX: clampOffset(clampNumber(next.offsetX, -1, 1, 0), nextScale),
      offsetY: clampOffset(clampNumber(next.offsetY, -1, 1, 0), nextScale),
      imageAspect: next.imageAspect ?? imgAspect,
    });
  };

  // Al cargar la imagen medimos su aspecto y lo persistimos para que todos los
  // renderers cubran el marco igual. El scale por defecto (1) ya = cubrir.
  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.target;
    if (!naturalWidth || !naturalHeight) return;
    const aspect = naturalWidth / naturalHeight;
    setImgAspect(aspect);
    if (Math.abs(aspect - (Number(imageAspect) || 0)) > 0.001) {
      emitChange({ scale: s, offsetX: ox, offsetY: oy, imageAspect: aspect });
    }
  };

  const handlePointerDown = (event) => {
    if (!src || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      offsetX: ox,
      offsetY: oy,
      scale: s,
      rectWidth: rect.width || 1,
      rectHeight: rect.height || 1,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragStateRef.current;
    if (!drag) return;
    // El delta del puntero (en px) se traduce a fracción del marco -> paneo real.
    const deltaX = (event.clientX - drag.startX) / drag.rectWidth;
    const deltaY = (event.clientY - drag.startY) / drag.rectHeight;
    emitChange({
      scale: drag.scale,
      offsetX: drag.offsetX + deltaX,
      offsetY: drag.offsetY + deltaY,
    });
  };

  const stopDragging = () => {
    dragStateRef.current = null;
    setIsDragging(false);
  };

  return (
    <div className="space-y-3">
      <div
        ref={previewRef}
        className={`relative overflow-hidden rounded-3xl border border-white/12 bg-zinc-950 ${src ? 'touch-none' : ''}`}
        style={{ aspectRatio: '4 / 5' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onPointerLeave={stopDragging}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            draggable={false}
            onLoad={handleImageLoad}
            className="select-none"
            style={{
              ...coverFrameImageStyle({ scale: s, offsetX: ox, offsetY: oy, imageAspect: imgAspect, frameAspect: COVER_FRAME_ASPECT }),
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: isDragging ? 'none' : 'left 80ms ease-out, top 80ms ease-out, width 80ms ease-out, height 80ms ease-out',
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-8 text-center text-sm text-zinc-400">
            Sube una portada para empezar a encuadrarla.
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" />
          <div className="absolute left-1/2 top-1/2 h-px w-16 -translate-x-1/2 -translate-y-1/2 bg-white/40" />
          <div className="absolute left-1/2 top-1/2 h-16 w-px -translate-x-1/2 -translate-y-1/2 bg-white/40" />
        </div>

        <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
          Arrastra para reencuadrar
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <label className="block space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.12em] text-zinc-400">
            <span>Zoom</span>
            <span>{s.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min={COVER_SCALE_MIN}
            max={COVER_SCALE_MAX}
            step="0.01"
            value={s}
            onChange={(event) => emitChange({ scale: event.target.value, offsetX: ox, offsetY: oy })}
            className="w-full accent-cyan-300"
          />
          <p className="text-[11px] leading-snug text-zinc-500">
            Aleja (←) para revelar más de la foto original · acerca (→) para encuadrar más de cerca.
          </p>
        </label>

        <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-300">
          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
            X: {Math.round(ox * 100)}%
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
            Y: {Math.round(oy * 100)}%
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
            Zoom: {s.toFixed(2)}x
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => emitChange({ scale: s, offsetX: 0, offsetY: 0 })}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            Centrar
          </button>
          <button
            type="button"
            onClick={() => emitChange({ scale: 1, offsetX: 0, offsetY: 0 })}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            Cubrir marco
          </button>
          <button
            type="button"
            onClick={() => emitChange({ scale: clampNumber(1 / base, COVER_SCALE_MIN, COVER_SCALE_MAX, 1), offsetX: 0, offsetY: 0 })}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            Ver foto completa
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            Revertir encuadre
          </button>
        </div>

        <button
          type="button"
          onClick={onTogglePDF}
          className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-xs transition ${
            appliedToPDF
              ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200'
              : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
          }`}
        >
          <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border text-[9px] font-black ${
            appliedToPDF ? 'border-cyan-400 bg-cyan-400 text-zinc-950' : 'border-zinc-600 bg-transparent text-transparent'
          }`}>✓</span>
          <span className="font-semibold uppercase tracking-[0.12em]">Aplicar encuadre al PDF</span>
        </button>
      </div>
    </div>
  );
}

function Stepform({
  data,
  onFieldChange,
  onLinkChange,
  onLinkMetricChange,
  onCoverUpload,
  onCoverFrameChange,
  onResetCoverFrame,
  onToggleCoverApplyToPDF,
  onGalleryUpload,
  onRecognitionImageUpload,
  onBioImageUpload,
  onContactLogoUpload,
  onLinkScreenshotUpload,
  onGenerateTwitterBio,
  onGenerateShortBio,
  onGenerateLongBio,
  onGenerateReleaseCta,
  milestones,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
  onGenerateMilestone,
  isGeneratingMilestone,
  generatingMilestoneKey,
  milestoneGenerationError,
  onAddRelease,
  onDeleteRelease,
  onUpdateRelease,
  onMoveRelease,
  onOpenPublish,
  onOpenImageLibrary,
  onPressArticleUpload,
  onDeletePressArticle,
  saveLabel,
  isGeneratingBio,
  generatingBioSection,
  bioGenerationError,
  selectedFileNames,
  imageUploadError,
  generatedBios = {},
  onCustomFontUpload,
  onRemoveCustomFont,
}) {
  const [showWhatsapp, setShowWhatsapp] = useState(Boolean(data.whatsappPhone));
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Formulario</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Construye tu presskit</h2>
        </div>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          {saveLabel}
        </span>
      </div>

      <div className="mt-6 space-y-6">
        <div id="presskit-step-1" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-sm font-semibold text-fuchsia-300">1. Portada</p>
          <p className="mt-2 text-sm text-zinc-300">
            Sube tu mejor foto, de estudio o de un show en vivo, y encuádrela con drag y zoom como en Instagram.
          </p>
          {imageUploadError && (
            <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-300">
              {imageUploadError}
            </div>
          )}
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
            <div className="space-y-3">
              <CoverFrameEditor
                src={data.images?.[0] || ''}
                alt="Portada del presskit"
                scale={data.coverImageScale}
                offsetX={data.coverImageOffsetX}
                offsetY={data.coverImageOffsetY}
                imageAspect={data.coverImageAspect}
                onChange={onCoverFrameChange}
                onReset={onResetCoverFrame}
                appliedToPDF={data.coverApplyToPDF}
                onTogglePDF={onToggleCoverApplyToPDF}
              />
              {selectedFileNames?.cover && (
                <div className="flex items-center gap-2 rounded-lg bg-cyan-300/10 px-3 py-2">
                  <span className="text-xs text-cyan-300">✓ {selectedFileNames.cover}</span>
                </div>
              )}
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <label className="space-y-3">
                <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Upload portada</span>
                <input id="cover-upload" type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" onChange={onCoverUpload} className="w-full cursor-pointer text-sm text-zinc-300 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-950" />
              </label>
              <button
                type="button"
                onClick={() => onOpenImageLibrary('cover')}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-cyan-300/50 hover:bg-white/10 hover:text-white"
              >
                📚 Biblioteca de fotos
              </button>
              <p className="text-xs leading-5 text-zinc-400">
                Arrastra la imagen dentro del marco para reencuadrarla. Usa zoom para acercar o alejar y guarda ese encuadre.
              </p>
            </div>
          </div>
        </div>

        <div id="presskit-step-2" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-sm font-semibold text-fuchsia-300">2. Datos del artista</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Nombre artista</span>
              <input
                id="artist-name"
                value={data.artistName}
                onChange={(event) => onFieldChange('artistName', event.target.value)}
                placeholder="Duna Fever"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Género</span>
              <input
                id="artist-genre"
                value={data.genre}
                onChange={(event) => onFieldChange('genre', event.target.value)}
                placeholder="Electrónica latina"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Ciudad</span>
              <input
                id="artist-city"
                value={data.city}
                onChange={(event) => onFieldChange('city', event.target.value)}
                placeholder="Bogotá"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>

            <label className="space-y-2 sm:col-span-3">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Link Performance en vivo (YouTube)</span>
              <input
                id="performance-live-link"
                value={data.performanceLiveLink || ''}
                onChange={(event) => onFieldChange('performanceLiveLink', event.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>
          </div>
        </div>

        <div id="presskit-step-3" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-sm font-semibold text-fuchsia-300">3. Reconocimientos y Streams</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Total de streams</span>
              <input
                id="total-streams"
                value={data.totalStreams || ''}
                onChange={(event) => onFieldChange('totalStreams', event.target.value)}
                placeholder="Escribe el total de streams en todas tus DSPs"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Total video views</span>
              <input
                id="total-video-views"
                value={data.totalVideoViews || ''}
                onChange={(event) => onFieldChange('totalVideoViews', event.target.value)}
                placeholder="Escribe el total de vistas de tus canales de video: Youtube, Vevo, etc."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>

            <div className="space-y-3 sm:col-span-2">
              <div>
                <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Reconocimientos</span>
                <p className="mt-1 text-xs text-zinc-500">Agrega hasta 10 reconocimientos del más actual al más antiguo</p>
              </div>
              {(data.recognitions || []).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={item}
                    onChange={(e) => {
                      const next = [...(data.recognitions || [])];
                      next[i] = e.target.value;
                      onFieldChange('recognitions', next);
                    }}
                    placeholder={`Reconocimiento ${i + 1}`}
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-fuchsia-300"
                  />
                  <button
                    type="button"
                    onClick={() => onFieldChange('recognitions', (data.recognitions || []).filter((_, idx) => idx !== i))}
                    className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-zinc-400 transition hover:border-red-400/40 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {(data.recognitions || []).length < 10 && (
                <button
                  type="button"
                  onClick={() => onFieldChange('recognitions', [...(data.recognitions || []), ''])}
                  className="flex items-center gap-2 rounded-xl border border-dashed border-fuchsia-300/40 px-4 py-2.5 text-xs font-semibold text-fuchsia-300 transition hover:border-fuchsia-300/70 hover:bg-fuchsia-300/5"
                >
                  + Agregar reconocimiento
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
              <label className="inline-flex cursor-pointer items-center gap-3">
                <input
                  id="use-recognition-image"
                  type="checkbox"
                  checked={Boolean(data.useRecognitionImage)}
                  onChange={(event) => onFieldChange('useRecognitionImage', event.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-white/20 bg-white/10"
                />
                <span className="text-sm font-semibold text-zinc-300">Agregar foto de reconocimientos</span>
              </label>

              {data.useRecognitionImage && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-zinc-400">Se recomienda usar una imagen sin fondo (PNG con transparencia)</p>
                  <label className="block space-y-3 rounded-xl border border-dashed border-cyan-300/50 bg-cyan-300/5 p-4">
                    <span className="text-xs uppercase tracking-[0.12em] font-semibold text-cyan-300">Selecciona o sube una foto</span>
                    <ImagePreviewThumb src={data.recognitionImage || ''} alt="Miniatura de reconocimientos" emptyLabel="La foto de reconocimientos aparecerá aquí" />
                    <input id="recognition-image-upload" type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" onChange={onRecognitionImageUpload} className="w-full cursor-pointer text-sm text-zinc-300 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-950" />
                    {selectedFileNames?.recognition && (
                      <div className="flex items-center gap-2 rounded-lg bg-cyan-300/10 px-3 py-2 mt-2">
                        <span className="text-xs text-cyan-300 font-medium">✓ {selectedFileNames.recognition}</span>
                      </div>
                    )}
                  </label>
                  <button
                    type="button"
                    onClick={() => onOpenImageLibrary('recognition')}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:border-white/30 hover:bg-white/10"
                    >
                    📚 Biblioteca de fotos
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div id="presskit-step-4" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-sm font-semibold text-fuchsia-300">4. Biografía</p>
          <p className="mt-2 text-sm text-zinc-300">
            Tres versiones, cada una con un uso distinto: la de redes para presentarte en una línea, la corta para bookers y festivales, y la oficial para prensa. Puedes completar solo las que necesites.
          </p>
          <div className="mt-4 grid gap-4">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Estilo IA</span>
              <select
                id="bio-style"
                value={data.bioStyle || 'prensa'}
                onChange={(event) => onFieldChange('bioStyle', event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              >
                <option value="prensa">Prensa (editorial/profesional)</option>
                <option value="festival">Festival (curatorial/escénico)</option>
                <option value="fanbase">Fanbase (cercano/emocional)</option>
                <option value="marca">Marca (alianzas/patrocinios)</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Bio para redes (140 caracteres)</span>
              <span className="block text-[11px] font-normal normal-case leading-snug tracking-normal text-zinc-500">
                La que va en tus perfiles de redes (Instagram, TikTok, X). En una sola frase, alguien que no te conoce debe identificar qué haces.
              </span>
              <div className="space-y-2">
                <ImagePreviewThumb src={data.twitterBioImage || ''} alt="Miniatura de bio para redes" emptyLabel="La imagen de esta bio aparecerá aquí" />
                <textarea
                  id="twitter-bio"
                  value={data.twitterBio || ''}
                  onChange={(event) => onFieldChange('twitterBio', event.target.value)}
                  rows={3}
                  placeholder="Ej: Productor y cantante de música urbana, fusiono ritmos latinos con sonidos electrónicos."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
                />
                <input
                  id="twitter-bio-image-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={(e) => onBioImageUpload?.(e, 'twitterBio')}
                  className="w-full cursor-pointer text-xs text-zinc-400 transition file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-cyan-300/40 file:bg-cyan-300/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-300 file:transition file:duration-200 hover:file:-translate-y-px hover:file:border-cyan-300/70 hover:file:bg-cyan-300/25 hover:file:shadow-[0_4px_12px_rgba(34,211,238,0.25)]"
                />
              </div>
              <button
                type="button"
                onClick={onGenerateTwitterBio}
                disabled={isGeneratingBio}
                className="cursor-pointer rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGeneratingBio && generatingBioSection === 'twitterBio' ? 'Generando...' : generatedBios.twitterBio || data.twitterBio ? '🔄 Regenerar' : '✨ Redactar con IA'}
              </button>
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Bio Corta (1 párrafo)</span>
              <span className="block text-[11px] font-normal normal-case leading-snug tracking-normal text-zinc-500">
                La que más leerán bookers, festivales y programadores. En un párrafo: quién eres, tu sonido y tus logros más fuertes.
              </span>
              <div className="space-y-2">
                <ImagePreviewThumb src={data.bioImage || ''} alt="Miniatura de bio corta" emptyLabel="La imagen de bio corta aparecerá aquí" />
                <textarea
                  id="short-bio"
                  value={data.bio}
                  onChange={(event) => onFieldChange('bio', event.target.value)}
                  rows={5}
                  placeholder="Resume tu propuesta para quien decide tu booking o programación."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
                />
                <input
                  id="short-bio-image-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={(e) => onBioImageUpload?.(e, 'shortBio')}
                  className="w-full cursor-pointer text-xs text-zinc-400 transition file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-cyan-300/40 file:bg-cyan-300/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-300 file:transition file:duration-200 hover:file:-translate-y-px hover:file:border-cyan-300/70 hover:file:bg-cyan-300/25 hover:file:shadow-[0_4px_12px_rgba(34,211,238,0.25)]"
                />
              </div>
              <button
                type="button"
                onClick={onGenerateShortBio}
                disabled={isGeneratingBio}
                className="cursor-pointer rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGeneratingBio && generatingBioSection === 'shortBio' ? 'Generando...' : generatedBios.shortBio || data.bio ? '🔄 Regenerar' : '✨ Redactar con IA'}
              </button>
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Biografía Oficial (3-4 párrafos · opcional)</span>
              <span className="block text-[11px] font-normal normal-case leading-snug tracking-normal text-zinc-500">
                Tu biografía oficial para boletines y notas de prensa — la versión más importante para la cobertura de medios y entrevistas. Puedes incluirla o dejarla en blanco si aún no la tienes.
              </span>
              <div className="space-y-2">
                <ImagePreviewThumb src={data.longBioImage || ''} alt="Miniatura de biografía oficial" emptyLabel="La imagen de la biografía oficial aparecerá aquí" />
                <textarea
                  id="long-bio"
                  value={data.longBio || ''}
                  onChange={(event) => onFieldChange('longBio', event.target.value)}
                  rows={9}
                  placeholder="La historia detallada y oficial, lista para que un medio la publique tal cual."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
                />
                <input
                  id="long-bio-image-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={(e) => onBioImageUpload?.(e, 'longBio')}
                  className="w-full cursor-pointer text-xs text-zinc-400 transition file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-cyan-300/40 file:bg-cyan-300/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-300 file:transition file:duration-200 hover:file:-translate-y-px hover:file:border-cyan-300/70 hover:file:bg-cyan-300/25 hover:file:shadow-[0_4px_12px_rgba(34,211,238,0.25)]"
                />
              </div>
              <button
                type="button"
                onClick={onGenerateLongBio}
                disabled={isGeneratingBio}
                className="cursor-pointer rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGeneratingBio && generatingBioSection === 'longBio' ? 'Generando...' : generatedBios.longBio || data.longBio ? '🔄 Regenerar' : '✨ Redactar con IA'}
              </button>
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Link de entrevista, si tienes</span>
              <input
                id="interview-link"
                value={data.interviewLink || ''}
                onChange={(event) => onFieldChange('interviewLink', event.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>

            {bioGenerationError ? (
              <p className="text-sm text-amber-300">{bioGenerationError}</p>
            ) : null}
          </div>
        </div>

        <div id="presskit-step-5" className="scroll-mt-28">
          <ArtistMilestonesStep
            milestones={milestones || {}}
            onAddMilestone={onAddMilestone}
            onUpdateMilestone={onUpdateMilestone}
            onDeleteMilestone={onDeleteMilestone}
            onGenerateMilestone={onGenerateMilestone}
            isGeneratingMilestone={isGeneratingMilestone}
            generatingMilestoneKey={generatingMilestoneKey}
            milestoneGenerationError={milestoneGenerationError}
          />
        </div>

        <div id="presskit-step-6" className="scroll-mt-28">
          <ReleaseStep
            releases={data.releases || []}
            releaseCtaText={data.releasesCtaText || ''}
            onReleaseCtaChange={(value) => onFieldChange('releasesCtaText', value)}
            onGenerateReleaseCta={onGenerateReleaseCta}
            isGeneratingBio={isGeneratingBio}
            generatingBioSection={generatingBioSection}
            generatedBios={generatedBios}
            onAddRelease={onAddRelease}
            onDeleteRelease={onDeleteRelease}
            onUpdateRelease={onUpdateRelease}
            onMoveRelease={onMoveRelease}
          />
        </div>

        <div id="presskit-step-7" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-sm font-semibold text-fuchsia-300">7. Links</p>
          <p className="mt-2 text-sm text-zinc-300">Agrega una captura de pantalla de tus redes sociales.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ['spotify', 'Spotify'],
              ['instagram', 'Instagram'],
              ['youtube', 'YouTube'],
              ['tiktok', 'TikTok'],
              ['facebook', 'Facebook'],
              ['appleMusic', 'Apple Music'],
              ['soundcloud', 'SoundCloud'],
            ].map(([key, label]) => (
              <div key={key} className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">{label}</span>
                <input
                  id={`link-${key}-url`}
                  value={data.links[key] || ''}
                  onChange={(event) => onLinkChange(key, event.target.value)}
                  placeholder={`https://.../${label.toLowerCase().replace(' ', '')}`}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
                />
                <p className="text-[11px] text-zinc-400">Para ver esta red en el diseño debes agregar un link.</p>
                <input
                  id={`link-${key}-metric`}
                  value={data.linkMetrics?.[key] || ''}
                  onChange={(event) => onLinkMetricChange?.(key, event.target.value)}
                  placeholder={
                    {
                      spotify: '2M+',
                      instagram: '20K+',
                      youtube: '2M views',
                      tiktok: '100K+',
                      facebook: '127K+',
                      appleMusic: '2M+',
                      soundcloud: '300K+',
                    }[key] || '100K+'
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
                />

                {['youtube', 'instagram', 'tiktok', 'facebook'].includes(key) ? (
                  <>
                    <label className="block space-y-2 rounded-xl border border-dashed border-white/15 bg-white/5 p-3">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">Captura de pantalla</span>
                      <ImagePreviewThumb
                        src={data.linkScreenshots?.[key] || ''}
                        alt={`Miniatura de ${label}`}
                        emptyLabel="La captura seleccionada aparecerá aquí"
                      />
                      <input
                        id={`link-${key}-screenshot`}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={(event) => onLinkScreenshotUpload?.(event, key)}
                        className="w-full cursor-pointer text-xs text-zinc-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-cyan-300 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-zinc-950"
                      />
                    </label>
                    {selectedFileNames?.linkScreenshots?.[key] ? (
                      <div className="rounded-lg bg-cyan-300/10 px-3 py-2 text-xs text-cyan-300">✓ {selectedFileNames.linkScreenshots[key]}</div>
                    ) : null}
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div id="presskit-step-8" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-sm font-semibold text-fuchsia-300">8. Galería</p>
          <p className="mt-2 text-sm text-zinc-300">Sube exactamente 4 fotos clave en vertical. Estas se usan en previews y PDF.</p>

          {imageUploadError && (
            <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-300">
              {imageUploadError}
            </div>
          )}
          <div className="mt-4 grid gap-4">
            {galleryPhotoSlots.map((slot) => {
              const imageUrl = data.images?.[slot.index] || '';
              const selectedName = selectedFileNames?.gallery?.[slot.id];

              return (
                <div key={slot.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-fuchsia-300">{slot.title}</p>
                  <p className="mt-1 text-xs text-zinc-400">{slot.hint}</p>

                  <div className="mt-3 max-w-56">
                    <ImagePreviewThumb src={imageUrl} alt={`Miniatura de ${slot.title}`} emptyLabel="Sin imagen en este slot" />
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <label className="space-y-2 rounded-xl border border-dashed border-white/15 bg-white/5 p-3">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">Subir imagen</span>
                      <input
                        id={`gallery-${slot.id}-upload`}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={(event) => onGalleryUpload(event, slot.id)}
                        className="w-full cursor-pointer text-xs text-zinc-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-fuchsia-400 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-zinc-950"
                      />
                      {selectedName ? <div className="text-xs text-fuchsia-300">✓ {selectedName}</div> : null}
                    </label>

                    <div className="flex flex-col gap-2 sm:w-52">
                      <button
                        type="button"
                        onClick={() => onOpenImageLibrary(`gallery:${slot.id}`)}
                        className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-cyan-300/50 hover:bg-white/10 hover:text-white"
                      >
                        📚 Biblioteca de fotos
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300">Fotos horizontales (opcional)</p>
            <p className="mt-1 text-xs text-zinc-400">Si las subes, se genera una página extra en el PDF con estas 2 fotos.</p>
            <div className="mt-4 grid gap-4">
              {horizontalPhotoSlots.map((slot) => {
                const imageUrl = data.images?.[slot.index] || '';
                const selectedName = selectedFileNames?.gallery?.[slot.id];

                return (
                  <div key={slot.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-cyan-300">{slot.title}</p>
                    <p className="mt-1 text-xs text-zinc-400">{slot.hint}</p>

                    <div className="mt-3 max-w-80">
                      <ImagePreviewThumb src={imageUrl} alt={`Miniatura de ${slot.title}`} emptyLabel="Sin imagen en este slot" />
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                      <label className="space-y-2 rounded-xl border border-dashed border-white/15 bg-white/5 p-3">
                        <span className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">Subir imagen</span>
                        <input
                          id={`gallery-${slot.id}-upload`}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                          onChange={(event) => onGalleryUpload(event, slot.id)}
                          className="w-full cursor-pointer text-xs text-zinc-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-cyan-400 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-zinc-950"
                        />
                        {selectedName ? <div className="text-xs text-cyan-300">✓ {selectedName}</div> : null}
                      </label>

                      <div className="flex flex-col gap-2 sm:w-52">
                        <button
                          type="button"
                          onClick={() => onOpenImageLibrary(`gallery:${slot.id}`)}
                          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-cyan-300/50 hover:bg-white/10 hover:text-white"
                        >
                          📚 Biblioteca de fotos
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div id="presskit-step-9" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-fuchsia-300">9. Artículos de Prensa</p>
              <p className="mt-2 text-sm text-zinc-300">Sube imágenes de artículos de prensa o notas destacadas. Cada imagen se mostrará como una página completa en el presskit.</p>
            </div>
          </div>

          {imageUploadError && (
            <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-300">
              {imageUploadError}
            </div>
          )}
          <div className="mt-4 grid gap-4">
            {Array.from({ length: data.pressArticles?.length || 0 }).map((_, idx) => {
              const selectedName = selectedFileNames?.pressArticles?.[idx];
              const pressArticleImage = data.pressArticles?.[idx] || '';
              return (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-fuchsia-300">Artículo de prensa {idx + 1}</p>
                  <p className="mt-1 text-xs text-zinc-400">Sube una imagen de nota, reseña o artículo destacado.</p>
                  <div className="mt-3 max-w-56">
                    <ImagePreviewThumb src={pressArticleImage} alt={`Miniatura de artículo de prensa ${idx + 1}`} emptyLabel="La imagen del artículo aparecerá aquí" />
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <label className="space-y-2 rounded-xl border border-dashed border-white/15 bg-white/5 p-3">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">Subir imagen</span>
                      <input
                        id={`press-article-${idx}-upload`}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={(e) => onPressArticleUpload?.(e, idx)}
                        className="w-full cursor-pointer text-xs text-zinc-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-fuchsia-400 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-zinc-950"
                      />
                      {selectedName ? <div className="text-xs text-fuchsia-300">✓ {selectedName}</div> : null}
                    </label>
                    <div className="flex flex-col gap-2 sm:w-52">
                      <button
                        type="button"
                        onClick={() => onOpenImageLibrary(`pressArticles:${idx}`)}
                        className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-cyan-300/50 hover:bg-white/10 hover:text-white"
                      >
                        📚 Biblioteca de fotos
                      </button>
                      {data.pressArticles?.[idx] && (
                        <button
                          type="button"
                          onClick={() => onDeletePressArticle?.(idx)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                        >
                          Eliminar imagen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => onFieldChange('pressArticles', [...(data.pressArticles || []), ''])}
              className="mt-4 rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-300/20"
            >
              + Agregar artículo
            </button>
          </div>
        </div>

        <div id="presskit-step-10" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-sm font-semibold text-fuchsia-300">10. Contacto</p>
          <p className="mt-2 text-sm text-zinc-300">
            Agrega la información de contacto profesional para cerrar tu EPK con canales directos de booking.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Nombre del artista</span>
              <input
                id="contact-artist-name"
                value={data.contactArtistName || ''}
                onChange={(event) => onFieldChange('contactArtistName', event.target.value)}
                placeholder="Nombre del artista"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>

            <label className="space-y-3 sm:col-span-2 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Logo (opcional)</span>
              <ImagePreviewThumb src={data.contactLogo || ''} alt="Miniatura del logo de contacto" emptyLabel="El logo seleccionado aparecerá aquí" />
              <input
                id="contact-logo-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={onContactLogoUpload}
                className="w-full cursor-pointer text-sm text-zinc-300 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-950"
              />
              {selectedFileNames?.contactLogo && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-cyan-300/10 px-3 py-2">
                  <span className="text-xs text-cyan-300">✓ {selectedFileNames.contactLogo}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => onOpenImageLibrary('contactLogo')}
                className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:border-white/30 hover:bg-white/10"
              >
                📚 Biblioteca de fotos
              </button>
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Manager</span>
              <input
                id="manager-name"
                value={data.managerName || ''}
                onChange={(event) => onFieldChange('managerName', event.target.value)}
                placeholder="Nombre del manager"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Road Manager</span>
              <input
                id="road-manager-name"
                value={data.roadManagerName || ''}
                onChange={(event) => onFieldChange('roadManagerName', event.target.value)}
                placeholder="Nombre del road manager"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">País / Indicativo</span>
              <select
                id="contact-country-code"
                value={data.contactCountryCode || '+57'}
                onChange={(event) => onFieldChange('contactCountryCode', event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              >
                {latamCountryCodes.map((country) => (
                  <option key={country.code + country.label} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Contacto</span>
              <input
                id="contact-phone"
                value={data.contactPhone || ''}
                onChange={(event) => onFieldChange('contactPhone', event.target.value.replace(/\D/g, ''))}
                placeholder="Número de contacto"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={15}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
              <p className="text-xs text-zinc-500">Solo números.</p>
            </label>

            {!showWhatsapp ? (
              <button
                type="button"
                onClick={() => setShowWhatsapp(true)}
                className="flex items-center gap-2 self-start rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
              >
                <span className="text-base">＋</span> Agregar número de WhatsApp
              </button>
            ) : (
              <label className="space-y-2">
                <span className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-zinc-400">
                  WhatsApp
                  <button
                    type="button"
                    onClick={() => { setShowWhatsapp(false); onFieldChange('whatsappPhone', ''); }}
                    className="text-[10px] font-semibold text-zinc-500 transition hover:text-red-400"
                  >
                    Quitar
                  </button>
                </span>
                <input
                  id="contact-whatsapp"
                  value={data.whatsappPhone || ''}
                  onChange={(event) => onFieldChange('whatsappPhone', event.target.value.replace(/\D/g, ''))}
                  placeholder="Número de WhatsApp"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={15}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-emerald-300"
                />
                <p className="text-xs text-zinc-500">Usa el mismo indicativo de país de arriba. Solo números.</p>
              </label>
            )}
          </div>
        </div>

        <div id="presskit-step-11" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-sm font-semibold text-fuchsia-300">11. Tema Visual</p>
          <p className="mt-2 text-sm text-zinc-300">
            Elige un estilo rápido o ajusta cada variable color a color. Los cambios se aplican al preview en tiempo real.
          </p>
          <div className="mt-5">
            <ThemePickerStep data={data} onFieldChange={onFieldChange} />
          </div>
        </div>

        <div id="presskit-step-12" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-sm font-semibold text-fuchsia-300">12. Identidad Visual</p>
          <div className="mt-5">
            <Step12GenreIdentity
              customFonts={data.customFonts}
              onCustomFontUpload={onCustomFontUpload}
              onRemoveCustomFont={onRemoveCustomFont}
            />
          </div>
        </div>

        <div id="presskit-step-13" className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-cyan-300">13. Preview y Guardar</p>
              <p className="mt-1 text-sm text-zinc-400">La información se autoguarda en Firestore en cada cambio.</p>
            </div>
            <button
              type="button"
              onClick={onOpenPublish}
              className="cursor-pointer rounded-xl bg-white px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200"
            >
              Guardar y publicar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stepform;
