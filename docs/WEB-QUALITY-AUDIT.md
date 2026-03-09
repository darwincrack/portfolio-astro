# Auditoría de calidad web

**Proyecto:** portfolio-astro  
**Fecha:** 2025-03-05  
**Skills aplicados:** web-quality-audit, core-web-vitals

---

## Resultados de la auditoría

### Críticos (0 encontrados)
- Ninguno.

### Alta prioridad (2 encontrados)

- **[Performance – LCP]** El canvas de partículas (tsparticles) se inicializa en `DOMContentLoaded` y puede competir con el LCP (título o primera imagen del hero).
  - **Impacto:** Retrasa la respuesta del hilo principal y puede empeorar LCP.
  - **Acción:** Inicializar partículas con `requestIdleCallback` o tras `window.load`.

- **[Performance – INP]** El listener de scroll en Header actualiza el navbar en cada evento sin throttling y sin `passive`.
  - **Impacto:** Puede bloquear el hilo principal y empeorar INP en dispositivos lentos.
  - **Acción:** Usar `{ passive: true }` y throttling con `requestAnimationFrame`.

### Prioridad media (3 encontrados)

- **[Core Web Vitals]** No se envían métricas LCP/INP/CLS a analytics.
  - **Impacto:** No hay datos de campo para priorizar mejoras.
  - **Acción:** Integrar `web-vitals` y enviar a gtag.

- **[Performance]** La primera imagen del hero (badge) podría priorizarse más.
  - **Impacto:** Pequeña mejora de LCP si el LCP es esa imagen.
  - **Acción:** Añadir `fetchpriority="high"` al primer badge.

- **[Accesibilidad]** Contraste en modo claro en hero: verificar que cumple 4.5:1 (ya revisado en pasada; mantener).

### Prioridad baja (1 encontrado)

- **[Rendimiento]** Múltiples listeners en `a[href^="#"]` duplicados en Header (smooth scroll).
  - **Impacto:** Código redundante.
  - **Acción:** Unificar en un solo script.

---

## Resumen por categoría

| Categoría        | Issues | Críticos | Altos | Medios | Bajos |
|------------------|--------|----------|-------|--------|-------|
| Performance      | 3      | 0        | 2     | 1      | 0     |
| Core Web Vitals  | 1      | 0        | 0     | 1      | 0     |
| Accesibilidad    | 0      | 0        | 0     | 0      | 0     |
| SEO              | 0      | 0        | 0     | 0      | 0     |
| Mejores prácticas | 1    | 0        | 0     | 0      | 1     |

---

## Checklist rápido (pre-despliegue)

- [x] Core Web Vitals: optimizaciones aplicadas (LCP, INP, CLS)
- [x] Sin errores de accesibilidad conocidos (skip link, ARIA, focus)
- [ ] Sin errores en consola (verificar en producción)
- [x] HTTPS y meta tags presentes
- [x] Imágenes con dimensiones (width/height) para CLS

---

## Prioridad recomendada

1. **Hecho:** Diferir partículas para no bloquear LCP.
2. **Hecho:** Scroll passive + throttling para INP.
3. **Hecho:** `fetchpriority="high"` en primera imagen del hero.
4. **Hecho:** Envío de Web Vitals a Google Analytics.
5. **Opcional:** Unificar scripts de smooth scroll en Header.

---

## Referencias

- [Performance](../.agents/skills/performance/SKILL.md)
- [Core Web Vitals](../.agents/skills/core-web-vitals/SKILL.md)
- [Web Quality Audit](../.agents/skills/web-quality-audit/SKILL.md)
