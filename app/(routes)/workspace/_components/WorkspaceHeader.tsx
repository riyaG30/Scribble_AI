"use client";

import { Button } from "@/components/ui/button";
import { Save, Share2 } from "lucide-react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { useState, useRef } from "react";

function WorkspaceHeader({ onSave }: any) {
   
    const captureRef = useRef<HTMLDivElement>(null);

  

    return (
        <div ref={captureRef} className="p-3 border-b flex justify-between items-center bg-gray-100 shadow-md">
            {/* Left Section: Logo & Title */}
            <div className="flex gap-2 items-center">
                <Image src={"/logo-1.png"} alt="logo" height={40} width={40} />
                <h2 className="font-semibold text-lg">Workspace</h2>
            </div>

            {/* Right Section: Buttons */}
            <div className="flex items-center gap-4">
                <Button className="h-8 text-[12px] gap-2 bg-yellow-500 hover:bg-yellow-600" onClick={onSave}>
                    <Save className="h-4 w-4" /> Save
                </Button>
                
            </div>

           
        </div>
    );
}

export default WorkspaceHeader;
