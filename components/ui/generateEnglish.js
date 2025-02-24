const getAccessToken = async () => {
    const url = "https://iam.cloud.ibm.com/identity/token";
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    };
    
    const body = new URLSearchParams({
        grant_type: "urn:ibm:params:oauth:grant-type:apikey",
        apikey: "EVz-U8Dzwkj5nEJYmLduGwKY18gOsKwkM_5nvVlsr-78", // Replace with actual API key
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

export const generateEnglish = async (customTopic) => {
	const accessToken = await getAccessToken(); 
	const url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
	const headers = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": `Bearer ${accessToken}` 
	};
   
    const baseInput = `Correct the grammar and spelling for a given sentence and generate only \"output\".\n\nInput: she dont likes to eat vegetable becuase its taste bad\nOutput: She doesn'\''t like to eat vegetables because they taste bad.\n\nInput: their is many people in the mall today.\nOutput: There are many people in the mall today.\n\nInput: He do his work very goodly and fastly.\nOutput: He does his work very well and quickly.\n\nInput: The informations provided by the teacher was very helpfuls.\nOutput: The information provided by the teacher was very helpful.\n\nInput: I don'\''t know where is my book.\nOutput: I don'\''t know where my book is.\n\nInput: My friend told that he will helps me for the project.\nOutput: My friend told me that he would help me with the project.\n\nInput: the book is on the table can you bring it to me?\nOutput: The book is on the table. Can you bring it to me?\n\nInput: lets go to the market its getting late.\nOutput: Let'\''s go to the market. It'\''s getting late.\n\nInput: i went to new york last summer it was amazing.\nOutput: I went to New York last summer. It was amazing.\n\nInput: she said i will be there at 5 pm.\nOutput: She said, \"I will be there at 5 PM.\"\n\nInput: I am agree with your opinion.\nOutput: I agree with your opinion.\n\nInput: This medicine is very affective for cold.\nOutput: This medicine is very effective for a cold.\n\nInput: The dog was laying on the ground.\nOutput: The dog was lying on the ground.\n\nInput: I did a mistake in my assignment.\nOutput: I made a mistake in my assignment.\n\nInput: If you will study hard, you will pass the exam.\nOutput: If you study hard, you will pass the exam.\n\nInput: John he is going to the market and he will buy some groceries.\nOutput: John is going to the market to buy some groceries.\n\n\n\nInput: The teacher said that everybody should submits their assignments before Monday.\nOutput: The teacher said that everybody should submit their assignments before Monday.\n\nInput: She told that she can’t able to come today because she is having fever.\nOutput: She said that she can'\''t come today because she has a fever.\n`;
	const updatedInput = `${baseInput}\nInput:  ${customTopic}\nOutput:`;
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
		project_id: "572cb865-b802-4c80-b5a7-27c89e8b022d",
		moderations: {
			hap: {
				input: {
					enabled: true,
					threshold: 0.5,
					mask: {
						remove_entity_value: true
					}
				},
				output: {
					enabled: true,
					threshold: 0.5,
					mask: {
						remove_entity_value: true
					}
				}
			},
			pii: {
				input: {
					enabled: true,
					threshold: 0.5,
					mask: {
						remove_entity_value: true
					}
				},
				output: {
					enabled: true,
					threshold: 0.5,
					mask: {
						remove_entity_value: true
					}
				}
			}
		}
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
generateEnglish()
  .then((text) => console.log("========================================================== ",text))
  .catch((error) => console.error());