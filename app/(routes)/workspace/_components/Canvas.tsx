import { api } from "@/convex/_generated/api";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { FILE } from "../../dashboard/_components/FileList";
function Canvas({
    onSaveTrigger,
    fileId,
    fileData,
}: {
    onSaveTrigger: any;
    fileId: any;
    fileData: FILE;
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
