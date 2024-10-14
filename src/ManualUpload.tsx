import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import OpenAI from "openai";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
function ManualUpload() {
  const navigate = useNavigate();

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [carInfo, setCarInfo] = useState({
    make: "",
    model: "",
    year: "",
    problem: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted car info:", carInfo);
    setIsLoading(true);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "", //TODO: FILL IN SYSTEM INSTRUCTIONS
        },
        {
          role: "user",
          content: `Model of the car is "${carInfo.model}",....`, //TODO: FILL IN USER INSTRUCTIONS
        },
      ],
      // TODO: SOMETHING ELSE YOU CAN PUT HERE TO FORCE JSON RESPONSE.
      // HINT: Look at https://platform.openai.com/docs/guides/structured-outputs
    });

    console.log(response.choices[0].message.content);
    setIsLoading(false);
    navigate("/results", { state: response.choices[0].message.content }); // navigate to results page with the response
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-foreground">
          Describe Your Car's Problem
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="make">Car Make</Label>
            <Input
              id="make"
              value={carInfo.make}
              onChange={(e) => setCarInfo({ ...carInfo, make: e.target.value })}
              placeholder="e.g., Toyota"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Car Model</Label>
            <Input
              id="model"
              value={carInfo.model}
              onChange={(e) =>
                setCarInfo({ ...carInfo, model: e.target.value })
              }
              placeholder="e.g., Corolla"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              value={carInfo.year}
              onChange={(e) => setCarInfo({ ...carInfo, year: e.target.value })}
              placeholder="e.g., 2018"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="problem">Describe the Problem</Label>
            <Textarea
              id="problem"
              value={carInfo.problem}
              onChange={(e) =>
                setCarInfo({ ...carInfo, problem: e.target.value })
              }
              placeholder="Describe the issue you're experiencing with your car..."
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
      <Dialog open={isLoading} onOpenChange={setIsLoading}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <h2 className="text-lg font-semibold">Processing...</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we process your request...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default ManualUpload;
