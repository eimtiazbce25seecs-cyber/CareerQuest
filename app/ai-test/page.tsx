'use client'

import { useState } from 'react';

export default function AITestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runAITest = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    // Hardcoded mock data simulating a user's recent run
    const mockSimulationData = {
      career_id: 'machine-learning-engineer',
      decisions: [
        { scene: 'scene_1', choice: 'Optimize the architecture', enjoyment: 5 },
        { scene: 'scene_2', choice: 'Debug the dataset', enjoyment: 4 }
      ]
    };

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulationData: mockSimulationData }),
      });

      if (!response.ok) throw new Error('API Request Failed');

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
      <h2>AI Pipeline Integration Test</h2>
      
      <button 
        onClick={runAITest} 
        disabled={loading}
        style={{ padding: '10px 20px', background: '#0070f3', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
      >
        {loading ? 'Generating Roadmap...' : 'Run Prompt Test'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>Error: {error}</p>}

      {result && (
        <div style={{ marginTop: '20px', background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
          <h4>Validated JSON Output:</h4>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
