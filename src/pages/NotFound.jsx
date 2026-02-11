import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md bg-card/90 border border-border shadow-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-semibold">
            404
          </CardTitle>
          <CardDescription>
            The page you are looking for does not exist.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center text-sm text-muted-foreground">
          The link may be broken, or the page may have been removed.
        </CardContent>

        <CardFooter className="flex justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>

          <Button
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default NotFound;
