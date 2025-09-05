import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch data from multiple endpoints to create comprehensive analytics
    const [turbinesRes, workOrdersRes] = await Promise.all([
      fetch('http://localhost:3000/api/1/windturbines', {
        headers: { 'Content-Type': 'application/json' },
      }),
      fetch('http://localhost:3000/api/1/workorders', {
        headers: { 'Content-Type': 'application/json' },
      }),
    ]);

    if (!turbinesRes.ok || !workOrdersRes.ok) {
      return res.status(500).json({ 
        error: 'Failed to fetch data from backend',
        message: 'One or more data sources are unavailable'
      });
    }

    const turbines = await turbinesRes.json();
    const workOrders = await workOrdersRes.json();

    // Process turbines data
    const turbinesArray = Array.isArray(turbines) ? turbines : (turbines.data || []);
    const totalTurbines = turbinesArray.length;
    const activeTurbines = turbinesArray.filter((t: any) => t.active === true).length;

    // Process work orders data
    const workOrdersArray = Array.isArray(workOrders) ? workOrders : (workOrders.data || []);
    const totalWorkOrders = workOrdersArray.length;
    const openWorkOrders = workOrdersArray.filter((wo: any) => wo.status === 'open').length;
    const inProgressWorkOrders = workOrdersArray.filter((wo: any) => wo.status === 'in_progress').length;

    // Calculate average power output (simplified - in real app this would come from power data)
    const avgPowerOutput = turbinesArray.length > 0 
      ? Math.round((Math.random() * 2000 + 1000) * 100) / 100 // Mock calculation
      : 0;

    const summary = {
      totalTurbines,
      activeTurbines,
      totalWorkOrders,
      openWorkOrders,
      inProgressWorkOrders,
      avgPowerOutput,
    };

    return res.status(200).json(summary);
  } catch (error) {
    console.error('Error generating system summary:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 