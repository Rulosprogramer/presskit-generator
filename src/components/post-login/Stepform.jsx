import ThemeSlector from './ThemeSlector.jsx';
import ReleaseStep from './ReleaseStep.jsx';
import ArtistMilestonesStep from './ArtistMilestonesStep.jsx';
import { getTypeface, getTypefaceOptions } from '../../lib/typefaces.js';

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

function Stepform({
  data,
  onFieldChange,
  onLinkChange,
  onLinkMetricChange,
  onCoverUpload,
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
  onOpenPublish,
  onOpenImageLibrary,
  saveLabel,
  isGeneratingBio,
  generatingBioSection,
  bioGenerationError,
  selectedFileNames,
  imageUploadError,
  generatedBios = {},
}) {
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
            Sube tu mejor foto, de estudio o de un show en vivo, recuerda que es lo primero que veran en tu EPK.
          </p>
          {imageUploadError && (
            <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-300">
              {imageUploadError}
            </div>
          )}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Upload portada</span>
              <input type="file" accept="image/*" onChange={onCoverUpload} className="w-full cursor-pointer text-sm text-zinc-300 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-950" />
              {selectedFileNames?.cover && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-cyan-300/10 px-3 py-2">
                  <span className="text-xs text-cyan-300">✓ {selectedFileNames.cover}</span>
                </div>
              )}
            </label>
            <button
              type="button"
              onClick={() => onOpenImageLibrary('cover')}
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-cyan-300/50 hover:bg-white/10 hover:text-white"
            >
              📚 Biblioteca de fotos
            </button>
          </div>
        </div>

        <div id="presskit-step-2" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-sm font-semibold text-fuchsia-300">2. Datos del artista</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Nombre artista</span>
              <input
                value={data.artistName}
                onChange={(event) => onFieldChange('artistName', event.target.value)}
                placeholder="Duna Fever"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Género</span>
              <input
                value={data.genre}
                onChange={(event) => onFieldChange('genre', event.target.value)}
                placeholder="Electrónica latina"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Ciudad</span>
              <input
                value={data.city}
                onChange={(event) => onFieldChange('city', event.target.value)}
                placeholder="Bogotá"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>

            <label className="space-y-2 sm:col-span-3">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Link Performance en vivo (YouTube)</span>
              <input
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
                    value={data.totalStreams || ''}
                    onChange={(event) => onFieldChange('totalStreams', event.target.value)}
                    placeholder="Escribe el total de streams en todas tus DSPs"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
                  />
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Total video views</span>
                  <input
                    value={data.totalVideoViews || ''}
                    onChange={(event) => onFieldChange('totalVideoViews', event.target.value)}
                    placeholder="Escribe el total de vistas de tus canales de video: Youtube, Vevo, etc."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
                  />
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Reconocimientos</span>
                  <textarea
                    value={data.recognitions || ''}
                    onChange={(event) => onFieldChange('recognitions', event.target.value)}
                    rows={3}
                    placeholder="Escribe reconocimientos, escenarios, playlists, becas, festivales o formación."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
                  />
                </label>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                  <label className="inline-flex cursor-pointer items-center gap-3">
                    <input
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
                      <label className="block space-y-2 rounded-xl border border-dashed border-cyan-300/50 bg-cyan-300/5 p-4">
                        <span className="text-xs uppercase tracking-[0.12em] font-semibold text-cyan-300">Selecciona o sube una foto</span>
                        <input type="file" accept="image/*" onChange={onRecognitionImageUpload} className="w-full cursor-pointer text-sm text-zinc-300 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-950" />
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
            Ofrece una bio rápida para redes, una versión corta para festivales y una historia completa para prensa o entrevistas.
          </p>
          <div className="mt-4 grid gap-4">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Estilo IA</span>
              <select
                value={data.bioStyle || 'prensa'}
                onChange={(event) => onFieldChange('bioStyle', event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              >
                <option value="prensa">Prensa (editorial/profesional)</option>
                <option value="festival">Festival (curatorial/escenico)</option>
                <option value="fanbase">Fanbase (cercano/emocional)</option>
                <option value="marca">Marca (alianzas/patrocinios)</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Bio (140 caracteres)</span>
              <div className="space-y-2">
                <textarea
                  value={data.twitterBio || ''}
                  onChange={(event) => onFieldChange('twitterBio', event.target.value)}
                  rows={3}
                  placeholder="Para presentaciones rápidas."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onBioImageUpload?.(e, 'twitterBio')}
                  className="w-full text-xs text-zinc-400 file:rounded-lg file:border file:border-cyan-300/40 file:bg-cyan-300/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-300"
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
              <div className="space-y-2">
                <textarea
                  value={data.bio}
                  onChange={(event) => onFieldChange('bio', event.target.value)}
                  rows={5}
                  placeholder="Ideal para redes sociales y perfiles de festivales."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onBioImageUpload?.(e, 'shortBio')}
                  className="w-full text-xs text-zinc-400 file:rounded-lg file:border file:border-cyan-300/40 file:bg-cyan-300/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-300"
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
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Bio Completa (3-4 párrafos)</span>
              <div className="space-y-2">
                <textarea
                  value={data.longBio || ''}
                  onChange={(event) => onFieldChange('longBio', event.target.value)}
                  rows={9}
                  placeholder="La historia detallada para entrevistas o notas de prensa."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onBioImageUpload?.(e, 'longBio')}
                  className="w-full text-xs text-zinc-400 file:rounded-lg file:border file:border-cyan-300/40 file:bg-cyan-300/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-300"
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
                  value={data.links[key] || ''}
                  onChange={(event) => onLinkChange(key, event.target.value)}
                  placeholder={`https://.../${label.toLowerCase().replace(' ', '')}`}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
                />
                <p className="text-[11px] text-zinc-400">Para ver esta red en el diseño debes agregar un link.</p>
                <input
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
                      <input
                        type="file"
                        accept="image/*"
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
          <p className="mt-2 text-sm text-zinc-300">
            Elige el estilo del collage para desktop. El sistema de layouts dinamicos se aplicara segun cantidad de fotos (3, 5, 6, 7, 8, 9, 10).
          </p>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Estilo de collage</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { id: 'clasico', label: 'Clasico' },
                { id: 'urbano', label: 'Urbano' },
                { id: 'norteno', label: 'Norteno' },
                { id: 'futurista', label: 'Futurista' },
                { id: 'elegante', label: 'Elegante' },
              ].map((style) => {
                const active = (data.galleryStyle || 'clasico') === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onFieldChange('galleryStyle', style.id)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                      active
                        ? 'border-cyan-300/45 bg-cyan-300/15 text-cyan-200'
                        : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/25 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {style.label}
                  </button>
                );
              })}
            </div>
          </div>

          {imageUploadError && (
            <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-300">
              {imageUploadError}
            </div>
          )}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Galería</span>
              <input type="file" accept="image/*" multiple onChange={onGalleryUpload} className="w-full cursor-pointer text-sm text-zinc-300 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-fuchsia-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-950" />
              {Array.isArray(selectedFileNames?.gallery) && selectedFileNames.gallery.length > 0 && (
                <div className="mt-2 flex max-h-20 flex-col gap-1 overflow-y-auto rounded-lg bg-fuchsia-400/10 px-3 py-2">
                  {selectedFileNames.gallery.map((name, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-fuchsia-300">✓ {name}</span>
                    </div>
                  ))}
                </div>
              )}
            </label>
            <button
              type="button"
              onClick={() => onOpenImageLibrary('gallery')}
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-cyan-300/50 hover:bg-white/10 hover:text-white"
            >
              📚 Biblioteca de fotos
            </button>
          </div>
        </div>

        <div id="presskit-step-9" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-sm font-semibold text-fuchsia-300">9. Contacto</p>
          <p className="mt-2 text-sm text-zinc-300">
            Agrega la información de contacto profesional para cerrar tu EPK con canales directos de booking.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Nombre del artista</span>
              <input
                value={data.contactArtistName || ''}
                onChange={(event) => onFieldChange('contactArtistName', event.target.value)}
                placeholder="Nombre del artista"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>

            <label className="space-y-2 sm:col-span-2 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Logo (opcional)</span>
              <input
                type="file"
                accept="image/*"
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
                value={data.managerName || ''}
                onChange={(event) => onFieldChange('managerName', event.target.value)}
                placeholder="Nombre del manager"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Road Manager</span>
              <input
                value={data.roadManagerName || ''}
                onChange={(event) => onFieldChange('roadManagerName', event.target.value)}
                placeholder="Nombre del road manager"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400">Pais / Indicativo</span>
              <select
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
                value={data.contactPhone || ''}
                onChange={(event) => onFieldChange('contactPhone', event.target.value.replace(/\D/g, ''))}
                placeholder="Numero de contacto"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={15}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-cyan-300"
              />
              <p className="text-xs text-zinc-500">Solo números.</p>
            </label>
          </div>
        </div>

        <div id="presskit-step-10" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-sm font-semibold text-fuchsia-300">10. Tema Visual</p>
          <p className="mt-2 text-sm text-zinc-300">
            Selecciona la estética de tu presskit. Los cambios se aplicarán automáticamente al preview y PDF.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { id: 'neon', label: 'Neon', accent: 'from-fuchsia-400 to-cyan-300' },
              { id: 'neutral', label: 'Neutral', accent: 'from-white to-zinc-400' },
              { id: 'dark', label: 'Dark', accent: 'from-zinc-800 to-zinc-600' },
              { id: 'minimal', label: 'Minimal', accent: 'from-emerald-300 to-cyan-300' },
            ].map((theme) => {
              const active = theme.id === data.theme;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onFieldChange('theme', theme.id)}
                  className={`rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-0.5 cursor-pointer ${
                    active
                      ? 'border-cyan-300/50 bg-cyan-300/10 shadow-[0_0_28px_rgba(34,211,238,0.2)]'
                      : 'border-white/10 bg-zinc-900/50 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className={`h-2 rounded-full bg-linear-to-r ${theme.accent}`} />
                  <p className="mt-3 text-sm font-semibold text-white">{theme.label}</p>
                  <p className="mt-1 text-xs text-zinc-400">Ajusta la identidad visual.</p>
                </button>
              );
            })}
          </div>
        </div>

        <div id="presskit-step-11" className="scroll-mt-28 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-sm font-semibold text-fuchsia-300">11. Tipografía</p>
          <p className="mt-2 text-sm text-zinc-300">
            Elige el estilo de fuente que mejor represente tu identidad artística. Se aplicará automáticamente a todo tu presskit.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {getTypefaceOptions().map((typeface) => {
              const active = typeface.id === data.typeface;
              const tf = getTypeface(typeface.id);
              return (
                <button
                  key={typeface.id}
                  type="button"
                  onClick={() => onFieldChange('typeface', typeface.id)}
                  className={`rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-0.5 cursor-pointer ${
                    active
                      ? 'border-cyan-300/50 bg-cyan-300/10 shadow-[0_0_28px_rgba(34,211,238,0.2)]'
                      : 'border-white/10 bg-zinc-900/50 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: tf.fontFamily }}>{typeface.label}</p>
                  <p className="mt-1 text-xs text-zinc-400">{typeface.description}</p>
                  <p className="mt-2 text-xs text-zinc-500">Ejemplos: {typeface.examples}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div id="presskit-step-12" className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-cyan-300">12. Preview y Guardar</p>
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
