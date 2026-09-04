interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}
export const Button = ({ children, className = '', variant = 'default', ...props }: ButtonProps) => (
  <button className={`px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 ${className}`} data-variant={variant} {...props}>
    {children}
  </button>
);
// Real shadcn implementations should replace these placeholders
