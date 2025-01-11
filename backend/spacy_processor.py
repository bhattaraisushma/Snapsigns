import sys
import spacy
import json


nlp = spacy.load("en_core_web_sm")


temporal_words = {"before", "after", "since", "until", "while", "now"}
for word in temporal_words:
    nlp.vocab[word].is_stop = False


nlp.vocab["please"].is_stop = False


IMPORTANT_WORDS = {"i", "we", "me", "you", "he", "she", "it", "they", "them", 
                   "us", "why", "what", "how", "who", "where", "when", "which"}

VERB_EXCEPTIONS = {"singing": "sing"}

SPECIAL_GLOSSES = {
    "go": "GO",
    "name": "NAME",
}



def process_text(input_text: str) -> dict:
    doc = nlp(input_text)

    filtered_tokens = []
    last_token = None  

    for token in doc:
        token_text = token.text.lower()

       
        if token_text in IMPORTANT_WORDS:
            processed_token = token.text.upper()
        elif token_text in VERB_EXCEPTIONS:
            processed_token = VERB_EXCEPTIONS[token_text].upper()
        elif token_text in SPECIAL_GLOSSES:
            processed_token = SPECIAL_GLOSSES[token_text]
        else:
           
            if token.pos_ == "NUM" or (not token.is_punct and not token.is_stop):
                processed_token = token.lemma_.upper()

       
        if processed_token and processed_token != last_token:
            filtered_tokens.append(processed_token)
            last_token = processed_token

   
    asl_gloss = " ".join(filtered_tokens)

    processed_data = {
        "text": input_text.upper(),
        "lemmas": filtered_tokens,
        "pos_tags": [token.pos_.upper() for token in doc if not token.is_punct],
        "asl_gloss": asl_gloss
    }

    return processed_data

if __name__ == "__main__":
    try:
       
        if len(sys.argv) < 2:
            raise ValueError("No input text provided. Please provide text as a command-line argument.")
        
        input_text = sys.argv[1]
        result = process_text(input_text)
        print(json.dumps(result, indent=4))
        
    except ValueError as ve:
        print(f"Error: {ve}")
    except Exception as e:
        print(f"Unexpected error: {e}")











