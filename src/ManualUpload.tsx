import { Label } from "@/components/ui/label";
import { useState } from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";

function ManualUpload() {
  const [carInfo, setCarInfo] = useState({
    make: "",
    model: "",
    year: "",
    problem: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend or process it
    console.log("Submitted car info:", carInfo);
    // You could then navigate to a results page or update the UI as needed
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-foreground">
          Describe Your Car's Problem
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="make">Car Make</Label><br></br>
            <Input type="text" 
              id="make"
              value={carInfo.make}
              onChange={(e) => setCarInfo({ ...carInfo, make: e.target.value })}
              placeholder="e.g., Toyota"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Car Model</Label><br></br>
            <Input type="text"
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
            <Label htmlFor="year">Year</Label><br></br>
            <Input type="text"
              id="year"
              value={carInfo.year}
              onChange={(e) => setCarInfo({ ...carInfo, year: e.target.value })}
              placeholder="e.g., 2018"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="problem">Describe the Problem</Label><br></br>
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
    </div>
  );
}
export default ManualUpload;
