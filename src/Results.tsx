import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function Results() {
  const { state } = useLocation();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-foreground">
          CarGPT Analysis Results
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Potential Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {JSON.parse(state).likelyCause.map(
              (cause: { issue: string; severity: string }, index: number) => (
                <p key={index}>
                  <Badge
                    variant={
                      cause.severity === "critical"
                        ? "destructive"
                        : cause.severity === "moderate"
                        ? "outline"
                        : "default"
                    }
                  >
                    {cause.severity.charAt(0).toUpperCase() +
                      cause.severity.slice(1)}
                  </Badge>{" "}
                  {cause.issue}
                </p>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estimated Cost to Fix</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {JSON.parse(state).estimatedCost}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              This is an estimate. Actual costs may vary.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default Results;
