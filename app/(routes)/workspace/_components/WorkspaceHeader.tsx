"use client";

import { Button } from "@/components/ui/button";
import { Save, Share2 } from "lucide-react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { useState, useRef } from "react";

function WorkspaceHeader({ onSave }: any) {
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const captureRef = useRef<HTMLDivElement>(null);

    // Capture Screenshot (only workspace, not entire page)
    const handleCaptureScreenshot = async () => {
        if (!captureRef.current) return;
        const canvas = await html2canvas(captureRef.current);
        const image = canvas.toDataURL("image/png");
        setScreenshot(image);
        setShareModalOpen(true);
    };

    // Copy Screenshot to Clipboard
    const handleCopyToClipboard = async () => {
        if (screenshot) {
            const blob = await fetch(screenshot).then(res => res.blob());
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
            ]);
            alert("Screenshot copied to clipboard!");
        }
    };

    // Save Screenshot Locally
    const generateLocalLink = () => {
        if (screenshot) {
            localStorage.setItem("sharedScreenshot", screenshot);
            alert("Screenshot saved! Open it later from local storage.");
        }
    };

    // Mobile Web Share API
    const handleWebShare = () => {
        if (navigator.share && screenshot) {
            navigator.share({
                title: "Check this screenshot",
                url: screenshot
            }).catch((error) => console.log("Sharing failed:", error));
        } else {
            alert("Sharing not supported on this device.");
        }
    };

    return (
        <div ref={captureRef} className="p-3 border-b flex justify-between items-center bg-gray-100 shadow-md">
            {/* Left Section: Logo & Title */}
            <div className="flex gap-2 items-center">
                <Image src={"/logo-1.png"} alt="logo" height={40} width={40} />
                <h2 className="font-semibold text-lg">Riya's Workspace</h2>
            </div>

            {/* Right Section: Buttons */}
            <div className="flex items-center gap-4">
                <Button className="h-8 text-[12px] gap-2 bg-yellow-500 hover:bg-yellow-600" onClick={onSave}>
                    <Save className="h-4 w-4" /> Save
                </Button>
                <Button className="h-8 text-[12px] gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleCaptureScreenshot}>
                    Share <Share2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Share Modal */}
            {shareModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-5 rounded-lg w-80 shadow-lg relative">
                        <h3 className="text-lg font-semibold mb-3">Share Screenshot</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Button className="bg-gray-700 text-white" onClick={handleCopyToClipboard}>
                                Copy to Clipboard
                            </Button>
                            <Button className="bg-green-500 text-white" onClick={generateLocalLink}>
                                Save Locally
                            </Button>
                            <Button className="bg-blue-600 text-white" onClick={handleWebShare}>
                                Mobile Share
                            </Button>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <Button className="bg-red-500 text-white" onClick={() => setShareModalOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkspaceHeader;
