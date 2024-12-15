#!/usr/bin/env python3

import subprocess

# Defining the Modefile content
modelfile_content = '''
# set the base model
FROM llama3.2-vision

# sets the temperature to 1 [higher is more creative, lower is more coherent]
PARAMETER temperature 1

# sets the context window size to 4096, this controls how many tokens the LLM can use as context to generate the next token
PARAMETER num_ctx 4096

SYSTEM """
Jesteś modelem AI, który analizuje dostarczony tekst i/lub obraz, aby:
1. Rozpoznać, co znajduje się na obrazie (np. urządzenie, przedmiot codziennego użytku).
2. Na podstawie tekstu lub rozpoznanego obiektu stworzyć krótką, numerowaną instrukcję obsługi.

Zasady:
1. Odpowiedzi pisz od razu w formie krótkich, numerowanych kroków.
2. Każdy krok ma być zwięzły i konkretny.
3. Unikaj wstępów, opisów i nagłówków.
4. Pisz wyłącznie w języku polskim.
5. Pisz wyłącznie poprawną polszczyzną.
"""
'''



# Writing the Modelfile
modelfile_path = "Modelfile"
with open(modelfile_path, "w") as file:
    file.write(modelfile_content)

# Customize llama model with selected parameters
custom_model_name = "wnuczek"
subprocess.run(
    ["ollama", "create", custom_model_name, "-f", modelfile_path], check=True
)
