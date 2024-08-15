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

import { api } from "@/convex/_generated/api";

import { useMutation } from "convex/react";
import { toast } from "sonner";
import { FILE } from "../../dashboard/_components/FileList";
const Header = require("editorjs-header-with-alignment");
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
function Editor({
    onSaveTrigger,
    fileId,
    fileData,
}: {
    onSaveTrigger: any;
    fileId: any;
    fileData: FILE;
}) {
    const ref = useRef<EditorJS>();
    const updateDocument = useMutation(api.files.updateDocument);
    const [document, setDocument] = useState(rawDocument);
    useEffect(() => {
        fileData && initEditor();
    }, [fileData]);

    useEffect(() => {
        console.log("triiger Value:", onSaveTrigger);
        onSaveTrigger && onSaveDocument();
    }, [onSaveTrigger]);

    const initEditor = () => {
        const editor = new EditorJS({
            /**
             * Id of Element that should contain Editor instance
             */

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
            data: fileData?.document
                ? JSON.parse(fileData.document)
                : rawDocument,
        });
        ref.current = editor;
    };

    const onSaveDocument = () => {
        if (ref.current) {
            ref.current
                .save()
                .then((outputData) => {
                    console.log("Article data: ", outputData);
                    updateDocument({
                        _id: fileId,
                        document: JSON.stringify(outputData),
                    }).then(
                        (resp) => {
                            if (resp) {
                                console.log("toast should be there");
                                toast("Document Updated!");
                            }
                        },
                        (e) => {
                            toast("Server Error!");
                        }
                    );
                })
                .catch((error) => {
                    console.log("Saving failed: ", error);
                });
        }
    };
    return (
        <div>
            <div id="editorjs" className="ml-20"></div>
        </div>
    );
}

export default Editor;
