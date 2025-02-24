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
import checkmarkImage from '/check-mark.png';
import html2canvas from "html2canvas";

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

function Editor({ onSaveTrigger, fileId, fileData }: { onSaveTrigger: any; fileId: any; fileData: FILE }) {
    const ref = useRef<EditorJS>();
    const updateDocument = useMutation(api.files.updateDocument);
    const [document, setDocument] = useState(rawDocument);

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
            const borderThickness = 1.2; // Increased border thickness
            const contentMargin = margin + 5; // Ensures content stays inside
            const pageWidth = 210 - 2 * margin; // A4 width minus margins
            const pageHeight = 297 - 2 * margin; // A4 height minus margins
            let y = margin + 10; // Added extra space before content
    
            // Function to draw thick border
            const drawBorder = () => {
                doc.setDrawColor(0); // Black color
                doc.setLineWidth(borderThickness); // Set border thickness
                doc.rect(margin, margin, pageWidth, pageHeight); // Draw border
            };
            function decodeHTML(html: string): string {
                return html.replace(/&nbsp;/g, " ")
                           .replace(/&lt;/g, "<")
                           .replace(/&gt;/g, ">")
                           .replace(/&amp;/g, "&")
                           .replace(/&quot;/g, '"')
                           .replace(/&#39;/g, "'");
            }
    
            drawBorder(); // Draw border on first page
    
            outputData.blocks.forEach((block) => {
                if (["button"].includes(block.type)) return;
    
                doc.setFontSize(14);
    
                // Check for page overflow and create new page if needed
                if (y > pageHeight + margin - 15) {
                    doc.addPage();
                    drawBorder();
                    y = margin + 10; // Reset Y position with extra space
                }
                const decodeHTML = (htmlString: string): string => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlString, "text/html");
                    return doc.body.textContent || "";
                };
                
                switch (block.type) {
                    case "paragraph":
    const paragraphText = he.decode(block.data.text || "No content"); // Decode HTML entities
    const wrappedParagraph = doc.splitTextToSize(paragraphText, pageWidth - 10);

    doc.text(wrappedParagraph, contentMargin, y);
    y += wrappedParagraph.length * 6;
    break;

                        case "header":
                            doc.setFontSize(20);
                            const text = block.data.text || "No title";
                            const textWidth = doc.getTextWidth(text);  // Get the width of the text
                            const textHeight = 10;  // Set a height for the underline (adjust if needed)
                            
                            // Draw the text
                            doc.text(text, contentMargin, y);
                            
                            // Draw a line underneath the text for the underline effect
                            doc.line(contentMargin, y + 2, contentMargin + textWidth, y + 2);  // Adjust 'y + 2' for distance from text
                        
                            y += 10;
                            
                        
                        break;
                        case "quote":
                            doc.setFontSize(16);
                            doc.setFont("italic");
                        
                            // Function to decode HTML entities
                            const decodeHTML = (htmlString: string): string => {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(htmlString, "text/html");
                                return doc.body.textContent || "";
                            };
                        
                            // Decode the quote text
                            const quoteText = decodeHTML(`"${block.data.text}"` || "No quote provided");
                        
                            // If there's an author, append it to the quote
                            let fullText = quoteText;
                            if (block.data.caption) {
                                const decodedCaption = decodeHTML(block.data.caption);
                                fullText += ` — ${decodedCaption}`; // Add author with a dash separator
                            }
                        
                            // Wrap text to fit within page width
                            const wrappedText = doc.splitTextToSize(fullText, pageWidth - 10);
                            doc.text(wrappedText, contentMargin, y);
                            y += wrappedText.length * 6 + 4;
                        
                            doc.setFont("normal"); // Reset font after quote
                            break;
                        

                        
                        
                            case "checklist":
                                y += 6;
                                block.data.items.forEach((item: { text: string; checked: boolean }) => {
                                    if (y > pageHeight + margin - 15) {
                                        doc.addPage();
                                        drawBorder();
                                        y = margin + 6;
                                    }
                            
                                    // Set the font for regular text
                                    doc.setFont("helvetica", "normal");
                            
                                    // Define common properties for images
                                    const iconWidth = 5;  // Slightly larger for better visibility
                                    const iconHeight = 5; // Matching size
                                    const iconX = contentMargin + 1;  // Adjusted position for better alignment
                                    const iconY = y - 2;  // Fine-tuned vertical alignment
                            
                                    const iconPath = item.checked ? "/check-mark.png" : "/close.png";
                            
                                    // Add the appropriate image
                                    doc.addImage(iconPath, "PNG", iconX, iconY, iconWidth, iconHeight);
                            
                                    // Draw the text next to the icon with proper spacing
                                    doc.text(item.text, contentMargin + 12, y + 1); // Slightly lower text for alignment
                            
                                    y += 12; // More spacing for better readability
                                });
                                break;
                            
                            

                            
                            
                            

    
                                case "writeMail":
                                    // Set font size for email scenario
                                    y += 6;
                                    doc.setFontSize(22);
                                    const emailScenario = doc.splitTextToSize(block.data.scenario || "No scenario provided", pageWidth - 10);
                                    
                                    // Get the width of the email scenario text (for underlining)
                                    const scenarioTextWidth = doc.getTextWidth(emailScenario.join(' '));  // Combine lines for full width
                                    
                                    // Write the email scenario text
                                    doc.text(emailScenario, contentMargin, y);
                                    
                                    // Draw the underline for email scenario
                                    doc.line(contentMargin, y + 2, contentMargin + scenarioTextWidth, y + 2);  // Adjust the y + 2 for distance
                                    
                                    y += emailScenario.length * 6 + 3;
                                
                                    // Set font size for generated email
                                    doc.setFontSize(14);
                                    const generatedEmail = doc.splitTextToSize(block.data.email || "No email generated", pageWidth - 10);
                                    doc.text(generatedEmail, contentMargin, y);
                                    
                                    y += generatedEmail.length * 6 + 10;
                                    break;
                                
    
                                    case "English":  // Ensure it matches the exact case
                                   
                                
                                    if (!block.data || (!block.data.scenario && !block.data.correctedText)) {
                                        console.log("❌ No valid English correction data found.");
                                        break;
                                    }
                                
                                    doc.setFontSize(16);
                                    doc.setFont("helvetica", "bold");
                                    doc.text("English Correction", contentMargin, y);
                                    y += 8;
                                
                                    doc.setFontSize(14);
                                    doc.setFont("helvetica", "normal");
                                
                                    if (block.data.scenario) {
                                        console.log("✅ Scenario:", block.data.scenario);
                                        const scenarioText = doc.splitTextToSize("Scenario: " + block.data.scenario, pageWidth - 10);
                                        doc.text(scenarioText, contentMargin, y);
                                        y += scenarioText.length * 6 + 4;
                                    }
                                
                                    if (block.data.correctedText) {
                                        console.log("✅ Corrected Text:", block.data.correctedText);
                                        doc.setFontSize(14);
                                        doc.setTextColor(0, 102, 255); // Blue color for corrected text
                                        const correctedText = doc.splitTextToSize("Corrected: " + block.data.correctedText, pageWidth - 10);
                                        doc.text(correctedText, contentMargin, y);
                                        doc.setTextColor(0, 0, 0); // Reset color
                                        y += correctedText.length * 6 + 6;
                                    }
                                    break;
                                
                                    
                                    
                                    
    
                    
                }
            });
    
            doc.save("editor-content.pdf");
        }).catch((error) => {
            console.error("PDF generation failed:", error);
        });
    };
    
    
    
    
    
    
    
    
    

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
