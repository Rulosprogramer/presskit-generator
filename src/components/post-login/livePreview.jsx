import PresskitWeb from './PresskitWeb.jsx';
import PDFPreview from './PDFPreview.jsx';

function LivePreview({ data }) {
  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <p className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-300">
        Tu EPK se actualiza en tiempo real en ambos previews.
      </p>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Preview en vivo para la web</p>
        <div className="flex justify-center">
          <div className="w-[clamp(18rem,94%,38rem)]">
            <PresskitWeb presskitData={data} mode="embedded" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.16em] text-fuchsia-300">Preview en vivo para descargar (A4)</p>
        <PDFPreview presskitData={data} />
      </div>
    </section>
  );
}

export default LivePreview;
