// móduloCarrito.test.js
// HU-004: Carrito de Compras
// API: https://fakestoreapi.com
// Guía 06 - IS-489 Pruebas y Aseguramiento de Calidad de Software

const request = require('supertest');
const API = 'https://fakestoreapi.com';

describe('HU-004: Carrito de Compras', () => {

  // TC-011: Adición de producto con stock disponible al carrito
  test('TC-011: POST /carts → 201 + carrito creado con producto', async () => {
    const res = await request(API)
      .post('/carts')
      .set('Content-Type', 'application/json')
      .send({
        userId: 1,
        date: new Date().toISOString().split('T')[0],
        products: [{ productId: 1, quantity: 1 }]
      });

    // FakeStoreAPI devuelve 201 Created al crear un carrito
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('products');
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(res.body.products[0].productId).toBe(1);
    expect(res.body.products[0].quantity).toBe(1);

    console.log('TC-011 ✔ Carrito creado, ID:', res.body.id);
  });

  // TC-012: Intento de adición omitiendo variantes obligatorias
  test('TC-012: POST /carts sin productId → retorna dato inválido o ausente', async () => {
    const res = await request(API)
      .post('/carts')
      .set('Content-Type', 'application/json')
      .send({
        userId: 1,
        date: new Date().toISOString().split('T')[0],
        products: [{ quantity: 2 }]  // productId omitido intencionalmente
      });

    expect(res.status).not.toBe(500);

    const productId = res.body.products?.[0]?.productId;
    expect(
      typeof productId === 'undefined' || productId === null || productId === 0
    ).toBe(true);

    console.log('TC-012 ✔ STATUS:', res.status, '| productId:', productId);
  });

  // TC-013: Vaciar carrito completamente
  test('TC-013: DELETE /carts/1 → 200 + confirmación de carrito eliminado', async () => {
    const res = await request(API).delete('/carts/1');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toBe(1);

    console.log('TC-013 ✔ Carrito eliminado, ID:', res.body.id);
  });

  // TC-014: Decremento bajo cantidad mínima
  // Postman:
  //   check 1 → servidor responde sin colapsar (no 500)
  //   check 2 → quantity 0 ES aceptada por la API (bug documentado)
  //   check 3 → Bug detectado: API no valida cantidad mínima
  test('TC-014: PUT /carts/1 con quantity 0 → Bug: API acepta cantidad inválida', async () => {
    const res = await request(API)
      .put('/carts/1')
      .set('Content-Type', 'application/json')
      .send({
        userId: 1,
        date: new Date().toISOString().split('T')[0],
        products: [{ productId: 1, quantity: 0 }]
      });

    // TC-014 check 1: servidor responde sin colapsar
    expect(res.status).not.toBe(500);

    // TC-014 check 2: quantity 0 es aceptada por la API (comportamiento real de FakeStoreAPI)
    expect(res.body.products[0].quantity).toBe(0);

    // TC-014 check 3: Bug detectado → la API NO valida cantidad mínima (quantity no es mayor a 0)
    expect(res.body.products[0].quantity).not.toBeGreaterThan(0);

    console.log('TC-014 ✔ STATUS:', res.status, '| ⚠ Bug: quantity aceptada:', res.body.products[0].quantity);
  });

  // TC-015: Incremento sobre la cantidad máxima de stock
  test('TC-015: PUT /carts/1 con quantity 99999 → no colapsa y documenta bug de validación', async () => {
    const res = await request(API)
      .put('/carts/1')
      .set('Content-Type', 'application/json')
      .send({
        userId: 1,
        date: new Date().toISOString().split('T')[0],
        products: [{ productId: 1, quantity: 99999 }]
      });

    expect(res.status).not.toBe(500);

    const qty = res.body.products?.[0]?.quantity;
    console.log('TC-015 ✔ STATUS:', res.status, '| ⚠ Bug: quantity aceptada:', qty);

    // FakeStoreAPI acepta 99999 → bug documentado (en sistema real debería rechazarse)
    expect(qty).toBe(99999);
  });

});