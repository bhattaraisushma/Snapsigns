import sys
import spacy
import json


nlp = spacy.load("en_core_web_sm")


temporal_words = {"before", "after", "since", "until", "while", "now", "tomorrow", "yesterday", 
                  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", 
                  "this", "weekend"}
for word in temporal_words:
    nlp.vocab[word].is_stop = False

IMPORTANT_WORDS = {"i", "we", "me", "you", "he", "she", "it", "they", "them", 
                   "us", "why", "what", "how", "who", "where", "when", "which"}
VERB_EXCEPTIONS = {"singing": "sing"}
SPECIAL_GLOSSES = {"go": "GO", "name": "NAME"}

PREPOSITIONS_AUX_VERBS = {"at", "on", "in", "to", "are", "am", "will", "is"}

def sort_temporal_tokens(tokens):
    
    order = {"YESTERDAY": 0, "TODAY": 1, "TOMORROW": 2}
    return sorted(tokens, key=lambda x: order.get(x, len(order)))

def process_text(input_text: str) -> dict:
    doc = nlp(input_text)

    
    excluded_pos = {"AUX", "ADP"}  

    temporal_tokens = []
    subject_tokens = []
    verb_tokens = []
    object_tokens = []
    location_tokens = [] 

    for token in doc:
        token_text = token.text.lower()

     
        if token_text in temporal_words:
            temporal_tokens.append(token.text.upper())
            continue

      
        if token_text in PREPOSITIONS_AUX_VERBS or token_text == "the":
            continue

       
        if token.pos_ not in excluded_pos:
            if token_text in {"i", "me"}:
                subject_tokens.append("ME")  
            elif token_text in {"we", "us"}:
                subject_tokens.append("WE")
            elif token_text in IMPORTANT_WORDS:
                subject_tokens.append(token.text.upper())
            elif token.pos_ == "VERB":
                verb = VERB_EXCEPTIONS.get(token_text, token.lemma_).upper()
                verb_tokens.append(verb)
            elif token_text in {"home", "store", "park", "office"}:  
                location_tokens.append(token.text.upper())
            else:
                object_tokens.append(token.lemma_.upper())

   
    temporal_tokens = sort_temporal_tokens(temporal_tokens)

   
    asl_gloss = " ".join(temporal_tokens + subject_tokens + verb_tokens + location_tokens + object_tokens)

  
    processed_data = {
        "text": input_text.upper(),
        "lemmas": temporal_tokens + subject_tokens + verb_tokens + location_tokens + object_tokens,
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

