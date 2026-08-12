def clean_text(text: str, max_length: int = 1000) -> str:
    if text is None:
        return ""
    
    text = text.strip()
    
    if len(text) == 0:
        return ""
    
    if len(text) > max_length:
        text = text[:max_length]
    
    return text


def is_valid_text(text: str) -> bool:
    cleaned = clean_text(text)
    return len(cleaned) > 0