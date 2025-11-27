// Logo simplifié - utilise le logo minimaliste centré
export function LogoIcon() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: '100%'
    }}>
      <img 
        src="/images/logo-mini.png" 
        alt="Chef★" 
        style={{ 
          height: '40px', 
          width: 'auto',
          objectFit: 'contain'
        }}
      />
    </div>
  );
}

// Logo complet - TAILLE FIXE 160px (comme la page d'accueil)
export function LogoFull() {
  return (
    <img 
      src="/images/chef-etoile-logo.png" 
      alt="Chef★" 
      style={{ 
        width: '160px',
        height: 'auto',
        display: 'block',
        margin: '0 auto'
      }}
    />
  );
}
