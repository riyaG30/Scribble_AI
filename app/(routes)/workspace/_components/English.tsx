import { generateEnglish } from "../../../../components/ui/generateEnglish";

class English {
    wrapper: HTMLElement;
    contentContainer: HTMLDivElement;
    api: any;
    data: { scenario: string; correctedText: string };

    static get toolbox() {
        return {
            title: "Correct English",
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 5C2 3.9 2.9 3 4 3H10C11.11 3 12 3.9 12 5V19C12 20.11 11.11 21 10 21H4C2.9 21 2 20.11 2 19V5ZM14 5C14 3.9 14.9 3 16 3H22C23.11 3 24 3.9 24 5V19C24 20.11 23.11 21 22 21H16C14.9 21 14 20.11 14 19V5ZM16 6V18H22V6H16ZM4 6V18H10V6H4Z" fill="black"/>
            </svg>`
        };
    }

    constructor({ data, api }: { data: { scenario: string; correctedText: string }; api: any }) {
        this.api = api;
        this.data = data || { scenario: "", correctedText: "" };
        this.wrapper = document.createElement("div");
        this.contentContainer = document.createElement("div");
    }

    render() {
        this.wrapper.innerHTML = ""; // Clear previous content

        // Scenario input
        const inputWrapper = document.createElement("div");
        inputWrapper.style.display = "flex"; // Use flexbox to align items horizontally
        inputWrapper.style.alignItems = "center"; // Center align the input and button vertically

        const input = document.createElement("textarea");
        input.placeholder = "Write a Sentence...";
        input.style.width = "100%";
        input.style.height = "50px";
        input.value = this.data.scenario || "";
        input.addEventListener("input", (e) => {
            this.data.scenario = (e.target as HTMLTextAreaElement).value;
        });

        // Generate button with IoReload SVG
        const button = document.createElement("button");
        button.style.marginLeft = "10px"; // Add some space between the input and button
        button.style.cursor = "pointer";
        button.style.border = "none";
        button.style.background = "none";
        button.style.display = "flex"; // Align button content (SVG) horizontally

        // Inject IoReload SVG directly (from react-icons)
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M12 4V1L8 5l4 4V6a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/>
            </svg>
        `;

        button.addEventListener("click", async () => {
            const correctedText = await generateEnglish(this.data.scenario);
            this.data.correctedText = correctedText; // ✅ Save correction

            // Update the textarea with the corrected text
            input.value = correctedText; // Replace content in the input area with the corrected text
        });

        // Append input and button to the wrapper with flexbox
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(button);

        // Add the input-wrapper to content container
        this.contentContainer.appendChild(inputWrapper);
        this.wrapper.appendChild(this.contentContainer);

        return this.wrapper;
    }

    // ✅ Ensure the tool saves its data in Editor.js
    save() {
        console.log("📤 Saving data:", this.data);
        return {
            scenario: this.data.scenario.trim() || "",
            correctedText: this.data.correctedText.trim() || "",
        };
    }
    
}

export default English;
