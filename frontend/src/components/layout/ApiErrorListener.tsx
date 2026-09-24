import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export function ApiErrorListener() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const onSessionExpired = () => {
      toast({
        title: "Session Expired",
        description: "Please log in again.",
        variant: "destructive"
      });
      navigate('/auth/login');
    };

    const onSuspended = () => {
      navigate('/suspended');
    };

    const onForbidden = () => {
      navigate('/403');
    };

    const onInvalidDomain = () => {
      navigate('/invalid-domain');
    };

    window.addEventListener('auth:logout', onSessionExpired);
    window.addEventListener('auth:suspended', onSuspended);
    window.addEventListener('auth:forbidden', onForbidden);
    window.addEventListener('auth:invalid_domain', onInvalidDomain);

    return () => {
      window.removeEventListener('auth:logout', onSessionExpired);
      window.removeEventListener('auth:suspended', onSuspended);
      window.removeEventListener('auth:forbidden', onForbidden);
      window.removeEventListener('auth:invalid_domain', onInvalidDomain);
    };
  }, [navigate, toast]);

  return null;
}
