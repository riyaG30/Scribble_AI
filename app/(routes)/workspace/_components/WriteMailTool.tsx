import { generateText } from "../../../.././components/ui/generateText";

class WriteMailTool {
    wrapper: HTMLElement;
    emailOutput: HTMLTextAreaElement | null;
    api: any;
    data: { scenario: string; email: string };

    static get toolbox() {
        return {
            title: "Text Generation",
            icon: "✉️",
        };
    }

    constructor({ data, api }: { data: { scenario: string; email: string }; api: any }) {
        this.api = api;
        this.data = data || { scenario: "", email: "" };
        this.wrapper = document.createElement("div");
        this.emailOutput = null;
    }

    render() {
        this.wrapper.innerHTML = ""; // Clear previous content

        // Scenario input
        const input = document.createElement("textarea");
        input.placeholder = "Enter text scenario...";
        input.style.width = "100%";
        input.style.height = "50px";
        input.style.border = "2px solid black";
        input.style.borderRadius = "4px"; 
        input.style.padding = "8px"; 
        input.value = this.data.scenario || "";

        input.addEventListener("input", (e) => {
            this.data.scenario = (e.target as HTMLTextAreaElement).value;
        });

        // Generate button
        const button = document.createElement("button");
        button.innerText = "Generate";
        button.className = "h-8 text-[12px] gap-2 bg-yellow-500 hover:bg-yellow-600 rounded-md font-bold px-4";
        button.style.marginTop = "10px";
        button.style.cursor = "pointer";
        button.addEventListener("click", async () => {
            const emailText = await generateText(this.data.scenario);
            this.data.email = emailText;
            if (this.emailOutput) {
                this.emailOutput.value = emailText; 
                this.adjustHeight(); // Auto-resize on text change
            }
        });

        // Editable email output
        this.emailOutput = document.createElement("textarea");
        this.emailOutput.style.width = "100%";
        this.emailOutput.style.marginTop = "10px";
        this.emailOutput.style.padding = "10px";
        this.emailOutput.style.resize = "none"; // Prevent manual resizing
        this.emailOutput.style.overflow = "hidden"; // Hide scrollbars
        this.emailOutput.style.border = "1px solid black"; // Remove border
        this.emailOutput.style.outline = "none"; // Remove focus outline
        this.emailOutput.style.background = "transparent"; // Blend with background
        this.emailOutput.style.fontSize = "14px";
        this.emailOutput.rows = 1;

        this.emailOutput.value = this.data.email || "Generated text will appear here...";

        // Auto-resize function
        this.adjustHeight = () => {
            this.emailOutput!.style.height = "auto"; // Reset height
            this.emailOutput!.style.height = `${this.emailOutput!.scrollHeight}px`; // Set height to fit content
        };

        // Adjust height on input
        this.emailOutput.addEventListener("input", (e) => {
            this.data.email = (e.target as HTMLTextAreaElement).value;
            this.adjustHeight();
        });

        // Initial height adjustment if email data exists
        setTimeout(() => this.adjustHeight(), 0);

        this.wrapper.appendChild(input);
        this.wrapper.appendChild(button);
        this.wrapper.appendChild(this.emailOutput);

        return this.wrapper;
    }

    /** Ensures that both scenario & modified email are saved */
    save() {
        return {
            scenario: this.data.scenario,
            email: this.data.email,
        };
    }

    /** Function to adjust height dynamically */
    private adjustHeight = () => {
        if (this.emailOutput) {
            this.emailOutput.style.height = "auto";
            this.emailOutput.style.height = `${this.emailOutput.scrollHeight}px`;
        }
    };
}

export default WriteMailTool;
