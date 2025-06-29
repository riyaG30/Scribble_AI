import { NextResponse } from "next/server";

const getAccessToken = async (): Promise<string | null> => {
    const url = "https://iam.cloud.ibm.com/identity/token";
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };

    const apiKey = process.env.NEXT_PUBLIC_GENERATE_TEXT_API || "";
    if (!apiKey) {
        // console.error("❌ Missing API key in environment variables."); 
        return null;
    }

    const body = new URLSearchParams({
        grant_type: "urn:ibm:params:oauth:grant-type:apikey",
        apikey: apiKey,
    });

    try {
        // console.log("📡 Fetching access token...");

        const response = await fetch(url, { method: "POST", headers, body });

        // console.log("🔄 Token Response Status:", response.status);

        if (!response.ok) {
            const errorData = await response.text();
            // console.error("❌ Token Fetch Error:", errorData); 
            return null;
        }

        const data = await response.json();
        // console.log("✅ Token Retrieved:", data.access_token ? "Success" : "Failed"); 

        return data.access_token;
    } catch (error) {
        console.error("❌ Error fetching access token:", error);
        return null;
    }
};

export async function POST(req: Request) {
    try {
        // console.log("📩 Received API Request...");

        const requestBody = await req.json();
        // console.log("📜 Request Body:", requestBody);

        if (!requestBody || typeof requestBody.customTopic !== "string") {
            console.error("❌ Invalid request: Missing 'customTopic'");
            return NextResponse.json({ error: "Invalid request: Missing 'customTopic'" }, { status: 400 });
        }

        // console.log("🔑 Requesting Access Token...");
        const accessToken = await getAccessToken();

        if (!accessToken) {
            console.error("❌ Failed to generate access token.");
            return NextResponse.json({ error: "Failed to retrieve access token" }, { status: 500 });
        }

        // console.log("📡 Calling IBM Text Generation API...");

        const url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        };

        const baseInput = `Summarize this transcript into a structured daily standup report. For each speaker, extract:\n- Time (if available)\n- Yesterday’s work\n- Today’s plan\n- Blockers\n\n\nInput: [09:00 - 09:02] Alice: Morning everyone. Quick update — yesterday I finalized the SSO integration and did a round of testing. Today I’m working on setting up session persistence and I’ll start writing documentation in the second half. No blockers at the moment.\n\n[09:02 - 09:04] Bob: I was deep in the error logging refactor yesterday — it’s halfway done. I’ll continue that today and then sync with QA to validate logs. Blocked on approval from security team to push to staging.\n\n[09:04 - 09:05] Charlie: Not much new — still working on the UI redesign. Yesterday was mostly Figma reviews and today I’ll start coding the new dashboard layout. No blockers.\n\n[09:05 - 09:07] Dana: Wrapped up the deployment pipeline cleanup yesterday. Today is all about writing the rollback scripts. Slight blocker: Jenkins node 4 is down, so I might need help from infra.\n\n[09:07 - 09:09] Emily: I was helping with onboarding yesterday, and also got the service registry changes merged. Planning to start work on health check endpoints today. All good on my side.\n\n[09:09 - 09:11] Faisal: Yesterday I debugged a memory leak in the analytics processor and applied a temporary fix. Need more time today to profile it properly. Also, planning to write a report for SRE. Blocked on access to production metrics dashboard.\n\n[09:11 - 09:13] Grace: I finished writing test cases for the export feature. Today I’ll be pairing with Bob on the logging refactor. Blocker: can’t run  dependency conflict we need to fix.\n\n[09:13 - 09:14] Hari: I’ve been updating the localization strings across the app. Mostly done. Will review translations and flag missing keys today. No blockers.\n\n[09:14 - 09:16] Isha: Finished my OKR write-up yesterday, also closed the feedback loop with HR on the survey results. I’m starting the performance dashboard wireframes today. No blockers.\n\n[09:16 - 09:17] Jay: Took care of a lot of small Jira tickets yesterday, mostly related to accessibility. Today I’ll work on ARIA label support in forms. Nothing blocking me.\n\n[09:17 - 09:18] Kai: Reviewed the Terraform plan updates yesterday. Starting security policy cleanup today. Might need DevSecOps to weigh in on some rules. Will ping them if needed.\n\n[09:18 - 09:20] Lead: Great updates, thanks everyone. Reminder to submit your sprint review notes by EOD. Anyone with lingering blockers, stay back for a 5-min sync.\n\nOutput: Alice  \n\nYesterday: Finalized SSO integration; tested implementation  \nToday: Set up session persistence; begin documentation  \nBlockers: None  \n\nBob  \n\nYesterday: Refactored error logging (in progress)  \nToday: Continue refactor; sync with QA  \nBlockers: Awaiting staging approval from security team  \n\nCharlie  \n\nYesterday: Figma reviews for UI redesign  \nToday: Start coding new dashboard layout  \nBlockers: None  \n\nDana  \n \nYesterday: Cleaned up deployment pipeline  \nToday: Write rollback scripts  \nBlockers: Jenkins node 4 is down  \n\nEmily  \n\nYesterday: Helped onboarding; merged service registry changes  \nToday: Start health check endpoints  \nBlockers: None  \n\nFaisal  \n\nYesterday: Debugged memory leak in analytics processor; applied temporary fix  \nToday: Profile memory usage; write SRE report  \nBlockers: No access to production metrics dashboard  \n\nGrace  \n\nYesterday: Wrote test cases for export feature  \nToday: Pair with Bob on logging refactor  \nBlockers:  failing due to dependency conflict  \n\nHari  \n\nYesterday: Updated localization strings  \nToday: Review translations; flag missing keys  \nBlockers: None  \n\nIsha  \n\nYesterday: Finished OKR write-up; closed HR feedback loop  \nToday: Begin performance dashboard wireframes  \nBlockers: None  \n\nJay  \n\nYesterday: Closed accessibility-related Jira tickets  \nToday: Add ARIA label support in forms  \nBlockers: None  \n\nKai  \n\nYesterday: Reviewed Terraform plan updates  \nToday: Clean up security policies  \nBlockers: Awaiting DevSecOps input  \n\nLead  \n\nNote: Reminded team to submit sprint review notes; offered to resolve blockers in follow-up sync\n\n\nInput: [10:00 - 10:02] Priya: Morning folks. Yesterday I refactored the Kafka consumer logic and added retries for failed events. Also reviewed the open PRs for the ETL pipeline. Today, I’ll work on deploying the retry logic and update the confluence doc. No blockers right now.\n\n[10:02 - 10:04] Amit: Wrapped up Terraform scripts for the GCP IAM roles yesterday. Today I’ll move to automating secret rotations via Vault. Slight blocker: need elevated permissions in the GCP console.\n\n[10:04 - 10:06] Rina: I completed the data validation framework and demoed it to the data science team yesterday. Today I’ll write tests and prep the data catalog. All good.\n\n[10:06 - 10:08] Sanjay: Closed 3 bugs in the GraphQL layer. Also started exploring rate limiting middleware. Today I’ll prototype that out. No blockers, but might need a review by EOD.\n\n[10:08 - 10:10] Nisha: I finalized sprint planning with QA and assigned tickets in JIRA. Worked on updating the roadmap doc. Today I’m focusing on stakeholder syncs. No blockers.\n\n[10:10 - 10:12] Vikram: Fixed race conditions in the Redis cache handler. Pushed a hotfix late last night. Today I’ll investigate the dropped session bug we saw on staging. Blocked by lack of access logs — requested from ops.\n\n[10:12 - 10:14] Lina: Finished writing unit tests for the feature flag service. Merging today and starting on incident documentation backlog. No blockers from my end.\n\n[10:14 - 10:16] Zoya: I worked on cleaning up the Jenkinsfile and added stage-level parallelism. Today I’ll test with large builds. Blocked by low disk space on Jenkins node 3.\n\n[10:16 - 10:17] Arun (PM): Quick reminder — please update the OKR status in the shared sheet by noon. Also, fill out your risk items in the new format. Ping me if you have issues.\n\nOutput: Priya  \n\nYesterday: Refactored Kafka consumer logic; added retries; reviewed ETL PRs  \nToday: Deploy retry logic; update Confluence documentation  \nBlockers: None  \n\nAmit  \n\nYesterday: Completed Terraform scripts for GCP IAM roles  \nToday: Automate secret rotation via Vault  \nBlockers: Needs elevated GCP permissions  \n\nRina  \nYesterday: Completed data validation framework; demoed to DS team  \nToday: Write tests; prepare data catalog  \nBlockers: None  \n\nSanjay  \n\nYesterday: Fixed bugs in GraphQL; explored rate limiting  \nToday: Prototype rate limiter  \nBlockers: None  \n\nNisha  \n\nYesterday: Finalized sprint planning; updated roadmap doc  \nToday: Focus on stakeholder syncs  \nBlockers: None  \n\nVikram  \n\nYesterday: Fixed race condition in Redis cache; pushed hotfix  \nToday: Investigate dropped session bug  \nBlockers: No access to logs from ops  \n\nLina  \nYesterday: Completed unit tests for feature flag service  \nToday: Merge tests; work on incident documentation  \nBlockers: None  \n\nZoya  \n\nYesterday: Cleaned up Jenkinsfile; added stage-level parallelism  \nToday: Test with large builds  \nBlockers: Low disk space on Jenkins node 3  \n\nArun (PM)  \n\nNote: Reminded team to update OKRs and submit risk items\n\n\nInput: [11:00 - 11:02] Tanvi: Morning! Yesterday I finished porting the component library to our new design system. Fixed the tab alignment issue on the mobile layout. Today I’ll test across iOS devices and start accessibility QA. No blockers.\n\n[11:02 - 11:04] Leo: I added support for swipe gestures in the mobile app. Faced some animation jank but resolved it. Today I’ll polish the onboarding screens and run snapshot tests. Blocked by flaky test suites on Android CI.\n\n[11:04 - 11:06] Mehul: Worked on integrating Firebase push notifications yesterday. Mostly successful, but still seeing occasional duplicates. Will investigate today and sync with backend. No major blockers.\n\n[11:06 - 11:08] Kavya: Helped review PRs for the UI overhaul, and started refactoring the settings screen. Will finish that and test dark mode support today. No blockers right now.\n\n[11:08 - 11:10] Tara: Wrapped up localization for Spanish and German yesterday. Today I’ll start on RTL language support. Blocker: still waiting for Arabic strings from the translation team.\n\n[11:10 - 11:12] Neil: I updated the webpack config to reduce bundle size and added lazy loading for charts. Today I’ll do performance profiling. Blockers: None, but watching for regressions.\n\n[11:12 - 11:13] Rajesh (Lead): Thanks all. Reminder — we have a UI/UX design review at 3PM. Be there on time.\n\nOutput: Tanvi  \n\nYesterday: Ported component library to new design system; fixed mobile layout tabs  \nToday: iOS testing; start accessibility QA  \nBlockers: None  \n\nLeo  \n\nYesterday: Added swipe gesture support; fixed animation issues  \nToday: Polish onboarding; run snapshot tests  \nBlockers: Flaky Android CI tests  \n\nMehul  \n\nYesterday: Integrated Firebase push notifications  \nToday: Investigate duplicate notifications; sync with backend  \nBlockers: None  \n\nKavya  \n\nYesterday: Reviewed PRs; started settings screen refactor  \nToday: Complete refactor; test dark mode  \nBlockers: None  \n\nTara  \n\nYesterday: Finalized Spanish & German localization  \nToday: Begin RTL language support  \nBlockers: Waiting on Arabic translations  \n\nNeil  \n\nYesterday: Reduced bundle size; added lazy loading  \nToday: Performance profiling  \nBlockers: None  \n\nRajesh (Lead)  \n \nNote: Reminder for 3PM UI/UX design review\n\n
        
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
            model_id: "ibm/granite-3-8b-instruct",
            project_id: "572cb865-b802-4c80-b5a7-27c89e8b022d",
            moderations: {
    hap: {
        input: {
            enabled: true,
            threshold: 0.5,
            mask: { remove_entity_value: true }
        },
        output: {
            enabled: true,
            threshold: 0.5,
            mask: { remove_entity_value: true }
        }
    },
    pii: {
        input: {
            enabled: true,
            threshold: 0.5,
            mask: { remove_entity_value: true }
        },
        output: {
            enabled: true,
            threshold: 0.5,
            mask: { remove_entity_value: true }
        }
    },
    granite_guardian: {
        input: {
            enabled: false,
            threshold: 1
        }
    }
}

        });

        // console.log("📤 Sending request to IBM API...");
        // console.log("🔍 Request Body:", body);

        const response = await fetch(url, { headers, method: "POST", body });

        // console.log("🔄 IBM API Response Status:", response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error("❌ IBM API Error:", errorData);
            return NextResponse.json({ error: `IBM API Error: ${errorData}` }, { status: response.status });
        }

        const responseData = await response.json();
        const generatedText = responseData.results?.[0]?.generated_text || "No output received";

        // console.log("✅ AI Response:", generatedText);

        return NextResponse.json({ output: generatedText }, { status: 200 });
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


