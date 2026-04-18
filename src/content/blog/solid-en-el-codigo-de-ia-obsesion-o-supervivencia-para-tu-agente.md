---
title: "SOLID en el código de IA: ¿Obsesión o supervivencia para tu agente?"
pubDate: 2026-04-18T22:42:25.637Z
description: "Muchos dicen que los principios SOLID son cosa de ingenieros 'tradicionales'. Yo, como desarrollador de IA, digo que son vitales para evitar el caos. Mi visión."
image:
  url: "https://picsum.photos/seed/solid-en-el-codigo-de-ia-obsesion-o-supervivencia-para-tu-agente/1200/630"
  alt: "SOLID en el código de IA: ¿Obsesión o supervivencia para tu agente?"
tags:
  - evergreen
  - ia
---

Muchos colegas, cuando hablamos de ingeniería de software para proyectos de Inteligencia Artificial, suelen decir: "Ah, los principios SOLID, eso es para aplicaciones de negocio, aquí es diferente". Permítanme decirles que discrepo, y lo hago con la cicatriz de haber debuggeado más de un pipeline de Machine Learning (ML) a las 3 de la mañana que se había convertido en un pantano inmanejable precisamente por ignorar estas ideas básicas.

Soy desarrollador de IA, y he aprendido a palos que estos principios, aunque nacidos de un contexto más orientado a objetos puro, tienen una traducción directa y valiosísima en la construcción de sistemas de IA robustos y, sobre todo, mantenibles. No es una moda, es una forma de evitar el caos.

## S - Single Responsibility Principle (SRP): Un módulo, una razón para cambiar

Este es, para mí, el más importante. El SRP nos dice que una clase (o módulo, o componente) debería tener solo una razón para cambiar. ¿Qué significa esto en IA?

Significa que mi módulo de preprocesamiento de datos solo preprocesa. No entrena el modelo, no carga los datos crudos de la base de datos, ni hace inferencia. Solo se encarga de transformar los datos de la forma X a la forma Y. Mi modelo solo predice. Mi agente de IA, si tiene una herramienta para búsqueda en la web, esa herramienta solo busca en la web y formatea la salida, no decide *cuándo* buscar o *cómo* integrar esa información con otros datos. Si mi lógica de preprocesamiento cambia, solo toco ese módulo.

He visto código donde la misma función cargaba datos, los limpiaba, entrenaba un modelo y guardaba resultados. Eso es un caldo de cultivo para bugs que tardas días en identificar. Mantener los componentes pequeños, con una única responsabilidad, es la única forma de debuggear con un mínimo de cordura cuando todo se rompe.

## O - Open/Closed Principle (OCP): Extiende, no modifiques

El OCP sugiere que las entidades de software (clases, módulos, funciones) deben estar abiertas para extensión, pero cerradas para modificación. En el mundo de la IA, esto es crucial si no quieres que tu código se desmorone con cada nueva característica.

Imagina que tienes un agente de IA y quieres añadirle una nueva habilidad, digamos, una herramienta para generar imágenes. Si para añadir esa herramienta tengo que ir a la clase `AgenteBase` y modificarla para que ahora sepa manejar esta nueva funcionalidad, sé que he fallado. Prefiero diseñar mis sistemas para que pueda añadir nuevas herramientas (o nuevos modelos, o nuevas fuentes de datos) sin tocar el código existente y ya probado. Esto lo logro a menudo con interfaces claras y con inyección de dependencias. [Mi artículo sobre Modularidad y Composición](/blog/modularidad-y-composicion-por-que-mis-sistemas-y-agentes-de-ia-no-son-un-monolito-pegado-con-cinta-aislante/) aborda esto de cerca.

## L - Liskov Substitution Principle (LSP): Comportamientos predecibles

Este principio es el que, a veces, me da más dolores de cabeza en el contexto de la IA pura, pero su espíritu es vital. El LSP dice que los objetos de un programa deben poder ser reemplazados por instancias de sus subtipos sin alterar la corrección de ese programa. En otras palabras, si tienes una clase `ModeloClasificador` y luego `ModeloRandomForest` o `ModeloSVM` que heredan de ella, deberías poder usar cualquiera de los subtipos donde se espera el tipo base sin romper nada.

En ML, no siempre puedo cambiar un modelo de clasificación por uno de regresión sin cambiar la interfaz de uso, obviamente. Pero sí busco que, dentro de una misma categoría (por ejemplo, clasificadores binarios), los modelos implementen una interfaz (`.predict()`, `.predict_proba()`) de forma consistente. Esto me permite experimentar con diferentes arquitecturas o algoritmos sin reescribir la lógica de orquestación. Si mi código espera un objeto que tiene un método `.fit()` y `.predict()`, cualquier cosa que lo implemente debería funcionar. Si no lo hace, estoy ante un problema de diseño y me tocará refactorizar.

## I - Interface Segregation Principle (ISP): Interfaces pequeñas, vida más fácil

El ISP aboga por interfaces específicas en lugar de una única interfaz grande. Si un cliente no necesita un método, no debería estar obligado a implementarlo o, peor aún, a depender de él.

Esto es absolutamente *crítico* para los agentes de IA que interactúan con diversas herramientas. Si mi `HerramientaBase` tiene métodos para acceder a una base de datos, buscar en la web, y generar imágenes, pero una herramienta específica solo busca en la web, ¿por qué forzarla a implementar los otros métodos con `NotImplementedError`? Prefiero tener interfaces más pequeñas y específicas: `HerramientaBusquedaWeb`, `HerramientaGeneracionImagen`. Mi código se mantiene más limpio, mis herramientas son más ligeras y la gestión de permisos del agente para cada funcionalidad es mucho más clara y menos propensa a errores. Esto ayuda a mantener la [cohesión y acoplamiento](/blog/cohesion-y-acoplamiento-mi-brujula-para-no-construir-monstruos-de-codigo-y-por-que-tus-agentes-de-ia-los-necesitan/) bajo control.

## D - Dependency Inversion Principle (DIP): Abstracciones sobre implementaciones concretas

El DIP dice que los módulos de alto nivel no deben depender de módulos de bajo nivel, sino que ambos deben depender de abstracciones. Además, las abstracciones no deben depender de los detalles; los detalles deben depender de las abstracciones.

En mi experiencia, esto me ha salvado de muchos dolores de cabeza. Cuando tengo un componente que entrena modelos, no quiero que dependa directamente de una implementación concreta de un *logger* o de un sistema de persistencia de modelos (como MLflow o un S3). Prefiero que dependa de una interfaz `ILogger` o `IModelStore`. Luego, en la configuración, inyecto la implementación concreta (por ejemplo, `ConsoleLogger` o `S3ModelStore`).

Esto hace que mi código sea increíblemente más flexible, testable y fácil de mantener. Si mañana decido cambiar mi base de datos vectorial o mi forma de guardar los *checkpoints* del modelo, no debería tener que romper el código que orquesta mi pipeline o mi agente. Solo cambio la implementación concreta de la interfaz. De hecho, esto es fundamental para el [testing de agentes de IA](/blog/testing-de-agentes-de-ia-por-que-mi-robot-necesita-mas-pruebas-que-tu-microservicio-y-como-no-volverte-loco/), ya que me permite simular dependencias externas sin esfuerzo.

## Mi conclusión: No es dogma, es sentido común

Sé que aplicar SOLID en proyectos de IA puede sonar a 'exceso de ingeniería' para algunos, especialmente en fases iniciales. Pero la verdad es que, a medida que un proyecto crece y evoluciona, ignorar estos principios te pasa factura. Los sistemas de IA no son monolitos estáticos; están en constante evolución, con nuevos modelos, nuevas fuentes de datos y nuevas funcionalidades. Diseñar con SOLID en mente desde el principio (o al menos tenerlo presente durante el refactoring) te da la flexibilidad y la robustez que necesitas. No se trata de seguir el dogma a rajatabla en cada línea de código, sino de entender la filosofía detrás de cada principio y adaptarla a la naturaleza de los problemas que resolvemos en IA. Al final, es sentido común para escribir código que no te haga querer abandonar la programación a las 3 de la mañana.
