SUPPORTED_LANGUAGES = ("zh", "en")
DEFAULT_LANGUAGE = "zh"


def normalize_language(language) -> str:
    if not language:
        return DEFAULT_LANGUAGE
    language = str(language).lower()
    if language.startswith("zh"):
        return "zh"
    if language.startswith("en"):
        return "en"
    return DEFAULT_LANGUAGE


LANGUAGE_DIRECTIVE = {
    "zh": "Respond in Chinese (Simplified) for all text analysis. Use English for Mermaid diagram node IDs, but labels can be in Chinese.",
    "en": "Respond in English for all text analysis, section headings and Mermaid diagram labels. Use English for Mermaid diagram node IDs.",
}
