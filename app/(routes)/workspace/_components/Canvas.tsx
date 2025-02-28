import { api } from "@/convex/_generated/api";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { FILE } from "../../dashboard/_components/FileList";

function Canvas({
    onSaveTrigger,
    fileId,
    fileData,
    onAnalysisComplete, 
}: {
    onSaveTrigger: any;
    fileId: any;
    fileData: FILE;
    onAnalysisComplete: (result: string) => void;
}) {
    const [whiteBoardData, setWhiteBoardData] = useState<any>();

    const updateWhiteboard = useMutation(api.files.updateWhiteboard);
    useEffect(() => {
        onSaveTrigger && saveWhiteboard();
    }, [onSaveTrigger]);
    const saveWhiteboard = () => {
        updateWhiteboard({
            _id: fileId,
            whiteboard: JSON.stringify(whiteBoardData),
        }).then((resp) => console.log(resp));
    };
    const analyzeImage = async (imageData: string) => {
        try {
            console.log("📤 Sending image data to API...");
     
     
            const response = await fetch("/api/generateImage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageData }),
            });
     
     
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(`Error: ${response.status} - ${errorResponse.error}`);
            }
     
     
            const data = await response.json();
            console.log("✅ AI Image Analysis Output:", data.output);
           
            if (data.output) {
                onAnalysisComplete(data.output);
                console.log("onAnalysisComplete called with:", data.output);
              }
                   
           
            return data.output;
        } catch (error) {
            console.error("❌ Error analyzing image:", error);
            return null;
        }
     };
    const handleAnalyse = async () => {
        const canvas = document.querySelector("canvas");
        if (!canvas) {
            console.error("Canvas not found");
            return;
        }
 
 
        const image = canvas.toDataURL("image/png"); // Capture image
        console.log("Captured Image:", image);
        const analyzedText = await analyzeImage(image); // Call analyze function
       
console.log("Analyzed Text:", analyzedText);

if (analyzedText) {
  onAnalysisComplete(analyzedText);
  console.log("onAnalysisComplete called with:", analyzedText);
}
       
        
    };
 
    return (
        <div style={{ height: "670px" }}>
            {fileData && (
                <Excalidraw
                    theme="light"
                    initialData={{
                        elements:
                            fileData?.whiteboard &&
                            JSON.parse(fileData?.whiteboard),
                    }}
                    onChange={(excalidrawElements, appState, files) =>
                        setWhiteBoardData(excalidrawElements)
                    }
                    UIOptions={{
                        canvasActions: {
                            saveToActiveFile: false,
                            loadScene: false,
                            export: false,
                            toggleTheme: false,
                        },
                    }}
                >
                   <MainMenu>
                       <MainMenu.DefaultItems.ClearCanvas />
                       <MainMenu.DefaultItems.SaveAsImage />
                       <MainMenu.DefaultItems.ChangeCanvasBackground />
                       <MainMenu.Item onSelect={handleAnalyse}>Analyse through AI</MainMenu.Item>
                   </MainMenu>

                    <WelcomeScreen>
                        <WelcomeScreen.Hints.MenuHint />
                        <WelcomeScreen.Hints.MenuHint />
                        <WelcomeScreen.Hints.ToolbarHint />
                        <WelcomeScreen.Center>
                            <WelcomeScreen.Center.MenuItemHelp />
                        </WelcomeScreen.Center>
                    </WelcomeScreen>
                </Excalidraw>
            )}
        </div>
    );
}

export default Canvas;

 