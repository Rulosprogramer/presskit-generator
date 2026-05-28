import PresskitDocument from './PresskitDocument.jsx';

function PresskitPDF({ presskitData }) {
  return <PresskitDocument presskitData={presskitData} scale={1} />;
}

export default PresskitPDF;
