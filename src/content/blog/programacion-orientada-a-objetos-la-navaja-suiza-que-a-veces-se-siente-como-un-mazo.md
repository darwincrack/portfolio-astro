---
title: "Programación Orientada a Objetos: La navaja suiza que a veces se siente como un mazo"
pubDate: 2026-03-18T14:20:25.863Z
description: "¿Es la POO la solución para todo? Desde mi trinchera, te cuento cuándo me ha salvado y cuándo me ha enredado. Una opinión sin filtros sobre sus pros y contras."
image:
  url: "https://picsum.photos/seed/programacion-orientada-a-objetos-la-navaja-suiza-que-a-veces-se-siente-como-un-mazo/1200/630"
  alt: "Programación Orientada a Objetos: La navaja suiza que a veces se siente como un mazo"
tags:
  - evergreen
  - programacion
---

Cuando me inicié en esto de programar, la Programación Orientada a Objetos (POO) era casi un dogma. Era *la forma* de hacerlo, el evangelio que te prometía código legible, mantenible y escalable. Y, lo admito, durante años me aferré a ella como a un salvavidas. Pero con el tiempo, y después de bastantes batallas debuggeando objetos anidados hasta el infinito, mi visión ha evolucionado. Ahora la veo, y la uso, como lo que es: una herramienta potente, sí, pero que requiere saber cuándo y cómo aplicarla. A veces es una navaja suiza, perfecta para el detalle; otras, se siente más como un mazo, intentando encajar todo a golpes.

### Para mí, ¿qué es la POO de verdad?

Para mí, la POO es una manera de modelar problemas complejos agrupando datos y el comportamiento que opera sobre esos datos. Hablamos de encapsulación, herencia y polimorfismo, esos tres pilares que te recitan en cada curso. En teoría, suena perfecto: objetos autónomos que se comunican, facilitando la comprensión y el mantenimiento del sistema.

### Donde la POO brilla (y donde la adoro)

No todo es criticar. La POO, usada con cabeza, es una maravilla. Hay dos conceptos que me hacen volver a ella una y otra vez:

1.  **Encapsulación:** Es la habilidad de esconder la complejidad interna de un objeto y exponer solo lo necesario. Para mí, esto es oro puro. Significa que puedo cambiar cómo funciona algo por dentro sin afectar a quién lo usa por fuera. Pienso en mis interfaces de bases de datos o en la lógica de negocio que procesa un pedido; mientras la API externa sea estable, el cómo lo resuelvo internamente puede evolucionar sin romper medio sistema. Reduce dependencias y facilita la refactorización. Un alivio.
2.  **Polimorfismo:** Este es mi favorito. La capacidad de tratar objetos de diferentes clases de una manera uniforme. Me permite escribir código genérico que funciona con cualquier objeto que cumpla una cierta interfaz o extienda una clase base. Por ejemplo, al procesar diferentes tipos de eventos (un `PaymentProcessedEvent`, un `OrderCancelledEvent`), puedo tener un `EventHandler` genérico y pasarle cualquier evento, siempre que todos implementen una interfaz `IEvent`. Esto hace que el código sea increíblemente flexible y extensible. Si necesito añadir un nuevo tipo de evento, solo tengo que implementarlo y registrarlo, sin tocar el código existente.

La herencia, por otro lado, la uso con muchísima más cautela. Sí, promueve la reutilización de código, pero a menudo se abusa de ella y crea jerarquías rígidas y difíciles de manejar. Soy un firme defensor de la *composición sobre la herencia* siempre que sea posible. Menos acoplamiento, menos sorpresas.

### Cuando la POO me da dolores de cabeza (y la evito)

Pero, como decía, no es una bala de plata. Me he encontrado demasiadas veces en situaciones donde la POO se convierte en un laberinto de abstracciones y complejidades innecesarias:

*   **Over-engineering:** Esto es clásico. Clases para cada minucia, jerarquías de herencia que parecen árboles genealógicos de la realeza, patrones de diseño aplicados sin un problema claro que resolver. A veces, un problema simple solo necesita una función simple. Punto. No hace falta una `SimpleFunctionExecutorFactory`.
*   **Modelos de dominio anémicos:** Objetos que solo son contenedores de datos, sin ningún comportamiento asociado. Toda la lógica vive en
