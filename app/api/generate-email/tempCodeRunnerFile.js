export const generateText = async () => {
	const url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
	const headers = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": "Bearer eyJraWQiOiIyMDI1MDEzMDA4NDQiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJJQk1pZC02OTIwMDBPWUI1IiwiaWQiOiJJQk1pZC02OTIwMDBPWUI1IiwicmVhbG1pZCI6IklCTWlkIiwianRpIjoiOTdiYTJiYTItZDE3MS00YWMxLTk0ODYtYWYyYjA5YjhlZjRhIiwiaWRlbnRpZmllciI6IjY5MjAwME9ZQjUiLCJnaXZlbl9uYW1lIjoiUml5YSIsImZhbWlseV9uYW1lIjoiR3VwdGEiLCJuYW1lIjoiUml5YSBHdXB0YSIsImVtYWlsIjoiUml5YS5HdXB0YTMwMTBAaWJtLmNvbSIsInN1YiI6IlJpeWEuR3VwdGEzMDEwQGlibS5jb20iLCJhdXRobiI6eyJzdWIiOiJSaXlhLkd1cHRhMzAxMEBpYm0uY29tIiwiaWFtX2lkIjoiSUJNaWQtNjkyMDAwT1lCNSIsIm5hbWUiOiJSaXlhIEd1cHRhIiwiZ2l2ZW5fbmFtZSI6IlJpeWEiLCJmYW1pbHlfbmFtZSI6Ikd1cHRhIiwiZW1haWwiOiJSaXlhLkd1cHRhMzAxMEBpYm0uY29tIn0sImFjY291bnQiOnsidmFsaWQiOnRydWUsImJzcyI6ImRiZjQ3NjhiN2M3NGU0M2Q2NDE2NWUyZDczMTA4Yjg4IiwiaW1zX3VzZXJfaWQiOiIxMzI4NDE3MiIsImZyb3plbiI6dHJ1ZSwiaW1zIjoiMTY0MDM0NSJ9LCJpYXQiOjE3NDAxMTkzNzgsImV4cCI6MTc0MDEyMjk3OCwiaXNzIjoiaHR0cHM6Ly9pYW0uY2xvdWQuaWJtLmNvbS9pZGVudGl0eSIsImdyYW50X3R5cGUiOiJ1cm46aWJtOnBhcmFtczpvYXV0aDpncmFudC10eXBlOmFwaWtleSIsInNjb3BlIjoiaWJtIG9wZW5pZCIsImNsaWVudF9pZCI6ImRlZmF1bHQiLCJhY3IiOjEsImFtciI6WyJwd2QiXX0.BKI80pe5ldcEXk0GwxZtJ0t-2toQGV7RcQfpAJ3BZ7dO9GkcK5m6x-_r18MmBii-7cJ4XISNCGk1Nx50oJD73xSrH03A1p3cb0BKRmxl59BYPOHxLD8AsWbfgzrFbEWB4Vo0ezrcFXzl00mcbhP3iX86VjCguN_hYF3n2VD0nEW3bKG2i1eoxXlDoR8zlr_a0hqsmJXSWNGGPSKfOQXJ4iVhANSQywTqo71e2kBsnXlzBzFhrkRgaafdVTMeStLJvZQQRVKObJfQb4-9zle0hv7b2qom9TatluegyzIevLKXYktrshfn3quV5REwGxXmwNQGZEr2y3MoHVnqvPu-Rw"
	};
	const body = {
		input: "Profesional Mail and Message Generator\n\nInput: topic write a mail  on topic - I have decided to resign from my position as a Software Engineer at XYZ Corp. I want to inform my manager professionally and express gratitude for the experience.\"\nOutput: Subject: Resignation Notice – [Your Name]\nTo: [Manager'\''s Email]\n\nDear [Manager’s Name],\n\nI hope this email finds you well. I would like to formally resign from my position as a Software Engineer at XYZ Corp, with my last working day being [Last Working Day, typically 2 weeks from today].\n\nWorking at XYZ Corp has been a valuable experience, and I sincerely appreciate the opportunities and support I have received during my time here. I am grateful for the guidance and the professional growth I have achieved under your leadership.\n\nI will ensure a smooth transition and will be happy to assist in handing over my responsibilities. Please let me know how I can help during this period.\n\nThank you once again for everything. I look forward to staying in touch.\n\nBest Regards,\n[Your Name]\n\nInput: topic  write a mail on topic -  need to request leave for 5 days due to a family emergency. The email should be formal and sent to my manager.\"\nOutput: Subject: Leave Request for [Dates]\nTo: [Manager'\''s Email]\n\nDear [Manager’s Name],\n\nI hope you are doing well. I would like to request leave from [Start Date] to [End Date] due to a family emergency. I will ensure that all my current tasks are either completed beforehand or delegated appropriately.\n\nPlease let me know if you need any further information. I appreciate your understanding and approval of my request.\n\nBest Regards,\n[Your Name]\n\nInput: topic  write a mail on topic  - Our team missed a project deadline for a client due to unforeseen technical issues. The email should apologize and assure them of a new delivery timeline\nOutput: Subject: Apology for Project Delay & Revised Timeline\n\nDear [Client’s Name],\n\nI hope you are doing well. I sincerely apologize for the delay in delivering [Project Name]. Due to unforeseen technical challenges, we were unable to meet the initial deadline.\n\nWe understand the importance of this project and are working diligently to ensure that it is completed to the highest standards. The revised delivery date is [New Deadline]. We appreciate your patience and assure you that we are committed to meeting this new timeline.\n\nPlease feel free to reach out if you have any concerns. Thank you for your understanding.\n\nBest Regards,\n[Your Name]\n[Your Company]\n\nInput: topic   write a mail on topic -  received a job offer from ABC Ltd. and want to accept it professionally.\nOutput: Subject: Acceptance of Job Offer – [Your Name]\n\nDear [HR Manager'\''s Name],\n\nI hope you are doing well. I am pleased to formally accept the offer for the position of [Job Title] at ABC Ltd. I sincerely appreciate the opportunity and look forward to joining the team on [Start Date].\n\nPlease let me know if there are any additional documents or formalities I need to complete before my start date.\n\nThank you once again for this opportunity. I am excited to contribute to the company’s success.\n\nBest Regards,\n[Your Name]\n\nInput: topic  write a mail on topic  -  I had an interview for a Software Engineer position at Google. I want to thank the interviewer and express my enthusiasm for the role.\"\n\n\nOutput: Dear [Interviewer’s Name],\n\nI hope you are doing well. I wanted to take a moment to sincerely thank you for the opportunity to interview for the Software Engineer position at Google. I truly enjoyed our conversation and learning more about the team and projects.\n\nI am very excited about the opportunity to contribute to [mention a specific topic discussed in the interview] and believe my skills align well with the role. Please feel free to reach out if you need any further information from my end.\n\nLooking forward to the next steps. Thanks again for your time and consideration.\n\nBest Regards,\n[Your Name]\n\nInput: topic  write a mail on topic  - Our team missed a project deadline for a client due to unforeseen technical issues. The email should apologize and assure them of a new delivery timeline  Our team missed a project deadline for a client due to unforeseen technical issues. The email should apologize and assure them of a new delivery timeline\nOutput:",
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

	if (!response.ok) {
		throw new Error("Non-200 response");
	}
    print("respnse getting printed",response.json);
	return await response.json();
}

