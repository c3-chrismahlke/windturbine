import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Proxy the request to the backend server
    const backendUrl = new URL(`/api/1/workorders${req.url?.split('?')[1] ? '?' + req.url.split('?')[1] : ''}`, 'http://localhost:3000');
    
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward any authorization headers if needed
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Backend error: ${response.status}`,
        message: await response.text()
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying work orders request:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
