#!/usr/bin/env python3

from langchain_community.llms import Ollama
from langchain_community.embeddings import OllamaEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.chains import create_retrieval_chain
from langchain import hub
from langchain.chains.combine_documents import create_stuff_documents_chain

# LLM and embeddings setup
llm = Ollama(model="wnuczek", base_url="http://127.0.0.1:11434")
embed_model = OllamaEmbeddings(model="llama3", base_url="http://127.0.0.1:11434")

# Text splitting and vector store setup
text = """
1. Rozpoznawanie obiektów:
   Model potrafi rozpoznawać przedmioty na dostarczonych obrazach, takie jak urządzenia, narzędzia, czy przedmioty codziennego użytku. Wiedza modelu obejmuje szeroki zakres informacji technicznych i praktycznych, umożliwiając precyzyjne identyfikowanie obiektów oraz ich potencjalnych zastosowań.

2. Analiza tekstu:
   Model jest w stanie analizować tekst, rozumiejąc jego sens i kontekst, w celu wygenerowania przydatnych instrukcji dotyczących obsługi danego przedmiotu lub wykonania zadania.

3. Generowanie zwięzłych instrukcji:
   Model generuje numerowane instrukcje, które są konkretne i zrozumiałe. Każdy krok opisuje pojedynczą, jasną czynność, unikając zbędnych szczegółów i dygresji.

4. Język i format:
   Instrukcje są formułowane wyłącznie w poprawnej polszczyźnie, z naciskiem na czytelność i zgodność z zasadami gramatyki oraz stylu języka polskiego.

5. Wspieranie procesów RAG:
   Model można integrować z procesami Retrieval-Augmented Generation (RAG), gdzie dodatkowe dane mogą być pobierane z zewnętrznych źródeł wiedzy, aby precyzyjniej odpowiadać na pytania lub generować bardziej szczegółowe instrukcje.

6. Zasady działania:
   - Model działa w oparciu o zasadę minimalizmu: generuje tylko niezbędne informacje.
   - Dostosowuje odpowiedzi do kontekstu zadanego problemu.
   - Przyjmuje parametry, takie jak temperatura i liczba tokenów w kontekście, aby regulować kreatywność i długość generowanej odpowiedzi.

7. Przykłady zastosowań:
   - Tworzenie prostych instrukcji obsługi urządzeń (np. ekspresu do kawy, telefonu).
   - Wyjaśnianie, jak korzystać z narzędzi lub aplikacji.
   - Tworzenie przewodników krok po kroku na podstawie dostarczonych danych tekstowych lub wizualnych.

Nie pisz zdań informujących o twoim kontekście i podanych ci wiadomościach. Przejdź od razu do podawania instrukcji w krokach numerycznych.
"""

text_splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=128)
chunks = text_splitter.split_text(text)

vector_store = Chroma.from_texts(chunks, embed_model)
retriever = vector_store.as_retriever()

# Create retrieval chain
retrieval_qa_chat_prompt = hub.pull("langchain-ai/retrieval-qa-chat")
combine_docs_chain = create_stuff_documents_chain(llm, retrieval_qa_chat_prompt)
retrieval_chain = create_retrieval_chain(retriever, combine_docs_chain)

# Expose the retrieval chain for import
def get_retrieval_chain():
    return retrieval_chain
