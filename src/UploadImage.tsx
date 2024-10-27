import { useState } from "react";
import OpenAI from "openai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Define a functional component named UploadAndDisplayImage
const UploadAndDisplayImage = () => {
  // Define state variables
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  //   const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Function to encode the image to base64
  const encodeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to get image description from OpenAI API
  const getImageDescription = async (file: File) => {
    setIsLoading(true);
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      const base64Image = await encodeImage(file);
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that identifies what might have gone wrong with the car given the photo of the car area with the problem.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `
          Please respond with a JSON object with the following keys: "likelyCause", "estimatedCost". likelyCause should be a list of [{issue: string, severity: string}]. Severity should ALWAYS be "critical", "moderate", or  "minor". Critical issues should come first.
          Make estimatedCost a simple range like "$XXX-$XXX"`,
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 300,
      });
      console.log(response.choices[0].message.content);
      navigate("/results", { state: response.choices[0].message.content });
    } catch (error) {
      console.error("Error getting image description:", error);
      //   setDescription("Error getting image description");
    } finally {
      setIsLoading(false);
    }
  };

  // Return the JSX for rendering
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Upload Car Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG or JPEG (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    console.log(file);
                    setSelectedImage(file);
                  }
                }}
                accept="image/*"
              />
            </label>
          </div>
          {selectedImage && (
            <div className="flex items-center space-x-2 text-sm">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span>{selectedImage.name}</span>
            </div>
          )}
          <Button
            onClick={() => selectedImage && getImageDescription(selectedImage)}
            disabled={!selectedImage}
            className="w-full"
          >
            {isLoading ? "Uploading..." : "Upload Photo"}
          </Button>
        </CardContent>
      </Card>
      <Dialog open={isLoading} onOpenChange={setIsLoading}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <h2 className="text-lg font-semibold">Uploading Photo</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we process your image...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Export the UploadAndDisplayImage component as default
export default UploadAndDisplayImage;
