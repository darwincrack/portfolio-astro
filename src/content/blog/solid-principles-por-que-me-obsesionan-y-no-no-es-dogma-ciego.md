---
title: "SOLID Principles: Por qué me obsesionan (y no, no es dogma ciego)"
pubDate: 2026-03-03T13:57:22.524Z
description: "Mis reflexiones y experiencias aplicando los principios SOLID. No es solo teoría, es cómo mantengo mi código robusto y manejable, sin caer en la sobreingeniería."
image:
  url: "https://picsum.photos/seed/solid-principles-por-que-me-obsesionan-y-no-no-es-dogma-ciego/1200/630"
  alt: "SOLID Principles: Por qué me obsesionan (y no, no es dogma ciego)"
tags:
  - evergreen
  - ia
---

La primera vez que escuché sobre los principios SOLID, pensé: "¡Otra colección de acrónimos que los puristas de la programación usan para sentirse superiores!". Reconozco mi escepticismo inicial. Siempre he sido de los que prefieren ir directo al grano, codificar y ver que funcione. Pero, sinceramente, después de varias noches debuggeando código spaghetti que yo mismo había escrito (y el de otros), código donde cambiar una línea en un sitio rompía otra en el lugar más inesperado, empecé a ver la luz. No es dogma; es, pura y dura, supervivencia.

### El Código que Duele: Mi Motivación para Abrazar SOLID

Mi principal motivación para abrazar estos principios no vino de un libro de texto, sino del dolor. Del dolor de un `if-else` anidado seis veces, del dolor de una clase `Manager` que hacía de todo menos gestionar bien, del dolor de no poder escribir un test unitario decente porque todo estaba acoplado a todo lo demás. Era un infierno de mantenimiento. Ahí fue cuando me di cuenta de que SOLID, aunque suene grandilocuente, es un set de reglas prácticas para hacer que el código sea más manejable, más escalable y, sobre todo, menos doloroso de trabajar a largo plazo. No se trata de construir la arquitectura perfecta desde el día uno, sino de tener herramientas para evitar el caos conforme el proyecto crece.

### Single Responsibility Principle (SRP): La Clase con Propósito Único

Para mí, el **Principio de Responsabilidad Única (SRP)** no significa que una clase deba tener solo un método. ¡Eso es una tontería! Significa que debe tener *una única razón para cambiar*. Si una clase `UserService` se encarga de validar usuarios, guardarlos en la base de datos y enviarles correos de bienvenida, tengo tres razones para modificarla: si cambia la lógica de validación, si cambia la capa de persistencia o si cambia el sistema de envío de emails. Eso es un problema. Mi enfoque es brutal: si detecto que una clase "hace dos cosas distintas" en mi cabeza, la divido. Un `UserValidator`, un `UserRepository` y un `WelcomeEmailSender`. Simple, efectivo y fácil de testear de forma aislada.

### Open/Closed Principle (OCP): No Toques lo que Ya Funciona

El **Principio Abierto/Cerrado (OCP)** fue el que más me costó asimilar al principio. ¿Cómo extiendes la funcionalidad de un sistema sin modificar su código existente? La clave, para mí, está en la abstracción y el polimorfismo. En lugar de escribir `if (tipo == 'PDF') { ... } else if (tipo == 'CSV') { ... }`, uso interfaces. Defino un `ReportGenerator` con un método `generate()`, y luego tengo `PdfReportGenerator` y `CsvReportGenerator` que implementan esa interfaz. Cuando necesito un nuevo formato, simplemente añado una nueva clase sin tocar el código que ya sabe cómo usar un `ReportGenerator`. Es elegante y reduce la superficie de errores. Si algo funciona, **no quiero tocarlo**.

### Liskov Substitution Principle (LSP): El "Pato" que no Debería Explotar

El **Principio de Sustitución de Liskov (LSP)** es el más teórico, pero su impacto es enorme en la fiabilidad. En resumen, si tienes una clase `Pato` y la sustituyes por una subclase `PatoDeGoma`, el código que usaba `Pato` debería seguir funcionando sin problemas. En términos prácticos, significa que las subclases no deben romper el contrato establecido por la superclase. Me he topado con esto al usar herencia donde no tocaba, o al crear una subclase que lanzaba excepciones que la superclase no prometía. Cuando esto ocurre, la abstracción se rompe, y tu código se vuelve impredecible. Evito la herencia profunda y pienso mucho en los contratos de mis interfaces y clases base. Si tengo que leer la implementación de la subclase para saber cómo usarla, he violado LSP.

### Interface Segregation Principle (ISP): Interfaces para Cada Cliente

El **Principio de Segregación de Interfaces (ISP)** es mi antídoto contra las interfaces "gordas". ¿De qué sirve tener una interfaz `Worker` con métodos `work()`, `eat()`, `sleep()` y `getPaid()` si tengo un `Robot` que solo `work()` y `getPaid()`? El `Robot` se vería obligado a implementar `eat()` y `sleep()` de forma vacía o lanzando errores, lo cual es feo y confuso. Prefiero interfaces más pequeñas y específicas para cada "cliente" que las vaya a usar. `IWorkable`, `IEatable`, `ISleepable`, `IPayable`. Así, el `Robot` solo implementa `IWorkable` y `IPayable`. Esto hace que el código sea más claro y fácil de entender, y evita que los clientes dependan de funcionalidades que no necesitan.

### Dependency Inversion Principle (DIP): Mi Arma Secreta para la Testabilidad

El **Principio de Inversión de Dependencias (DIP)** es, para mí, el más potente. Me permite escribir código flexible y, lo que es más importante, *testable*. En lugar de que mis módulos de alto nivel dependan de módulos de bajo nivel directamente (ej. `UserService` dependiendo directamente de `MySQLDatabase`), hago que ambos dependan de abstracciones. `UserService` depende de `IUserRepository` y `MySQLDatabase` implementa `IUserRepository`. Esto permite "inyectar" la implementación concreta de `IUserRepository` en `UserService`. Así, puedo cambiar de base de datos sin tocar `UserService`, o, crucialmente, puedo pasarle un `MockUserRepository` en mis tests. Este principio es la base de la inyección de dependencias y de frameworks robustos. Es más, para construir sistemas complejos como [arquitecturas de agentes de IA robustas](/blog/agentes-de-ia-mas-alla-del-prompt-chaining-mi-vision-de-una-arquitectura-robusta/), donde quieres intercambiar componentes (modelos, herramientas, memorias) con facilidad, la inversión de dependencias es absolutamente fundamental.

### El "Pero" Importante: No seas un Purista Ciego

Ahora, un descargo de responsabilidad vital: aplicar SOLID no significa caer en la sobreingeniería. Si estás haciendo un script de una sola vez o un prototipo rápido, meter abstracciones para cada cosa es una pérdida de tiempo. La clave es el equilibrio. No te obsesiones con SOLID si no tienes un problema que resolver. A veces, la simplicidad gana. La decisión de aplicar un principio debe venir de una necesidad real de mantener el código flexible o de resolver un punto de dolor existente, no por seguir una regla a ciegas.

### Mi Reflexión Final

Los principios SOLID no son una bala de plata ni una cura para todos los males del software. Pero, en mi experiencia, son una guía invaluable para escribir código que envejezca bien. Me han ahorrado incontables horas de frustración y me han permitido construir sistemas más mantenibles y adaptables. No los uso como un martillo para cada clavo, sino como un conjunto de buenas prácticas que me permiten dormir mejor por la noche, sabiendo que mi código tiene una base sólida. Si no los conocías o los veías con escepticismo como yo, te invito a darles una oportunidad en tu próximo proyecto. Te prometo que, cuando los apliques con criterio, tu yo futuro te lo agradecerá.
