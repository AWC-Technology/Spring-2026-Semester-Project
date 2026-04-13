export default function Topbar({ showSearch = true }) {
  return (
    <div style={{
      height: 56, background: 'white',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 40,
    }}>
      {showSearch ? (
        <div style={{ position: 'relative', width: 420 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
          <input placeholder="Search courses or professors..." style={{
            width: '100%', padding: '8px 12px 8px 36px',
            border: '1px solid #e5e7eb', borderRadius: 8,
            fontSize: 14, background: '#f9fafb', outline: 'none',
          }} />
        </div>
      ) : <div />}
      <button style={{
        background: '#1a1a2e', color: 'white',
        padding: '8px 20px', borderRadius: 8,
        border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 14,
      }}>Sign In</button>
    </div>
  );
}