const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

const pdfStyles = {
  page: {
    width: `${A4_WIDTH}px`,
    height: `${A4_HEIGHT}px`,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0a0a12',
    color: '#f4f4f5',
    border: '1px solid rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  cover: {
    height: '42%',
    position: 'relative',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#18181b',
    color: '#a1a1aa',
    fontSize: '18px',
  },
  coverOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: '24px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))',
  },
  coverMeta: {
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: '#67e8f9',
    fontSize: '12px',
  },
  coverTitle: {
    margin: '8px 0 0 0',
    fontSize: '42px',
    lineHeight: 1.1,
    fontWeight: 800,
    color: '#ffffff',
  },
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    padding: '22px 26px 26px',
  },
  sectionTitle: {
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#f0abfc',
    fontSize: '12px',
  },
  paragraph: {
    margin: '8px 0 0 0',
    color: '#e4e4e7',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  releaseList: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  releaseItem: {
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: '10px',
    padding: '10px 12px',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  releaseTitle: {
    margin: 0,
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '14px',
  },
  releaseAuthor: {
    margin: '4px 0 0 0',
    color: '#67e8f9',
    fontSize: '12px',
  },
  linksWrap: {
    marginTop: '8px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  linkPill: {
    border: '1px solid rgba(110,231,183,0.45)',
    borderRadius: '9999px',
    padding: '4px 10px',
    color: '#a7f3d0',
    fontSize: '12px',
    textDecoration: 'none',
    backgroundColor: 'rgba(16,185,129,0.1)',
  },
};

function PresskitPDF({ presskitData }) {
  const cover = presskitData.images?.[0] || '';
  const artistName = presskitData.artistName || 'Nombre del artista';
  const genre = presskitData.genre || 'Genero';
  const city = presskitData.city || 'Ciudad';
  const bio = presskitData.bio || 'Agrega una biografia para mostrar tu historia.';
  const releases = Array.isArray(presskitData.releases) ? presskitData.releases : [];
  const links = Object.entries(presskitData.links || {}).filter(([, value]) => value);

  return (
    <article style={pdfStyles.page}>
      <header style={pdfStyles.cover}>
        {cover ? (
          <img src={cover} alt={artistName} style={pdfStyles.coverImage} />
        ) : (
          <div style={pdfStyles.coverFallback}>Sin portada</div>
        )}
        <div style={pdfStyles.coverOverlay}>
          <p style={pdfStyles.coverMeta}>{genre} · {city}</p>
          <h2 style={pdfStyles.coverTitle}>{artistName}</h2>
        </div>
      </header>

      <div style={pdfStyles.body}>
        <section>
          <p style={pdfStyles.sectionTitle}>Biografia</p>
          <p style={pdfStyles.paragraph}>{bio}</p>
        </section>

        <section>
          <p style={pdfStyles.sectionTitle}>Releases</p>
          <div style={pdfStyles.releaseList}>
            {releases.length > 0 ? (
              releases.slice(0, 6).map((release, index) => (
                <div key={`${release.title}-${index}`} style={pdfStyles.releaseItem}>
                  <p style={pdfStyles.releaseTitle}>{release.title || 'Release sin titulo'}</p>
                  {release.author ? <p style={pdfStyles.releaseAuthor}>{release.author}</p> : null}
                </div>
              ))
            ) : (
              <p style={pdfStyles.paragraph}>Agrega releases para visualizarlos en el PDF.</p>
            )}
          </div>
        </section>

        <section>
          <p style={pdfStyles.sectionTitle}>Links</p>
          <div style={pdfStyles.linksWrap}>
            {links.length > 0 ? (
              links.slice(0, 8).map(([key, value]) => (
                <a key={key} href={value} style={pdfStyles.linkPill} target="_blank" rel="noopener noreferrer">
                  {key}
                </a>
              ))
            ) : (
              <p style={pdfStyles.paragraph}>Agrega links para mostrarlos en el PDF.</p>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}

export default PresskitPDF;