import sys
import spacy
import json

nlp = spacy.load("en_core_web_sm")

IMPORTANT_WORDS = {"i", "we", "me", "you", "he", "she", "it", "they", "them",
                   "us", "why", "what", "how", "who", "where", "when", "which"}
VERB_EXCEPTIONS = {"singing": "sing"}

def process_text(input_text: str) -> dict:
    doc = nlp(input_text)

    filtered_tokens = []
    for token in doc:
        token_text = token.text.lower()
    
        if token_text in IMPORTANT_WORDS:
            processed_token = token.text.upper()
        elif token_text in VERB_EXCEPTIONS:
            processed_token = VERB_EXCEPTIONS[token_text].upper()
        else:
     
            processed_token = token.lemma_.upper() if not token.is_stop and not token.is_punct else None
        if processed_token:
            filtered_tokens.append(processed_token)

    asl_gloss = " ".join(filtered_tokens)

    processed_data = {
        "text": input_text.upper(),
        "lemmas": filtered_tokens,
        "pos_tags": [
            token.pos_.upper()
            for token in doc
            if not token.is_stop and not token.is_punct
        ],
        "asl_gloss": asl_gloss
    }

    return processed_data

if __name__ == "__main__":
    try:
        input_text = sys.argv[1]
        result = process_text(input_text)
        print(json.dumps(result, indent=4))
    except IndexError:
        print("Error: No input text provided. Please provide text as a command-line argument.")
    except Exception as e:
        print(f"Unexpected error: {e}")
