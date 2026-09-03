import csv, json, os, random

# Reuse the 20-record JSONL created in the previous step.
src = "ugandan_public_health_visual_storytelling_20.jsonl"
out = "ugandan_public_health_visual_storytelling_2000.csv"

# Replace your current base = [...] lines with this:
with open(src, "r", encoding="utf-8") as f:
    base = []
    for line in f:
        stripped = line.strip()
        if stripped:  # Only parse if the line actually contains text
            try:
                base.append(json.loads(stripped))
            except json.JSONDecodeError:
                continue  # Skip any broken JSON lines safely


# Topic templates. These create diverse candidate records around the same
# source-grounded public-health storytelling schema. The health statements
# remain intentionally conservative; final medical QA should be performed
# against authoritative Ugandan/WHO/UNICEF guidance before deployment.
topics = {
    "Malaria": [
        ("Prevention", "Families", "Ugandan household"),
        ("Mosquito-net use", "Parents and caregivers", "Ugandan household"),
        ("Care seeking", "Families", "Ugandan community"),
        ("Community awareness", "Community members", "Ugandan village"),
        ("Mosquito breeding-site awareness", "Community members", "Ugandan neighbourhood"),
    ],
    "Maternal health": [
        ("Antenatal care", "Pregnant women", "Ugandan health centre"),
        ("Birth preparedness", "Pregnant women and families", "Ugandan community"),
        ("Pregnancy danger signs", "Pregnant women and families", "Ugandan household"),
        ("Postnatal care", "Mothers and families", "Ugandan health centre"),
        ("Skilled care seeking", "Pregnant women and families", "Ugandan community"),
    ],
    "Newborn health": [
        ("Keeping newborns warm", "New mothers and caregivers", "Ugandan home"),
        ("Cord care", "Parents and caregivers", "Ugandan home"),
        ("Breastfeeding support", "New mothers", "Ugandan health centre"),
        ("Newborn danger signs", "Parents and caregivers", "Ugandan community"),
        ("Early newborn care", "Families", "Ugandan home"),
    ],
    "Child health": [
        ("Child illness awareness", "Parents and caregivers", "Ugandan household"),
        ("Community screening", "Parents and caregivers", "Ugandan community"),
        ("Care seeking", "Families", "Ugandan health centre"),
        ("Child health education", "Parents", "Ugandan community"),
        ("Growth and wellbeing", "Caregivers", "Ugandan health centre"),
    ],
    "Immunisation": [
        ("Routine childhood vaccination", "Parents and caregivers", "Ugandan health centre"),
        ("Vaccination awareness", "Families", "Ugandan community"),
        ("HPV vaccination awareness", "Adolescents and parents", "Ugandan school"),
        ("Immunisation records", "Parents", "Ugandan health centre"),
        ("Community vaccination education", "Community members", "Ugandan village"),
    ],
    "WASH": [
        ("Handwashing", "Children and families", "Ugandan school"),
        ("Handwashing before meals", "Families", "Ugandan household"),
        ("Safe water", "Families", "Rural Ugandan community"),
        ("Sanitation", "Community members", "Ugandan neighbourhood"),
        ("School hygiene", "Schoolchildren and teachers", "Ugandan school"),
    ],
    "Nutrition": [
        ("Infant and young-child feeding", "Parents and caregivers", "Ugandan household"),
        ("Dietary diversity", "Families", "Ugandan household"),
        ("Nutrition counselling", "Mothers and caregivers", "Ugandan community"),
        ("Community nutrition screening", "Parents and caregivers", "Ugandan community"),
        ("Food and hygiene education", "Families", "Ugandan household"),
    ],
    "HIV": [
        ("HIV testing awareness", "Adolescents and young adults", "Ugandan health facility"),
        ("HIV prevention", "Young adults", "Ugandan community"),
        ("Treatment, care and support", "People living with HIV and families", "Ugandan health facility"),
        ("Reducing stigma", "Community members", "Ugandan community"),
        ("Adolescent HIV education", "Adolescents", "Ugandan school"),
    ],
    "Tuberculosis": [
        ("TB awareness", "Community members", "Ugandan community"),
        ("Community screening", "Community members", "Ugandan village"),
        ("Care seeking", "Adults and families", "Ugandan health centre"),
        ("Treatment support", "Patients and families", "Ugandan health facility"),
        ("Reducing stigma", "Community members", "Ugandan community"),
    ],
    "Sexual and reproductive health": [
        ("Family planning", "Couples and families", "Ugandan health centre"),
        ("Pregnancy spacing", "Couples", "Ugandan community"),
        ("Adolescent health education", "Adolescents", "Ugandan school"),
        ("Health-service information", "Young adults", "Ugandan health centre"),
        ("Confidential counselling", "Young adults", "Ugandan health facility"),
    ],
    "Non-communicable diseases": [
        ("Hypertension awareness", "Adults", "Ugandan community"),
        ("Diabetes awareness", "Adults and families", "Ugandan health centre"),
        ("Healthy lifestyle awareness", "Adults", "Ugandan community"),
        ("Health screening", "Adults", "Ugandan health facility"),
        ("Risk-factor awareness", "Community members", "Ugandan neighbourhood"),
    ],
    "Mental health": [
        ("Mental-health awareness", "Community members", "Ugandan community"),
        ("Seeking support", "Young adults", "Ugandan health facility"),
        ("Reducing stigma", "Families", "Ugandan community"),
        ("Youth wellbeing", "Adolescents", "Ugandan school"),
        ("Community support", "Community members", "Ugandan village"),
    ],
    "Infectious disease awareness": [
        ("Prevention education", "Community members", "Ugandan community"),
        ("Health-facility care seeking", "Families", "Ugandan health centre"),
        ("Community hygiene", "Community members", "Ugandan neighbourhood"),
        ("Outbreak awareness", "Community members", "Ugandan village"),
        ("Health-information sharing", "Families", "Ugandan community"),
    ],
    "Community health": [
        ("Village Health Team outreach", "Community members", "Ugandan village"),
        ("Community health education", "Families", "Ugandan community"),
        ("Referral awareness", "Families", "Ugandan community"),
        ("Household health visits", "Families", "Ugandan household"),
        ("Community screening", "Adults and families", "Ugandan village"),
    ],
    "Environmental health": [
        ("Waste management", "Community members", "Ugandan neighbourhood"),
        ("Clean surroundings", "Families", "Ugandan community"),
        ("Water-source protection", "Community members", "Rural Ugandan community"),
        ("Environmental hygiene", "Schoolchildren and families", "Ugandan school"),
        ("Community clean-up", "Community members", "Ugandan neighbourhood"),
    ],
}

source_map = {
    "Malaria": ("Uganda Ministry of Health / WHO Uganda",
                "https://health.go.ug/now-we-can-now-we-must-uganda-pushes-for-a-malaria-free-future/"),
    "Maternal health": ("UNICEF Uganda",
                       "https://www.unicef.org/uganda/key-practice-antenatal-care"),
    "Newborn health": ("UNICEF Uganda",
                       "https://www.unicef.org/uganda/key-practice-newborn-care"),
    "Child health": ("UNICEF Uganda",
                     "https://www.unicef.org/uganda/stories/it-turns-deadly"),
    "Immunisation": ("UNICEF Uganda",
                     "https://www.unicef.org/uganda/key-practice-immunization"),
    "WASH": ("UNICEF Uganda",
             "https://www.unicef.org/uganda/key-practice-hand-washing-soap-and-water"),
    "Nutrition": ("UNICEF Uganda",
                  "https://www.unicef.org/uganda/stories/tackling-malnutrition-through-infant-and-young-child-feeding-counselling-sessions"),
    "HIV": ("UNICEF Uganda",
            "https://www.unicef.org/uganda/what-we-do/hiv-aids"),
    "Tuberculosis": ("WHO Uganda",
                     "https://www.who.int/about/accountability/results/who-results-report-2024-2025/country-profile/2024/uganda"),
    "Sexual and reproductive health": ("UNICEF Uganda",
                                       "https://www.unicef.org/uganda/all-key-family-care-practices"),
    "Non-communicable diseases": ("WHO Uganda",
                                  "https://www.who.int/countries/uga/"),
    "Mental health": ("WHO Uganda",
                      "https://www.who.int/countries/uga/"),
    "Infectious disease awareness": ("WHO Uganda",
                                     "https://www.who.int/countries/uga/"),
    "Community health": ("WHO Uganda",
                         "https://www.who.int/about/accountability/results/who-results-report-2024-2025/country-profile/2024/uganda"),
    "Environmental health": ("WHO Uganda",
                             "https://www.who.int/countries/uga/"),
}

# Conservative phrase libraries for synthetic variations.
openings = [
    "A family learns about an important health practice.",
    "A community health worker shares practical health information.",
    "A caregiver notices an issue and seeks appropriate guidance.",
    "Residents attend a local health-education activity.",
    "A family puts a recommended health practice into their daily routine."
]
closings = [
    "The family leaves with clear guidance on the next appropriate step.",
    "The community shares the message with other households.",
    "The caregiver follows the guidance and knows when to seek professional help.",
    "The health worker reinforces the importance of using trusted health services.",
    "The story ends with the community putting the health message into practice."
]

def make_record(i, topic, subtopic, audience, setting):
    source_org, source_url = source_map[topic]
    title = f"{subtopic}: A Community Story {i:04d}"
    summary = f"A short Ugandan public-health story about {subtopic.lower()} for {audience.lower()}."
    source_info = (
        f"This example focuses on {subtopic.lower()} within the Ugandan public-health context. "
        f"The health information should be interpreted and verified against the cited authoritative source."
    )
    message = (
        f"Communicate accurate, practical information about {subtopic.lower()} "
        f"and encourage appropriate use of trusted health services and guidance."
    )

    # Keep generated scenes visually distinct while avoiding invented clinical instructions.
    scene_descriptions = [
        f"{openings[i % len(openings)]} The setting is a {setting.lower()}.",
        f"A trained health worker or trusted community member explains information about {subtopic.lower()} to the {audience.lower()}.",
        f"The people apply or discuss the health message in an appropriate everyday situation.",
        closings[i % len(closings)]
    ]

    captions = [
        f"Learning about {subtopic.lower()} can help families make informed health decisions.",
        f"The health worker shares clear information suited to the community.",
        f"The family or community discusses how to follow the guidance safely.",
        "For health concerns, people are encouraged to use appropriate professional services."
    ]

    visual_context = {
        "Ugandan household": "realistic Ugandan household, culturally appropriate environment",
        "Rural Ugandan community": "rural Ugandan community, culturally appropriate homes and surroundings",
        "Ugandan community": "diverse Ugandan community, realistic local environment",
        "Ugandan village": "Ugandan village setting, realistic homes and community surroundings",
        "Ugandan neighbourhood": "Ugandan neighbourhood, realistic streets and homes",
        "Ugandan school": "Ugandan school compound and classroom environment",
        "Ugandan health centre": "Ugandan health centre with trained health workers",
        "Ugandan health facility": "Ugandan health facility, clean realistic clinical environment",
    }.get(setting, f"realistic {setting.lower()}")

    scenes = []
    for n in range(4):
        scenes.append({
            "scene_number": n + 1,
            "description": scene_descriptions[n],
            "caption": captions[n],
            "visual_prompt": (
                f"Educational public-health visual story set in {visual_context}; "
                f"show {scene_descriptions[n].lower()} "
                f"with respectful, non-stigmatizing, culturally appropriate Ugandan representation."
            )
        })

    return {
        "id": f"UGPH_{i:04d}",
        "topic": topic,
        "subtopic": subtopic,
        "audience": audience,
        "setting": setting,
        "source_organization": source_org,
        "source_url": source_url,
        "source_information": source_info,
        "health_message": message,
        "story_title": title,
        "story_summary": summary,
        "scenes": json.dumps(scenes, ensure_ascii=False)
    }

# Generate exactly 2,000 records, preserving the original 20 records and filling the rest.
rows = []
for r in base:
    rows.append({
        "id": r["id"],
        "topic": r["topic"],
        "subtopic": r["subtopic"],
        "audience": r["audience"],
        "setting": r["setting"],
        "source_organization": r["source"]["organization"],
        "source_url": r["source"]["url"],
        "source_information": r["source_information"],
        "health_message": r["health_message"],
        "story_title": r["story_title"],
        "story_summary": r["story_summary"],
        "scenes": json.dumps(r["scenes"], ensure_ascii=False)
    })

choices = [(t, s, a, st) for t, vals in topics.items() for s, a, st in vals]

for i in range(21, 2001):
    topic, subtopic, audience, setting = choices[(i - 21) % len(choices)]
    rows.append(make_record(i, topic, subtopic, audience, setting))

random.seed(42)
# Shuffle only the newly generated records; keep IDs unique and all 20 originals.
original = rows[:20]
generated = rows[20:]
random.shuffle(generated)
rows = original + generated

fieldnames = [
    "id", "topic", "subtopic", "audience", "setting",
    "source_organization", "source_url", "source_information",
    "health_message", "story_title", "story_summary", "scenes"
]

with open(out, "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Created: {out}")
print(f"Records: {len(rows)}")
print(f"Columns: {len(fieldnames)}")
print("Note: records 0021-2000 are synthetic draft examples and require source-level medical QA before being treated as final training data.")
