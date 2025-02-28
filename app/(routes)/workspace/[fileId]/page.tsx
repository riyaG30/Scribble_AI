"use client";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useEffect, useState } from "react";
import { FILE } from "../../dashboard/_components/FileList";

import Canvas from "../_components/Canvas";
import Editor from "../_components/Editor";
import WorkspaceHeader from "../_components/WorkspaceHeader";

function Workspace({ params }: any) {
  const [triggerSave, setTriggerSave] = useState(false);
  const convex = useConvex();
  const [fileData, setFileData] = useState<FILE | any>();

  const [aiAnalysisResult, setAiAnalysisResult] = useState<string>("");

  useEffect(() => {
    console.log("FILEID", params.fileId);
    if (params.fileId) {
      getFileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFileData = async () => {
    const result = await convex.query(api.files.getFileById, {
      _id: params.fileId,
    });
    setFileData(result);
  };

  

  return (
    <div>
      <WorkspaceHeader onSave={() => setTriggerSave(!triggerSave)} />

      {/* Workspace Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Document/Editor */}
        <div className="h-screen">
          <Editor
            onSaveTrigger={triggerSave}
            fileId={params.fileId}
            fileData={fileData}
            // 3) Pass the Canvas value down to Editor as a prop
            aiAnalysisResult={aiAnalysisResult}
          />
        </div>

        {/* Whiteboard/Canvas */}
        <div className="h-screen border-l">
          <Canvas
            onSaveTrigger={triggerSave}
            fileId={params.fileId}
            fileData={fileData}
            // 4) Pass the callback down so Canvas can update canvasValue
            onAnalysisComplete={setAiAnalysisResult} 
          />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
