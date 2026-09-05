import { FileQuestion } from 'lucide-react';

export const EmptyState = ({ title = 'No data', description = 'There is nothing here yet.' }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed border-border bg-transparent">
    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
      <FileQuestion className="h-5 w-5" />
    </div>
    <h3 className="text-lg font-semibold text-foreground tracking-tight">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
  </div>
);
