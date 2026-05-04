---
title: "Agentes de IA que hacen algo (más allá de hablar): por qué mis modelos tienen 'manos' y 'ojos'"
pubDate: 2026-05-04T15:08:34.767Z
description: "Los LLMs son geniales para conversar, pero ¿qué pasa cuando necesitas que tu agente de IA interactúe con el mundo real? Comparto mi experiencia dándoles 'manos' y 'ojos' con herramientas."
image:
  url: "https://picsum.photos/seed/agentes-de-ia-que-hacen-algo-mas-alla-de-hablar-por-que-mis-modelos-tienen-manos-y-ojos/1200/630"
  alt: "Agentes de IA que hacen algo (más allá de hablar): por qué mis modelos tienen 'manos' y 'ojos'"
tags:
  - evergreen
  - ia
---

La primera vez que intenté que un modelo de lenguaje hiciera algo más que responder a una pregunta en texto plano, me di de bruces con la cruda realidad: son brillantes cerebritos, sí, pero no tienen manos, ni ojos, ni acceso a nada fuera de su entrenamiento.

Mi agente era una maravilla conversando sobre el clima, pero si le pedía "¿Cuál es el tiempo en Madrid para mañana?", se quedaba atascado en el "no puedo acceder a información externa". Era como tener un genio encerrado en una botella de cristal: mucha sabiduría, pero incapacitado para actuar en el mundo físico. La frustración era palpable. Necesitaba que mis agentes no solo *supieran* cosas, sino que *hicieran* cosas. Que pudieran llamar una API, buscar en una base de datos, o incluso enviar un email. ¿Cómo los sacas de esa botella?

La respuesta, en mi experiencia, no es mágica, es ingeniería: **el uso de herramientas o 'función calling'**.

## No es magia, es una interfaz bien definida

Imagina que tu LLM es un director de orquesta. Sabe leer partituras, interpretar intenciones, pero no toca ningún instrumento. Las herramientas son esos instrumentos. Les das una descripción clara y concisa de cada instrumento (función) que tienes a su disposición: qué hace, qué necesita para funcionar y qué tipo de resultado devuelve. El LLM, entonces, basándose en la conversación y la tarea, decide *cuándo* usar qué instrumento y *con qué notas* (parámetros).

Mi código se encarga de que, cuando el director diga "toca esta melodía con estos parámetros", el instrumento adecuado la ejecute y devuelva el resultado. Y lo más importante, el director de orquesta (el LLM) ve ese resultado y puede decidir el siguiente paso. Esto transforma un LLM de un mero generador de texto a un **agente activo** capaz de interactuar con sistemas externos y, por ende, con el mundo real.

## Por qué mis agentes tienen que tener 'manos' y 'ojos'

Para mí, el valor de un agente de IA se multiplica exponencialmente cuando puede pasar de la teoría a la acción. Si quiero un agente que me gestione la agenda, no me sirve que me *diga* cómo programar una reunión; necesito que la *programe* usando mi calendario. Si busco un asistente para el soporte técnico, no me vale con que *sugiera* un reinicio; tiene que ser capaz de *ejecutar* un diagnóstico remoto o levantar un ticket.

Es la diferencia entre un simulador y un operador real. Esto es crucial en cualquier proyecto que aspire a ir más allá de un chatbot glorificado.

## Mi estrategia personal para dotar de herramientas a mis agentes

### 1. Define tus herramientas con bisturí, no con mazo

La descripción de la función es tu contrato. Tiene que ser clara, precisa y estar en un formato que el LLM entienda perfectamente (JSON Schema es mi elección). Si la descripción es ambigua, el LLM "alucinará" los parámetros o la usará en el momento equivocado. Me aseguro de que cada herramienta tenga una única responsabilidad, evitando el clásico `utility_mega_tool` que hace de todo. Esto hace que el agente sea más predecible y fácil de depurar, una filosofía que también aplico al código de mis sistemas más tradicionales [Modularidad y Composición](/blog/modularidad-y-composicion-por-que-mis-sistemas-y-agentes-de-ia-no-son-un-monolito-pegado-con-cinta-aislante/).

### 2. Espera que fallen. Siempre.

Las herramientas, al final, son llamadas a sistemas externos. Y los sistemas externos fallan. Las APIs devuelven errores, la red se cae, los datos no son los esperados. Mi código **debe** manejar estos errores de forma robusta y, crucial, comunicarle al LLM que la herramienta falló, y por qué. Un buen agente no se bloquea ante un error; intenta recuperarse, pregunta al usuario, o cambia de estrategia. Si no, tenemos un agente tan frágil como un programa sin `try-catch`.

### 3. Loggea cada movimiento

Si el agente llama a una herramienta para, por ejemplo, actualizar el estado de un pedido, quiero un registro claro de qué llamó, con qué argumentos y qué resultado obtuvo. Esto no es solo para depurar; es para entender el comportamiento del agente, auditar sus acciones y asegurar la explicabilidad cuando las cosas van mal. [Testing de Agentes de IA](/blog/testing-de-agentes-de-ia-por-que-mi-robot-necesita-mas-pruebas-que-tu-microservicio-y-como-no-volverte-loco) se vuelve mucho más complejo cuando los agentes interactúan con el mundo real, y los logs son tu mejor amigo.

## Cuándo no me complico con las herramientas

No todo problema necesita una herramienta. Si la tarea se resuelve perfectamente con la generación de texto o un ajuste fino del modelo (fine-tuning) para un dominio específico, no introduzco la complejidad extra de las herramientas. Añaden latencia (cada llamada es un "turno" extra para el LLM) y pueden aumentar la complejidad del promt, "distrayendo" al modelo de su tarea principal.

Para tareas muy específicas y de bajo riesgo, un prompt bien diseñado puede ser suficiente. Pero cuando necesito que mi agente sea un actor en el mundo digital, las herramientas son, de lejos, la pieza más importante del rompecabezas. Es ahí donde los agentes de IA dejan de ser una demo simpática y se transforman en una parte vital de mis soluciones.
