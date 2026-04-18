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
    <div className="h-140 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90" ref={wrapperRef}>
      <div className="flex h-full w-full items-center justify-center">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            width: `${A4_WIDTH}px`,
            height: `${A4_HEIGHT}px`,
          }}
        >
          <PresskitPDF presskitData={presskitData} />
        </div>
      </div>
    </div>
  );
}

export default PDFPreview;