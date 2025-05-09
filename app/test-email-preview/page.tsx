'use client';

export default function TestEmailPreview() {
  const name = 'Unda';

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        fontFamily: 'Cinzel, serif',
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: "url('/catmoon-bg.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      />
      {/* Dark Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // <<< ลดความสว่างที่นี่
          zIndex: 1,
        }}
      />
      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '600px',
          backgroundImage: "url('/redsky-bg.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '12px',
          padding: '40px',
          color: '#f8fcdc',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        <h1 style={{ color: '#dc9e63', fontSize: '28px', marginBottom: '20px' }}>
          Thank you for your purchase!
        </h1>
        <p style={{ marginBottom: '16px' }}>
          Hi <strong>{name}</strong>,
        </p>
        <p style={{ marginBottom: '16px' }}>
          We're thrilled to let you know that your order has been successfully received and is now being processed.
        </p>
        <p style={{ marginBottom: '30px' }}>
          You’ll receive another email once your items have shipped.
        </p>
        <a
          href="https://www.undaalunda.com"
          style={{
            display: 'inline-block',
            backgroundColor: '#dc9e63',
            color: '#000000',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          Return to Store
        </a>
        <p
          style={{
            fontSize: '12px',
            color: '#999',
            marginTop: '30px',
            textAlign: 'center',
          }}
        >
          Copyright © 2025 Unda Alunda
        </p>
      </div>
    </div>
  );
}