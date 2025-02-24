

const getAccessToken = async () => {
    const url = "https://iam.cloud.ibm.com/identity/token";
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    };
    
    const body = new URLSearchParams({
        grant_type: "urn:ibm:params:oauth:grant-type:apikey",
        apikey: "1tCTLW0VivxpdKUzb03KdCGc5P9f5NN5PoEk5CywVfaf", // Replace with actual API key
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body,
        });

        if (!response.ok) {
            throw new Error(`Error fetching token: ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token; // Extract and return the access token
    } catch (error) {
        console.error("Error fetching access token:", error);
        return null;
    }
};

export const generateText = async (customTopic) => {
	const accessToken = await getAccessToken(); 
	const url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
	const headers = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": `Bearer ${accessToken}` 
	};
	
	const baseInput = `Input: write a mail  on topic - I have decided to resign from my position as a Software Engineer at XYZ Corp. I want to inform my manager professionally and express gratitude for the experience.\"\nOutput: Subject: Resignation Notice – [Your Name]\nTo: [Manager'\''s Email]\n\nDear [Manager’s Name],\n\nI hope this email finds you well. I would like to formally resign from my position as a Software Engineer at XYZ Corp, with my last working day being [Last Working Day, typically 2 weeks from today].\n\nWorking at XYZ Corp has been a valuable experience, and I sincerely appreciate the opportunities and support I have received during my time here. I am grateful for the guidance and the professional growth I have achieved under your leadership.\n\nI will ensure a smooth transition and will be happy to assist in handing over my responsibilities. Please let me know how I can help during this period.\n\nThank you once again for everything. I look forward to staying in touch.\n\nBest Regards,\n[Your Name]\n\nInput:  write a mail on topic -  need to request leave for 5 days due to a family emergency. The email should be formal and sent to my manager.\"\n\n\nOutput: Subject: Leave Request for [Dates]\nTo: [Manager'\''s Email]\n\nDear [Manager’s Name],\n\nI hope you are doing well. I would like to request leave from [Start Date] to [End Date] due to a family emergency. I will ensure that all my current tasks are either completed beforehand or delegated appropriately.\n\nPlease let me know if you need any further information. I appreciate your understanding and approval of my request.\n\nBest Regards,\n[Your Name]\n\nInput:  write a mail on topic  -  I had an interview for a Software Engineer position at Google. I want to thank the interviewer and express my enthusiasm for the role.\"\n\nOutput: Dear [Interviewer’s Name],\n\nI hope you are doing well. I wanted to take a moment to sincerely thank you for the opportunity to interview for the Software Engineer position at Google. I truly enjoyed our conversation and learning more about the team and projects.\n\nI am very excited about the opportunity to contribute to [mention a specific topic discussed in the interview] and believe my skills align well with the role. Please feel free to reach out if you need any further information from my end.\n\nLooking forward to the next steps. Thanks again for your time and consideration.\n\nBest Regards,\n[Your Name]\n\nInput: I recently attended a cybersecurity conference and met a senior professional from IBM Security. I want to follow up with them via email, thank them for their insights, and express my interest in learning more about security orchestration.\nOutput: Subject: Great Connecting at [Conference Name]\n\nDear [Professional’s Name],\n\nI hope you'\''re doing well! It was a pleasure meeting you at [Cybersecurity Conference Name] and learning from your insights on security orchestration.\n\nI truly appreciated our discussion on [specific topic], and I’m eager to deepen my understanding in this area. If you’re open to it, I’d love to continue our conversation and explore potential learning opportunities.\n\nLooking forward to staying in touch! Thanks again for your time.\n\nBest Regards,\n[Your Name]\n\nInput: I want to connect with a cybersecurity expert from IBM on LinkedIn, thank them for their talk at a conference, and express interest in learning more about security automation.\"\nOutput: Hi [Name],\n\nIt was great attending your session at [Conference Name]—I really enjoyed your insights on security automation.\n\nI’m passionate about this field and would love to connect to learn more from your experience. Looking forward to staying in touch!\n\nBest,\n[Your Name]\n\nInput: I need to inform my manager that I will be working remotely tomorrow due to a personal commitment. It should be a formal email.\"\nOutput: Subject: Remote Work Notification for [Date]\n\nDear [Manager’s Name],\n\nI hope you are doing well. I wanted to inform you that due to a personal commitment, I will be working remotely tomorrow, [Date]. I will remain available via email and Slack and will ensure all my tasks are completed as per schedule.\n\nPlease let me know if you need any further information.\n\nBest regards,\n[Your Name]\n\nInput: I want to tell my friend casually that I’ll be working from home tomorrow.\nOutput: Hey [Friend’s Name],\n\nJust a heads-up—I’ll be working from home tomorrow. Let’s catch up later if you’re free!\n\nInput: I want to send a LinkedIn message to a hiring manager at Google, expressing my interest in a software engineering role.\nOutput: Hi [Hiring Manager’s Name],\n\nI hope you'\''re doing well. I came across the [Software Engineer] opening at Google and am really excited about the opportunity. With my experience in [mention key skills], I believe I could contribute effectively to your team.\n\nI’d love to connect and learn more about the role. Looking forward to your thoughts!\n\nBest,\n[Your Name]\n\nInput: I missed an important client meeting due to an emergency and want to apologize.\nOutput: Subject: Apology for Missing Our Meeting\n\nDear [Client’s Name],\n\nI sincerely apologize for missing our scheduled meeting today. Unfortunately, I had an unexpected emergency that required my immediate attention.\n\nI value our discussions and would love to reschedule at your earliest convenience. Please let me know a time that works for you. I appreciate your understanding and look forward to our conversation.\n\nBest Regards,\n[Your Name]\n\n\n\nInput: Notify my team that the deadline for the project has been moved to next Monday.\nOutput: Hey team,\nJust a quick update—the deadline for the project has been extended to next Monday. Let me know if you have any questions or need any clarifications.\n\nInput: Write a short description of Quantum Computing.\nOutput: Quantum computing is a cutting-edge field that leverages the principles of quantum mechanics to process information in ways that classical computers cannot. Unlike traditional computers that use bits (0s and 1s), quantum computers use qubits, which can exist in multiple states simultaneously. This allows quantum computers to solve complex problems exponentially faster than conventional systems, making them ideal for fields like cryptography, material science, and AI.\n\nInput: Explain blockchain in simple terms.\nOutput: A blockchain is a decentralized digital ledger that records transactions securely and transparently. Think of it as a chain of blocks, where each block contains transaction data. Once a block is added, it cannot be changed, ensuring security and trust. This technology is widely used in cryptocurrencies like Bitcoin but also has applications in supply chain management, healthcare, and finance.\n\nInput: Explain startup funding in simple terms\nOutput: Startup funding is the process of raising capital to launch and grow a new business. It typically comes from sources such as bootstrapping (personal savings), angel investors, venture capitalists, or crowdfunding. Startups go through different funding stages—seed, Series A, B, and beyond—each helping them scale operations, develop products, and reach more customers.\n\nInput: Give a brief description of the stock market.\nOutput: The stock market is a marketplace where investors buy and sell shares of publicly traded companies. It operates through stock exchanges like the New York Stock Exchange (NYSE) and NASDAQ. The stock market plays a crucial role in the economy, allowing businesses to raise capital and investors to grow their wealth.\n\nInput: Explain the benefits of meditation.\nOutput: Meditation is a practice that helps calm the mind and improve focus. It reduces stress, enhances emotional well-being, and promotes better sleep. Regular meditation has also been linked to improved concentration, increased self-awareness, and better overall mental health.\n\nInput: Describe a cat.\nOutput: A cat is a small, domesticated carnivorous mammal known for its agility, sharp claws, and playful nature. Cats have excellent night vision, allowing them to see in low-light conditions. They communicate through purring, meowing, and body language. As pets, they are independent yet affectionate, often forming strong bonds with their owners.\n\n\n\nInput: Describe a rose flower.\nOutput: A rose is a fragrant and beautiful flower known for its soft petals and thorny stems. Roses come in various colors, each symbolizing different emotions—red for love, yellow for friendship, and white for purity. They are widely used in gardens, perfumes, and as gifts for special occasions.\n\n\n\nInput: Describe the difference between SQL and NoSQL databases.\nOutput: SQL databases are relational, using structured tables and ACID transactions for consistency, while NoSQL databases offer flexibility with document, key-value, and graph storage. SQL is used for structured data (e.g., PostgreSQL), whereas NoSQL is preferred for scalability (e.g., MongoDB).\n


`;
const updatedInput = `${baseInput}\nInput: topic ${customTopic}\nOutput:`;
	const body = {
		input: updatedInput,
		parameters: {
			decoding_method: "greedy",
			max_new_tokens: 200,
			min_new_tokens: 0,
			stop_sequences: [],
			repetition_penalty: 1
		},
		model_id: "ibm/granite-13b-instruct-v2",
		project_id: "572cb865-b802-4c80-b5a7-27c89e8b022d"
	};

	const response = await fetch(url, {
		headers,
		method: "POST",
		body: JSON.stringify(body)
	});
	console.log("Response Status:", response.status);
const responseText = await response.text();
console.log(JSON.parse(responseText).results[0].generated_text);



if (!response.ok) {
    throw new Error(`Error: ${responseBody.errors?.[0]?.message || "Unknown error"}`);
}
	return JSON.parse(responseText).results[0].generated_text;
}

generateText()
  .then((text) => console.log("========================================================== ",text))
  .catch((error) => console.error());


  