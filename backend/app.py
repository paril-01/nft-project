from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")
STABILITY_API_HOST = "https://api.stability.ai"

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "NFT Generator API is running!"})

@app.route("/generate", methods=["POST"])
def generate_nft():
    if not STABILITY_API_KEY:
        return jsonify({"error": "Stability API key not configured"}), 500

    # Validate Content-Type header
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    prompt = data.get("prompt", "").strip()

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
        
    if len(prompt) > 1000:
        return jsonify({"error": "Prompt is too long. Maximum 1000 characters allowed."}), 400

    try:
        response = requests.post(
            f"{STABILITY_API_HOST}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": f"Bearer {STABILITY_API_KEY}"
            },
            json={
                "text_prompts": [{"text": prompt}],
                "cfg_scale": 7,
                "height": 1024,
                "width": 1024,
                "samples": 1,
                "steps": 30,
            },
        )

        if response.status_code != 200:
            return jsonify({"error": f"API request failed: {response.text}"}), response.status_code

        data = response.json()
        
        if "artifacts" in data and len(data["artifacts"]) > 0:
            image_data = data["artifacts"][0]["base64"]
            return jsonify({"image_url": f"data:image/png;base64,{image_data}"})
        
        return jsonify({"error": "No image was generated"}), 500

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Request failed: {str(e)}"}), 500
    except Exception as e:
        print(f"Error generating image: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
