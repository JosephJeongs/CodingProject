import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-3xl font-bold text-center text-foreground">
          CarGPT
        </h1>
        <Button asChild className="w-full h-14 text-lg" size="lg">
          <Link to="/upload">
            <Upload className="mr-2 h-5 w-5" />
            Upload Image
          </Link>
        </Button>
        <div className="text-center ">
          <Button
            asChild
            variant="ghost"
            className="w-full h-14 text-lg 3text-lg"
          >
            <Link to="/manual">Type in manually</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
export default App;
