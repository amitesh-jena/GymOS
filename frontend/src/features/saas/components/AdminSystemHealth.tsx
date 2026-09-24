import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Database, Server, Component } from 'lucide-react';

export const AdminSystemHealth: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">System Health</h2>
          <p className="text-muted-foreground mt-1">
            Overview of microservices and dependencies.
          </p>
        </div>
      </div>

      <div className="bg-muted text-muted-foreground p-4 rounded-md text-sm">
        <strong>Note:</strong> Currently relying on mock data. Production health endpoints are not yet available in the backend API.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Gateway</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operational</div>
            <p className="text-xs text-muted-foreground mt-1">Latency: ~45ms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database (Primary)</CardTitle>
            <Database className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operational</div>
            <p className="text-xs text-muted-foreground mt-1">Connections: 450 / 10000</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Background Workers</CardTitle>
            <Server className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Degraded</div>
            <p className="text-xs text-muted-foreground mt-1">Queue backup: 15 tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Gateway</CardTitle>
            <Component className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operational</div>
            <p className="text-xs text-muted-foreground mt-1">Webhook sync: Active</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
