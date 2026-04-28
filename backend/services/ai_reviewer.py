import asyncio
import json

async def analyze_code(code: str, language: str, api_key: str = None) -> dict:
    """
    Mock AI Code Reviewer.
    Returns a structured dictionary formatted closely to what Claude would return based on the required prompt.
    Includes bugs, optimizations, standards_violations, positives, score, and summary.
    """
    # Simulate processing delay
    await asyncio.sleep(2)
    
    # Simple hardcoded heuristic for mock responses
    bugs = []
    optimizations = []
    positives = ["Code is generally well-structured", "Variable naming is mostly readable"]
    score = 85
    
    if "console.log" in code or "print(" in code:
        optimizations.append({
            "description": "Consider using a proper logging framework instead of raw print/console statements.",
            "suggested_code": "// Replace with logger.info() or winston"
        })
        score -= 5

    if "eval(" in code:
        bugs.append({
            "line": 1,
            "severity": "Critical",
            "description": "Use of eval() is a severe security vulnerability.",
            "fix": "Avoid evaluating arbitrary strings."
        })
        score -= 20

    if not bugs:
        bugs.append({
            "line": 10,
            "severity": "Warning",
            "description": "Potential unhandled null reference.",
            "fix": "Add null checking or use optional chaining."
        })
        
    return {
        "bugs": bugs,
        "optimizations": optimizations,
        "standards_violations": [
            {
                "line": 5,
                "rule": "Indentation",
                "description": "Inconsistent indentation spacing."
            }
        ],
        "positives": positives,
        "score": max(0, score),
        "summary": "The code demonstrates good foundational logic but requires some attention to error handling and performance optimizations. Implementing the suggested changes will greatly enhance stability."
    }
