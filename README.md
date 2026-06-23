# Lab 06 - Pruebas de API: Falabella
## IS-489 Pruebas y Aseguramiento de Calidad de Software

**Docente:** Ing. Lizbeth Jaico Quispe  
**Estudiante:** Nayherly Dianeth Vila Cayo  
**Semestre:** 2026-I  
**API utilizada:** FakeStoreAPI (https://fakestoreapi.com)  
**Sistema analizado:** Falabella Perú - Módulo Búsqueda y Carrito

**Monografia:** 
https://docs.google.com/document/d/1-kms3XDpXRw5hB4LYTCSzb0H3LMbbVly/edit?usp=sharing&ouid=112866555820979888165&rtpof=true&sd=true
---

## Módulos probados

### HU-003: Búsqueda y Filtros
| TC | Descripción | Método | Endpoint | Status |
|---|---|---|---|---|
| TC-007 | Búsqueda exitosa por texto exacto | GET | /products/category/electronics | 200 ✅ |
| TC-008 | Búsqueda con campo vacío | GET | /products?limit=0 | 200 ✅ |
| TC-009 | Búsqueda con caracteres especiales | GET | /products/category/%3Cscript%3E | 200 ✅ |
| TC-010 | Parámetros inválidos en URL | GET | /products?limit=abc | 200 ✅ |
| TC-020 | Búsqueda con término inexistente | GET | /products/999 | 200 ✅ |

### HU-004: Carrito de Compras
| TC | Descripción | Método | Endpoint | Status |
|---|---|---|---|---|
| TC-011 | Agregar producto al carrito | POST | /carts | 201 ✅ |
| TC-012 | Agregar sin quantity | POST | /carts | 201 ✅ |
| TC-013 | Vaciar carrito completamente | DELETE | /carts/7 | 200 ✅ |
| TC-014 | Cantidad menor a 1 | POST | /carts | 201 ✅ |
| TC-015 | Cantidad mayor al stock | POST | /carts | 201 ✅ |

---

## Bugs encontrados

| TC | Bug | Comportamiento esperado | Comportamiento real |
|---|---|---|---|
| TC-020 | API retorna 200 con body vacío para ID inexistente | 404 Not Found | 200 OK vacío |
| TC-008| La API devuelve los 20 productos ignorando el parámetro | 


---

## Herramientas utilizadas
- Postman Desktop
- FakeStoreAPI (https://fakestoreapi.com)
- Git y GitHub

## Colección Postman
Ver archivo `falabella-collection.json`

## Cómo ejecutar
1. Importar `falabella-collection.json` en Postman
2. Activar entorno `Fallabella-PE`
3. Ejecutar cada request con Send
