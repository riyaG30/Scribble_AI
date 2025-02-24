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
        input.style.border = "2px solid black ";
        input.style.borderRadius = "4px"; // Optional: Rounded corners
input.style.padding = "8px"; // Add padding inside the textarea
input.value = this.data.scenario || "";

        input.addEventListener("input", (e) => {
            this.data.scenario = (e.target as HTMLTextAreaElement).value;
        });

        // Generate button
       
        const button = document.createElement("button");
button.innerText = "Generate ";
button.className = "h-8 text-[12px] gap-2 bg-yellow-500 hover:bg-yellow-600 rounded-md font-bold px-4"; // Add horizontal padding (margin)
        button.style.marginTop = "10px";
        button.style.cursor = "pointer";
        button.addEventListener("click", async () => {
            const emailText = await generateText(this.data.scenario);
            this.data.email = emailText;
            if (this.emailOutput) {
                this.emailOutput.value = emailText; // ✅ Set value instead of innerText
            }
        });

        // **Editable email output**
        this.emailOutput = document.createElement("textarea");
        this.emailOutput.style.width = "100%";
        this.emailOutput.style.height = "120px";
        this.emailOutput.style.marginTop = "10px";
        this.emailOutput.style.border = "1px solid black";
        this.emailOutput.style.padding = "10px";
        this.emailOutput.value = this.data.email || "Generated text will appear here...";
        
        // **✅ Save edits to the email output dynamically**
        this.emailOutput.addEventListener("input", (e) => {
            this.data.email = (e.target as HTMLTextAreaElement).value;
        });

        this.wrapper.appendChild(input);
        this.wrapper.appendChild(button);
        this.wrapper.appendChild(this.emailOutput);

        return this.wrapper;
    }

    /** ✅ Ensures that both scenario & modified email are saved */
    save() {
        return {
            scenario: this.data.scenario,
            email: this.data.email, // ✅ Saves user-edited email
        };
    }
}

export default WriteMailTool;
