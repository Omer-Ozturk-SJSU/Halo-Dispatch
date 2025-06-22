# OpenAI calls + prompt formatting

import os
import openai
from typing import Dict, List, Optional, Union

# Configure OpenAI API key
openai.api_key = os.environ.get("OPENAI_API_KEY")

class AIPromptService:
    def __init__(self):
        self.model = "gpt-4o"  # Default model, can be configured
    
    async def get_urgency_score(self, transcript: str) -> int:
        """
        Rate the urgency of a 911 transcript from 1-10
        """
        prompt = f"""Rate the urgency of this 911 transcript from 1 (not urgent) to 10 (life-threatening). Return only the number.

Transcript:
"{transcript}"
"""
        try:
            response = await openai.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,  # Low temperature for consistent scoring
                max_tokens=10,    # We only need a number
            )
            
            # Extract the score from the response
            score_text = response.choices[0].message.content.strip()
            # Try to convert to integer
            try:
                score = int(score_text)
                # Ensure score is within range
                return max(1, min(10, score))
            except ValueError:
                # If we can't parse the score, default to 5
                print(f"Warning: Could not parse urgency score: {score_text}")
                return 5
                
        except Exception as e:
            print(f"Error getting urgency score: {str(e)}")
            return 5  # Default score on error
    
    async def get_key_concerns(self, transcript: str) -> List[str]:
        """
        Extract key safety concerns from a 911 transcript
        """
        valid_concerns = [
            "Domestic Violence",
            "Bleeding",
            "Head Injury",
            "Perpetrator Present",
            "Mental Health Crisis",
            "Unknown Location"
        ]
        
        concerns_list = ", ".join(valid_concerns)
        
        prompt = f"""Extract any relevant safety concerns from the transcript. Only choose from this list:
{concerns_list}

Return only the concerns as a comma-separated list with no additional text.

Transcript:
"{transcript}"
"""
        try:
            response = await openai.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=100,
            )
            
            # Extract concerns from the response
            concerns_text = response.choices[0].message.content.strip()
            
            # Parse the concerns
            concerns = [
                concern.strip() 
                for concern in concerns_text.split(",") 
                if concern.strip() in valid_concerns
            ]
            
            return concerns
                
        except Exception as e:
            print(f"Error getting key concerns: {str(e)}")
            return []  # Empty list on error

# Create a singleton instance
ai_service = AIPromptService()
