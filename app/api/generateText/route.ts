import { NextResponse } from "next/server";

const getAccessToken = async (): Promise<string | null> => {
    const url = "https://iam.cloud.ibm.com/identity/token";
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };

    const apiKey = process.env.NEXT_PUBLIC_GENERATE_TEXT_API || "";
    if (!apiKey) {
        console.error("❌ Missing API key in environment variables.");
        return null;
    }

    const body = new URLSearchParams({
        grant_type: "urn:ibm:params:oauth:grant-type:apikey",
        apikey: apiKey,
    });

    try {
        console.log("📡 Fetching access token...");

        const response = await fetch(url, { method: "POST", headers, body });

        console.log("🔄 Token Response Status:", response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error("❌ Token Fetch Error:", errorData);
            return null;
        }

        const data = await response.json();
        console.log("✅ Token Retrieved:", data.access_token ? "Success" : "Failed");

        return data.access_token;
    } catch (error) {
        console.error("❌ Error fetching access token:", error);
        return null;
    }
};

export async function POST(req: Request) {
    try {
        console.log("📩 Received API Request...");

        const requestBody = await req.json();
        console.log("📜 Request Body:", requestBody);

        if (!requestBody || typeof requestBody.customTopic !== "string") {
            console.error("❌ Invalid request: Missing 'customTopic'");
            return NextResponse.json({ error: "Invalid request: Missing 'customTopic'" }, { status: 400 });
        }

        console.log("🔑 Requesting Access Token...");
        const accessToken = await getAccessToken();

        if (!accessToken) {
            console.error("❌ Failed to generate access token.");
            return NextResponse.json({ error: "Failed to retrieve access token" }, { status: 500 });
        }

        console.log("📡 Calling IBM Text Generation API...");

        const url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        };

        const baseInput = `Correct the grammar and spelling for a given sentence and generate only \"output\".
        
        Input: she dont likes to eat vegetable becuase its taste bad
        Output: She doesn’t like to eat vegetables because they taste bad.
        
        Input: ${requestBody.customTopic}
        Output:`;

        const body = JSON.stringify({
            input: baseInput,
            parameters: {
                decoding_method: "greedy",
                max_new_tokens: 200,
                min_new_tokens: 0,
                stop_sequences: [],
                repetition_penalty: 1
            },
            model_id: "ibm/granite-13b-instruct-v2",
            project_id: "572cb865-b802-4c80-b5a7-27c89e8b022d",
            moderations: {
                hap: { input: { enabled: true }, output: { enabled: true } },
                pii: { input: { enabled: true }, output: { enabled: true } }
            }
        });

        console.log("📤 Sending request to IBM API...");
        console.log("🔍 Request Body:", body);

        const response = await fetch(url, { headers, method: "POST", body });

        console.log("🔄 IBM API Response Status:", response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error("❌ IBM API Error:", errorData);
            return NextResponse.json({ error: `IBM API Error: ${errorData}` }, { status: response.status });
        }

        const responseData = await response.json();
        const generatedText = responseData.results?.[0]?.generated_text || "No output received";

        console.log("✅ AI Response:", generatedText);

        return NextResponse.json({ output: generatedText }, { status: 200 });
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


