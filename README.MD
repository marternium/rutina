# 🌸 Agenda de Mar

Una agenda diaria simple hecha con HTML, CSS y JavaScript puro. Permite organizar rutinas diarias, agregar eventos personalizados y visualizar el progreso del día.

## 📌 Qué hace
- 📅 Genera una rutina diaria automática (horarios básicos como comidas y sueño)
- ➕ Permite crear eventos personalizados con fecha y hora
- 📆 Muestra eventos futuros
- ⏰ Indica el evento actual y el siguiente
- 📊 Muestra progreso diario de tareas completadas
- ⭐ Sistema simple de XP por tareas realizadas
- 🐶 Mensajes dinámicos de Kaly según el progreso
- 💾 Guarda todo en localStorage (no requiere backend)

## 🧠 Cómo funciona

La aplicación mantiene un objeto de estado en JavaScript que se guarda en el navegador:

```js
{
  xp: 0,
  lastDate: "YYYY-MM-DD",
  events: []
}
```

Cada día:

- Se genera automáticamente la rutina base
- Se combinan eventos del sistema con eventos del usuario
- Se filtran por fecha actual

## 🛠️ Tecnologías usadas
- HTML5
- CSS3
- JavaScript (Vanilla)
- LocalStorage

## 🧩 Tipos de eventos
- life → rutina diaria (comidas, dormir, etc.)
- work → trabajo
- study → estudio
- custom → eventos creados por el usuario

## 📊 Sistema de progreso

El progreso del día se calcula en base a tareas completadas:

- Cada tarea completada suma al porcentaje total del día
- El XP se incrementa según el tipo de tarea

## 🐶 Kaly

Kaly es un sistema de mensajes que reacciona al progreso diario:

- Alto progreso → mensajes positivos
- Progreso medio → neutro
- Bajo progreso → advertencias suaves

(No es inteligencia artificial, solo reglas simples)

## 💾 Persistencia

Todos los datos se guardan en localStorage, por lo que:

- No se pierde la información al recargar
- No requiere base de datos
- Todo funciona en el navegador

## ⚠️ Limitaciones
- No hay sincronización entre dispositivos
- No hay backend
- Los datos dependen del navegador
- Puede ser editado manualmente desde DevTools

## 🚀 Posibles mejoras
- Vista de calendario mensual
- Notificaciones del navegador
- Edición de eventos existentes
- Sincronización con backend opcional
- Mejor sistema de organización de rutinas

## 📌 Nota

Este proyecto está hecho como práctica de lógica en JavaScript y manejo de estado en frontend sin frameworks.

### 🌸 Gracias por visitar!