"""
AquaHear — Accessibility Voice Alert Service
Generates multilingual speech audio for water risk alerts.
"""

import io
import base64
from gtts import gTTS

# ---------- Translation Map ----------
TRANSLATIONS = {
    "High Risk": {
        "en": "High water risk detected. Immediate action required. Please store water and follow emergency guidelines.",
        "hi": "उच्च जल जोखिम पाया गया है। तत्काल कार्रवाई आवश्यक है। कृपया पानी का भंडारण करें।",
        "ta": "அதிக நீர் ஆபத்து கண்டறியப்பட்டது. உடனடி நடவடிக்கை தேவை. தண்ணீர் சேமியுங்கள்.",
        "te": "అధిక నీటి ప్రమాదం గుర్తించబడింది. తక్షణ చర్య అవసరం. నీటిని నిల్వ చేయండి."
    },
    "Warning": {
        "en": "Water supply disruption possible in your area. Please conserve water and stay alert for updates.",
        "hi": "आपके क्षेत्र में पानी की आपूर्ति प्रभावित हो सकती है। कृपया पानी बचाएं और अपडेट के लिए सतर्क रहें।",
        "ta": "உங்கள் பகுதியில் நீர் விநியோகம் பாதிக்கப்படலாம். நீர் சேமிக்கவும்.",
        "te": "మీ ప్రాంతంలో నీటి సరఫరా అంతరాయం కలగవచ్చు. నీటిని పొదుపుగా వాడండి."
    },
    "Stable": {
        "en": "Water network is operating normally. No action required at this time.",
        "hi": "जल आपूर्ति सामान्य रूप से काम कर रही है। इस समय कोई कार्रवाई आवश्यक नहीं है।",
        "ta": "நீர் விநியோகம் இயல்பாக இயங்குகிறது. இந்த நேரத்தில் எந்த நடவடிக்கையும் தேவையில்லை.",
        "te": "నీటి సరఫరా సాధారణంగా పనిచేస్తోంది. ప్రస్తుతం ఎటువంటి చర్య అవసరం లేదు."
    }
}

LANG_MAP = {
    "English": "en",
    "Hindi": "hi",
    "Tamil": "ta",
    "Telugu": "te"
}


def generate_audio(language: str = "English", alert_type: str = "Stable", custom_text: str = None):
    """
    Generate speech audio for a given alert.
    Returns base64-encoded MP3 audio.
    """
    lang_code = LANG_MAP.get(language, "en")

    if custom_text:
        text = custom_text
    else:
        text = TRANSLATIONS.get(alert_type, TRANSLATIONS["Stable"]).get(lang_code, TRANSLATIONS["Stable"]["en"])

    # Generate audio
    tts = gTTS(text=text, lang=lang_code)

    # Save to buffer
    buffer = io.BytesIO()
    tts.write_to_fp(buffer)
    buffer.seek(0)

    # Encode as base64
    audio_base64 = base64.b64encode(buffer.read()).decode("utf-8")

    return {
        "audio_base64": audio_base64,
        "language": language,
        "lang_code": lang_code,
        "alert_type": alert_type,
        "text": text,
        "format": "mp3"
    }
