export type WorkOrderStatus = 'open' | 'in_progress' | 'closed' | string;
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'critical' | string;

export interface WorkOrder {
  id: string;
  windTurbineId: string;
  title: string;
  description?: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  assignedTo?: string;
  createdDate: string; // ISO
  dueDate?: string; // ISO
  resolvedDate?: string; // ISO
}

export interface PaginatedWorkOrders {
  data: WorkOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}


