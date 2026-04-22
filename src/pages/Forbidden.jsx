import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      
      <Card className="w-full max-w-md text-center bg-gradient-to-b from-[#0f0f10] to-[#18181b] border border-white/10">
        
        <CardHeader>
          <CardTitle className="text-4xl font-bold tracking-wide">
            403 - Forbidden
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          
          <p className="text-muted-foreground text-sm">
            Access Denied. You are not authorized to view this information.
          </p>

          <div className="flex justify-center gap-3 pt-2">
            
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>

            <Button
              onClick={() => navigate('/app')}
            >
              Go Home
            </Button>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}

export default Forbidden;