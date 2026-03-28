---
title: "Manejo de Errores: Mi filosofía para no perder la cabeza (y dormir por las noches)"
pubDate: 2026-03-28T13:48:38.559Z
description: "Después de años debuggeando bugs inexplicables y sistemas que fallan sin decir por qué, he desarrollado una filosofía para el manejo de errores y excepciones. Esto es lo que me funciona para que mi código sea robusto y mi sueño reparador."
image:
  url: "https://picsum.photos/seed/manejo-de-errores-mi-filosofia-para-no-perder-la-cabeza-y-dormir-por-las-noches/1200/630"
  alt: "Manejo de Errores: Mi filosofía para no perder la cabeza (y dormir por las noches)"
tags:
  - evergreen
  - programacion
---

La primera vez que un sistema en producción se fue al garete a las 3 de la mañana, y el único "error" que encontré en los logs fue un críptico `NoneType object has no attribute 'some_method'`, juré que nunca más. La mala gestión de errores es una plaga, una invitación a noches en vela y a perder la cordura intentando adivinar qué demonios pasó. En mi carrera, he aprendido que no se trata solo de que el código funcione, sino de que falle *bien*.

### Fallar bien, no solo fallar

Mi filosofía es simple: si algo va a fallar, que falle **fuerte** y que falle **claramente**. Prefiero una excepción que detenga mi programa con un mensaje útil y un *stack trace* completo, a un `None` silencioso que corrompe datos o genera un error incoherente mil líneas de código más abajo. Ese tipo de fallos silenciosos son los que me han tenido mordiéndome las uñas.

Para mí, el manejo de errores no es solo envolver bloques de código en `try...except`. Es una parte fundamental del diseño de software, tan importante como elegir la estructura de datos correcta o definir una buena API.

### ¿Excepciones o valores de retorno? Mi guerra personal

Esta es una discusión que he tenido un millón de veces. ¿Devuelvo un `False`, un `null`, un código de error, o lanzo una excepción? Mi postura es firme: **excepciones para condiciones excepcionales, valores de retorno para resultados esperados (incluso si son "vacíos" o "no encontrados")**.

Si un usuario pide un recurso que no existe, y tu aplicación está diseñada para manejar esa situación (quizás mostrando un "404 Not Found"), eso no es una excepción, es un resultado esperado. Podría ser un `Optional` o un `None` en Python, o un `Result` type en lenguajes que los favorecen. Pero si el disco duro está lleno y no puedo guardar un archivo, ¡eso es una excepción! No espero que mi función de guardado falle por eso en el flujo normal; es algo que requiere atención y posiblemente una intervención.

Yo evito a toda costa devolver códigos de error mágicos o `False` cuando la falla es realmente catastrófica. Ese patrón me recuerda a la programación en C de antaño, donde tenías que estar chequeando cada retorno. ¡Usa las herramientas que el lenguaje te da!

### Los errores que me quitan el sueño (y cómo los evito)

Hay dos pecados capitales en el manejo de excepciones que me han costado horas de vida:

1.  **Tragar excepciones (`except: pass` o `except Exception:`)**: Esto es lo peor. Cuando veo un `except: pass` en un código ajeno, se me revuelven las tripas. Estás diciendo "no importa lo que pase, ignóralo". Es una receta para la catástrofe silenciosa. Tu programa sigue funcionando, pero con un estado interno corrupto, o sin haber hecho algo crítico, y tú no te enteras hasta que es demasiado tarde. Si vas a capturar una `Exception` genérica, por lo menos, ¡loguéala! Y si puedes, haz que el programa falle de forma controlada o retorne un error claro. No la ignores.
2.  **No dar contexto**: Un `ValueError` es útil, pero un `ValueError: Invalid input provided for user ID 123 in function 'process_order'` es oro. La información contextual en el mensaje de error y en los logs es vital para diagnosticar. ¿Qué datos se estaban procesando? ¿Qué parámetros recibió la función? ¿Qué estado tenía el sistema? Si no puedo responder a estas preguntas en el *stack trace* o en el log, es que mi manejo de errores es deficiente. Esto se relaciona mucho con mi cruzada por la [observabilidad en sistemas de ML](/blog/tu-ia-hace-lo-que-crees-que-hace-mi-cruzada-por-la-observabilidad-en-sistemas-de-ml/), donde entender qué está haciendo tu sistema es tan crucial como que funcione.

### Mis reglas de oro para un manejo de errores sano

1.  **Sé específico**: Siempre que sea posible, captura excepciones específicas (`FileNotFoundError`, `ValueError`, `KeyError`) en lugar de `Exception` general. Si tienes que usar `Exception`, vuelve a lanzarla o regístrala con verbosidad.
2.  **Loguea con cabeza**: Usa un buen sistema de logging. Incluye la fecha, el nivel de error, el *stack trace* completo y toda la información contextual relevante. Piensa en qué necesitarías si te despiertan a las 3 AM.
3.  **Define tus propias excepciones**: Para los errores de tu dominio de negocio, define clases de excepción personalizadas. Esto mejora la claridad del código y permite a los llamadores capturar errores específicos de tu módulo sin depender de excepciones genéricas de Python. Por ejemplo: `PedidoNoEncontradoError` o `CredencialesInvalidasError`.
4.  **No te compliques**: Evita anidar demasiados `try...except`s. A veces, un error debe propagarse a una capa superior que tenga más información o contexto para manejarlo adecuadamente. Aquí entra en juego la idea de [funciones puras y efectos secundarios](/blog/funciones-puras-y-efectos-secundarios-por-que-me-obsesionan-y-te-ahorran-debugging-a-las-3-am/): separar las funciones que *pueden* fallar (por I/O, red, etc.) de las que son puramente computacionales te ayuda a controlar mejor dónde y cómo manejar los errores.
5.  **Prueba tus errores**: Sí, así como pruebas tu código que funciona, prueba tu código que falla. ¿Se lanzan las excepciones correctas? ¿Los mensajes son claros? ¿Se loguean adecuadamente? Un test para asegurar que una función lanza un `ValueError` cuando se le pasan datos inválidos es tan importante como un test que verifica que devuelve el resultado correcto. De hecho, es parte de mi filosofía para [testear IA](/blog/testear-ia-no-es-testear-una-rest-api-mis-batallas-y-la-receta-que-funciona/), que a menudo implica lidiar con datos inesperados y comportamientos anómalos.

### En mi experiencia, el tiempo invertido aquí se paga con creces

Puede parecer mucho trabajo al principio, pero te prometo que implementar un buen manejo de errores te ahorrará dolores de cabeza, tiempo de depuración y, lo más importante, te permitirá dormir tranquilo. Un sistema que falla limpiamente y te dice por qué falló es un sistema robusto, incluso cuando se cae. Es una señal de madurez en el desarrollo de software.
