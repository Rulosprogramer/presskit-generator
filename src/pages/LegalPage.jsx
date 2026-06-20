const CONTACT_EMAIL = 'soporte@music-presskit-generator.com';

const privacy = {
  title: 'Política de Privacidad',
  updated: 'Última actualización: 20 de junio de 2026',
  sections: [
    {
      h: '1. Responsable del tratamiento',
      p: 'Presskit Generator ("nosotros") es responsable del tratamiento de los datos personales que recopilamos a través de music-presskit-generator.com. Para cualquier consulta sobre privacidad puedes escribirnos a ' + CONTACT_EMAIL + '.',
    },
    {
      h: '2. Datos que recopilamos',
      p: 'Recopilamos: (a) datos de cuenta (nombre, correo electrónico) cuando te registras o inicias sesión con Google; (b) el contenido que cargas para tu presskit (biografía, imágenes, enlaces, datos de contacto artístico); y (c) datos de pago procesados de forma segura por Mercado Pago — no almacenamos los datos de tu tarjeta.',
    },
    {
      h: '3. Cómo usamos tus datos',
      p: 'Usamos tus datos para crear y alojar tu presskit, generar el PDF y el enlace público, procesar pagos, brindar soporte y mejorar el servicio. No vendemos tus datos personales a terceros.',
    },
    {
      h: '4. Almacenamiento y proveedores',
      p: 'Tus datos se almacenan en Firebase (Google Cloud) y la aplicación se aloja en Vercel. Los pagos se procesan mediante Mercado Pago. Estos proveedores aplican sus propias medidas de seguridad y políticas de privacidad.',
    },
    {
      h: '5. Enlaces públicos',
      p: 'Cuando publicas tu presskit, el contenido que incluyes se hace accesible a través de un enlace público. El plan por descarga mantiene el enlace activo durante 20 días; el plan anual lo mantiene activo mientras la suscripción esté vigente.',
    },
    {
      h: '6. Tus derechos',
      p: 'Puedes acceder, corregir o eliminar tus datos personales y tu cuenta en cualquier momento escribiéndonos a ' + CONTACT_EMAIL + '. Atenderemos tu solicitud conforme a la legislación aplicable.',
    },
    {
      h: '7. Cookies',
      p: 'Utilizamos almacenamiento local y cookies estrictamente necesarias para mantener tu sesión iniciada y guardar borradores de tu presskit. No utilizamos cookies de publicidad de terceros.',
    },
  ],
};

const terms = {
  title: 'Términos de Servicio',
  updated: 'Última actualización: 20 de junio de 2026',
  sections: [
    {
      h: '1. Aceptación',
      p: 'Al usar music-presskit-generator.com aceptas estos Términos de Servicio. Si no estás de acuerdo, no utilices la plataforma.',
    },
    {
      h: '2. Descripción del servicio',
      p: 'Presskit Generator es una herramienta que permite a artistas musicales crear un EPK (electronic press kit) profesional, descargable en PDF y compartible mediante un enlace web público.',
    },
    {
      h: '3. Planes y pagos',
      p: 'Ofrecemos un plan por descarga (The Starter Beat, $4.99 USD, incluye enlace público por 20 días) y un plan anual (The Headliner Pro, $14.99 USD, con descargas ilimitadas). Los pagos se procesan a través de Mercado Pago. Los precios se muestran en USD y el cobro puede realizarse en la moneda local correspondiente.',
    },
    {
      h: '4. Contenido del usuario',
      p: 'Eres el único responsable del contenido que cargas (textos, imágenes, enlaces). Declaras que cuentas con los derechos necesarios sobre ese material y que no infringe derechos de terceros ni la ley aplicable.',
    },
    {
      h: '5. Uso aceptable',
      p: 'No puedes utilizar el servicio para fines ilícitos, para cargar contenido ofensivo o que infrinja derechos de autor, ni para intentar vulnerar la seguridad de la plataforma.',
    },
    {
      h: '6. Reembolsos',
      p: 'Dado que el servicio entrega un producto digital de forma inmediata, los pagos por descarga no son reembolsables una vez generado el PDF o el enlace público. Para suscripciones anuales puedes cancelar la renovación en cualquier momento.',
    },
    {
      h: '7. Limitación de responsabilidad',
      p: 'El servicio se ofrece "tal cual". No garantizamos resultados específicos (por ejemplo, contrataciones o cobertura de prensa). No somos responsables de daños indirectos derivados del uso de la plataforma.',
    },
    {
      h: '8. Contacto',
      p: 'Para cualquier consulta sobre estos términos, escríbenos a ' + CONTACT_EMAIL + '.',
    },
  ],
};

function LegalPage({ kind = 'privacy' }) {
  const data = kind === 'terms' ? terms : privacy;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-20 pt-32 lg:px-12">
      <h1 className="text-3xl font-black text-white sm:text-4xl">{data.title}</h1>
      <p className="mt-2 text-sm text-zinc-400">{data.updated}</p>

      <div className="mt-8 space-y-6">
        {data.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg font-bold text-white">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{s.p}</p>
          </section>
        ))}
      </div>

      <div className="mt-10">
        <a href="/" className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">
          ← Volver al inicio
        </a>
      </div>
    </div>
  );
}

export default LegalPage;
