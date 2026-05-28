import { BlobProvider } from '@react-pdf/renderer';
import PresskitPdfDocument from '../pdfx/PresskitPdfDocument.jsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useEffect, useState } from 'react';
import { resolvePdfPresskitData } from '../../lib/pdfImageResolver';

function hexify(color) {
  if (!color) return '#000000';
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  const h3 = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color);
  if (h3) return `#${h3[1]}${h3[1]}${h3[2]}${h3[2]}${h3[3]}${h3[3]}`;
  const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(color);
  if (m) return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
  return '#000000';
}

function PDFPreview({ presskitData }) {
  const { theme: uiTheme } = useTheme();
  const [pdfPresskitData, setPdfPresskitData] = useState(presskitData || {});
  const pdfColors = {
    bg:     hexify(uiTheme.bgColor),
    card:   uiTheme.cardBg,
    title:  uiTheme.titleColor,
    text:   uiTheme.textColor,
    accent: hexify(uiTheme.accentColor),
    border: uiTheme.borderColor,
  };

  useEffect(() => {
    let cancelled = false;
    resolvePdfPresskitData(presskitData).then((resolved) => {
      if (!cancelled) setPdfPresskitData(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [presskitData]);

  const docKey = JSON.stringify(pdfPresskitData || {});

  return (
    <div className="h-140 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90">
      <div className="h-full w-full overflow-hidden">
        <BlobProvider key={docKey} document={<PresskitPdfDocument data={pdfPresskitData} variant="professional" colors={pdfColors} />}>
          {({ url, loading }) => (
            loading || !url ? (
              <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                Generando preview PDF...
              </div>
            ) : (
              <iframe
                title="Preview PDF"
                src={`${url}#toolbar=0`}
                className="h-full w-full border-0"
              />
            )
          )}
        </BlobProvider>
      </div>
    </div>
  );
}

export default PDFPreview;
