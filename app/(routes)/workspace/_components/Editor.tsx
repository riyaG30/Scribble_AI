"use client";
import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef, useState } from "react";
// @ts-ignore
// @ts-ignore
// @ts-ignore
import Checklist from "@editorjs/checklist";
// @ts-ignore
import Quote from "@editorjs/quote";
// @ts-ignore
import Paragraph from "@editorjs/paragraph";
import he from "he";
import WriteMailTool from "./WriteMailTool";
import English from "./English";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

import { toast } from "sonner";
import { FILE } from "../../dashboard/_components/FileList";
const Header = require("editorjs-header-with-alignment");
import jsPDF from "jspdf";


const rawDocument = {
    time: 1550476186479,
    blocks: [
        {
            data: {
                text: "Write Document Name",
                level: 2,
            },
            id: "123",
            type: "header",
        },
        {
            data: {
                level: 4,
            },
            id: "1234",
            type: "header",
        },
    ],
    version: "2.8.1",
};

function Editor({ onSaveTrigger, fileId, fileData, aiAnalysisResult, }: { onSaveTrigger: any; fileId: any; fileData: FILE ;aiAnalysisResult: string; }) {
    const ref = useRef<EditorJS>();
    const updateDocument = useMutation(api.files.updateDocument);
    const [document, setDocument] = useState(rawDocument);
    useEffect(() => {
        // console.log("Editor received aiAnalysisResult:", aiAnalysisResult); 
      }, [aiAnalysisResult]);
    useEffect(() => {
        fileData && initEditor();
    }, [fileData]);    
    useEffect(() => {
        onSaveTrigger && onSaveDocument();
    }, [onSaveTrigger]);

    const initEditor = () => {
        const editor = new EditorJS({
            tools: {
                header: {
                    class: Header,
                    config: {
                        placeholder: "Enter a header",
                        levels: [2, 3, 4],
                        defaultLevel: 3,
                        defaultAlignment: "left",
                    },
                },
                writeMail: {
                    class: WriteMailTool as unknown as { new(config: any): any },
                    inlineToolbar: true,
                },
                English: {
                    class: English as unknown as { new(config: any): any },
                    inlineToolbar: true,
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    shortcut: "CMD+SHIFT+O",
                    config: {
                        quotePlaceholder: "Enter a quote",
                        captionPlaceholder: "Quote's author",
                    },
                },
                checklist: {
                    class: Checklist,
                    inlineToolbar: true,
                },
                paragraph: Paragraph,
            },

            holder: "editorjs",
            data: fileData?.document ? JSON.parse(fileData.document) : rawDocument,
        });
        ref.current = editor;
    };
    const onSaveDocument = () => {
        if (ref.current) {
            ref.current
                .save()
                .then((outputData) => {
                    updateDocument({
                        _id: fileId,
                        document: JSON.stringify(outputData),
                    }).then(
                        () => toast("Document Updated!"),
                        () => toast("Server Error!")
                    );
                })
                .catch((error) => {
                    console.log("Saving failed: ", error);
                });
        }
    };

    const saveAsPDF = () => {
        if (!ref.current) return;
    
        ref.current.save().then((outputData) => {
            console.log("Editor data:", outputData); // Debugging step
    
            const doc = new jsPDF({
                unit: "mm",
                format: "a4",
                orientation: "portrait",
            });
    
            const margin = 12; // 1.2cm margin
            const borderThickness = 1.2; 
            const contentMargin = margin + 5; 
            const pageWidth = 210 - 2 * margin;
            const pageHeight = 297 - 2 * margin;
            let y = margin + 10; // Initial Y position with extra space
    
            // Function to draw thick border
            const drawBorder = () => {
                doc.setDrawColor(0);
                doc.setLineWidth(borderThickness);
                doc.rect(margin, margin, pageWidth, pageHeight);
            };
    
            drawBorder(); // Draw border on first page
    
            const moveToNextPage = () => {
                doc.addPage();
                drawBorder();
                y = margin + 10; // Reset Y position on the new page
            };
    
            outputData.blocks.forEach((block) => {
                if (["button"].includes(block.type)) return;
    
                doc.setFontSize(14);
    
                switch (block.type) {
                    case "paragraph":
                        const paragraphText = he.decode(block.data.text || "No content");
                        const wrappedParagraph = doc.splitTextToSize(paragraphText, pageWidth - 10);
                        const paragraphHeight = wrappedParagraph.length * 6;
    
                        if (y + paragraphHeight > pageHeight + margin) {
                            moveToNextPage();
                        }
    
                        doc.text(wrappedParagraph, contentMargin, y);
                        y += paragraphHeight + 4;
                        break;
    
                    case "header":
                        doc.setFontSize(20);
                        const text = block.data.text || "No title";
                        const textWidth = doc.getTextWidth(text);
                        const headerHeight = 12;
    
                        if (y + headerHeight > pageHeight + margin) {
                            moveToNextPage();
                        }
    
                        doc.text(text, contentMargin, y);
                        doc.line(contentMargin, y + 2, contentMargin + textWidth, y + 2);
                        y += headerHeight;
                        break;
    
                    case "quote":
                        doc.setFontSize(16);
                        doc.setFont("italic");
    
                        const quoteText = he.decode(block.data.text || "No quote provided");
                        let fullText = quoteText;
                        if (block.data.caption) {
                            const decodedCaption = he.decode(block.data.caption);
                            fullText += ` — ${decodedCaption}`;
                        }
    
                        const wrappedQuote = doc.splitTextToSize(fullText, pageWidth - 10);
                        const quoteHeight = wrappedQuote.length * 6 + 4;
    
                        if (y + quoteHeight > pageHeight + margin) {
                            moveToNextPage();
                        }
    
                        doc.text(wrappedQuote, contentMargin, y);
                        y += quoteHeight;
                        doc.setFont("normal");
                        break;
    
                    case "checklist":
                        block.data.items.forEach((item: { checked: any; text: string | string[]; }) => {
                            const checklistHeight = 12;
                            if (y + checklistHeight > pageHeight + margin) {
                                moveToNextPage();
                            }
    
                            const iconPath = item.checked ? "/check-mark.png" : "/close.png";
                            doc.addImage(iconPath, "PNG", contentMargin + 1, y - 2, 5, 5);
                            doc.text(item.text, contentMargin + 12, y + 1);
                            y += checklistHeight;
                        });
                        break;
    
                    case "writeMail":
                        doc.setFontSize(22);
                        const emailScenario = doc.splitTextToSize(block.data.scenario || "No scenario provided", pageWidth - 10);
                        const scenarioHeight = emailScenario.length * 6 + 3;
    
                        if (y + scenarioHeight > pageHeight + margin) {
                            moveToNextPage();
                        }
    
                        doc.text(emailScenario, contentMargin, y);
                        doc.line(contentMargin, y + 2, contentMargin + doc.getTextWidth(emailScenario.join(" ")), y + 2);
                        y += scenarioHeight;
    
                        doc.setFontSize(14);
                        const generatedEmail = doc.splitTextToSize(block.data.email || "No email generated", pageWidth - 10);
                        const emailHeight = generatedEmail.length * 6 + 10;
    
                        if (y + emailHeight > pageHeight + margin) {
                            moveToNextPage();
                        }
    
                        doc.text(generatedEmail, contentMargin, y);
                        y += emailHeight;
                        break;
    
                    case "English":
                        if (!block.data || (!block.data.scenario && !block.data.correctedText)) break;
    
                        doc.setFontSize(16);
                        doc.setFont("helvetica", "bold");
                        const titleHeight = 8;
                        if (y + titleHeight > pageHeight + margin) moveToNextPage();
                        doc.text("English Correction", contentMargin, y);
                        y += titleHeight;
    
                        doc.setFontSize(14);
                        doc.setFont("helvetica", "normal");
    
                        if (block.data.scenario) {
                            const scenarioText = doc.splitTextToSize("Scenario: " + block.data.scenario, pageWidth - 10);
                            const scenarioHeight = scenarioText.length * 6 + 4;
    
                            if (y + scenarioHeight > pageHeight + margin) moveToNextPage();
    
                            doc.text(scenarioText, contentMargin, y);
                            y += scenarioHeight;
                        }
    
                        if (block.data.correctedText) {
                            doc.setTextColor(0, 102, 255);
                            const correctedText = doc.splitTextToSize("Corrected: " + block.data.correctedText, pageWidth - 10);
                            const correctedTextHeight = correctedText.length * 6 + 6;
    
                            if (y + correctedTextHeight > pageHeight + margin) moveToNextPage();
    
                            doc.text(correctedText, contentMargin, y);
                            doc.setTextColor(0, 0, 0);
                            y += correctedTextHeight;
                        }
                        break;
                }
            });
    
            doc.save("editor-content.pdf");
        }).catch((error) => {
            console.error("PDF generation failed:", error);
        });
    };
    

    useEffect(() => {
        if (ref.current && aiAnalysisResult) {
          ref.current
            .save()
            .then((outputData: any) => {
              // Find the index of an existing AI Analysis header block
              const aiIndex = outputData.blocks.findIndex(
                (block: any) => block.type === "header" && block.data.text === "AI Analysis Output:"
              );
      
              // If found, remove this header and all blocks after it
              if (aiIndex !== -1) {
                outputData.blocks.splice(aiIndex);
              }
      
              // Append a new header block (big and bold) at the end
              outputData.blocks.push({
                type: "header",
                data: { text: "AI Analysis Output:", level: 2 },
              });
      
              // Split the AI output by newline characters and append each non-empty line as a paragraph
              aiAnalysisResult
                .split("\n")
                .filter((line) => line.trim())
                .forEach((line) => {
                  outputData.blocks.push({
                    type: "paragraph",
                    data: { text: line },
                  });
                });
      
              // Re-render the editor with the updated document data
              (ref.current as any).render(outputData);
              console.log("Refreshed AI Analysis Output at the bottom of the document.");
            })
            .catch((error: any) => {
              console.error("Error saving editor data:", error);
            });
        }
      }, [aiAnalysisResult]);
    return (
        <div>
            <div id="editorjs" className="ml-20"></div>
            <button
                onClick={saveAsPDF}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Save as PDF
            </button>
        </div>
    );
}

export default Editor;
