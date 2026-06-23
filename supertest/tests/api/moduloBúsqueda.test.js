// moduloBúsqueda.test.js
// HU-003: Búsqueda y Filtros
// API: https://fakestoreapi.com
// Guía 06 - IS-489 Pruebas y Aseguramiento de Calidad de Software

const request = require('supertest');
const API = 'https://fakestoreapi.com';

describe('HU-003: Búsqueda y Filtros', () => {

  // TC-007: Búsqueda exitosa por coincidencia de texto exacto
  test('TC-007: GET /products → 200 + lista de productos no vacía', async () => {
    const res = await request(API).get('/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const primero = res.body[0];
    expect(primero).toHaveProperty('id');
    expect(primero).toHaveProperty('title');
    expect(primero).toHaveProperty('price');
    expect(primero).toHaveProperty('category');

    console.log('TC-007 ✔ Total productos:', res.body.length);
  });

  // TC-008: Búsqueda con campo vacío
  // Postman: status 200 + API devuelve todos los productos por defecto
  test('TC-008: GET /products?limit=0 → 200 + API devuelve todos los productos por defecto', async () => {
    const res = await request(API)
      .get('/products')
      .query({ limit: 0 });

    // TC-008 check 1: servidor responde 200
    expect(res.status).toBe(200);

    // TC-008 check 2: campo vacío → API devuelve todos los productos por defecto (no vacío)
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    console.log('TC-008 ✔ STATUS:', res.status, '| Productos devueltos:', res.body.length);
  });

  // TC-009: Búsqueda con caracteres especiales / XSS
  test("TC-009: GET /products/category/<script> → no expone error del servidor", async () => {
    const payloadXSS = "<script>alert('xss')</script>";

    const res = await request(API)
      .get(`/products/category/${encodeURIComponent(payloadXSS)}`);

    expect(res.status).not.toBe(500);

    const bodyText = JSON.stringify(res.body);
    expect(bodyText).not.toMatch(/stack/i);
    expect(bodyText).not.toMatch(/SQLException/i);

    console.log('TC-009 ✔ STATUS:', res.status);
  });

  // TC-010: Filtrado con parámetro de URL inválido
  test('TC-010: GET /products/category/INVALIDO → no colapsa el servidor', async () => {
    const res = await request(API)
      .get('/products/category/CATEGORIA_QUE_NO_EXISTE');

    expect(res.status).not.toBe(500);
    expect([200, 400, 404]).toContain(res.status);

    console.log('TC-010 ✔ STATUS:', res.status);
  });

  // TC-020: Búsqueda con término inexistente
  // Postman: status 200 + response body es string vacío ''
  test('TC-020: GET /products/category/termino-inexistente → 200 + body vacío', async () => {
    const res = await request(API)
      .get('/products/category/xqz99productofalso');

    // TC-020 check 1: servidor responde sin colapsar
    expect(res.status).toBe(200);

    // TC-020 check 2: término inexistente no retorna datos de producto
    // FakeStoreAPI devuelve "[]" (array vacío serializado), no productos reales
    expect(res.text).toBe('[]');

    console.log('TC-020 ✔ STATUS:', res.status, '| Body:', res.text);
  });

});