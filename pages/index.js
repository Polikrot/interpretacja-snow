import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [dream, setDream] = useState('');
  const [mode, setMode] = useState('simple');
  const [interpretation, setInterpretation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInterpretation = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/interpretDream', { dream, mode });
      setInterpretation(response.data.interpretation);
    } catch (error) {
      alert("Wystąpił błąd przy interpretacji snu.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Interpretacja Snów</h1>
      <textarea
        value={dream}
        onChange={(e) => setDream(e.target.value)}
        placeholder="Opisz swój sen tutaj..."
        rows={5}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <div>
        <label>
          <input
            type="radio"
            name="mode"
            value="simple"
            checked={mode === 'simple'}
            onChange={() => setMode('simple')}
          />
          Uproszczona interpretacja
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input
            type="radio"
            name="mode"
            value="professional"
            checked={mode === 'professional'}
            onChange={() => setMode('professional')}
          />
          Profesjonalna interpretacja
        </label>
      </div>
      <button onClick={handleInterpretation} disabled={loading}>
        {loading ? 'Interpretuje...' : 'Interpretuj Sen'}
      </button>
      {interpretation && (
        <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '10px' }}>
          <h3>Interpretacja:</h3>
          <p>{interpretation}</p>
        </div>
      )}
    </div>
  );
}
