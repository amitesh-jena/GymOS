export const EmptyState = ({ title = "No data", description = "There is nothing here yet." }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed text-muted-foreground">
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-1">{description}</p>
  </div>
);
