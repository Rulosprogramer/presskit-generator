import { useEffect, useRef, useState } from 'react';
import PresskitPDF from './PresskitPDF.jsx';

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

function PDFPreview({ presskitData }) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return undefined;

    const updateScale = () => {
      const { clientWidth, clientHeight } = element;
      const availableWidth = Math.max(clientWidth - 32, 0);
      const availableHeight = Math.max(clientHeight - 32, 0);
      const nextScale = Math.min(availableWidth / A4_WIDTH, availableHeight / A4_HEIGHT, 1);
      setScale(nextScale || 0.5);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <div className="h-140 overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 bg-zinc-950/90" ref={wrapperRef}>
      <div className="flex min-h-full w-full justify-center py-4">
        <PresskitPDF presskitData={presskitData} scale={scale} />
      </div>
    </div>
  );
}

export default PDFPreview;