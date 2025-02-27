export const generateText = async (customTopic) => {
    try {
        console.log("Sending request with:", { customTopic }); // Debugging log

        const response = await fetch("/api/texting", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ customTopic: String(customTopic) }), // Make sure it's a string
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error: ${response.status} - ${errorResponse.error}`);
        }

        const data = await response.json();
        console.log("Generated Text:", data.output);
        return data.output;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

// Example Usage
generateText("describe a car")
    .then((text) => console.log("Description:", text))
    .catch((error) => console.error("Error:", error));